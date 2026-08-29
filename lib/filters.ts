import type { Job, JobFilters } from "./types";

export function applyJobFilters(jobs: Job[], filters: JobFilters): Job[] {
  const needle = filters.query.trim().toLowerCase();
  return jobs.filter((job) => {
    if (filters.industry !== "all" && !job.industries.includes(filters.industry)) {
      return false;
    }
    if (filters.location === "remote") {
      if (!job.remote) return false;
    } else if (filters.location !== "all" && !job.states.includes(filters.location)) {
      return false;
    }
    if (filters.company && job.company !== filters.company) return false;
    if (filters.aging !== "all" && job.aging !== filters.aging) return false;
    if (filters.pay !== "all" && job.payBand !== filters.pay) return false;
    if (filters.contractOnly && job.engagement !== "contract") return false;
    if (!needle) return true;
    const haystack =
      `${job.title} ${job.company} ${job.locations.join(" ")} ${job.payLabel}`.toLowerCase();
    return haystack.includes(needle);
  });
}

export function countBy<K extends string>(
  jobs: Job[],
  keyFor: (job: Job) => K[],
): { key: K; count: number }[] {
  const counts = new Map<K, number>();
  for (const job of jobs) {
    for (const key of keyFor(job)) {
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count || a.key.localeCompare(b.key));
}
