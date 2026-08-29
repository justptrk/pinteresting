import { getJobs } from "@/lib/get-jobs";
import { parseFilters } from "@/lib/parse-filters";
import { JobBoard } from "../job-board";
import { WatchPage } from "../watch-page";

export const revalidate = 1800;

export default async function ListingsPage({
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
      pathname="/listings"
      title="Open listings"
      description="Contractor listings for Virginia, NY/NJ/CT, and North Carolina. Same company and state filters as the dashboard."
      jobs={jobs}
      fetchedAt={fetchedAt}
      errors={errors}
      filters={filters}
    >
      {(filtered) => <JobBoard jobs={filtered} />}
    </WatchPage>
  );
}
