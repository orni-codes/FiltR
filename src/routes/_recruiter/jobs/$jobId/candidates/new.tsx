import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  UploadCloud,
  FileText,
  User,
  Mail,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Briefcase,
  GraduationCap,
  Sparkles,
  ChevronRight,
  Plus,
} from "lucide-react";
import { uploadCandidate, extractCandidate, matchApplication } from "@/lib/api";
import { hydrateStoreFromBackend, useFiltRStore } from "@/lib/store";
import { aiService } from "@/lib/ai/service";
import type { RequirementMatchAnalysis } from "@/lib/ai/service";
import type { ParsedResumeProfile } from "@/lib/ai/service";

export const Route = createFileRoute(
  "/_recruiter/jobs/$jobId/candidates/new"
)({
  component: AddCandidatePage,
});

type Step = "input" | "parsing" | "analyzing" | "review";

export function AddCandidatePage() {
  const { jobId } = Route.useParams();
  const navigate = useNavigate();
  const { jobs } = useFiltRStore();
  const job = jobs.find((item) => item.id === jobId);

  const [step, setStep] = useState<Step>("input");
  const [candidateName, setCandidateName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [createdApplicationId, setCreatedApplicationId] = useState<number | null>(null);
  const [createdCandidateId, setCreatedCandidateId] = useState<number | null>(null);

  const [parsedProfile, setParsedProfile] = useState<ParsedResumeProfile | null>(
    null
  );
  const [resumeAnalysis, setResumeAnalysis] =
    useState<RequirementMatchAnalysis[] | null>(null);

  if (!job) {
    return (
      <div className="p-8 text-center">
        <p className="text-zinc-400">Job not found.</p>
        <Link
          to="/jobs"
          className="mt-4 inline-block text-sm text-amber-500 hover:underline"
        >
          Return to Jobs
        </Link>
      </div>
    );
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
      setFileSize((file.size / 1024).toFixed(1) + " KB");

      // Set candidate name guess if blank
      if (!candidateName) {
        const cleanName = file.name
          .replace(/\.[^/.]+$/, "")
          .replace(/[-_]/g, " ")
          .replace(/resume|cv/gi, "")
          .trim();
        if (cleanName) {
          setCandidateName(
            cleanName
              .split(" ")
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(" ")
          );
        }
      }

      // TXT files can be read directly in the browser. PDF/DOCX files are
      // intentionally treated as uploaded documents in this mock frontend;
      // the real parser will be connected during backend integration.
      if (file.type === "text/plain" || file.name.toLowerCase().endsWith(".txt")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = typeof event.target?.result === "string" ? event.target.result : "";
          setResumeText(text || `Resume for ${candidateName || "candidate"}`);
        };
        reader.readAsText(file);
      } else {
        setResumeText(`Resume document uploaded: ${file.name}. Candidate profile will be extracted by FiltR AI.`);
      }
    }
  };

  const handleProcessCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateName || !candidateEmail || !selectedFile) return;
    try {
      setStep("parsing");
      setStatusMessage("Uploading resume to FiltR backend...");
      const uploaded = await uploadCandidate(job.id, selectedFile);
      setCreatedApplicationId(uploaded.application_id);
      setCreatedCandidateId(uploaded.candidate_id);
      setStep("analyzing");
      setStatusMessage("Extracting candidate profile with the backend AI...");
      await extractCandidate(String(uploaded.candidate_id));
      setStatusMessage("Matching candidate evidence to job requirements...");
      await matchApplication(String(uploaded.application_id));
      await hydrateStoreFromBackend();
      setParsedProfile({ name: candidateName, email: candidateEmail, skills: [], experience: "—", projects: [], connectedClaims: [] } as any);
      setResumeAnalysis([]);
      setStep("review");
    } catch (err) {
      console.error(err);
      setStatusMessage(err instanceof Error ? err.message : "Processing encountered an error. Please try again.");
      setStep("input");
    }
  };

  const handleSaveCandidate = async () => {
    if (!createdCandidateId || !createdApplicationId) return;
    try {
      const interview = await (await import("@/lib/api")).createInterview(String(createdApplicationId));
      await hydrateStoreFromBackend();
      navigate({ to: "/jobs/$jobId/candidates/$candidateId", params: { jobId: job.id, candidateId: String(createdCandidateId) }, search: { tab: "overview" } });
      void interview;
    } catch (error) {
      console.error("Failed to create interview", error);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/jobs/$jobId/candidates"
          params={{ jobId: job.id }}
          className="p-2 -ml-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">Add Candidate</h1>
          <p className="text-sm text-zinc-400">
            Add a new applicant to <span className="text-zinc-200">{job.title}</span>
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2 p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-400">
        <span
          className={`flex items-center gap-1.5 ${
            step === "input" ? "text-amber-500 font-semibold" : "text-zinc-400"
          }`}
        >
          1. Candidate Details & Resume
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
        <span
          className={`flex items-center gap-1.5 ${
            step === "parsing" || step === "analyzing"
              ? "text-amber-500 font-semibold"
              : "text-zinc-500"
          }`}
        >
          2. AI Extraction & Analysis
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
        <span
          className={`flex items-center gap-1.5 ${
            step === "review" ? "text-amber-500 font-semibold" : "text-zinc-500"
          }`}
        >
          3. Review & Add to Pipeline
        </span>
      </div>

      {/* Form Step */}
      {step === "input" && (
        <form onSubmit={handleProcessCandidate} className="space-y-6">
          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl space-y-5">
            <h2 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">
              Candidate Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jordan Miller"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                  <input
                    type="email"
                    required
                    placeholder="jordan.miller@example.com"
                    value={candidateEmail}
                    onChange={(e) => setCandidateEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Resume Upload Box */}
            <div className="pt-2">
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                Resume Document (PDF / DOCX / TXT)
              </label>
              <div className="border-2 border-dashed border-zinc-700 hover:border-zinc-500 rounded-xl p-6 text-center transition-colors bg-zinc-950/50">
                <input
                  type="file"
                  id="resume-upload"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="resume-upload"
                  className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                >
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                    <UploadCloud className="w-5 h-5 text-amber-500" />
                  </div>
                  <div className="text-sm text-zinc-300 font-medium">
                    {fileName ? (
                      <span className="text-amber-500 font-mono">
                        {fileName} ({fileSize})
                      </span>
                    ) : (
                      <>
                        Click to upload resume or{" "}
                        <span className="text-amber-500">browse files</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500">
                    Supports PDF, DOCX, TXT (up to 10MB)
                  </p>
                </label>
              </div>
            </div>

            {/* Optional Paste Text */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                Or Paste Resume Text (Optional)
              </label>
              <textarea
                rows={4}
                placeholder="Paste candidate resume or raw career summary text here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-amber-500 font-mono resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Link
              to="/jobs/$jobId/candidates"
              params={{ jobId: job.id }}
              className="px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={!candidateName || !candidateEmail}
              className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-medium text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/10"
            >
              <Sparkles className="w-4 h-4" />
              Parse & Match with AI
            </button>
          </div>
        </form>
      )}

      {/* Loading States */}
      {(step === "parsing" || step === "analyzing") && (
        <div className="p-12 bg-zinc-900 border border-zinc-800 rounded-xl flex flex-col items-center justify-center text-center space-y-4">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-zinc-100">
              {step === "parsing" ? "Parsing Resume" : "Analyzing Evidence"}
            </h3>
            <p className="text-sm text-zinc-400 font-mono">{statusMessage}</p>
          </div>
          <div className="w-48 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className={`h-full bg-amber-500 transition-all duration-500 ${
                step === "parsing" ? "w-1/2" : "w-5/6"
              }`}
            />
          </div>
        </div>
      )}

      {/* Review & Add Step */}
      {step === "review" && parsedProfile && resumeAnalysis && (
        <div className="space-y-6">
          {/* Candidate Profile Summary */}
          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h2 className="text-lg font-semibold text-zinc-100">
                  {candidateName}
                </h2>
                <p className="text-xs text-zinc-400">{candidateEmail}</p>
              </div>
              <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono rounded-full flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Resume Extracted
              </span>
            </div>

            {/* Profile Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-zinc-500" />
                  Experience Highlights
                </h3>
                <p className="text-xs leading-relaxed text-zinc-300">
                  {parsedProfile.experience}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                  {parsedProfile.summary}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-zinc-500" />
                  Education & Skills
                </h3>
                <p className="text-xs text-zinc-300 mb-2">
                  {parsedProfile.education.map((edu, i) => (
                    <span key={i}>
                      {edu.degree}, {edu.institution} ({edu.year})
                    </span>
                  ))}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {parsedProfile.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-zinc-800 text-zinc-300 text-[11px] rounded border border-zinc-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Job Requirements vs Resume Analysis */}
          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">
                  Resume ↔ Job Requirements Analysis
                </h2>
                <p className="text-xs text-zinc-400">
                  Initial requirement verification from resume evidence (No scores
                  or rankings)
                </p>
              </div>
              <span className="text-xs font-mono text-zinc-500">
                {resumeAnalysis.length} Requirements Checked
              </span>
            </div>

            <div className="divide-y divide-zinc-800">
              {resumeAnalysis.map((match, i) => {
                const badgeStyle =
                  match.status === "Validated"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : match.status === "Partial"
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    : "bg-zinc-800 text-zinc-400 border-zinc-700";

                return (
                  <div key={i} className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-zinc-200">
                          {match.requirementName}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 font-mono">
                        {match.evidence}
                      </p>
                    </div>
                    <div>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono border capitalize ${badgeStyle}`}
                      >
                        {match.status === "Validated"
                          ? "Validated"
                          : match.status === "Partial"
                          ? "Partial"
                          : "Needs Validation"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setStep("input")}
              className="text-xs text-zinc-400 hover:text-zinc-200"
            >
              ← Edit details
            </button>
            <button
              onClick={handleSaveCandidate}
              className="flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-sm rounded-lg transition-colors shadow-lg shadow-amber-500/10"
            >
              <Plus className="w-4 h-4" />
              Save Candidate to Pipeline
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
