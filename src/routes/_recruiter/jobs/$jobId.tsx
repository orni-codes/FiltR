import { createFileRoute, Outlet, notFound, useMatches } from "@tanstack/react-router";
import { JobHeader, JobNavigation } from "@/components/jobs/JobHeader";
import { ApiError, getJobDashboard, mapJobFromDashboard } from "@/lib/api";
import { getJob, hydrateStoreFromBackend } from "@/lib/store";

export const Route = createFileRoute("/_recruiter/jobs/$jobId")({
  loader: async ({ params }) => {
    await hydrateStoreFromBackend();
    let job = getJob(params.jobId);
    if (!job) {
      try {
        job = mapJobFromDashboard(await getJobDashboard(params.jobId), params.jobId);
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) throw notFound();
        throw error;
      }
    }
    if (!job) throw notFound();
    return { job };
  },
  component: JobLayout,
  notFoundComponent: () => (
    <div className="flex min-h-[60vh] items-center justify-center">
      <p className="text-sm text-muted-foreground">Job not found.</p>
    </div>
  ),
});

function JobLayout() {
  const { job } = Route.useLoaderData();
  const matches = useMatches();

  // Hide job header/tabs when rendering the candidate workspace
  const isCandidatePage = matches.some(
    (m) => typeof m.params === "object" && m.params !== null && "candidateId" in m.params,
  );

  if (isCandidatePage) {
    return <Outlet />;
  }

  return (
    <>
      <JobHeader job={job} />
      <JobNavigation jobId={job.id} />
      <main className="px-4 py-7 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Outlet />
        </div>
      </main>
    </>
  );
}
