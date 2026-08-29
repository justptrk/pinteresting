import { ageInDays, agingBucket } from "./aging";
import { detectEngagement, detectIndustries, normalizeKey } from "./classify";
import { extractPay, payBandFromPay } from "./pay";
import { classifyLocations, inTargetRegion } from "./regions";
import { GREENHOUSE_BOARDS, MUSE_LOCATIONS, MUSE_PAGES } from "./sources";
import type { Job, JobsPayload, RegionState } from "./types";

const FETCH_INIT = {
  headers: { "User-Agent": "contract-watch/0.1 (contractor tracker)" },
  next: { revalidate: 1800 },
};

type MuseJob = {
  id: number;
  name: string;
  contents?: string;
  publication_date?: string;
  company?: { name?: string };
  locations?: { name: string }[];
  refs?: { landing_page?: string };
  categories?: { name: string }[];
};

type GreenhouseJob = {
  id: number;
  title: string;
  absolute_url: string;
  updated_at?: string;
  first_published?: string;
  location?: { name?: string };
  company_name?: string;
  content?: string;
};

function stripHtml(value: string): string {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function withDerivedFields(
  job: Omit<Job, "ageDays" | "aging" | "pay" | "payBand" | "payLabel">,
  payText: string,
): Job {
  const pay = extractPay(`${job.title} ${payText}`);
  return {
    ...job,
    ageDays: ageInDays(job.publishedAt),
    aging: agingBucket(ageInDays(job.publishedAt)),
    pay,
    payBand: payBandFromPay(pay),
    payLabel: pay?.label ?? "Rate not posted",
  };
}

function resolveStates(
  locations: string[],
  extraText: string,
  hubStates: RegionState[],
): { states: RegionState[]; remote: boolean } {
  const classified = classifyLocations(locations);
  const extra = extraText ? classifyLocations([extraText]).states : [];
  const merged = new Set<RegionState>([...classified.states, ...extra]);
  if (merged.size === 0 && classified.remote) {
    for (const state of hubStates) merged.add(state);
  }
  return {
    states: [...merged],
    remote: classified.remote,
  };
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, FETCH_INIT);
  if (!response.ok) {
    throw new Error(`${url} failed with ${response.status}`);
  }
  return (await response.json()) as T;
}

async function fromMuse(errors: string[]): Promise<Job[]> {
  const jobs: Job[] = [];
  const seen = new Set<string>();
  const requests = MUSE_LOCATIONS.flatMap((location) =>
    MUSE_PAGES.map((page) =>
      fetchJson<{ results?: MuseJob[] }>(
        `https://www.themuse.com/api/public/jobs?page=${page}&descending=true&location=${encodeURIComponent(location)}`,
      ).then((payload) => payload.results ?? []),
    ),
  );

  const settled = await Promise.allSettled(requests);
  for (const result of settled) {
    if (result.status === "rejected") {
      errors.push(`The Muse: ${result.reason}`);
      continue;
    }
    for (const raw of result.value) {
      const company = raw.company?.name ?? "Unknown";
      const title = raw.name ?? "Untitled";
      const key = normalizeKey(company, title);
      if (seen.has(key)) continue;
      seen.add(key);

      const text = stripHtml(raw.contents ?? "");
      const locations = (raw.locations ?? []).map((item) => item.name);
      const industries = detectIndustries(
        `${title} ${company} ${(raw.categories ?? []).map((item) => item.name).join(" ")} ${text}`,
      );
      const engagement = detectEngagement(title, text);
      if (engagement !== "contract") continue;
      if (
        !inTargetRegion({
          locations,
          extraText: `${title} ${text}`,
          isContract: true,
        })
      ) {
        continue;
      }

      const { states, remote } = resolveStates(locations, `${title} ${text}`, []);
      jobs.push(
        withDerivedFields(
          {
            id: `muse-${raw.id}`,
            title,
            company,
            url: raw.refs?.landing_page ?? `https://www.themuse.com/jobs/${raw.id}`,
            source: "themuse",
            locations: locations.length ? locations : remote ? ["Remote"] : [],
            states,
            remote,
            industries,
            engagement,
            publishedAt: raw.publication_date ?? null,
          },
          text,
        ),
      );
    }
  }

  return jobs;
}

async function fromGreenhouse(errors: string[]): Promise<Job[]> {
  const jobs: Job[] = [];

  const requests = GREENHOUSE_BOARDS.map((board) =>
    fetchJson<{ jobs?: GreenhouseJob[] }>(
      `https://boards-api.greenhouse.io/v1/boards/${board.token}/jobs?content=true`,
    ).then((payload) => ({ board, jobs: payload.jobs ?? [] })),
  );

  const settled = await Promise.allSettled(requests);
  for (const [index, result] of settled.entries()) {
    const board = GREENHOUSE_BOARDS[index];
    if (result.status === "rejected") {
      errors.push(`Greenhouse (${board.company}): ${result.reason}`);
      continue;
    }
    for (const raw of result.value.jobs) {
      const title = raw.title ?? "Untitled";
      const company = raw.company_name || result.value.board.company;
      const locationName = raw.location?.name ?? "";
      const locations = locationName ? [locationName] : [];
      const text = stripHtml(raw.content ?? "");
      const engagement = detectEngagement(title, text);
      if (engagement !== "contract") continue;
      const industries = detectIndustries(`${title} ${text}`, [
        result.value.board.industry,
      ]);
      const hubStates = result.value.board.hubStates;

      if (
        !inTargetRegion({
          locations,
          extraText: `${title} ${text}`,
          isContract: true,
          hubStates,
        })
      ) {
        continue;
      }

      const { states, remote } = resolveStates(
        locations,
        `${title} ${text}`,
        hubStates,
      );
      jobs.push(
        withDerivedFields(
          {
            id: `gh-${board.token}-${raw.id}`,
            title,
            company,
            url: raw.absolute_url,
            source: "greenhouse",
            locations: locations.length ? locations : ["Remote"],
            states,
            remote,
            industries,
            engagement,
            publishedAt: raw.first_published || raw.updated_at || null,
          },
          text,
        ),
      );
    }
  }

  return jobs;
}

type RemoteOkJob = {
  id?: string | number;
  position?: string;
  company?: string;
  location?: string;
  description?: string;
  apply_url?: string;
  url?: string;
  date?: string;
  tags?: string[];
};

async function fromRemoteOk(errors: string[]): Promise<Job[]> {
  try {
    const rows = await fetchJson<RemoteOkJob[]>("https://remoteok.com/api");
    const jobs: Job[] = [];
    for (const raw of rows) {
      if (!raw || !raw.position) continue;
      const title = raw.position;
      const company = raw.company || "Unknown";
      const text = stripHtml(raw.description ?? "");
      const locations = raw.location ? [raw.location] : ["Remote"];
      const blob = `${title} ${(raw.tags ?? []).join(" ")} ${text}`;
      if (detectEngagement(title, blob) !== "contract") continue;
      if (
        !inTargetRegion({
          locations,
          extraText: blob,
          isContract: true,
        })
      ) {
        continue;
      }
      const industries = detectIndustries(blob);
      const { states, remote } = resolveStates(locations, blob, []);
      jobs.push(
        withDerivedFields(
          {
            id: `remoteok-${raw.id ?? normalizeKey(company, title)}`,
            title,
            company,
            url: raw.apply_url || raw.url || "https://remoteok.com",
            source: "remoteok",
            locations,
            states,
            remote,
            industries,
            engagement: "contract",
            publishedAt: raw.date ?? null,
          },
          text,
        ),
      );
    }
    return jobs;
  } catch (error) {
    errors.push(`RemoteOK: ${error}`);
    return [];
  }
}

type JobicyJob = {
  id?: string | number;
  jobTitle?: string;
  companyName?: string;
  jobType?: string | string[];
  jobGeo?: string | string[];
  jobIndustry?: string | string[];
  jobDescription?: string;
  jobExcerpt?: string;
  url?: string;
  pubDate?: string;
};

function asList(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

async function fromJobicy(errors: string[]): Promise<Job[]> {
  try {
    const payload = await fetchJson<{ jobs?: JobicyJob[] }>(
      "https://jobicy.com/api/v2/remote-jobs?count=100",
    );
    const jobs: Job[] = [];
    for (const raw of payload.jobs ?? []) {
      const title = raw.jobTitle ?? "Untitled";
      const company = raw.companyName ?? "Unknown";
      const types = asList(raw.jobType).join(" ");
      const geos = asList(raw.jobGeo);
      const text = stripHtml(`${raw.jobExcerpt ?? ""} ${raw.jobDescription ?? ""}`);
      const blob = `${title} ${types} ${geos.join(" ")} ${text}`;
      if (detectEngagement(title, blob) !== "contract") continue;
      if (
        !inTargetRegion({
          locations: geos.length ? geos : ["Remote"],
          extraText: blob,
          isContract: true,
        })
      ) {
        continue;
      }
      const industries = detectIndustries(
        `${blob} ${asList(raw.jobIndustry).join(" ")}`,
      );
      const locations = geos.length ? geos : ["Remote"];
      const { states, remote } = resolveStates(locations, blob, []);
      jobs.push(
        withDerivedFields(
          {
            id: `jobicy-${raw.id ?? normalizeKey(company, title)}`,
            title,
            company,
            url: raw.url ?? "https://jobicy.com",
            source: "jobicy",
            locations,
            states,
            remote,
            industries,
            engagement: "contract",
            publishedAt: raw.pubDate ?? null,
          },
          text,
        ),
      );
    }
    return jobs;
  } catch (error) {
    errors.push(`Jobicy: ${error}`);
    return [];
  }
}

export async function getJobs(): Promise<JobsPayload> {
  const errors: string[] = [];
  const [muse, greenhouse, remoteok, jobicy] = await Promise.all([
    fromMuse(errors),
    fromGreenhouse(errors),
    fromRemoteOk(errors),
    fromJobicy(errors),
  ]);

  const merged = new Map<string, Job>();
  for (const job of [...greenhouse, ...muse, ...remoteok, ...jobicy]) {
    const key = normalizeKey(job.company, job.title);
    if (!merged.has(key)) merged.set(key, job);
  }

  const jobs = [...merged.values()].sort((a, b) => {
    const aTime = a.publishedAt ? Date.parse(a.publishedAt) : 0;
    const bTime = b.publishedAt ? Date.parse(b.publishedAt) : 0;
    return bTime - aTime;
  });

  return { jobs, fetchedAt: new Date().toISOString(), errors };
}
