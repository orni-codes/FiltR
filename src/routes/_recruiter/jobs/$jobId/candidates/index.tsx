import { createFileRoute, getRouteApi } from "@tanstack/react-router";
import { CandidateTable } from "@/components/candidates/CandidateTable";
import { useFiltRStore } from "@/lib/store";

export const Route = createFileRoute("/_recruiter/jobs/$jobId/candidates/")({
  component: CandidatesPage,
});

const parentRoute = getRouteApi("/_recruiter/jobs/$jobId");

function CandidatesPage() {
  const { job } = parentRoute.useLoaderData();
  const { candidates: allCandidates } = useFiltRStore();
  const candidates = allCandidates.filter((candidate) => candidate.jobId === job.id);
  return <CandidateTable job={job} candidates={candidates} />;
}
