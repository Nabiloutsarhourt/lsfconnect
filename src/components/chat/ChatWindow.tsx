"use client";

import { useRef, useEffect, useState } from "react";
import { useChat } from "@/hooks/useChat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Hand, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatWindowProps {
    recipientId: string;
    recipientName: string;
    onClose?: () => void;
    className?: string;
}

export function ChatWindow({ recipientId, recipientName, onClose, className }: ChatWindowProps) {
    const { messages, loading, sendMessage, currentUser } = useChat(recipientId);
    const [newMessage, setNewMessage] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        const ok = await sendMessage(newMessage);
        if (ok) setNewMessage("");
    };

    return (
        <div className={cn("flex flex-col h-[500px] w-full max-w-sm bg-background border rounded-2xl shadow-2xl overflow-hidden", className)}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-primary text-primary-foreground border-b shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold border border-white/10">
                        {recipientName.charAt(0)}
                    </div>
                    <div>
                        <h3 className="font-bold text-sm leading-tight tracking-tight">{recipientName}</h3>
                        <div className="flex items-center gap-1 opacity-80">
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                            <p className="text-[10px] uppercase tracking-widest font-bold">En ligne</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/10 rounded-full transition-colors">
                        <Hand className="h-4 w-4" />
                    </Button>
                    {onClose && (
                        <Button onClick={onClose} variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/10 rounded-full transition-colors">
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 scroll-smooth">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground animate-in fade-in duration-500">
                        <Loader2 className="h-6 w-6 animate-spin text-primary/40" />
                        <p className="text-[10px] font-extrabold uppercase tracking-widest opacity-50">Connexion sécurisée...</p>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-30 animate-in zoom-in-95 duration-700">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                            <Hand className="h-8 w-8 text-slate-400" />
                        </div>
                        <p className="text-xs font-bold uppercase tracking-tight max-w-[150px]">Démarrez la conversation avec cet expert LSF</p>
                    </div>
                ) : (
                    messages.map((msg, idx) => {
                        const isMe = msg.sender_id === currentUser?.id;
                        return (
                            <div
                                key={msg.id}
                                className={cn(
                                    "flex flex-col max-w-[85%] space-y-1 animate-in slide-in-from-bottom-2 duration-300",
                                    isMe ? "ml-auto items-end" : "mr-auto items-start"
                                )}
                            >
                                <div
                                    className={cn(
                                        "p-3.5 rounded-2xl text-sm font-medium shadow-sm transition-all",
                                        isMe
                                            ? "bg-primary text-primary-foreground rounded-tr-none shadow-primary/10"
                                            : "bg-white text-slate-800 rounded-tl-none border border-slate-200"
                                    )}
                                >
                                    {msg.content}
                                </div>
                                <span className="text-[9px] text-muted-foreground font-bold px-1 opacity-70">
                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-slate-100">
                <form onSubmit={handleSend} className="flex items-center gap-2">
                    <div className="relative flex-1">
                        <Input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Écrivez en LSF..."
                            className="h-11 rounded-xl border-slate-200 focus-visible:ring-primary/20 text-sm pl-4 pr-10 transition-all font-medium"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <Hand className="h-4 w-4 text-slate-300 pointer-events-none" />
                        </div>
                    </div>
                    <Button
                        type="submit"
                        size="icon"
                        disabled={!newMessage.trim()}
                        className="h-11 w-11 rounded-xl shadow-xl shadow-primary/20 shrink-0 active:scale-95 transition-all"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
                <p className="text-[8px] text-center text-muted-foreground mt-2 font-bold uppercase tracking-widest opacity-40">
                    Chiffrement de bout en bout
                </p>
            </div>
        </div>
    );
}
