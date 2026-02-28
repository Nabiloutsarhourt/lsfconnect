"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Video, VideoOff, Mic, MicOff, LogOut, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface JitsiMeetingProps {
    roomName: string;
    userName: string;
    userEmail?: string;
    onClose?: () => void;
    className?: string;
}

declare global {
    interface Window {
        JitsiMeetExternalAPI: any;
    }
}

export function JitsiMeeting({
    roomName,
    userName,
    userEmail,
    onClose,
    className
}: JitsiMeetingProps) {
    const jitsiContainerRef = useRef<HTMLDivElement>(null);
    const [api, setApi] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load Jitsi Script
        const script = document.createElement("script");
        script.src = "https://meet.jit.si/external_api.js";
        script.async = true;
        script.onload = () => {
            if (jitsiContainerRef.current) {
                const options = {
                    roomName: `LSFCONNECT_${roomName}`,
                    width: "100%",
                    height: "100%",
                    parentNode: jitsiContainerRef.current,
                    userInfo: {
                        displayName: userName,
                        email: userEmail
                    },
                    configOverwrite: {
                        startWithAudioMuted: true,
                        disableDeepLinking: true,
                        prejoinPageEnabled: false,
                    },
                    interfaceConfigOverwrite: {
                        TOOLBAR_BUTTONS: [
                            'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
                            'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
                            'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
                            'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
                            'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
                            'security'
                        ],
                    }
                };

                const jitsiApi = new window.JitsiMeetExternalAPI("meet.jit.si", options);
                setApi(jitsiApi);
                setLoading(false);

                jitsiApi.addEventListener("videoConferenceLeft", () => {
                    if (onClose) onClose();
                });
            }
        };
        document.body.appendChild(script);

        return () => {
            if (api) api.dispose();
            document.body.removeChild(script);
        };
    }, [roomName, userName, userEmail]);

    return (
        <div className={cn("relative w-full h-[600px] rounded-[2.5rem] overflow-hidden bg-slate-900 shadow-3xl", className)}>
            {loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white space-y-4">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] italic">Preparation de la classe virtuelle...</p>
                </div>
            )}
            <div ref={jitsiContainerRef} className="w-full h-full" />

            {/* Premium Overlay for LSF focus */}
            <div className="absolute top-6 left-6 pointer-events-none z-10">
                <div className="px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white italic">Session Live LSF</span>
                </div>
            </div>
        </div>
    );
}
