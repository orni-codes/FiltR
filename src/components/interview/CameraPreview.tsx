import { useEffect, useRef, useState } from "react";
import { Camera, CameraOff, Mic, MicOff, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CameraPreviewProps {
  candidateInitials: string;
  candidateName: string;
  isRecording?: boolean;
  recordingSeconds?: number;
  showControls?: boolean;
  className?: string;
  onMediaStreamReady?: (stream: MediaStream) => void;
  onPermissionChange?: (hasVideo: boolean, hasAudio: boolean) => void;
}

export function CameraPreview({
  candidateInitials,
  candidateName,
  isRecording = false,
  recordingSeconds = 0,
  showControls = true,
  className = "",
  onMediaStreamReady,
  onPermissionChange,
}: CameraPreviewProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const onMediaStreamReadyRef = useRef(onMediaStreamReady);
  const onPermissionChangeRef = useRef(onPermissionChange);

  useEffect(() => {
    onMediaStreamReadyRef.current = onMediaStreamReady;
    onPermissionChangeRef.current = onPermissionChange;
  }, [onMediaStreamReady, onPermissionChange]);

  const [hasCamera, setHasCamera] = useState(false);
  const [hasMic, setHasMic] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function initMedia() {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("MediaDevices API not supported in this environment");
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
          audio: true,
        });

        if (!mounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        setHasCamera(true);
        setHasMic(true);
        setPermissionError(null);
        onPermissionChangeRef.current?.(true, true);
        onMediaStreamReadyRef.current?.(stream);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // Setup audio level analyzer
        try {
          const AudioContextClass =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          if (AudioContextClass) {
            const ctx = new AudioContextClass();
            audioContextRef.current = ctx;
            const source = ctx.createMediaStreamSource(stream);
            const analyser = ctx.createAnalyser();
            analyser.fftSize = 64;
            source.connect(analyser);
            analyserRef.current = analyser;

            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            const updateVolume = () => {
              if (!mounted) return;
              analyser.getByteFrequencyData(dataArray);
              let sum = 0;
              for (let i = 0; i < dataArray.length; i++) {
                sum += dataArray[i];
              }
              const avg = sum / dataArray.length;
              setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
              animFrameRef.current = requestAnimationFrame(updateVolume);
            };
            updateVolume();
          }
        } catch (e) {
          console.warn("Web Audio API not initialized", e);
        }
      } catch (err: unknown) {
        if (!mounted) return;
        const errMsg =
          err instanceof Error ? err.message : "Camera and microphone access unavailable";
        setPermissionError(errMsg);
        setHasCamera(false);
        setHasMic(false);
        onPermissionChangeRef.current?.(false, false);
      }
    }

    initMedia();

    return () => {
      mounted = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close().catch(() => {});
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTracks = streamRef.current.getVideoTracks();
      videoTracks.forEach((track) => {
        track.enabled = isVideoMuted;
      });
      setIsVideoMuted(!isVideoMuted);
    } else {
      setIsVideoMuted(!isVideoMuted);
    }
  };

  const toggleAudio = () => {
    if (streamRef.current) {
      const audioTracks = streamRef.current.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = isAudioMuted;
      });
      setIsAudioMuted(!isAudioMuted);
    } else {
      setIsAudioMuted(!isAudioMuted);
    }
  };

  const formatTimer = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-border/80 bg-neutral-950 text-white shadow-2xl ${className}`}
    >
      {/* Video Element */}
      {hasCamera && !isVideoMuted ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="h-full w-full object-cover -scale-x-100"
        />
      ) : (
        /* Fallback / Video Off View */
        <div className="flex h-full min-h-[300px] w-full flex-col items-center justify-center p-8 text-center sm:min-h-[380px]">
          <div className="flex size-24 items-center justify-center rounded-full bg-neutral-800 text-3xl font-semibold text-neutral-100 shadow-inner">
            {candidateInitials}
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-neutral-200">{candidateName}</p>
            <p className="mt-1 text-xs text-neutral-400">
              {permissionError
                ? "Simulated camera stream (Permission required for live video)"
                : isVideoMuted
                  ? "Camera preview paused"
                  : "Connecting camera..."}
            </p>
          </div>
        </div>
      )}

      {/* Top Overlay: Status and Recording Badge */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-4 bg-gradient-to-b from-black/70 via-black/30 to-transparent">
        <div className="flex items-center gap-2">
          {isRecording ? (
            <div className="flex items-center gap-2 rounded-full bg-red-500/20 px-3 py-1 text-xs font-semibold text-red-400 backdrop-blur-md border border-red-500/40 animate-pulse">
              <span className="size-2 rounded-full bg-red-500" />
              REC {formatTimer(recordingSeconds)}
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-full bg-neutral-900/70 px-2.5 py-1 text-[11px] font-medium text-neutral-300 backdrop-blur-md border border-white/10">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              HD 1080p
            </div>
          )}
        </div>

        {/* Audio Meter */}
        <div className="flex items-center gap-2 rounded-full bg-neutral-900/70 px-2.5 py-1 text-[11px] text-neutral-300 backdrop-blur-md border border-white/10">
          <Volume2 className="size-3.5 text-neutral-400" />
          <div className="flex h-2 w-12 items-center gap-0.5 overflow-hidden rounded-full bg-neutral-800">
            <div
              className={`h-full transition-all duration-75 ${
                isAudioMuted
                  ? "w-0 bg-neutral-600"
                  : audioLevel > 60
                    ? "bg-amber-400"
                    : audioLevel > 15
                      ? "bg-emerald-400"
                      : "bg-emerald-500/50"
              }`}
              style={{ width: isAudioMuted ? "0%" : `${Math.max(10, audioLevel)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Overlay: Candidate label & On-preview device toggles */}
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
        <div className="text-xs font-medium text-neutral-300 drop-shadow-sm truncate max-w-[200px] sm:max-w-none">
          {candidateName}
        </div>

        {showControls && (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={isVideoMuted ? "Turn camera on" : "Turn camera off"}
              onClick={toggleVideo}
              className={`size-8 rounded-full border transition-colors ${
                isVideoMuted
                  ? "border-red-500/50 bg-red-500/20 text-red-300 hover:bg-red-500/30"
                  : "border-white/10 bg-neutral-900/70 text-neutral-200 hover:bg-neutral-800"
              }`}
            >
              {isVideoMuted ? <CameraOff className="size-3.5" /> : <Camera className="size-3.5" />}
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={isAudioMuted ? "Unmute microphone" : "Mute microphone"}
              onClick={toggleAudio}
              className={`size-8 rounded-full border transition-colors ${
                isAudioMuted
                  ? "border-red-500/50 bg-red-500/20 text-red-300 hover:bg-red-500/30"
                  : "border-white/10 bg-neutral-900/70 text-neutral-200 hover:bg-neutral-800"
              }`}
            >
              {isAudioMuted ? <MicOff className="size-3.5" /> : <Mic className="size-3.5" />}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
