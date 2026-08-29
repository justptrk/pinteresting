import type { ReactNode } from "react";
import type { Industry, Job } from "@/lib/types";
import { formatAge, formatDate } from "./format";

const INDUSTRY_LABEL: Record<Industry, string> = {
  healthtech: "Healthtech",
  fintech: "Fintech",
};

export function JobBoard({ jobs }: { jobs: Job[] }) {
  if (jobs.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-zinc-300 px-6 py-16 text-center text-zinc-600">
        No listings match these filters. Clear a company, location, aging, or
        pay filter to widen the view.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {jobs.map((job) => (
        <li key={job.id}>
          <a
            href={job.url}
            target="_blank"
            rel="noreferrer"
            className="block rounded-2xl border border-zinc-200 bg-white p-5 transition hover:border-teal-700"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-zinc-950">{job.title}</h2>
                <p className="text-sm text-zinc-600">{job.company}</p>
              </div>
              <p className="text-sm text-zinc-500">{formatAge(job.ageDays)}</p>
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
              {job.engagement === "contract" ? <Badge tone="teal">Contract</Badge> : null}
              {job.remote ? <Badge>Remote eligible</Badge> : null}
              {job.states.map((code) => (
                <Badge key={code}>{code}</Badge>
              ))}
              <Badge tone={job.pay ? "teal" : "zinc"}>{job.payLabel}</Badge>
              <Badge>{formatDate(job.publishedAt)}</Badge>
            </div>
          </a>
        </li>
      ))}
    </ul>
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
    tone === "teal" ? "bg-teal-50 text-teal-900" : "bg-zinc-100 text-zinc-700";
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${className}`}>
      {children}
    </span>
  );
}
