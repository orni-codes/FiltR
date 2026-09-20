import { useEffect, useMemo, useState } from "react";
import { Link, useMatches } from "@tanstack/react-router";
import {
  ChevronRight,
  Command,
  Menu,
  Search,
  Sparkles,
  X,
  BriefcaseBusiness,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getCandidate,
  getCandidatesForJob,
  getJob,
  getJobs,
} from "@/data/mock";

interface TopbarProps {
  onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const matches = useMatches();

  const params = matches.reduce<Record<string, string>>(
    (acc, m) => {
      if (m.params && typeof m.params === "object") {
        Object.assign(acc, m.params);
      }
      return acc;
    },
    {},
  );

  const jobId = params["jobId"] as string | undefined;
  const candidateId = params["candidateId"] as string | undefined;

  const job = jobId ? getJob(jobId) : undefined;
  const candidate = candidateId ? getCandidate(candidateId) : undefined;

  /*
   * Get all jobs from the centralized store.
   */
  const jobs = getJobs();

  /*
   * Build a searchable list of all candidates across all jobs.
   */
  const allCandidates = useMemo(() => {
    const candidates: Array<{
      candidate: ReturnType<typeof getCandidate>;
      jobId: string;
      jobTitle: string;
    }> = [];

    jobs.forEach((currentJob) => {
      const jobCandidates = getCandidatesForJob(currentJob.id);

      jobCandidates.forEach((currentCandidate) => {
        candidates.push({
          candidate: currentCandidate,
          jobId: currentJob.id,
          jobTitle: currentJob.title,
        });
      });
    });

    return candidates;
  }, [jobs]);

  /*
   * Search jobs and candidates as the user types.
   */
  const searchResults = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return {
        jobs: [],
        candidates: [],
      };
    }

    const matchingJobs = jobs
      .filter((currentJob) => {
        return (
          currentJob.title?.toLowerCase().includes(normalizedQuery) ||
          currentJob.id?.toLowerCase().includes(normalizedQuery)
        );
      })
      .slice(0, 6);

    const matchingCandidates = allCandidates
      .filter(({ candidate: currentCandidate, jobTitle }) => {
        return (
          currentCandidate?.name
            ?.toLowerCase()
            .includes(normalizedQuery) ||
          currentCandidate?.id
            ?.toLowerCase()
            .includes(normalizedQuery) ||
          jobTitle.toLowerCase().includes(normalizedQuery)
        );
      })
      .slice(0, 8);

    return {
      jobs: matchingJobs,
      candidates: matchingCandidates,
    };
  }, [query, jobs, allCandidates]);

  const hasResults =
    searchResults.jobs.length > 0 ||
    searchResults.candidates.length > 0;

  /*
   * Ctrl+K / Cmd+K opens search.
   * Escape closes it.
   */
  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();
        setSearchOpen(true);
      }

      if (event.key === "Escape") {
        setSearchOpen(false);
      }
    };

    window.addEventListener("keydown", handleShortcut);

    return () => {
      window.removeEventListener("keydown", handleShortcut);
    };
  }, []);

  /*
   * Clear search whenever the dialog closes.
   */
  useEffect(() => {
    if (!searchOpen) {
      setQuery("");
    }
  }, [searchOpen]);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/80 bg-background/80 px-4 backdrop-blur-xl lg:px-8">
        {/* Mobile menu */}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-xl lg:hidden"
          onClick={onMenuClick}
          aria-label="Open navigation"
        >
          <Menu />
        </Button>

        {/* Breadcrumb */}
        <nav
          className="flex min-w-0 items-center gap-1 text-xs"
          aria-label="Breadcrumb"
        >
          <Link
            to="/jobs"
            className="rounded-lg px-2 py-1.5 font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Jobs
          </Link>

          {job && (
            <>
              <ChevronRight className="size-3 text-muted-foreground/60" />

              <Link
                to="/jobs/$jobId"
                params={{ jobId: job.id }}
                className="max-w-40 truncate rounded-lg px-2 py-1.5 font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {job.title}
              </Link>
            </>
          )}

          {candidate && (
            <>
              <ChevronRight className="size-3 text-muted-foreground/60" />

              <span className="max-w-36 truncate px-2 py-1.5 font-medium text-foreground">
                {candidate.name}
              </span>
            </>
          )}
        </nav>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-2">
          {/* Desktop Search */}
          <Button
            variant="outline"
            onClick={() => setSearchOpen(true)}
            className="hidden h-9 w-64 justify-start gap-2 rounded-xl border-border bg-card/80 px-3 text-xs font-normal text-muted-foreground shadow-sm hover:bg-muted sm:flex"
          >
            <Search className="size-3.5" />

            <span>Search workspace</span>

            <kbd className="ml-auto flex items-center gap-0.5 rounded-md border border-border bg-muted px-1.5 py-0.5 text-[9px]">
              <Command className="size-2.5" />
              K
            </kbd>
          </Button>

          {/* Mobile Search */}
          <Button
            variant="outline"
            size="icon"
            className="rounded-xl bg-card sm:hidden"
            onClick={() => setSearchOpen(true)}
            aria-label="Search workspace"
          >
            <Search className="size-4" />
          </Button>

          {/* AI Status */}
          <Button
            variant="outline"
            size="icon"
            className="rounded-xl bg-card"
            aria-label="AI status"
          >
            <Sparkles className="size-4 text-primary" />
          </Button>
        </div>
      </header>

      {/* Search Modal */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 p-4 pt-[15vh] backdrop-blur-sm"
          onMouseDown={() => setSearchOpen(false)}
        >
          <div
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-background shadow-2xl"
            onMouseDown={(event) => event.stopPropagation()}
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 border-b border-border px-4">
              <Search className="size-5 shrink-0 text-muted-foreground" />

              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search jobs, candidates..."
                className="h-14 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />

              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg"
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
              >
                <X className="size-4" />
              </Button>
            </div>

            {/* Results */}
            <div className="max-h-[420px] overflow-y-auto p-2">
              {!query.trim() ? (
                <div className="px-3 py-12 text-center">
                  <Search className="mx-auto mb-3 size-7 text-muted-foreground/40" />

                  <p className="text-sm font-medium">
                    Search your workspace
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Find jobs and candidates instantly
                  </p>
                </div>
              ) : !hasResults ? (
                <div className="px-3 py-12 text-center">
                  <Search className="mx-auto mb-3 size-7 text-muted-foreground/40" />

                  <p className="text-sm font-medium">No results found</p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Nothing matches "{query}"
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Jobs */}
                  {searchResults.jobs.length > 0 && (
                    <div>
                      <div className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        Jobs
                      </div>

                      <div className="space-y-1">
                        {searchResults.jobs.map((resultJob) => (
                          <Link
                            key={resultJob.id}
                            to="/jobs/$jobId"
                            params={{ jobId: resultJob.id }}
                            onClick={() => setSearchOpen(false)}
                            className="group flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-muted"
                          >
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                              <BriefcaseBusiness className="size-4" />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="truncate text-sm font-medium">
                                {resultJob.title}
                              </div>

                              <div className="truncate text-[11px] text-muted-foreground">
                                Job · {resultJob.id}
                              </div>
                            </div>

                            <ChevronRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Candidates */}
                  {searchResults.candidates.length > 0 && (
                    <div>
                      <div className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        Candidates
                      </div>

                      <div className="space-y-1">
                        {searchResults.candidates.map(
                          ({ candidate: resultCandidate, jobId, jobTitle }) => {
                            if (!resultCandidate) return null;

                            return (
                              <Link
                                key={`${jobId}-${resultCandidate.id}`}
                                to="/jobs/$jobId/candidates/$candidateId"
                                params={{
                                  jobId,
                                  candidateId: resultCandidate.id,
                                }}
                                onClick={() => setSearchOpen(false)}
                                className="group flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-muted"
                              >
                                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                  <UserRound className="size-4" />
                                </div>

                                <div className="min-w-0 flex-1">
                                  <div className="truncate text-sm font-medium">
                                    {resultCandidate.name}
                                  </div>

                                  <div className="truncate text-[11px] text-muted-foreground">
                                    Candidate · {jobTitle}
                                  </div>
                                </div>

                                <ChevronRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                              </Link>
                            );
                          },
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-border bg-muted/30 px-4 py-2.5">
              <span className="text-[10px] text-muted-foreground">
                {hasResults
                  ? `${searchResults.jobs.length + searchResults.candidates.length} result${
                      searchResults.jobs.length +
                        searchResults.candidates.length !==
                      1
                        ? "s"
                        : ""
                    }`
                  : "Search workspace"}
              </span>

              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <kbd className="rounded border border-border bg-background px-1.5 py-0.5">
                  ESC
                </kbd>
                <span>to close</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}