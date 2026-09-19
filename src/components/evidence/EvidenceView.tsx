import { useState } from "react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/shared/Panel";
import { EvidenceStatus } from "@/components/evidence/EvidenceStatus";
import { EvidenceChain } from "@/components/evidence/EvidenceChain";
import { EvidencePanel } from "@/components/evidence/EvidencePanel";
import type { Interview } from "@/types/filtr";

interface EvidenceViewProps {
  interview: Interview;
  onJumpToTimestamp: (time: string) => void;
  onOpenReport: () => void;
}

export function EvidenceView({ interview, onJumpToTimestamp, onOpenReport }: EvidenceViewProps) {
  const [selectedId, setSelectedId] = useState<string>(interview?.evidenceItems[0]?.id || "");

  if (!interview || interview.evidenceItems.length === 0) {
    return (
      <div className="animate-workspace-enter">
        <Panel className="p-8 text-center">
          <p className="text-sm text-muted-foreground">No evidence collected yet.</p>
        </Panel>
      </div>
    );
  }

  const activeEvidence =
    interview.evidenceItems.find((e) => e.id === selectedId) || interview.evidenceItems[0];

  return (
    <div className="animate-workspace-enter space-y-6">
      {/* Interactive Evidence Chain */}
      <EvidenceChain
        interview={interview}
        selectedEvidenceId={selectedId}
        onSelectEvidence={setSelectedId}
        onJumpToTranscript={onJumpToTimestamp}
        onOpenReport={onOpenReport}
      />

      {/* Contextual Evidence Panel for Active Requirement */}
      {activeEvidence && (
        <EvidencePanel evidence={activeEvidence} onJumpToTranscript={onJumpToTimestamp} />
      )}
    </div>
  );
}
