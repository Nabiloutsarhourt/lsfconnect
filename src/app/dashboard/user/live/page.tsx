"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Video, Calendar, Clock,
    ArrowRight, Users, Sparkles,
    ChevronLeft, Play
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { JitsiMeeting } from "@/components/live/JitsiMeeting";

export default function LiveSessionsPage() {
    const supabase = createClient();
    const [sessions, setSessions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeSession, setActiveSession] = useState<any>(null);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        async function fetchData() {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (authUser) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', authUser.id)
                    .single();
                setUser(profile);
            }

            const { data } = await supabase
                .from('live_sessions')
                .select('*, courses(title)')
                .order('scheduled_at', { ascending: true });

            if (data) setSessions(data);
            setLoading(false);
        }
        fetchData();
    }, [supabase]);

    if (activeSession) {
        return (
            <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex items-center justify-between">
                    <Button
                        variant="ghost"
                        onClick={() => setActiveSession(null)}
                        className="rounded-xl hover:bg-white border border-transparent hover:border-slate-100 gap-2 font-bold uppercase tracking-widest text-[10px] text-slate-400"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Quitter la Classe
                    </Button>
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{activeSession.title} — EN DIRECT</span>
                    </div>
                </div>

                <JitsiMeeting
                    roomName={activeSession.meeting_id}
                    userName={user?.full_name || "Étudiant LSF"}
                    userEmail={user?.email}
                    onClose={() => setActiveSession(null)}
                    className="h-[750px]"
                />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.3em] text-[10px]">
                    <Video className="h-4 w-4" />
                    Interaction Temps Réel
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-slate-900 italic uppercase leading-none tracking-tighter">
                    Classes <span className="text-primary not-italic">Virtuelles</span>
                </h1>
                <p className="text-slate-500 font-medium italic max-w-2xl">
                    Participez à des sessions de pratique LSF en direct avec nos experts certifiés. Perfectionnez votre technique et posez vos questions face à face.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                    Array(3).fill(0).map((_, i) => (
                        <div key={i} className="h-80 rounded-[2.5rem] bg-slate-100 animate-pulse" />
                    ))
                ) : sessions.length === 0 ? (
                    <div className="col-span-full py-20 text-center space-y-6">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-300">
                            <Calendar className="h-10 w-10" />
                        </div>
                        <p className="text-sm font-black uppercase tracking-widest text-slate-400">Aucune session programmée</p>
                    </div>
                ) : (
                    sessions.map((session) => (
                        <Card key={session.id} className="rounded-[2.5rem] border-none shadow-2xl bg-white overflow-hidden hover:-translate-y-2 transition-all duration-500 group">
                            <CardHeader className="p-10 pb-4">
                                <div className="flex items-center justify-between mb-6">
                                    <div className={cn(
                                        "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest italic flex items-center gap-2",
                                        session.status === 'live' ? "bg-red-500 text-white animate-pulse" : "bg-primary/10 text-primary"
                                    )}>
                                        {session.status === 'live' && <Play className="h-3 w-3 fill-current" />}
                                        {session.status === 'live' ? "EN DIRECT" : "PROGRAMMÉ"}
                                    </div>
                                    <div className="p-2 bg-slate-50 rounded-xl text-slate-400">
                                        <Users className="h-4 w-4" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-black text-slate-900 italic uppercase leading-tight mb-2">
                                    {session.title}
                                </h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    {session.courses?.title || "Session Générale"}
                                </p>
                            </CardHeader>
                            <CardContent className="p-10 pt-4 space-y-6 text-slate-500 italic font-medium text-sm">
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-4 w-4 text-primary" />
                                        <span>{new Date(session.scheduled_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Clock className="h-4 w-4 text-primary" />
                                        <span>{new Date(session.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({session.duration_minutes} min)</span>
                                    </div>
                                </div>

                                <Button
                                    onClick={() => setActiveSession(session)}
                                    disabled={session.status === 'ended'}
                                    className={cn(
                                        "w-full h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] gap-3 transition-all",
                                        session.status === 'live' ? "bg-red-500 hover:bg-red-600 shadow-xl shadow-red-200" : "bg-slate-900 shadow-xl"
                                    )}
                                >
                                    {session.status === 'live' ? "Rejoindre la Classe" : "Définir un Rappel"}
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Pro Tip Section */}
            <section className="p-12 md:p-16 rounded-[4rem] bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-[100px] -mr-20 -mt-20" />
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                    <div className="w-20 h-20 bg-white/10 rounded-[2rem] flex items-center justify-center shrink-0">
                        <Sparkles className="h-10 w-10 text-primary" />
                    </div>
                    <div className="space-y-4 text-center md:text-left">
                        <h4 className="text-2xl font-black italic uppercase tracking-tight">Conseil d'Expert : Maximisez votre Live</h4>
                        <p className="text-slate-400 font-medium italic text-lg leading-relaxed">
                            Assurez-vous d'avoir un éclairage de face suffisant pour que vos signes soient clairement visibles par l'instructeur. Le "Live" est le meilleur moment pour corriger vos configurations manuelles en temps réel.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
