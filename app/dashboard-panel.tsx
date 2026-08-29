import Link from "next/link";
import { AGING_BUCKETS, AGING_LABELS } from "@/lib/aging";
import { countBy } from "@/lib/filters";
import { PAY_BAND_LABELS, type PayBand } from "@/lib/pay";
import { filtersToQuery } from "@/lib/parse-filters";
import { STATE_LABELS, TARGET_STATES } from "@/lib/regions";
import type { Industry, Job, JobFilters } from "@/lib/types";
import { BreakdownList } from "./breakdown-list";
import { formatAge } from "./format";

const INDUSTRY_LABEL: Record<Industry, string> = {
  healthtech: "Healthtech",
  fintech: "Fintech",
};

export function DashboardPanel({
  jobs,
  filtered,
  filters,
}: {
  jobs: Job[];
  filtered: Job[];
  filters: JobFilters;
}) {
  const stale = filtered.filter((job) => job.aging === "61+").length;
  const withPay = filtered.filter((job) => job.pay).length;
  const companies = countBy(filtered, (job) => [job.company])
    .slice(0, 12)
    .map((row) => ({ ...row, label: row.key }));
  const locations = [
    ...TARGET_STATES.map((code) => ({
      key: code,
      label: STATE_LABELS[code],
      count: filtered.filter((job) => job.states.includes(code)).length,
    })),
    {
      key: "remote",
      label: "Remote eligible",
      count: filtered.filter((job) => job.remote).length,
    },
  ].filter((row) => row.count > 0);
  const aging = AGING_BUCKETS.map((bucket) => ({
    key: bucket,
    label: AGING_LABELS[bucket],
    count: filtered.filter((job) => job.aging === bucket).length,
  }));
  const industries = (["healthtech", "fintech"] as Industry[]).map((industry) => ({
    key: industry,
    label: INDUSTRY_LABEL[industry],
    count: filtered.filter((job) => job.industries.includes(industry)).length,
  }));
  const pay = (Object.keys(PAY_BAND_LABELS) as PayBand[]).map((band) => ({
    key: band,
    label: PAY_BAND_LABELS[band],
    count: filtered.filter((job) => job.payBand === band).length,
  }));
  const oldest = [...filtered]
    .filter((job) => job.ageDays !== null)
    .sort((a, b) => (b.ageDays ?? 0) - (a.ageDays ?? 0))
    .slice(0, 8);

  return (
    <div className="flex flex-col gap-6">
      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="In this view" value={filtered.length} hint={`${jobs.length} loaded`} />
        <Stat
          label="61+ days open"
          value={stale}
          hint="Needs attention"
          href={`/aging${filtersToQuery({ ...filters, aging: "61+" })}`}
        />
        <Stat
          label="Pay posted"
          value={withPay}
          hint="From job text"
          href={`/listings${filtersToQuery(filters)}`}
        />
        <Stat
          label="Companies"
          value={new Set(filtered.map((job) => job.company)).size}
        />
      </dl>

      <div className="grid gap-4 lg:grid-cols-2">
        <BreakdownList
          title="By company"
          rows={companies}
          href="/"
          filters={filters}
          activeKey={filters.company}
          patchFor={(key) => ({ company: key })}
        />
        <BreakdownList
          title="By location"
          rows={locations}
          href="/"
          filters={filters}
          activeKey={filters.location === "all" ? undefined : filters.location}
          patchFor={(key) => ({
            location: key as JobFilters["location"],
          })}
        />
        <BreakdownList
          title="By aging"
          rows={aging}
          href="/aging"
          filters={filters}
          activeKey={filters.aging === "all" ? undefined : filters.aging}
          patchFor={(key) => ({ aging: key as JobFilters["aging"] })}
        />
        <BreakdownList
          title="By industry"
          rows={industries}
          href="/"
          filters={filters}
          activeKey={filters.industry === "all" ? undefined : filters.industry}
          patchFor={(key) => ({ industry: key as JobFilters["industry"] })}
        />
        <BreakdownList
          title="By pay"
          rows={pay}
          href="/"
          filters={filters}
          activeKey={filters.pay === "all" ? undefined : filters.pay}
          patchFor={(key) => ({ pay: key as JobFilters["pay"] })}
        />
        <section className="rounded-2xl border border-zinc-200 bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold tracking-wide text-zinc-500 uppercase">
              Oldest open roles
            </h2>
            <Link
              href={`/aging${filtersToQuery(filters)}`}
              className="text-sm font-medium text-teal-800 hover:underline"
            >
              Full aging report
            </Link>
          </div>
          {oldest.length === 0 ? (
            <p className="mt-4 text-sm text-zinc-500">No dated listings in this view.</p>
          ) : (
            <ol className="mt-4 flex flex-col gap-3">
              {oldest.map((job) => (
                <li key={job.id} className="border-b border-zinc-100 pb-3 last:border-0">
                  <a href={job.url} target="_blank" rel="noreferrer" className="block">
                    <p className="font-medium text-zinc-950">{job.title}</p>
                    <p className="text-sm text-zinc-600">
                      {job.company} · {formatAge(job.ageDays)} · {job.payLabel}
                    </p>
                  </a>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
  href,
}: {
  label: string;
  value: number;
  hint?: string;
  href?: string;
}) {
  const inner = (
    <>
      <dt className="text-xs tracking-wide text-zinc-500 uppercase">{label}</dt>
      <dd className="text-2xl font-semibold text-zinc-950">{value}</dd>
      {hint ? <p className="text-xs text-zinc-500">{hint}</p> : null}
    </>
  );
  if (href) {
    return (
      <Link href={href} className="rounded-xl border border-zinc-200 bg-white px-4 py-3">
        {inner}
      </Link>
    );
  }
  return (
    <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3">{inner}</div>
  );
}
