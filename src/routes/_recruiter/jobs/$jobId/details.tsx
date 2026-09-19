import { createFileRoute, getRouteApi } from "@tanstack/react-router";
import { JobDetails } from "@/components/jobs/JobDetails";

export const Route = createFileRoute("/_recruiter/jobs/$jobId/details")({
  component: JobDetailsPage,
});

const parentRoute = getRouteApi("/_recruiter/jobs/$jobId");

function JobDetailsPage() {
  const { job } = parentRoute.useLoaderData();
  return <JobDetails job={job} />;
}
