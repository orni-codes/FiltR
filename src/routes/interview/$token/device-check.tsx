import { createFileRoute, getRouteApi, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Camera, Check, Mic, Volume2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/shared/Panel";
import { CameraPreview } from "@/components/interview/CameraPreview";

export const Route = createFileRoute("/interview/$token/device-check")({
  component: DeviceCheckPage,
});

const parentRoute = getRouteApi("/interview/$token");

function DeviceCheckPage() {
  const { token, candidate } = parentRoute.useLoaderData();

  const [hasCameraAccess, setHasCameraAccess] = useState(false);
  const [hasMicAccess, setHasMicAccess] = useState(false);
  const [speakerTested, setSpeakerTested] = useState(false);
  const [testTonePlaying, setTestTonePlaying] = useState(false);
  const [simulatedDeviceMode, setSimulatedDeviceMode] = useState(false);

  const handlePermissionChange = (hasVideo: boolean, hasAudio: boolean) => {
    setHasCameraAccess(hasVideo);
    setHasMicAccess(hasAudio);
  };

  const playTestTone = () => {
    try {
      setTestTonePlaying(true);
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        const ctx = new AudioContextClass();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.8);
        setTimeout(() => {
          setTestTonePlaying(false);
          setSpeakerTested(true);
        }, 800);
      } else {
        setTestTonePlaying(false);
        setSpeakerTested(true);
      }
    } catch {
      setTestTonePlaying(false);
      setSpeakerTested(true);
    }
  };

  const canContinue = (hasCameraAccess && hasMicAccess) || simulatedDeviceMode;

  return (
    <div className="animate-workspace-enter mx-auto max-w-2xl space-y-6">
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2 mb-2 text-muted-foreground hover:text-foreground"
          asChild
        >
          <Link to="/interview/$token" params={{ token }}>
            <ArrowLeft className="mr-1 size-3.5" />
            Back to overview
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
          System & Device Check
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Confirm that your camera, microphone, and audio output are working properly.
        </p>
      </div>

      <div className="space-y-4">
        {/* Live Camera Preview */}
        <CameraPreview
          candidateInitials={candidate.initials}
          candidateName={candidate.name}
          onPermissionChange={handlePermissionChange}
          className="aspect-video w-full"
        />

        {/* Permission / Status Panel */}
        <Panel className="divide-y divide-border">
          {/* Camera Status */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-md bg-muted text-foreground">
                <Camera className="size-4 text-primary" />
              </div>
              <div>
                <div className="text-xs font-semibold text-foreground">Camera Feed</div>
                <p className="text-[11px] text-muted-foreground">
                  {hasCameraAccess
                    ? "Camera is active and streaming"
                    : "Waiting for camera permission"}
                </p>
              </div>
            </div>
            <div>
              {hasCameraAccess ? (
                <span className="flex items-center gap-1 text-xs font-medium text-emerald-500">
                  <Check className="size-4" /> Ready
                </span>
              ) : (
                <span className="text-xs text-muted-foreground">Checking...</span>
              )}
            </div>
          </div>

          {/* Microphone Status */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-md bg-muted text-foreground">
                <Mic className="size-4 text-primary" />
              </div>
              <div>
                <div className="text-xs font-semibold text-foreground">Microphone Input</div>
                <p className="text-[11px] text-muted-foreground">
                  {hasMicAccess
                    ? "Microphone is connected and measuring level"
                    : "Waiting for microphone permission"}
                </p>
              </div>
            </div>
            <div>
              {hasMicAccess ? (
                <span className="flex items-center gap-1 text-xs font-medium text-emerald-500">
                  <Check className="size-4" /> Ready
                </span>
              ) : (
                <span className="text-xs text-muted-foreground">Checking...</span>
              )}
            </div>
          </div>

          {/* Audio Output / Speaker */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-md bg-muted text-foreground">
                <Volume2 className="size-4 text-primary" />
              </div>
              <div>
                <div className="text-xs font-semibold text-foreground">Speakers / Headphones</div>
                <p className="text-[11px] text-muted-foreground">
                  {speakerTested ? "Audio output verified" : "Play a test tone to confirm output"}
                </p>
              </div>
            </div>
            <Button
              variant={speakerTested ? "ghost" : "outline"}
              size="sm"
              onClick={playTestTone}
              disabled={testTonePlaying}
              className="gap-1.5"
            >
              {testTonePlaying ? (
                "Playing tone..."
              ) : speakerTested ? (
                <>
                  <Check className="size-3.5 text-emerald-500" /> Tested
                </>
              ) : (
                "Play sound"
              )}
            </Button>
          </div>
        </Panel>

        {/* Fallback info when permission is denied or in mock environment */}
        {!hasCameraAccess && !hasMicAccess && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-600 dark:text-amber-400 flex items-start justify-between gap-4">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <div>
                <strong>Permissions Notice:</strong> If your browser prompted for camera/mic access,
                please select "Allow". You can also continue with simulated interview mode for
                testing.
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="shrink-0 border-amber-500/40 text-amber-500 hover:bg-amber-500/20"
              onClick={() => setSimulatedDeviceMode(!simulatedDeviceMode)}
            >
              {simulatedDeviceMode ? "Using Simulated Devices" : "Enable Demo Simulation"}
            </Button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-2">
        <p className="text-xs text-muted-foreground">
          {canContinue
            ? "All devices configured. You are ready to start."
            : "Please allow camera & microphone access to begin."}
        </p>

        <Button size="lg" disabled={!canContinue} className="font-semibold shadow-md gap-2" asChild>
          <Link to="/interview/$token/session" params={{ token }}>
            Start Interview Session
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
