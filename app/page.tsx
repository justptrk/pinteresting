import { getJobs } from "@/lib/get-jobs";
import { parseFilters } from "@/lib/parse-filters";
import { DashboardPanel } from "./dashboard-panel";
import { WatchPage } from "./watch-page";

export const revalidate = 1800;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ jobs, fetchedAt, errors }, params] = await Promise.all([
    getJobs(),
    searchParams,
  ]);
  const filters = parseFilters(params);

  return (
    <WatchPage
      pathname="/"
      title="Hiring dashboard"
      description="Companies hiring contractors in healthtech and fintech. Filter by company, state, how long the role has been open, industry, and hourly contract rate — not permanent salary bands."
      jobs={jobs}
      fetchedAt={fetchedAt}
      errors={errors}
      filters={filters}
    >
      {(filtered) => (
        <DashboardPanel jobs={jobs} filtered={filtered} filters={filters} />
      )}
    </WatchPage>
  );
}
