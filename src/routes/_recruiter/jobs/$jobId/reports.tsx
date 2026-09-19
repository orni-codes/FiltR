import { createFileRoute, getRouteApi } from "@tanstack/react-router";
import { JobReports } from "@/components/reports/JobReports";

export const Route = createFileRoute("/_recruiter/jobs/$jobId/reports")({
  component: JobReportsPage,
});

const parentRoute = getRouteApi("/_recruiter/jobs/$jobId");

function JobReportsPage() {
  const { job } = parentRoute.useLoaderData();
  return <JobReports jobId={job.id} jobTitle={job.title} />;
}
