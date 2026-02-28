"use client";

import { cn } from "@/lib/utils";
import { Play, Pause, Volume2, VolumeX, Maximize, Languages, Sparkles } from "lucide-react";
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
    const [isLooping, setIsLooping] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [progress, setProgress] = useState(0);

    const togglePlay = () => {
        if (videoRef.current) {
            isPlaying ? videoRef.current.pause() : videoRef.current.play();
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const toggleLoop = () => {
        if (videoRef.current) {
            videoRef.current.loop = !isLooping;
            setIsLooping(!isLooping);
        }
    };

    const toggleSpeed = () => {
        if (videoRef.current) {
            const nextRate = playbackRate === 1 ? 0.5 : 1;
            videoRef.current.playbackRate = nextRate;
            setPlaybackRate(nextRate);
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
        <div className={cn("relative group overflow-hidden rounded-2xl bg-slate-900 shadow-2xl transition-all duration-700", className)}>
            <video
                ref={videoRef}
                src={src}
                poster={poster}
                className="w-full h-full aspect-video cursor-pointer"
                onTimeUpdate={handleTimeUpdate}
                onClick={togglePlay}
                aria-label={title || "Vidéo LSF"}
            />

            {/* Custom Controls Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent p-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-white/20 rounded-full mb-6 cursor-pointer group/progress overflow-hidden">
                    <div
                        className="h-full bg-primary rounded-full relative transition-all"
                        style={{ width: `${progress}%` }}
                    >
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg scale-0 group-hover/progress:scale-100 transition-transform" />
                    </div>
                </div>

                <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-6">
                        <button onClick={togglePlay} className="hover:scale-110 transition-transform p-2 bg-white/10 rounded-xl backdrop-blur-md" aria-label={isPlaying ? "Pause" : "Lire"}>
                            {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current" />}
                        </button>

                        <div className="flex items-center gap-4">
                            <button onClick={toggleMute} className="hover:text-primary transition-colors" aria-label={isMuted ? "Réactiver le son" : "Couper le son"}>
                                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                            </button>

                            <button
                                onClick={toggleSpeed}
                                className={cn("text-[10px] font-black px-2 py-1 rounded-md border border-white/20 hover:border-primary hover:text-primary transition-all uppercase tracking-tighter", playbackRate === 0.5 && "bg-primary text-white border-primary")}
                                title="Ralentir (x0.5)"
                            >
                                x0.5
                            </button>

                            <button
                                onClick={toggleLoop}
                                className={cn("p-1.5 rounded-md border border-white/20 hover:border-primary hover:text-primary transition-all", isLooping && "bg-primary text-white border-primary")}
                                title="Boucler la vidéo"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m17 2 4 4-4 4" /><path d="M3 11v-1a4 4 0 0 1 4-4h14" /><path d="m7 22-4-4 4-4" /><path d="M21 13v1a4 4 0 0 1-4 4H3" /></svg>
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {hasLSFInterpretation && (
                            <div
                                className="flex items-center gap-2 bg-primary/20 text-primary px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-primary/20"
                                title="Cette vidéo inclut une interprétation LSF"
                            >
                                <Sparkles className="h-3 w-3 fill-current" />
                                <span>LSF Ready</span>
                            </div>
                        )}
                        <button onClick={toggleFullscreen} className="hover:text-primary transition-colors" aria-label="Plein écran">
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
