import { createFileRoute, getRouteApi } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { InterviewComplete } from "@/components/interview/InterviewComplete";
import { DEMO_INTERVIEW_QUESTIONS, loadSessionState } from "@/lib/interview-session";
import { filtRStore } from "@/lib/store";
import type { InterviewEvidence, TranscriptEntry } from "@/types/filtr";

export const Route = createFileRoute("/interview/$token/complete")({
  component: InterviewCompleteRoute,
});

const parentRoute = getRouteApi("/interview/$token");

function buildCompletedInterview(token: string) {
  const session = loadSessionState(token);
  const durationSeconds = session.answers.reduce(
    (total, answer) => total + Math.max(answer.durationSeconds || 0, 30),
    0,
  );

  const transcript: TranscriptEntry[] = DEMO_INTERVIEW_QUESTIONS.map((question, index) => {
    const primaryAnswer = session.answers.find((answer) => answer.questionId === question.id);
    const followUpAnswer = question.followUpQuestion
      ? session.answers.find((answer) => answer.questionId === question.followUpQuestion?.id)
      : undefined;

    return {
      id: `tr-${question.id}`,
      questionNumber: index + 1,
      timestamp: `${String(Math.floor((index * 270 + 60) / 60)).padStart(2, "0")}:00`,
      title: question.requirementName,
      aiQuestion: question.question,
      candidateAnswer: primaryAnswer
        ? `The candidate provided a recorded response describing their practical experience with ${question.requirementName}.`
        : "No response recorded.",
      candidateAnswerTime: primaryAnswer ? "Response recorded" : undefined,
      hasFollowUp: Boolean(followUpAnswer),
      aiFollowUp: followUpAnswer ? question.followUpQuestion?.question : undefined,
      aiFollowUpTime: followUpAnswer ? "Follow-up" : undefined,
      candidateFollowUpAnswer: followUpAnswer
        ? "The candidate clarified their ownership and implementation details."
        : undefined,
      candidateFollowUpTime: followUpAnswer ? "Response recorded" : undefined,
      requirementId: question.requirementId,
      requirementName: question.requirementName,
    };
  });

  const evidenceItems: InterviewEvidence[] = DEMO_INTERVIEW_QUESTIONS.map((question, index) => {
    const followUpAnswer = question.followUpQuestion
      ? session.answers.find((answer) => answer.questionId === question.followUpQuestion?.id)
      : undefined;

    const status =
      question.expectedOutcome === "validated"
        ? "Validated"
        : question.expectedOutcome === "partial"
          ? "Partial"
          : "Needs validation";

    return {
      id: `ev-${question.id}`,
      requirementId: question.requirementId,
      requirementName: question.requirementName,
      requirementType: question.requirementType,
      resumeClaim: `Resume claim related to ${question.requirementName}`,
      resumeSource: "Resume · Parsed profile",
      interviewQuestionNumber: index + 1,
      question: question.question,
      answer: `Recorded response for ${question.requirementName}.`,
      evidence:
        status === "Validated"
          ? `The response contained specific examples and evidence relevant to ${question.requirementName}.`
          : status === "Partial"
            ? `The response demonstrated relevant exposure to ${question.requirementName}, but some depth remains unclear.`
            : `The initial response did not provide enough direct evidence for ${question.requirementName}.`,
      evidencePoints:
        status === "Validated"
          ? [
              "Specific practical example",
              "Clear ownership or methodology",
              "Evidence aligned with the requirement",
            ]
          : status === "Partial"
            ? ["Relevant experience mentioned", "Technical depth requires clarification"]
            : ["Insufficient direct evidence", "Recruiter validation recommended"],
      status,
      timestamp: `${String(Math.floor((index * 270 + 60) / 60)).padStart(2, "0")}:00`,
      duration: "02:30",
      hasFollowUp: Boolean(followUpAnswer),
      followUpQuestion: followUpAnswer ? question.followUpQuestion?.question : undefined,
      followUpAnswer: followUpAnswer
        ? "Candidate clarified their direct contribution and implementation context."
        : undefined,
      followUpTimestamp: followUpAnswer ? "Follow-up" : undefined,
    };
  });

  return {
    duration: `${String(Math.max(1, Math.round(durationSeconds / 60))).padStart(2, "0")}:00`,
    questionsTotal: DEMO_INTERVIEW_QUESTIONS.length,
    questionsAnswered: Math.max(DEMO_INTERVIEW_QUESTIONS.length, session.totalAnswered),
    transcript,
    evidenceItems,
  };
}

function InterviewCompleteRoute() {
  const { token, candidate, job } = parentRoute.useLoaderData();
  const session = loadSessionState(token);
  const completedInterview = useMemo(() => buildCompletedInterview(token), [token]);

  useEffect(() => {
    if (!session.completedAt || !candidate) return;

    filtRStore.completeCandidateInterview(candidate.id, {
      duration: completedInterview.duration,
      questionsTotal: completedInterview.questionsTotal,
      questionsAnswered: completedInterview.questionsAnswered,
      transcript: completedInterview.transcript,
      evidenceItems: completedInterview.evidenceItems,
    });
  }, [candidate, completedInterview, session.completedAt]);

  const durationMinutes = Math.max(1, Number.parseInt(completedInterview.duration, 10));

  return (
    <InterviewComplete
      candidateName={candidate.name}
      jobTitle={job?.title}
      totalQuestionsAnswered={completedInterview.questionsAnswered}
      durationMinutes={durationMinutes}
      completedAt={session.completedAt}
    />
  );
}
