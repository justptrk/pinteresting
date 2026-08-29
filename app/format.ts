export function formatDate(value: string | null): string {
  if (!value) return "Date unknown";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unknown";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatAge(days: number | null): string {
  if (days === null) return "Unknown";
  if (days === 0) return "Posted today";
  if (days === 1) return "1 day open";
  return `${days} days open`;
}
