import { AGING_BUCKETS, AGING_LABELS } from "@/lib/aging";
import { filtersToQuery } from "@/lib/parse-filters";
import type { Job, JobFilters } from "@/lib/types";
import { formatAge, formatDate } from "./format";

export function AgingReport({
  jobs,
  filters,
}: {
  jobs: Job[];
  filters: JobFilters;
}) {
  const buckets = AGING_BUCKETS.map((bucket) => {
    const rows = jobs.filter((job) => job.aging === bucket);
    return { bucket, rows, count: rows.length };
  });
  const total = jobs.length || 1;
  const oldest = [...jobs].sort((a, b) => {
    if (a.ageDays === null) return 1;
    if (b.ageDays === null) return -1;
    return b.ageDays - a.ageDays;
  });

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-zinc-950">Aging buckets</h2>
        <p className="mt-1 text-sm text-zinc-600">
          Days since the listing was first published. Click a bucket to keep
          that slice while you move between dashboard, report, and listings.
        </p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {buckets.map((item) => (
            <li key={item.bucket}>
              <a
                href={`/aging${filtersToQuery({ ...filters, aging: item.bucket })}`}
                className="block rounded-xl border border-zinc-200 px-4 py-3 hover:border-teal-700"
              >
                <p className="text-sm font-medium text-zinc-700">
                  {AGING_LABELS[item.bucket]}
                </p>
                <p className="text-2xl font-semibold text-zinc-950">{item.count}</p>
                <p className="text-xs text-zinc-500">
                  {Math.round((item.count / total) * 100)}% of this view
                </p>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-zinc-50 text-xs tracking-wide text-zinc-500 uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Age</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Company</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">Industry</th>
              <th className="px-4 py-3 font-medium">Pay</th>
              <th className="px-4 py-3 font-medium">Posted</th>
            </tr>
          </thead>
          <tbody>
            {oldest.map((job) => (
              <tr key={job.id} className="border-t border-zinc-100">
                <td className="px-4 py-3 font-medium text-zinc-950">
                  {formatAge(job.ageDays)}
                </td>
                <td className="px-4 py-3">
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-teal-900 hover:underline"
                  >
                    {job.title}
                  </a>
                </td>
                <td className="px-4 py-3">
                  <a
                    href={`/aging${filtersToQuery({ ...filters, company: job.company })}`}
                    className="hover:underline"
                  >
                    {job.company}
                  </a>
                </td>
                <td className="px-4 py-3 text-zinc-600">
                  {job.states.join(", ") || (job.remote ? "Remote" : "—")}
                </td>
                <td className="px-4 py-3 text-zinc-600">
                  {job.industries.join(", ")}
                </td>
                <td className="px-4 py-3 text-zinc-600">{job.payLabel}</td>
                <td className="px-4 py-3 text-zinc-500">
                  {formatDate(job.publishedAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {oldest.length === 0 ? (
          <p className="px-4 py-10 text-center text-zinc-500">
            No listings match this aging view.
          </p>
        ) : null}
      </section>
    </div>
  );
}
