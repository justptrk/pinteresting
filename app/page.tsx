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
      title="Companies hiring contractors"
      description="Open contractor roles in Virginia, the NY/NJ/CT tri-state area, and North Carolina. Drill by company, state, aging, and hourly rate."
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
