import { detectEngagement, detectIndustries, normalizeKey } from "./classify";
import { classifyLocations, inTargetRegion } from "./regions";
import { GREENHOUSE_BOARDS, MUSE_LOCATIONS } from "./sources";
import type { Job, JobsPayload } from "./types";

const FETCH_INIT = {
  headers: { "User-Agent": "contract-watch/0.1 (healthtech-fintech tracker)" },
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
};

function stripHtml(value: string): string {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
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

  const pages = MUSE_LOCATIONS.map((location) =>
    fetchJson<{ results?: MuseJob[] }>(
      `https://www.themuse.com/api/public/jobs?page=0&descending=true&location=${encodeURIComponent(location)}`,
    ).then((payload) => payload.results ?? []),
  );

  const settled = await Promise.allSettled(pages);
  for (const [index, result] of settled.entries()) {
    if (result.status === "rejected") {
      errors.push(`The Muse (${MUSE_LOCATIONS[index]}): ${result.reason}`);
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
        `${title} ${text} ${(raw.categories ?? []).map((item) => item.name).join(" ")}`,
      );
      if (industries.length === 0) continue;

      const engagement = detectEngagement(title, text);
      if (
        !inTargetRegion({
          locations,
          extraText: `${title} ${text}`,
          remoteCountsIfContract: true,
          isContract: engagement === "contract",
        })
      ) {
        continue;
      }

      const { states, remote } = classifyLocations(locations);
      jobs.push({
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
      });
    }
  }

  return jobs;
}

async function fromGreenhouse(errors: string[]): Promise<Job[]> {
  const jobs: Job[] = [];

  const requests = GREENHOUSE_BOARDS.map((board) =>
    fetchJson<{ jobs?: GreenhouseJob[] }>(
      `https://boards-api.greenhouse.io/v1/boards/${board.token}/jobs`,
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
      const engagement = detectEngagement(title, locationName);
      const industries = detectIndustries(`${title} ${locationName}`, [
        result.value.board.industry,
      ]);

      if (
        !inTargetRegion({
          locations,
          extraText: title,
          remoteCountsIfContract: true,
          isContract: engagement === "contract",
        })
      ) {
        continue;
      }

      const { states, remote } = classifyLocations(locations);
      jobs.push({
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
      });
    }
  }

  return jobs;
}

export async function getJobs(): Promise<JobsPayload> {
  const errors: string[] = [];
  const [muse, greenhouse] = await Promise.all([
    fromMuse(errors),
    fromGreenhouse(errors),
  ]);

  const merged = new Map<string, Job>();
  for (const job of [...greenhouse, ...muse]) {
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
