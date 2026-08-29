export type AgingBucket = "0-7" | "8-14" | "15-30" | "31-60" | "61+" | "unknown";

export const AGING_BUCKETS: AgingBucket[] = [
  "0-7",
  "8-14",
  "15-30",
  "31-60",
  "61+",
  "unknown",
];

export const AGING_LABELS: Record<AgingBucket, string> = {
  "0-7": "0–7 days",
  "8-14": "8–14 days",
  "15-30": "15–30 days",
  "31-60": "31–60 days",
  "61+": "61+ days",
  unknown: "Date unknown",
};

export function ageInDays(publishedAt: string | null, now = Date.now()): number | null {
  if (!publishedAt) return null;
  const time = Date.parse(publishedAt);
  if (Number.isNaN(time)) return null;
  return Math.max(0, Math.floor((now - time) / 86_400_000));
}

export function agingBucket(days: number | null): AgingBucket {
  if (days === null) return "unknown";
  if (days <= 7) return "0-7";
  if (days <= 14) return "8-14";
  if (days <= 30) return "15-30";
  if (days <= 60) return "31-60";
  return "61+";
}
