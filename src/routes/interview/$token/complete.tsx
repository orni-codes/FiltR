import { createFileRoute, getRouteApi } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { InterviewComplete } from "@/components/interview/InterviewComplete";
import { completeInterview } from "@/lib/api";

export const Route = createFileRoute("/interview/$token/complete")({ component: InterviewCompleteRoute });
const parentRoute = getRouteApi("/interview/$token");

function InterviewCompleteRoute() {
  const { interview_id, candidate, job } = parentRoute.useLoaderData();
  const [report, setReport] = useState<any>(null);
  useEffect(() => { completeInterview(String(interview_id)).then((result) => setReport(result.report)).catch(console.error); }, [interview_id]);
  const questions = report?.questions_answered || report?.questionsAnswered || 5;
  return <InterviewComplete candidateName={candidate?.name || "Candidate"} jobTitle={job?.title} totalQuestionsAnswered={questions} durationMinutes={report?.duration_minutes || 15} completedAt={new Date().toISOString()} />;
}
