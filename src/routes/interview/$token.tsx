import { createFileRoute, Outlet, notFound } from "@tanstack/react-router";
import { CandidateLayout } from "@/components/layout/CandidateLayout";
import { getInterviewByToken } from "@/lib/api";

export const Route = createFileRoute("/interview/$token")({
  loader: async ({ params }) => {
    try {
      const data = await getInterviewByToken(params.token);
      return { token: params.token, ...data };
    } catch { throw notFound(); }
  },
  component: CandidateInterviewLayout,
  notFoundComponent: () => <div className="flex min-h-screen items-center justify-center p-6 text-center"><div><h1 className="text-xl font-semibold">Interview Link Invalid or Expired</h1><p className="mt-2 text-sm text-muted-foreground">Please check the link provided by your recruiter.</p></div></div>,
});

function CandidateInterviewLayout() {
  const { token, candidate, job, question_count } = Route.useLoaderData();
  const name = candidate?.name || "Candidate";
  return <CandidateLayout token={token} candidateName={name} jobTitle={job?.title} questionsAnswered={0} questionsTotal={question_count || 5} />;
}
