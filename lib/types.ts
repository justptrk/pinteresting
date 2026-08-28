export type Industry = "healthtech" | "fintech";
export type RegionState = "NY" | "NJ" | "CT" | "VA" | "NC";
export type Engagement = "contract" | "full_time" | "unknown";

export type Job = {
  id: string;
  title: string;
  company: string;
  url: string;
  source: "themuse" | "greenhouse";
  locations: string[];
  states: RegionState[];
  remote: boolean;
  industries: Industry[];
  engagement: Engagement;
  publishedAt: string | null;
};

export type JobsPayload = {
  jobs: Job[];
  fetchedAt: string;
  errors: string[];
};
