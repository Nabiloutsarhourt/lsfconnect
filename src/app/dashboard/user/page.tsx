"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
    Sparkles, Video, Trophy,
    ArrowRight, Play, Star,
    Flame, ChevronRight, BarChart3, Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { ClassroomLeaderboard } from "@/components/social/ClassroomLeaderboard";
import { BadgeShowcase } from "@/components/social/BadgeShowcase";
import { ReferralCard } from "@/components/social/ReferralCard";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function UserOverviewPage() {
    const supabase = createClient();
    const [user, setUser] = useState<any>(null);
    const [stats, setStats] = useState({
        coursesCompleted: 0,
        certificatesEarned: 0,
        liveSessionsJoined: 2, // Mock for demo
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUserData() {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (authUser) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', authUser.id)
                    .single();
                setUser(profile);

                // Fetch completed progress
                const { count: completedCount } = await supabase
                    .from('user_progress')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', authUser.id)
                    .eq('is_completed', true);

                setStats(prev => ({ ...prev, coursesCompleted: completedCount || 0 }));
            }
            setLoading(false);
        }
        fetchUserData();
    }, [supabase]);

    if (loading) return (
        <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-500">
            {/* Hero Skeleton */}
            <Skeleton className="h-[400px] w-full rounded-[4rem]" />

            {/* Stats & Cards Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <Skeleton className="h-[300px] rounded-[2.5rem]" />
                        <Skeleton className="h-[300px] rounded-[2.5rem]" />
                    </div>
                    <Skeleton className="h-[200px] rounded-[3.5rem]" />
                </div>
                <div className="lg:col-span-4">
                    <Skeleton className="h-[500px] rounded-[2.5rem]" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">

            {/* Welcome Hero */}
            <section className="relative p-12 md:p-16 rounded-[4rem] bg-slate-900 text-white overflow-hidden shadow-3xl">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -mr-40 -mt-40" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] -ml-20 -mb-20" />

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="space-y-6 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
                            <Sparkles className="h-4 w-4 text-primary fill-current" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">Statut : {user?.points > 500 ? "Maître LSF" : "Étudiant Actif"}</span>
                        </div>
                        <h1 className="text-4xl md:text-7xl font-black italic uppercase leading-none tracking-tighter">
                            Salut, <span className="text-primary not-italic">{user?.full_name?.split(' ')[0] || "Aventurier"}</span> !
                        </h1>
                        <p className="text-slate-400 font-medium italic text-lg max-w-xl">
                            Prêt à passer au niveau supérieur aujourd'hui ? Votre progression est impressionnante, continuez comme ça !
                        </p>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                            <Button asChild className="h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[10px] px-8 shadow-xl shadow-primary/20 gap-3 border-none">
                                <Link href="/dashboard/user/courses">
                                    Reprendre mes cours
                                    <Play className="h-4 w-4 fill-current" />
                                </Link>
                            </Button>
                            <div className="flex items-center gap-3 px-6 h-14 bg-white/5 border border-white/10 rounded-2xl">
                                <Flame className="h-5 w-5 text-orange-500 fill-current animate-pulse" />
                                <span className="text-xl font-black">{user?.points || 0}</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">XP Points</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                        <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5 flex flex-col items-center text-center">
                            <Trophy className="h-6 w-6 text-yellow-500 mb-2" />
                            <span className="text-2xl font-black">{stats.coursesCompleted}</span>
                            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Validation</span>
                        </div>
                        <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5 flex flex-col items-center text-center">
                            <Star className="h-6 w-6 text-primary mb-2" />
                            <span className="text-2xl font-black">{user?.points > 1000 ? "Expert" : "Élite"}</span>
                            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Rang</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Grid: Gamification & Engagement */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* Left Column: Social & Rewards */}
                <div className="lg:col-span-8 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <BadgeShowcase />
                        <ClassroomLeaderboard />
                    </div>

                    <ReferralCard />

                    {/* Live CTA Section */}
                    <section className="group p-12 rounded-[3.5rem] bg-white shadow-2xl border border-slate-50 relative overflow-hidden transition-all hover:border-primary/10">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 group-hover:scale-150 transition-transform duration-1000" />
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                            <div className="flex items-center gap-8 text-center md:text-left flex-col md:flex-row">
                                <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary group-hover:rotate-12 transition-transform shadow-inner">
                                    <Video className="h-10 w-10" />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-center md:justify-start gap-2">
                                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Classes en temps réel</span>
                                    </div>
                                    <h3 className="text-2xl font-black italic uppercase text-slate-900 leading-none">Interagir <span className="text-primary not-italic">en Direct</span></h3>
                                    <p className="text-sm text-slate-500 font-medium italic">Rejoignez une session live pour pratiquer la LSF avec un expert.</p>
                                </div>
                            </div>
                            <Button asChild variant="outline" className="h-14 rounded-2xl border-2 border-slate-100 font-black uppercase tracking-widest text-[10px] px-8 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all gap-3">
                                <Link href="/dashboard/user/live">
                                    Voir le planning
                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </section>
                </div>

                {/* Right Column: Shortcuts & Activities */}
                <div className="lg:col-span-4 space-y-10">
                    <Card className="rounded-[2.5rem] border-none shadow-2xl bg-slate-900 text-white overflow-hidden p-10 space-y-8">
                        <CardTitle className="text-lg font-black uppercase italic leading-none">Ressources <span className="text-primary not-italic">Rapides</span></CardTitle>
                        <div className="space-y-4">
                            {[
                                { label: "Mes Certificats", href: "/dashboard/user/certificates", icon: Trophy },
                                { label: "Analytiques", href: "/dashboard/user/analytics", icon: BarChart3 },
                                { label: "Forum de discussion", href: "/dashboard/user/forum", icon: Users },
                            ].map((item, i) => (
                                <Link key={i} href={item.href} className="flex items-center justify-between p-6 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group">
                                    <div className="flex items-center gap-4">
                                        <item.icon className="h-5 w-5 text-primary" />
                                        <span className="text-xs font-bold uppercase tracking-widest group-hover:translate-x-1 transition-transform">{item.label}</span>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-white" />
                                </Link>
                            ))}
                        </div>
                    </Card>

                    {/* Motivation Quote */}
                    <div className="p-10 rounded-[2.5rem] bg-primary/10 border border-primary/10 flex flex-col items-center text-center space-y-4">
                        <Flame className="h-10 w-10 text-primary animate-pulse" />
                        <p className="text-slate-700 font-black italic leading-tight text-lg">
                            "La communication est la clé. La LSF est la porte."
                        </p>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Citation du jour</span>
                    </div>
                </div>

            </div>
        </div>
    );
}
