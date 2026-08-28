"use client";

import { useMemo, useState, type ReactNode } from "react";
import { STATE_LABELS, TARGET_STATES } from "@/lib/regions";
import type { Industry, Job, RegionState } from "@/lib/types";

type Props = {
  jobs: Job[];
  fetchedAt: string;
  errors: string[];
};

const INDUSTRY_LABEL: Record<Industry, string> = {
  healthtech: "Healthtech",
  fintech: "Fintech",
};

function formatDate(value: string | null): string {
  if (!value) return "Date unknown";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unknown";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function JobBoard({ jobs, fetchedAt, errors }: Props) {
  const [query, setQuery] = useState("");
  const [industry, setIndustry] = useState<"all" | Industry>("all");
  const [state, setState] = useState<"all" | RegionState>("all");
  const [contractOnly, setContractOnly] = useState(true);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return jobs.filter((job) => {
      if (industry !== "all" && !job.industries.includes(industry)) return false;
      if (state !== "all" && !job.states.includes(state)) return false;
      if (contractOnly && job.engagement !== "contract") return false;
      if (!needle) return true;
      const haystack = `${job.title} ${job.company} ${job.locations.join(" ")}`.toLowerCase();
      return haystack.includes(needle);
    });
  }, [jobs, query, industry, state, contractOnly]);

  const counts = useMemo(() => {
    const byState = Object.fromEntries(TARGET_STATES.map((code) => [code, 0])) as Record<
      RegionState,
      number
    >;
    let contract = 0;
    let healthtech = 0;
    let fintech = 0;
    for (const job of jobs) {
      if (job.engagement === "contract") contract += 1;
      if (job.industries.includes("healthtech")) healthtech += 1;
      if (job.industries.includes("fintech")) fintech += 1;
      for (const code of job.states) byState[code] += 1;
    }
    return { byState, contract, healthtech, fintech };
  }, [jobs]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
      <header className="flex flex-col gap-4 border-b border-zinc-200 pb-8">
        <p className="text-sm font-medium tracking-wide text-teal-800 uppercase">
          Contract watch
        </p>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
              Healthtech and fintech contract roles
            </h1>
            <p className="mt-2 text-base leading-7 text-zinc-600">
              Open roles across the NY/NJ/CT tri-state area, Virginia, and North
              Carolina. Pulled from public Greenhouse boards and The Muse, then
              filtered for industry, geography, and contract language.
            </p>
          </div>
          <p className="text-sm text-zinc-500">
            {jobs.length} in-scope listings · refreshed{" "}
            {formatDate(fetchedAt)}
          </p>
        </div>
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Contract-tagged" value={counts.contract} />
          <Stat label="Healthtech" value={counts.healthtech} />
          <Stat label="Fintech" value={counts.fintech} />
          <Stat
            label="With a target state"
            value={jobs.filter((job) => job.states.length > 0).length}
          />
        </dl>
      </header>

      <section className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row">
          <label className="flex flex-1 flex-col gap-1 text-sm font-medium text-zinc-700">
            Search
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Title, company, or city"
              className="rounded-lg border border-zinc-300 px-3 py-2 text-base font-normal text-zinc-950 outline-none focus:border-teal-700"
            />
          </label>
          <label className="flex min-w-40 flex-col gap-1 text-sm font-medium text-zinc-700">
            Industry
            <select
              value={industry}
              onChange={(event) =>
                setIndustry(event.target.value as "all" | Industry)
              }
              className="rounded-lg border border-zinc-300 px-3 py-2 text-base font-normal text-zinc-950"
            >
              <option value="all">All</option>
              <option value="healthtech">Healthtech</option>
              <option value="fintech">Fintech</option>
            </select>
          </label>
          <label className="flex min-w-40 flex-col gap-1 text-sm font-medium text-zinc-700">
            State
            <select
              value={state}
              onChange={(event) =>
                setState(event.target.value as "all" | RegionState)
              }
              className="rounded-lg border border-zinc-300 px-3 py-2 text-base font-normal text-zinc-950"
            >
              <option value="all">All target states</option>
              {TARGET_STATES.map((code) => (
                <option key={code} value={code}>
                  {STATE_LABELS[code]} ({counts.byState[code]})
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="flex items-center gap-2 text-sm text-zinc-700">
          <input
            type="checkbox"
            checked={contractOnly}
            onChange={(event) => setContractOnly(event.target.checked)}
          />
          Contract / 1099 / C2C / temporary only
        </label>
        <p className="text-sm text-zinc-500">
          Showing {filtered.length} of {jobs.length} listings. Contract view
          keeps 1099, C2C, contractor, and fixed-term roles; turn it off to
          include other in-scope jobs at the same companies and locations.
        </p>
      </section>

      {errors.length > 0 ? (
        <p className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          Some sources failed this refresh ({errors.length}). Listings below
          are still from sources that responded.
        </p>
      ) : null}

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-zinc-300 px-6 py-16 text-center text-zinc-600">
          No listings match these filters. Try another state, or include
          full-time roles.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {filtered.map((job) => (
            <li key={job.id}>
              <a
                href={job.url}
                target="_blank"
                rel="noreferrer"
                className="block rounded-2xl border border-zinc-200 bg-white p-5 transition hover:border-teal-700"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-zinc-950">
                      {job.title}
                    </h2>
                    <p className="text-sm text-zinc-600">{job.company}</p>
                  </div>
                  <p className="text-sm text-zinc-500">
                    {formatDate(job.publishedAt)}
                  </p>
                </div>
                <p className="mt-3 text-sm text-zinc-600">
                  {job.locations.slice(0, 4).join(" · ")}
                  {job.locations.length > 4
                    ? ` · +${job.locations.length - 4} more`
                    : ""}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {job.industries.map((tag) => (
                    <Badge key={tag}>{INDUSTRY_LABEL[tag]}</Badge>
                  ))}
                  {job.engagement === "contract" ? (
                    <Badge tone="teal">Contract</Badge>
                  ) : null}
                  {job.remote ? <Badge>Remote eligible</Badge> : null}
                  {job.states.map((code) => (
                    <Badge key={code}>{code}</Badge>
                  ))}
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
      <dt className="text-xs tracking-wide text-zinc-500 uppercase">{label}</dt>
      <dd className="text-2xl font-semibold text-zinc-950">{value}</dd>
    </div>
  );
}

function Badge({
  children,
  tone = "zinc",
}: {
  children: ReactNode;
  tone?: "zinc" | "teal";
}) {
  const className =
    tone === "teal"
      ? "bg-teal-50 text-teal-900"
      : "bg-zinc-100 text-zinc-700";
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${className}`}>
      {children}
    </span>
  );
}
