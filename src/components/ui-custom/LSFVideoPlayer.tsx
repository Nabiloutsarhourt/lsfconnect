"use client";

import { cn } from "@/lib/utils";
import { Play, Pause, Volume2, VolumeX, Maximize, Languages } from "lucide-react";
import { useRef, useState } from "react";

interface LSFVideoPlayerProps {
    src: string;
    poster?: string;
    className?: string;
    title?: string;
    hasLSFInterpretation?: boolean;
}

export function LSFVideoPlayer({
    src,
    poster,
    className,
    title,
    hasLSFInterpretation = false,
}: LSFVideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [progress, setProgress] = useState(0);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
            setProgress(currentProgress);
        }
    };

    const toggleFullscreen = () => {
        if (videoRef.current) {
            if (videoRef.current.requestFullscreen) {
                videoRef.current.requestFullscreen();
            }
        }
    };

    return (
        <div className={cn("relative group overflow-hidden rounded-lg bg-black", className)}>
            <video
                ref={videoRef}
                src={src}
                poster={poster}
                className="w-full h-full aspect-video"
                onTimeUpdate={handleTimeUpdate}
                onClick={togglePlay}
                aria-label={title || "Vidéo LSF"}
            />

            {/* Custom Controls Overlay (Visible on hover or mobile touch) */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                {/* Progress Bar */}
                <div className="w-full h-1 bg-white/30 rounded-full mb-4 cursor-pointer">
                    <div
                        className="h-full bg-primary rounded-full relative"
                        style={{ width: `${progress}%` }}
                    >
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md" />
                    </div>
                </div>

                <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-4">
                        <button onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Lire"}>
                            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                        </button>
                        <button onClick={toggleMute} aria-label={isMuted ? "Réactiver le son" : "Couper le son"}>
                            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                        </button>
                    </div>

                    <div className="flex items-center gap-4">
                        {hasLSFInterpretation && (
                            <div
                                className="flex items-center gap-1 bg-primary/20 text-primary-foreground px-2 py-1 rounded text-xs font-bold"
                                title="Cette vidéo inclut une interprétation LSF"
                            >
                                <Languages className="h-3 w-3" />
                                <span>LSF</span>
                            </div>
                        )}
                        <button onClick={toggleFullscreen} aria-label="Plein écran">
                            <Maximize className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Screen reader only status */}
            <div className="sr-only" aria-live="polite">
                {isPlaying ? "Vidéo en cours de lecture" : "Vidéo en pause"}
            </div>
        </div>
    );
}
