import { createFileRoute, getRouteApi, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { CameraPreview } from "@/components/interview/CameraPreview";
import { InterviewProgress } from "@/components/interview/InterviewProgress";
import { InterviewQuestion } from "@/components/interview/InterviewQuestion";
import { FollowUpQuestion } from "@/components/interview/FollowUpQuestion";
import { RecordingControls } from "@/components/interview/RecordingControls";
import { ProcessingState } from "@/components/interview/ProcessingState";
import {
  DEMO_INTERVIEW_QUESTIONS,
  loadSessionState,
  saveSessionState,
  type InterviewStepState,
  type DemoInterviewQuestion,
} from "@/lib/interview-session";

export const Route = createFileRoute("/interview/$token/session")({
  component: InterviewSessionPage,
});

const parentRoute = getRouteApi("/interview/$token");

function InterviewSessionPage() {
  const { token, candidate } = parentRoute.useLoaderData();
  const navigate = useNavigate();

  // Load persistent or initial state
  const [session, setSession] = useState(() => loadSessionState(token));
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const timerRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const questions = DEMO_INTERVIEW_QUESTIONS;
  const currentQIndex = session.currentQuestionIndex;
  const activeQuestion: DemoInterviewQuestion = questions[currentQIndex] || questions[0];
  const isFollowUp = session.isInFollowUp && !!activeQuestion.followUpQuestion;
  const displayQuestion = isFollowUp ? activeQuestion.followUpQuestion! : activeQuestion;
  const totalQuestions = questions.length;
  const isLastQuestion =
    currentQIndex === totalQuestions - 1 &&
    (!activeQuestion.triggersFollowUp || session.isInFollowUp);

  // Synchronize session state to sessionStorage
  useEffect(() => {
    saveSessionState(token, session);
  }, [session, token]);

  // Handle Recording Timer
  useEffect(() => {
    if (session.stepState === "RECORDING") {
      setRecordingSeconds(0);
      const interval = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
      timerRef.current = interval;
      return () => {
        clearInterval(interval);
      };
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [session.stepState]);

  // Handle MediaRecorder hookup
  const handleMediaStreamReady = (stream: MediaStream) => {
    try {
      if (typeof MediaRecorder !== "undefined") {
        const recorder = new MediaRecorder(stream);
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            recordedChunksRef.current.push(e.data);
          }
        };
        mediaRecorderRef.current = recorder;
      }
    } catch (e) {
      console.warn("MediaRecorder could not be initialized, using demo fallback", e);
    }
  };

  const startRecording = () => {
    try {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "inactive") {
        recordedChunksRef.current = [];
        mediaRecorderRef.current.start(1000);
      }
    } catch (e) {
      console.warn("MediaRecorder start error", e);
    }
    setSession((prev) => ({
      ...prev,
      stepState: "RECORDING",
    }));
  };

  const stopAndSubmit = () => {
    try {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    } catch (e) {
      console.warn("MediaRecorder stop error", e);
    }

    // Move to ANALYZING state
    setSession((prev) => ({
      ...prev,
      stepState: "ANALYZING",
      answers: [
        ...prev.answers,
        {
          questionId: displayQuestion.id,
          requirementName: displayQuestion.requirementName,
          durationSeconds: recordingSeconds,
          recordedAt: new Date().toISOString(),
          isFollowUp,
        },
      ],
      totalAnswered: prev.totalAnswered + 1,
    }));

    // Simulate intentional AI response analysis
    setTimeout(() => {
      // Check if this question triggers an adaptive follow-up clarification
      if (
        !session.isInFollowUp &&
        activeQuestion.triggersFollowUp &&
        activeQuestion.followUpQuestion
      ) {
        setSession((prev) => ({
          ...prev,
          isInFollowUp: true,
          stepState: "FOLLOW_UP",
        }));
      } else {
        // Move to next question or complete
        const nextIndex = currentQIndex + 1;
        if (nextIndex >= questions.length) {
          setSession((prev) => ({
            ...prev,
            stepState: "COMPLETE",
            completedAt: new Date().toISOString(),
          }));
          navigate({
            to: "/interview/$token/complete",
            params: { token },
          });
        } else {
          setSession((prev) => ({
            ...prev,
            currentQuestionIndex: nextIndex,
            isInFollowUp: false,
            stepState: "QUESTION",
          }));
        }
      }
    }, 2400);
  };

  return (
    <div className="animate-workspace-enter mx-auto max-w-5xl space-y-5">
      {/* Top progress */}
      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
        <div><div className="text-[9px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Live interview</div><div className="mt-1 text-xs font-medium text-white">{displayQuestion.requirementName}</div></div>
        <div className="min-w-[180px]"><InterviewProgress currentQuestionNumber={currentQIndex + 1} totalQuestions={totalQuestions} isFollowUp={isFollowUp} /></div>
      </div>

      <div className="grid gap-5 lg:grid-cols-12">
        {/* Left column: Live Camera Feed */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-3xl border border-white/10 bg-black/25 p-2 shadow-2xl shadow-black/30">
          <CameraPreview
            candidateInitials={candidate.initials}
            candidateName={candidate.name}
            isRecording={session.stepState === "RECORDING"}
            recordingSeconds={recordingSeconds}
            onMediaStreamReady={handleMediaStreamReady}
            className="aspect-square lg:aspect-auto lg:h-full min-h-[260px]"
          />
        </div>

        {/* Right column: Question / Processing State */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4 rounded-3xl border border-white/10 bg-white/[0.025] p-5 sm:p-6">
          {session.stepState === "ANALYZING" ? (
            <ProcessingState
              requirementName={displayQuestion.requirementName}
              isFollowUp={isFollowUp}
            />
          ) : isFollowUp ? (
            <FollowUpQuestion question={displayQuestion} />
          ) : (
            <InterviewQuestion question={displayQuestion} />
          )}

          {/* Recording & submission controls */}
          <RecordingControls
            stepState={session.stepState}
            isRecording={session.stepState === "RECORDING"}
            recordingSeconds={recordingSeconds}
            onStartRecording={startRecording}
            onStopAndSubmit={stopAndSubmit}
            isLastQuestion={isLastQuestion}
          />
        </div>
      </div>
    </div>
  );
}
