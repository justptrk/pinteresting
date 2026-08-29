"use client";

import { useRouter } from "next/navigation";
import { AGING_BUCKETS, AGING_LABELS } from "@/lib/aging";
import { PAY_BAND_LABELS, type PayBand } from "@/lib/pay";
import { filtersToQuery } from "@/lib/parse-filters";
import { STATE_LABELS, TARGET_STATES } from "@/lib/regions";
import type { Industry, JobFilters } from "@/lib/types";

export function WatchFilters({
  pathname,
  filters,
  companies,
}: {
  pathname: string;
  filters: JobFilters;
  companies: string[];
}) {
  const router = useRouter();

  function update(patch: Partial<JobFilters>) {
    router.push(`${pathname}${filtersToQuery({ ...filters, ...patch })}`);
  }

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700">
          Search
          <input
            id="filter-search"
            name="q"
            defaultValue={filters.query}
            key={filters.query}
            placeholder="Title, company, or city"
            className="rounded-lg border border-zinc-300 px-3 py-2 text-base font-normal text-zinc-950 outline-none focus:border-teal-700"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                update({ query: event.currentTarget.value });
              }
            }}
            onBlur={(event) => update({ query: event.currentTarget.value })}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700">
          Company
          <select
            id="filter-company"
            name="company"
            value={filters.company}
            onChange={(event) => update({ company: event.target.value })}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-base font-normal text-zinc-950"
          >
            <option value="">All companies</option>
            {companies.map((company) => (
              <option key={company} value={company}>
                {company}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700">
          Location
          <select
            id="filter-location"
            name="location"
            value={filters.location}
            onChange={(event) =>
              update({
                location: event.target.value as JobFilters["location"],
              })
            }
            className="rounded-lg border border-zinc-300 px-3 py-2 text-base font-normal text-zinc-950"
          >
            <option value="all">All target states</option>
            <option value="remote">Remote eligible</option>
            {TARGET_STATES.map((code) => (
              <option key={code} value={code}>
                {STATE_LABELS[code]}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700">
          Aging
          <select
            id="filter-aging"
            name="aging"
            value={filters.aging}
            onChange={(event) =>
              update({ aging: event.target.value as JobFilters["aging"] })
            }
            className="rounded-lg border border-zinc-300 px-3 py-2 text-base font-normal text-zinc-950"
          >
            <option value="all">All ages</option>
            {AGING_BUCKETS.map((bucket) => (
              <option key={bucket} value={bucket}>
                {AGING_LABELS[bucket]}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700">
          Industry
          <select
            id="filter-industry"
            name="industry"
            value={filters.industry}
            onChange={(event) =>
              update({
                industry: event.target.value as "all" | Industry,
              })
            }
            className="rounded-lg border border-zinc-300 px-3 py-2 text-base font-normal text-zinc-950"
          >
            <option value="all">All</option>
            <option value="healthtech">Healthtech</option>
            <option value="fintech">Fintech</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700">
          Pay
          <select
            id="filter-pay"
            name="pay"
            value={filters.pay}
            onChange={(event) =>
              update({ pay: event.target.value as "all" | PayBand })
            }
            className="rounded-lg border border-zinc-300 px-3 py-2 text-base font-normal text-zinc-950"
          >
            <option value="all">All contract rates</option>
            {(Object.keys(PAY_BAND_LABELS) as PayBand[]).map((band) => (
              <option key={band} value={band}>
                {PAY_BAND_LABELS[band]}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="mt-3 flex items-center gap-2 text-sm text-zinc-700">
        <input
          id="filter-contract"
          name="contract"
          type="checkbox"
          checked={filters.contractOnly}
          onChange={(event) => update({ contractOnly: event.target.checked })}
        />
        Contract / 1099 / C2C / temporary only
      </label>
    </section>
  );
}
