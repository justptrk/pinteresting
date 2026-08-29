import Link from "next/link";
import { filtersToQuery } from "@/lib/parse-filters";
import type { JobFilters } from "@/lib/types";

type Row = { key: string; label: string; count: number };

export function BreakdownList({
  title,
  rows,
  href,
  filters,
  patchFor,
  activeKey,
}: {
  title: string;
  rows: Row[];
  href: string;
  filters: JobFilters;
  patchFor: (key: string) => Partial<JobFilters>;
  activeKey?: string;
}) {
  const max = Math.max(...rows.map((row) => row.count), 1);
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5">
      <h2 className="text-sm font-semibold tracking-wide text-zinc-500 uppercase">
        {title}
      </h2>
      {rows.length === 0 ? (
        <p className="mt-4 text-sm text-zinc-500">No rows for this view.</p>
      ) : (
        <ul className="mt-4 flex flex-col gap-2">
          {rows.map((row) => {
            const next = filtersToQuery({ ...filters, ...patchFor(row.key) });
            const active = activeKey === row.key;
            return (
              <li key={row.key}>
                <Link
                  href={`${href}${next}`}
                  className={`block rounded-xl px-3 py-2 ${
                    active ? "bg-teal-50" : "hover:bg-zinc-50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-medium text-zinc-900">{row.label}</span>
                    <span className="text-zinc-500">{row.count}</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-zinc-100">
                    <div
                      className="h-full rounded-full bg-teal-700"
                      style={{ width: `${(row.count / max) * 100}%` }}
                    />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
