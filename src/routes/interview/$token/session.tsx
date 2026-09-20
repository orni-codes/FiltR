import { createFileRoute, getRouteApi, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { CameraPreview } from "@/components/interview/CameraPreview";
import { InterviewProgress } from "@/components/interview/InterviewProgress";
import { InterviewQuestion } from "@/components/interview/InterviewQuestion";
import { FollowUpQuestion } from "@/components/interview/FollowUpQuestion";
import { RecordingControls } from "@/components/interview/RecordingControls";
import { ProcessingState } from "@/components/interview/ProcessingState";
import { startInterview, submitInterviewAnswer } from "@/lib/api";
import type { DemoInterviewQuestion, InterviewStepState } from "@/lib/interview-session";

export const Route = createFileRoute("/interview/$token/session")({ component: InterviewSessionPage });
const parentRoute = getRouteApi("/interview/$token");

function toQuestion(raw: any): DemoInterviewQuestion {
  return { id: String(raw.id), requirementId: "backend", requirementName: "Interview signal", requirementType: "Required", question: raw.question_text, timeEstimateSeconds: 120 } as DemoInterviewQuestion;
}

function InterviewSessionPage() {
  const data = parentRoute.useLoaderData();
  const navigate = useNavigate();
  const [question, setQuestion] = useState<DemoInterviewQuestion | null>(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [stepState, setStepState] = useState<InterviewStepState>("QUESTION");
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [transcript, setTranscript] = useState("");
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);
  const interviewId = String(data.interview_id);
  const totalQuestions = data.question_count || 5;

  useEffect(() => {
    startInterview(interviewId).then((result) => { setQuestion(toQuestion(result.question)); setQuestionNumber(result.question.question_number || 1); }).catch(console.error);
  }, [interviewId]);

  useEffect(() => {
    if (stepState !== "RECORDING") return;
    const timer = window.setInterval(() => setRecordingSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [stepState]);

  const handleMediaStreamReady = (stream: MediaStream) => {
    try { recorderRef.current = new MediaRecorder(stream); recorderRef.current.ondataavailable = (event) => { if (event.data.size) chunksRef.current.push(event.data); }; } catch {}
  };

  const startRecording = () => {
    setTranscript(""); setRecordingSeconds(0); chunksRef.current = [];
    try { if (recorderRef.current?.state === "inactive") recorderRef.current.start(500); } catch {}
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try { const recognition = new SpeechRecognition(); recognition.continuous = true; recognition.interimResults = true; recognition.onresult = (event: any) => { let text = ""; for (let i = 0; i < event.results.length; i++) text += event.results[i][0].transcript + " "; setTranscript(text.trim()); }; recognitionRef.current = recognition; recognition.start(); } catch {}
    }
    setStepState("RECORDING");
  };

  const stopAndSubmit = async () => {
    try { recorderRef.current?.stop(); recognitionRef.current?.stop(); } catch {}
    setStepState("ANALYZING");
    const answer = transcript.trim() || "Candidate recorded a spoken response.";
    try {
      const result = await submitInterviewAnswer(interviewId, { question_id: Number(question?.id), answer_text: answer, transcript: answer, duration_seconds: recordingSeconds });
      if (result.completed || !result.next_question) {
        navigate({ to: "/interview/$token/complete", params: { token: data.token } });
        return;
      }
      setQuestion(toQuestion(result.next_question)); setQuestionNumber(result.next_question.question_number || questionNumber + 1); setStepState("QUESTION"); setRecordingSeconds(0);
    } catch (error) { console.error(error); setStepState("QUESTION"); }
  };

  if (!question) return <div className="mx-auto max-w-5xl p-8 text-sm text-muted-foreground">Preparing your first interview question…</div>;
  const isLastQuestion = questionNumber >= totalQuestions;
  return <div className="animate-workspace-enter mx-auto max-w-5xl space-y-5"><div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"><div><div className="text-[9px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Live interview</div><div className="mt-1 text-xs font-medium text-white">Adaptive question {questionNumber}</div></div><div className="min-w-[180px]"><InterviewProgress currentQuestionNumber={questionNumber} totalQuestions={totalQuestions} isFollowUp={false} /></div></div><div className="grid gap-5 lg:grid-cols-12"><div className="lg:col-span-5 flex flex-col justify-between rounded-3xl border border-white/10 bg-black/25 p-2 shadow-2xl shadow-black/30"><CameraPreview candidateInitials={(data.candidate?.name || "C").split(/\s+/).map((x: string) => x[0]).join("").slice(0,2).toUpperCase()} candidateName={data.candidate?.name || "Candidate"} isRecording={stepState === "RECORDING"} recordingSeconds={recordingSeconds} onMediaStreamReady={handleMediaStreamReady} className="aspect-square lg:aspect-auto lg:h-full min-h-[260px]" /></div><div className="lg:col-span-7 flex flex-col justify-between space-y-4 rounded-3xl border border-white/10 bg-white/[0.025] p-5 sm:p-6">{stepState === "ANALYZING" ? <ProcessingState requirementName="Interview signal" isFollowUp={false} /> : <InterviewQuestion question={question} />}<RecordingControls stepState={stepState} isRecording={stepState === "RECORDING"} recordingSeconds={recordingSeconds} onStartRecording={startRecording} onStopAndSubmit={stopAndSubmit} isLastQuestion={isLastQuestion} /></div></div></div>;
}
