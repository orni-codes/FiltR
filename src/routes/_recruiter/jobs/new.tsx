import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Check,
  FileText,
  Plus,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/shared/Panel";
import { aiService, type ExtractedRequirement } from "@/lib/ai/service";
import { filtRStore } from "@/lib/store";
import type { Job, JobRequirement } from "@/types/filtr";

export const Route = createFileRoute("/_recruiter/jobs/new")({
  component: CreateJobPage,
});

type Step = "input" | "parsing" | "review";

const SAMPLE_JDS = [
  {
    title: "Senior Analytics Engineer",
    department: "Data & BI",
    location: "Bengaluru",
    workMode: "Hybrid",
    type: "Full-time",
    description: `We are looking for a Senior Analytics Engineer to lead our core dimensional data warehouse in Snowflake and dbt. You will design canonical data marts, optimize high-volume queries, partner with product managers on event taxonomy, and mentor junior analysts. Requirements include advanced SQL, data modeling (Kimball star schema), Python automation, and executive dashboard communication.`,
  },
  {
    title: "Lead Product Designer",
    department: "Design",
    location: "Remote",
    workMode: "Remote",
    type: "Full-time",
    description: `Join our team as a Lead Product Designer to shape next-generation B2B intelligence tools. You will lead end-to-end user research, build our scalable Figma design system, craft interactive prototypes in Framer, and partner with engineering leads on accessibility and implementation feasibility.`,
  },
];

function CreateJobPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>("input");
  const [jobTitle, setJobTitle] = useState("");
  const [department, setDepartment] = useState("Engineering & Product");
  const [location, setLocation] = useState("Bengaluru");
  const [workMode, setWorkMode] = useState("Hybrid");
  const [employmentType, setEmploymentType] = useState("Full-time");
  const [description, setDescription] = useState("");
  const [experience, setExperience] = useState("3–5 years");

  const [requirements, setRequirements] = useState<ExtractedRequirement[]>([]);
  const [newReqName, setNewReqName] = useState("");
  const [newReqType, setNewReqType] = useState<"Required" | "Preferred">("Required");

  const handleApplySample = (sample: (typeof SAMPLE_JDS)[0]) => {
    setJobTitle(sample.title);
    setDepartment(sample.department);
    setLocation(sample.location);
    setWorkMode(sample.workMode);
    setEmploymentType(sample.type);
    setDescription(sample.description);
  };

  const handleStartParsing = async () => {
    if (!jobTitle.trim() || !description.trim()) return;
    setStep("parsing");
    try {
      const extracted = await aiService.extractRequirements(jobTitle, description);
      setRequirements(extracted);
      setStep("review");
    } catch (e) {
      console.error("Requirement extraction failed", e);
      setStep("input");
    }
  };

  const handleAddRequirement = () => {
    if (!newReqName.trim()) return;
    const newReq: ExtractedRequirement = {
      id: `req-${Date.now()}`,
      name: newReqName.trim(),
      category: "Technical",
      type: newReqType,
      description: "Custom recruiter requirement",
      coverage: "1 question",
      status: "Validated",
    };
    setRequirements([...requirements, newReq]);
    setNewReqName("");
  };

  const handleRemoveRequirement = (id: string) => {
    setRequirements(requirements.filter((r) => r.id !== id));
  };

  const handleToggleRequirementType = (id: string) => {
    setRequirements(
      requirements.map((r) =>
        r.id === id ? { ...r, type: r.type === "Required" ? "Preferred" : "Required" } : r,
      ),
    );
  };

  const handleSaveJob = () => {
    const slug = jobTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const newJobId = `${slug}-${Date.now().toString().slice(-4)}`;

    const convertedRequirements: JobRequirement[] = requirements.map((r) => ({
      id: r.id,
      name: r.name,
      type: r.type,
      coverage: r.coverage || "2 questions",
      status: r.status || "Validated",
    }));

    const newJob: Job = {
      id: newJobId,
      title: jobTitle,
      location,
      workMode,
      experience,
      employmentType,
      description,
      requiredSkills: requirements.filter((r) => r.type === "Required").map((r) => r.name),
      preferredSkills: requirements.filter((r) => r.type === "Preferred").map((r) => r.name),
      requirements: convertedRequirements,
      candidateCount: 0,
      interviewCount: 0,
      activity: "Created just now",
      status: "Active",
    };

    filtRStore.addJob(newJob);

    navigate({
      to: "/jobs/$jobId",
      params: { jobId: newJobId },
    });
  };

  return (
    <main className="px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-3xl animate-workspace-enter space-y-6">
        <div>
          <Button variant="ghost" size="sm" className="-ml-2 mb-2 text-muted-foreground" asChild>
            <Link to="/jobs">
              <ArrowLeft className="mr-1.5 size-3.5" />
              Back to Jobs
            </Link>
          </Button>
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-primary">
            <Briefcase className="size-3.5" />
            Job Creation Workflow
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
            Create New Job Workspace
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Paste your job description to extract evidence criteria and generate an AI interview
            structure.
          </p>
        </div>

        {/* Step 1: Input Details */}
        {step === "input" && (
          <div className="space-y-6">
            {/* Quick Sample Presets */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground">Sample templates:</span>
              {SAMPLE_JDS.map((sample) => (
                <button
                  key={sample.title}
                  type="button"
                  onClick={() => handleApplySample(sample)}
                  className="rounded-full bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors border border-border/60"
                >
                  {sample.title}
                </button>
              ))}
            </div>

            <Panel className="p-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-foreground">Job Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Data Analyst"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="mt-1.5 h-9 w-full rounded-md border border-border bg-background px-3 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground">Department</label>
                  <input
                    type="text"
                    placeholder="e.g. Analytics & Growth"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="mt-1.5 h-9 w-full rounded-md border border-border bg-background px-3 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="text-xs font-semibold text-foreground">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Bengaluru / Remote"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="mt-1.5 h-9 w-full rounded-md border border-border bg-background px-3 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground">Work Mode</label>
                  <select
                    value={workMode}
                    onChange={(e) => setWorkMode(e.target.value)}
                    className="mt-1.5 h-9 w-full rounded-md border border-border bg-background px-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                    <option value="Onsite">Onsite</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground">Experience Target</label>
                  <input
                    type="text"
                    placeholder="e.g. 2–4 years"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="mt-1.5 h-9 w-full rounded-md border border-border bg-background px-3 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">
                  Job Description / Role Requirements *
                </label>
                <textarea
                  rows={6}
                  required
                  placeholder="Paste the full job description or core role responsibilities..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1.5 w-full rounded-md border border-border bg-background p-3 text-xs placeholder:text-muted-foreground leading-relaxed focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </Panel>

            <div className="flex justify-end">
              <Button
                size="lg"
                disabled={!jobTitle.trim() || !description.trim()}
                onClick={handleStartParsing}
                className="gap-2 font-semibold shadow-md"
              >
                <Sparkles className="size-4" />
                Analyze & Extract Requirements
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Parsing Animation */}
        {step === "parsing" && (
          <Panel className="p-12 text-center space-y-4">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary ring-8 ring-primary/5 animate-pulse">
              <Sparkles className="size-7 animate-spin" />
            </div>
            <h2 className="text-lg font-bold text-foreground">Analyzing Job Description...</h2>
            <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
              FiltR AI is extracting core competencies, technical criteria, and behavioral
              requirements for {jobTitle}.
            </p>
          </Panel>
        )}

        {/* Step 3: Review Extracted Requirements */}
        {step === "review" && (
          <div className="space-y-6">
            <Panel className="overflow-hidden">
              <div className="border-b border-border p-5 bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                    AI Criteria Engine
                  </div>
                  <h2 className="mt-1 text-sm font-semibold text-foreground">
                    Extracted Requirements for {jobTitle}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Review, toggle importance, or add custom criteria before saving.
                  </p>
                </div>
                <span className="text-xs font-mono text-muted-foreground">
                  {requirements.length} Criteria Identified
                </span>
              </div>

              <div className="divide-y divide-border">
                {requirements.map((req) => (
                  <div key={req.id} className="p-4 flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-foreground">{req.name}</span>
                        <button
                          type="button"
                          onClick={() => handleToggleRequirementType(req.id)}
                          className={`rounded px-2 py-0.5 text-[10px] font-medium transition-colors border ${
                            req.type === "Required"
                              ? "bg-primary/10 text-primary border-primary/20"
                              : "bg-muted text-muted-foreground border-border"
                          }`}
                        >
                          {req.type}
                        </button>
                      </div>
                      <p className="mt-1 text-[11px] text-muted-foreground">{req.description}</p>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveRequirement(req.id)}
                      className="size-8 text-muted-foreground hover:text-destructive"
                      aria-label="Remove requirement"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Add Custom Requirement */}
              <div className="border-t border-border bg-muted/20 p-4 flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="text"
                  placeholder="Add custom skill or requirement..."
                  value={newReqName}
                  onChange={(e) => setNewReqName(e.target.value)}
                  className="h-8 flex-1 w-full rounded-md border border-border bg-background px-3 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <select
                  value={newReqType}
                  onChange={(e) => setNewReqType(e.target.value as "Required" | "Preferred")}
                  className="h-8 rounded-md border border-border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Required">Required</option>
                  <option value="Preferred">Preferred</option>
                </select>
                <Button
                  size="sm"
                  type="button"
                  variant="outline"
                  onClick={handleAddRequirement}
                  disabled={!newReqName.trim()}
                  className="h-8 text-xs gap-1.5"
                >
                  <Plus className="size-3.5" />
                  Add
                </Button>
              </div>
            </Panel>

            <div className="flex items-center justify-between pt-2">
              <Button variant="ghost" size="sm" onClick={() => setStep("input")}>
                Edit Job Details
              </Button>

              <Button size="lg" onClick={handleSaveJob} className="gap-2 font-semibold shadow-md">
                <Check className="size-4" />
                Save Job Workspace
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
