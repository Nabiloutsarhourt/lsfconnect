"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Send, User, Search,
    MoreVertical, Phone, Video,
    Check, CheckCheck, Loader2,
    MessageSquare, Hand, Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function MessagingPage() {
    const supabase = createClient();
    const [conversations, setConversations] = useState<any[]>([]);
    const [selectedConv, setSelectedConv] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const fetchConversations = useCallback(async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        setUserId(user.id);

        const { data } = await supabase
            .from("conversations")
            .select(`
                *,
                p1:profiles!participant_1_id(id, full_name, avatar_url, role),
                p2:profiles!participant_2_id(id, full_name, avatar_url, role)
            `)
            .or(`participant_1_id.eq.${user.id},participant_2_id.eq.${user.id}`)
            .order("last_message_at", { ascending: false });

        if (data) {
            setConversations(data.map(c => ({
                ...c,
                otherUser: c.participant_1_id === user.id ? c.p2 : c.p1
            })));
        }
        setLoading(false);
    }, [supabase]);

    const fetchMessages = useCallback(async (convId: string) => {
        const { data } = await supabase
            .from("messages")
            .select("*")
            .eq("conversation_id", convId)
            .order("created_at", { ascending: true });

        if (data) setMessages(data);
    }, [supabase]);

    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    useEffect(() => {
        if (selectedConv) {
            fetchMessages(selectedConv.id);

            // Subscribe to real-time messages
            const channel = supabase
                .channel(`messages:${selectedConv.id}`)
                .on('postgres_changes', {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `conversation_id=eq.${selectedConv.id}`
                }, (payload) => {
                    setMessages(prev => [...prev, payload.new]);
                })
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [selectedConv, fetchMessages, supabase]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConv || !userId) return;

        setSending(true);
        const { error } = await supabase.from("messages").insert({
            conversation_id: selectedConv.id,
            sender_id: userId,
            content: newMessage
        });

        if (!error) {
            setNewMessage("");
        }
        setSending(false);
    };

    if (loading) return (
        <div className="flex items-center justify-center h-[70vh]">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
    );

    return (
        <div className="h-[calc(100vh-140px)] -m-6 md:-m-12 overflow-hidden flex bg-white border border-slate-100 rounded-[3rem] shadow-2xl relative">
            {/* Conversations List */}
            <aside className={cn(
                "w-full md:w-[400px] border-r border-slate-50 flex flex-col bg-slate-50/30",
                selectedConv ? "hidden md:flex" : "flex"
            )}>
                <div className="p-8 border-b border-slate-50 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-black text-slate-900 italic uppercase">Messages</h2>
                        <Button variant="ghost" size="icon" className="rounded-xl text-slate-400">
                            <Sparkles className="h-5 w-5 text-primary" />
                        </Button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Rechercher..."
                            className="h-12 rounded-xl border-none bg-white shadow-inner pl-11 font-medium italic"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {conversations.map((conv) => (
                        <button
                            key={conv.id}
                            onClick={() => setSelectedConv(conv)}
                            className={cn(
                                "w-full p-4 rounded-2xl flex items-center gap-4 transition-all duration-300 group",
                                selectedConv?.id === conv.id
                                    ? "bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]"
                                    : "hover:bg-white hover:shadow-lg text-slate-600"
                            )}
                        >
                            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-black overflow-hidden border border-white shadow-inner">
                                {conv.otherUser?.avatar_url ? (
                                    <img src={conv.otherUser.avatar_url} className="w-full h-full object-cover" />
                                ) : (
                                    conv.otherUser?.full_name?.charAt(0) || "U"
                                )}
                            </div>
                            <div className="flex-1 text-left">
                                <p className="font-black text-sm truncate leading-none mb-1">{conv.otherUser?.full_name}</p>
                                <p className={cn(
                                    "text-[10px] font-bold uppercase tracking-widest opacity-60",
                                    selectedConv?.id === conv.id ? "text-white" : "text-slate-400"
                                )}>{conv.otherUser?.role}</p>
                            </div>
                            <span className="text-[9px] font-black opacity-40">{new Date(conv.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </button>
                    ))}
                </div>
            </aside>

            {/* Chat Area */}
            {selectedConv ? (
                <main className="flex-1 flex flex-col min-w-0 bg-white">
                    {/* Chat Header */}
                    <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden"
                                onClick={() => setSelectedConv(null)}
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </Button>
                            <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden border border-slate-50 shadow-inner">
                                {selectedConv.otherUser?.avatar_url ? (
                                    <img src={selectedConv.otherUser.avatar_url} className="w-full h-full object-cover" />
                                ) : (
                                    <User className="h-5 w-5 text-slate-300 m-auto mt-2.5" />
                                )}
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-slate-900 leading-none mb-1">{selectedConv.otherUser.full_name}</h3>
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">En ligne</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="rounded-xl text-slate-400 hover:text-primary hover:bg-primary/5">
                                <Phone className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="rounded-xl text-slate-400 hover:text-primary hover:bg-primary/5">
                                <Video className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="rounded-xl text-slate-400 hover:bg-slate-50">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Messages List */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/30">
                        {messages.map((msg, i) => {
                            const isMe = msg.sender_id === userId;
                            return (
                                <div key={msg.id} className={cn(
                                    "flex flex-col max-w-[70%] animate-in fade-in slide-in-from-bottom-2 duration-500",
                                    isMe ? "ml-auto items-end" : "mr-auto items-start"
                                )}>
                                    <div className={cn(
                                        "p-4 px-6 rounded-[2rem] text-sm font-medium italic shadow-xl shadow-slate-200/20",
                                        isMe
                                            ? "bg-primary text-white rounded-tr-none"
                                            : "bg-white text-slate-700 border border-slate-50 rounded-tl-none"
                                    )}>
                                        {msg.content}
                                    </div>
                                    <div className="flex items-center gap-2 mt-2 px-2">
                                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">
                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        {isMe && (msg.is_read ? <CheckCheck className="h-3 w-3 text-primary" /> : <Check className="h-3 w-3 text-slate-300" />)}
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Chat Input */}
                    <div className="p-8 border-t border-slate-50 bg-white">
                        <form onSubmit={handleSendMessage} className="flex gap-4">
                            <div className="flex-1 relative group">
                                <Input
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Écrivez votre message..."
                                    className="h-16 rounded-[2rem] border-slate-100 bg-slate-50/50 px-8 font-medium italic focus:bg-white transition-all shadow-inner"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                    <Button type="button" variant="ghost" size="icon" className="text-slate-300 hover:text-primary rounded-xl">
                                        <Hand className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>
                            <Button
                                type="submit"
                                disabled={sending || !newMessage.trim()}
                                className="h-16 w-16 rounded-[2rem] bg-slate-900 shadow-2xl shadow-slate-900/20 hover:-translate-y-1 transition-all flex items-center justify-center p-0"
                            >
                                {sending ? <Loader2 className="h-5 w-5 animate-spin text-white" /> : <Send className="h-6 w-6 text-white" />}
                            </Button>
                        </form>
                    </div>
                </main>
            ) : (
                <div className="flex-1 hidden md:flex flex-col items-center justify-center text-center p-20 space-y-6 bg-slate-50/10">
                    <div className="w-24 h-24 bg-white rounded-[3rem] shadow-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <MessageSquare className="h-10 w-10" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-black text-slate-900 italic uppercase">Vos Conversations</h2>
                        <p className="text-slate-400 font-medium italic max-w-xs">Sélectionnez une discussion pour commencer à échanger en temps réel.</p>
                    </div>
                </div>
            )}
        </div>
    );
}

function ChevronLeft({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("lucide lucide-chevron-left", className)}>
            <path d="m15 18-6-6 6-6" />
        </svg>
    );
}
