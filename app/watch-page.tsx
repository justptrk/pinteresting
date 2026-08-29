import type { ReactNode } from "react";
import { applyJobFilters } from "@/lib/filters";
import type { Job, JobFilters } from "@/lib/types";
import { formatDate } from "./format";
import { SiteNav } from "./site-nav";
import { WatchFilters } from "./watch-filters";

export function WatchPage({
  pathname,
  title,
  description,
  jobs,
  fetchedAt,
  errors,
  filters,
  children,
}: {
  pathname: string;
  title: string;
  description: string;
  jobs: Job[];
  fetchedAt: string;
  errors: string[];
  filters: JobFilters;
  children: (filtered: Job[]) => ReactNode;
}) {
  const filtered = applyJobFilters(jobs, filters);
  const companies = [...new Set(jobs.map((job) => job.company))].sort();

  return (
    <div className="min-h-full">
      <SiteNav pathname={pathname} filters={filters} />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
              {title}
            </h1>
            <p className="mt-2 max-w-2xl text-base leading-7 text-zinc-600">
              {description}
            </p>
          </div>
          <p className="text-sm text-zinc-500">
            {filtered.length} shown · {jobs.length} loaded · refreshed{" "}
            {formatDate(fetchedAt)}
          </p>
        </div>
        <WatchFilters pathname={pathname} filters={filters} companies={companies} />
        {errors.length > 0 ? (
          <p className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950">
            Some sources failed this refresh ({errors.length}). Numbers below
            still come from sources that responded.
          </p>
        ) : null}
        {children(filtered)}
      </main>
    </div>
  );
}
