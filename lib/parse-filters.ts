import { AGING_BUCKETS, type AgingBucket } from "./aging";
import { PAY_BAND_LABELS, type PayBand } from "./pay";
import type { Industry, JobFilters, RegionState } from "./types";

const INDUSTRIES: Industry[] = ["healthtech", "fintech"];
const STATES: RegionState[] = ["NY", "NJ", "CT", "VA", "NC"];
const PAY_BANDS = Object.keys(PAY_BAND_LABELS) as PayBand[];

function first(
  value: string | string[] | undefined,
): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export function parseFilters(
  searchParams: Record<string, string | string[] | undefined>,
): JobFilters {
  const industry = first(searchParams.industry);
  const location = first(searchParams.location);
  const aging = first(searchParams.aging);
  const pay = first(searchParams.pay);

  return {
    query: first(searchParams.q),
    industry: INDUSTRIES.includes(industry as Industry)
      ? (industry as Industry)
      : "all",
    location:
      location === "remote" || STATES.includes(location as RegionState)
        ? (location as RegionState | "remote")
        : "all",
    company: first(searchParams.company),
    aging: AGING_BUCKETS.includes(aging as AgingBucket)
      ? (aging as AgingBucket)
      : "all",
    pay: PAY_BANDS.includes(pay as PayBand) ? (pay as PayBand) : "all",
    contractOnly: first(searchParams.contract) !== "0",
  };
}

export function filtersToQuery(filters: JobFilters): string {
  const params = new URLSearchParams();
  if (filters.query) params.set("q", filters.query);
  if (filters.industry !== "all") params.set("industry", filters.industry);
  if (filters.location !== "all") params.set("location", filters.location);
  if (filters.company) params.set("company", filters.company);
  if (filters.aging !== "all") params.set("aging", filters.aging);
  if (filters.pay !== "all") params.set("pay", filters.pay);
  params.set("contract", filters.contractOnly ? "1" : "0");
  const query = params.toString();
  return query ? `?${query}` : "";
}
