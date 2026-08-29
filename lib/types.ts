import type { AgingBucket } from "./aging";
import type { Pay, PayBand } from "./pay";

export type Industry = "healthtech" | "fintech";
export type RegionState = "NY" | "NJ" | "CT" | "VA" | "NC";
export type Engagement = "contract" | "full_time" | "unknown";

export type Job = {
  id: string;
  title: string;
  company: string;
  url: string;
  source: "themuse" | "greenhouse" | "remoteok" | "jobicy";
  locations: string[];
  states: RegionState[];
  remote: boolean;
  industries: Industry[];
  engagement: Engagement;
  publishedAt: string | null;
  ageDays: number | null;
  aging: AgingBucket;
  pay: Pay | null;
  payBand: PayBand;
  payLabel: string;
};

export type JobsPayload = {
  jobs: Job[];
  fetchedAt: string;
  errors: string[];
};

export type JobFilters = {
  query: string;
  industry: "all" | Industry;
  location: "all" | RegionState | "remote";
  company: string;
  aging: "all" | AgingBucket;
  pay: "all" | PayBand;
  contractOnly: boolean;
};
