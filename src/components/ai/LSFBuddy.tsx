"use client";

import { useState, useRef, useEffect } from "react";
import {
    MessageCircle, X, Send,
    Sparkles, Loader2, Bot,
    User, ChevronDown, Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export function LSFBuddy() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: "Bonjour ! Je suis LSF Buddy, votre assistant théorique. Comment puis-je vous aider dans votre apprentissage de la LSF aujourd'hui ?" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [...messages, userMessage] }),
            });

            if (!response.ok) throw new Error("Erreur de communication");

            const data = await response.json();
            setMessages(prev => [...prev, data]);
        } catch (error) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "Désolé, j'ai rencontré un petit souci technique. Pouvez-vous répéter votre question ?"
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <Card className="w-[380px] h-[550px] mb-6 rounded-[2.5rem] border-none shadow-4xl bg-white/95 backdrop-blur-xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-500">
                    <CardHeader className="bg-slate-900 p-8 flex flex-row items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
                                <Bot className="h-6 w-6" />
                            </div>
                            <div>
                                <CardTitle className="text-sm font-black text-white italic uppercase tracking-widest leading-none">LSF <span className="text-primary not-italic">Buddy</span></CardTitle>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">En ligne</span>
                                </div>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-xl text-slate-400 hover:text-white hover:bg-white/10">
                            <ChevronDown className="h-5 w-5" />
                        </Button>
                    </CardHeader>

                    <CardContent
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/30 custom-scrollbar"
                    >
                        {messages.map((m, i) => (
                            <div key={i} className={cn(
                                "flex gap-3 animate-in fade-in duration-300",
                                m.role === 'user' ? "flex-row-reverse" : "flex-row"
                            )}>
                                <div className={cn(
                                    "w-8 h-8 rounded-xl flex items-center justify-center shrink-0",
                                    m.role === 'user' ? "bg-slate-100 text-slate-600" : "bg-primary/20 text-primary"
                                )}>
                                    {m.role === 'user' ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                                </div>
                                <div className={cn(
                                    "max-w-[80%] p-4 rounded-2xl text-xs font-medium leading-relaxed italic shadow-sm",
                                    m.role === 'user'
                                        ? "bg-slate-900 text-white rounded-tr-none"
                                        : "bg-white text-slate-700 rounded-tl-none border border-slate-100"
                                )}>
                                    {m.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex gap-3 animate-pulse">
                                <div className="w-8 h-8 bg-primary/10 rounded-xl" />
                                <div className="h-10 w-20 bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-center">
                                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                </div>
                            </div>
                        )}
                    </CardContent>

                    <CardFooter className="p-6 bg-white border-t border-slate-50">
                        <div className="flex w-full items-center gap-3">
                            <input
                                type="text"
                                placeholder="Posez une question théorique..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                className="flex-1 bg-slate-50 border-none rounded-2xl px-6 h-14 text-xs font-medium italic focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                            />
                            <Button
                                onClick={handleSend}
                                disabled={isLoading || !input.trim()}
                                className="h-14 w-14 rounded-2xl bg-slate-900 hover:bg-primary transition-all shadow-xl shadow-slate-200"
                            >
                                <Send className="h-5 w-5 text-white" />
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            )}

            {/* Floating Toggle Button */}
            {!isOpen && (
                <Button
                    onClick={() => setIsOpen(true)}
                    className="w-20 h-20 rounded-[2rem] bg-slate-900 border-none shadow-4xl hover:-translate-y-2 transition-all group overflow-hidden"
                >
                    <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10 flex flex-col items-center">
                        <Bot className="h-8 w-8 text-white group-hover:scale-110 transition-transform" />
                        <span className="text-[6px] font-black uppercase tracking-[0.2em] mt-2 text-primary group-hover:text-white">LSF Buddy</span>
                    </div>
                    {/* Badge */}
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full border-2 border-white flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                    </div>
                </Button>
            )}
        </div>
    );
}
