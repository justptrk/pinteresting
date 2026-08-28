import { JobBoard } from "./job-board";
import { getJobs } from "@/lib/get-jobs";

export const revalidate = 1800;

export default async function Home() {
  const { jobs, fetchedAt, errors } = await getJobs();
  return <JobBoard jobs={jobs} fetchedAt={fetchedAt} errors={errors} />;
}
