import { getJobs } from "@/lib/get-jobs";
import { parseFilters } from "@/lib/parse-filters";
import { AgingReport } from "../aging-report";
import { WatchPage } from "../watch-page";

export const revalidate = 1800;

export default async function AgingPage({
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
      pathname="/aging"
      title="Aging report"
      description="How long each contractor listing has been open in Virginia, the tri-state area, and North Carolina. Oldest first."
      jobs={jobs}
      fetchedAt={fetchedAt}
      errors={errors}
      filters={filters}
    >
      {(filtered) => <AgingReport jobs={filtered} filters={filters} />}
    </WatchPage>
  );
}
