import { createFileRoute, getRouteApi } from "@tanstack/react-router";
import { CandidateTable } from "@/components/candidates/CandidateTable";
import { getCandidatesForJob } from "@/data/mock";

export const Route = createFileRoute("/_recruiter/jobs/$jobId/candidates/")({
  component: CandidatesPage,
});

const parentRoute = getRouteApi("/_recruiter/jobs/$jobId");

function CandidatesPage() {
  const { job } = parentRoute.useLoaderData();
  const candidates = getCandidatesForJob(job.id);
  return <CandidateTable job={job} candidates={candidates} />;
}
