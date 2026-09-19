import { createFileRoute, getRouteApi } from "@tanstack/react-router";
import { JobOverview } from "@/components/jobs/JobOverview";

export const Route = createFileRoute("/_recruiter/jobs/$jobId/")({
  component: JobOverviewPage,
});

const parentRoute = getRouteApi("/_recruiter/jobs/$jobId");

function JobOverviewPage() {
  const { job } = parentRoute.useLoaderData();
  return <JobOverview job={job} />;
}
