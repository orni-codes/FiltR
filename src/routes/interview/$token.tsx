import { createFileRoute, Outlet, notFound } from "@tanstack/react-router";
import { CandidateLayout } from "@/components/layout/CandidateLayout";
import { getCandidateByToken, getJob, getInterview } from "@/data/mock";

export const Route = createFileRoute("/interview/$token")({
  loader: ({ params }) => {
    const candidate = getCandidateByToken(params.token);
    if (!candidate) throw notFound();

    const job = getJob(candidate.jobId);
    const interview = getInterview(candidate.id);

    return { token: params.token, candidate, job, interview };
  },
  component: CandidateInterviewLayout,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center p-6 text-center">
      <div>
        <h1 className="text-xl font-semibold">Interview Link Invalid or Expired</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Please check the link provided in your invitation email or contact your recruiter.
        </p>
      </div>
    </div>
  ),
});

function CandidateInterviewLayout() {
  const { token, candidate, job, interview } = Route.useLoaderData();

  return (
    <CandidateLayout
      token={token}
      candidateName={candidate.name}
      jobTitle={job?.title}
      questionsAnswered={interview?.questionsAnswered}
      questionsTotal={interview?.questionsTotal}
    />
  );
}
