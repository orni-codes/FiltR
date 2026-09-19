import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, ChevronRight } from "lucide-react";

const steps = [
  {
    number: "1",
    title: "Create the Job",
    description:
      "Add a job description and let FiltR extract the key requirements, skills, experience and responsibilities.",
  },
  {
    number: "2",
    title: "Add Candidates",
    description:
      "Upload candidate resumes directly under the relevant job.",
  },
  {
    number: "3",
    title: "AI Match",
    description:
      "FiltR compares the candidate's evidence against the specific job requirements.",
  },
  {
    number: "4",
    title: "AI Interview",
    description:
      "Generate a personalized interview with adaptive follow-up questions.",
  },
  {
    number: "5",
    title: "Evidence Report",
    description:
      "Review structured candidate insights, interview evidence and requirement coverage.",
  },
];

const mvpFeatures = [
  {
    title: "AI Resume Extraction",
    description:
      "Turn unstructured resumes into structured candidate profiles.",
    featured: true,
  },
  {
    title: "Job-Specific AI Matching",
    description:
      "Compare every candidate against the requirements of the specific job.",
  },
  {
    title: "Adaptive AI Interview",
    description:
      "Generate personalized questions and follow-ups based on the candidate and role.",
  },
  {
    title: "Evidence-Based Reports",
    description:
      "Connect interview answers to job requirements with traceable evidence.",
  },
  {
    title: "Human Review",
    description:
      "Give recruiters structured insights while keeping the final hiring decision with them.",
  },
];

function FiltrLogo({ large = false }: { large?: boolean }) {
  return (
    <div className={`flex items-center ${large ? "gap-3" : "gap-2"}`}>
      <div
        className={`flex items-center justify-center rounded-xl bg-[#07101f] text-white shadow-lg shadow-blue-900/10 ${
          large ? "h-12 w-12 text-2xl" : "h-9 w-9 text-lg"
        }`}
      >
        <span className="font-black italic">F</span>
      </div>

      <div className="leading-none">
        <div
          className={`font-bold tracking-tight text-[#0a0d14] ${
            large ? "text-3xl" : "text-2xl"
          }`}
        >
          Filt<span className="text-[#1857ff]">R</span>
        </div>

        <div
          className={`mt-1 whitespace-nowrap text-[#5e6675] ${
            large ? "text-[9px]" : "text-[7px]"
          }`}
        >
          AI-Powered Recruitment Intelligence
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f4f8ff] text-[#07101f]">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[700px] w-[900px] -translate-x-1/2 rounded-full bg-blue-100/60 blur-[120px]" />
        <div className="absolute right-[-250px] top-[500px] h-[600px] w-[600px] rounded-full bg-blue-200/40 blur-[120px]" />
        <div className="absolute bottom-0 left-[-300px] h-[600px] w-[600px] rounded-full bg-white blur-[100px]" />
      </div>

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-blue-100/70 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex h-[74px] max-w-7xl items-center justify-between px-6 lg:px-10">
          <a href="#home" className="shrink-0">
            <FiltrLogo />
          </a>

          <nav className="hidden items-center gap-2 md:flex">
            <a
              href="#home"
              className="rounded-full border border-[#1857ff] bg-white px-5 py-2 text-sm font-medium text-[#1857ff] shadow-sm"
            >
              Home
            </a>

            <a
              href="#how-it-works"
              className="rounded-full px-4 py-2 text-sm text-[#1857ff] transition hover:bg-blue-50"
            >
              How It Works
            </a>

            <a
              href="#why-filtr"
              className="rounded-full px-4 py-2 text-sm text-[#1857ff] transition hover:bg-blue-50"
            >
              Why FiltR
            </a>

            <a
              href="#mvp"
              className="rounded-full px-4 py-2 text-sm text-[#1857ff] transition hover:bg-blue-50"
            >
              Our MVP
            </a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section
        id="home"
        className="relative flex min-h-[650px] items-center justify-center px-6 py-24"
      >
        <div className="mx-auto w-full max-w-5xl text-center">
          <div className="mb-7 flex justify-center">
            <FiltrLogo large />
          </div>

          <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-[-0.045em] text-[#0a0d14] sm:text-5xl md:text-6xl lg:text-[72px] lg:leading-[0.98]">
            Stop screening resumes.
            <br />
            <span className="italic font-medium">
              Start understanding candidates.
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-3xl text-base leading-7 text-[#657083] md:text-lg">
            FiltR helps recruiters move from resumes to evidence-backed
            candidate insights — combining AI-powered resume analysis, job
            matching, and adaptive interviews in one workflow.
          </p>

          <div className="mt-10 flex flex-col items-center">
            <div className="mb-3 rounded-full border border-[#1857ff] bg-white/70 px-10 py-2 text-sm font-medium text-[#1857ff] shadow-sm">
              I am a .......
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              {/* Recruiter */}
              <Link
                to="/jobs"
                className="group flex h-28 w-48 items-center justify-center rounded-2xl bg-[#5d82f5] px-6 text-xl font-bold text-white shadow-xl shadow-blue-500/15 transition duration-300 hover:-translate-y-1 hover:bg-[#4d73ed]"
              >
                <span>Recruiter</span>
                <ArrowRight className="ml-3 h-5 w-5 opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100" />
              </Link>

              {/* Candidate */}
              <a
                href="/interview/demo"
                className="group flex h-28 w-48 items-center justify-center rounded-2xl border-2 border-[#1857ff] bg-white/40 px-6 text-xl font-bold text-[#1857ff] shadow-lg shadow-blue-500/5 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:bg-white"
              >
                <span>Candidate</span>
                <ArrowRight className="ml-3 h-5 w-5 opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className="border-y border-blue-100/70 bg-white/35 px-6 py-24"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-16">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#1857ff]">
              Workflow
            </p>

            <h2 className="text-4xl font-bold tracking-tight text-[#0a0d14] md:text-6xl">
              How It Works
            </h2>
          </div>

          <div className="relative">
            <div className="absolute left-[25px] top-8 hidden h-[calc(100%-55px)] w-px bg-[#8caeff] md:block" />

            <div className="space-y-8">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="relative flex gap-6 md:gap-8"
                >
                  <div className="relative z-10 flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border-2 border-[#1857ff] bg-[#f4f8ff] text-lg font-semibold text-[#1857ff]">
                    {step.number}
                  </div>

                  <div className="pb-2">
                    <h3 className="text-2xl font-bold text-[#1857ff] md:text-3xl">
                      {step.title}
                    </h3>

                    <p className="mt-1 max-w-4xl text-base leading-7 text-[#657083]">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WHY FILTR */}
      <section id="why-filtr" className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <h2 className="text-4xl font-bold tracking-tight md:text-6xl">
              Why <span className="text-[#1857ff]">FiltR</span>?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-[#657083]">
              FiltR doesn't replace the recruiter.
              <br />
              It gives the recruiter better information to work with.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Traditional Screening */}
            <div className="rounded-[28px] border-2 border-[#1857ff] bg-white/50 p-8 shadow-sm">
              <h3 className="text-xl font-bold text-[#1857ff]">
                Traditional Screening
              </h3>

              <div className="mt-6 space-y-4">
                {[
                  "Resume-first",
                  "Keyword matching",
                  "Static screening",
                  "One-dimensional resume view",
                  "AI makes the shortlist",
                  "Black-box recommendation",
                  "Manual screening notes",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-[#1857ff]"
                  >
                    <Check className="h-4 w-4" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* FiltR */}
            <div className="rounded-[28px] bg-gradient-to-br from-[#1955ff] to-[#7299ff] p-8 text-white shadow-2xl shadow-blue-500/20">
              <h3 className="text-xl font-bold">FiltR</h3>

              <div className="mt-6 space-y-4">
                {[
                  "Job-first",
                  "Requirement-based evidence",
                  "Adaptive interview",
                  "Resume + interview evidence",
                  "AI assists the recruiter",
                  "Explainable evidence",
                  "Structured candidate insights",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <Check className="h-4 w-4" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OUR MVP */}
      <section
        id="mvp"
        className="border-y border-blue-100/70 bg-white/30 px-6 py-24"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 flex items-end justify-between gap-8">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#1857ff]">
                Product
              </p>

              <h2 className="text-4xl font-bold tracking-tight md:text-6xl">
                Our MVP
              </h2>
            </div>

            <div className="hidden max-w-sm text-right text-sm leading-6 text-[#657083] md:block">
              AI-powered recruitment intelligence built around structured
              candidate evidence.
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-6">
            {mvpFeatures.map((feature, index) => (
              <div
                key={feature.title}
                className={`group rounded-[28px] border p-7 transition duration-300 hover:-translate-y-1 ${
                  feature.featured
                    ? "border-transparent bg-gradient-to-br from-[#1955ff] to-[#5c9cf6] text-white shadow-2xl shadow-blue-500/20 md:col-span-2"
                    : "border-blue-100 bg-white/60 text-[#0a0d14] shadow-sm md:col-span-2"
                }`}
              >
                <div
                  className={`mb-6 flex h-10 w-10 items-center justify-center rounded-full ${
                    feature.featured
                      ? "bg-white/15"
                      : "bg-blue-50 text-[#1857ff]"
                  }`}
                >
                  <span className="text-sm font-bold">
                    0{index + 1}
                  </span>
                </div>

                <h3
                  className={`text-xl font-bold ${
                    feature.featured ? "text-white" : "text-[#1857ff]"
                  }`}
                >
                  {feature.title}
                </h3>

                <p
                  className={`mt-3 text-sm leading-6 ${
                    feature.featured ? "text-blue-50" : "text-[#657083]"
                  }`}
                >
                  {feature.description}
                </p>

                <div className="mt-7 flex items-center text-sm font-semibold">
                  Explore
                  <ChevronRight className="ml-1 h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gradient-to-r from-[#1554ff] via-[#347ef5] to-[#54b4ee] px-6 py-14 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
            <div>
              <div className="mb-5 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#07101f] text-xl font-black italic">
                  F
                </div>

                <div>
                  <div className="text-2xl font-bold">
                    Filt<span className="text-blue-100">R</span>
                  </div>

                  <div className="text-[8px] text-blue-50">
                    AI-Powered Recruitment Intelligence
                  </div>
                </div>
              </div>

              <p className="max-w-sm text-sm leading-6 text-blue-50">
                AI-powered recruitment intelligence for evidence-driven
                hiring.
              </p>

              <p className="mt-12 text-xs text-blue-100">
                © 2026 FiltR. Built for better candidate understanding.
              </p>
            </div>

            <div>
              <h4 className="mb-5 font-semibold">Product</h4>

              <div className="space-y-3 text-sm text-blue-50">
                <a href="#home" className="block hover:text-white">
                  Home
                </a>

                <a href="#how-it-works" className="block hover:text-white">
                  How It Works
                </a>

                <a href="#why-filtr" className="block hover:text-white">
                  Why FiltR
                </a>

                <a href="#mvp" className="block hover:text-white">
                  AI Matching
                </a>

                <a href="#mvp" className="block hover:text-white">
                  AI Interviews
                </a>
              </div>
            </div>

            <div>
              <h4 className="mb-5 font-semibold">Company</h4>

              <div className="space-y-3 text-sm text-blue-50">
                <a href="#" className="block hover:text-white">
                  About
                </a>

                <a href="#" className="block hover:text-white">
                  Contact
                </a>

                <a href="#" className="block hover:text-white">
                  Careers
                </a>
              </div>
            </div>

            <div>
              <h4 className="mb-5 font-semibold">Responsible AI</h4>

              <div className="space-y-3 text-sm text-blue-50">
                <a href="#" className="block hover:text-white">
                  AI Transparency
                </a>

                <a href="#" className="block hover:text-white">
                  Responsible Hiring
                </a>

                <a href="#" className="block hover:text-white">
                  Data & Privacy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
