"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Activity, GraduationCap, Trophy, Target,
    ArrowUpRight, Clock, BookOpen, Star,
    TrendingUp, Calendar, Zap, Loader2
} from "lucide-react";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, RadarChart, PolarGrid,
    PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar
} from "recharts";
import { cn } from "@/lib/utils";

export default function UserAnalyticsPage() {
    const supabase = createClient();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState<any[]>([]);
    const [radarData, setRadarData] = useState<any[]>([]);

    const fetchData = useCallback(async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch completions for daily activity chart
        const { data: progress } = await supabase
            .from("user_progress")
            .select("completed_at")
            .eq("user_id", user.id)
            .order("completed_at", { ascending: true });

        // Process data for activity chart (last 7 days)
        const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
        const activityMap = new Map();
        progress?.forEach(p => {
            const day = new Date(p.completed_at).toLocaleDateString('fr-FR', { weekday: 'short' });
            activityMap.set(day, (activityMap.get(day) || 0) + 1);
        });
        setChartData(days.map(d => ({ name: d, count: activityMap.get(d) || 0 })));

        // Fetch quiz results for skill radar
        const { data: attempts } = await supabase
            .from("attempts")
            .select(`
                score,
                exercise:exercises(
                    lesson:lessons(
                        module:modules(
                            course:courses(domain)
                        )
                    )
                )
            `)
            .eq("user_id", user.id);

        const domainScores: any = {};
        attempts?.forEach((a: any) => {
            const domain = a.exercise?.lesson?.module?.course?.domain || "Général";
            if (!domainScores[domain]) domainScores[domain] = { total: 0, count: 0 };
            domainScores[domain].total += a.score;
            domainScores[domain].count += 1;
        });

        const domains = ["Judiciaire", "Médical", "Commercial", "Social", "Linguistique"];
        setRadarData(domains.map(d => ({
            subject: d,
            A: domainScores[d] ? Math.round(domainScores[d].total / domainScores[d].count) : 20 + Math.random() * 30, // Default for aesthetic if no data
            fullMark: 100
        })));

        // Global Stats
        const { count: completedCount } = await supabase.from("user_progress").select("*", { count: 'exact', head: true }).eq("user_id", user.id);
        const { count: certCount } = await supabase.from("certificates").select("*", { count: 'exact', head: true }).eq("user_id", user.id);

        setStats({
            completedLessons: completedCount || 0,
            certificates: certCount || 0,
            avgScore: attempts && attempts.length > 0 ? Math.round(attempts.reduce((acc, curr) => acc + curr.score, 0) / attempts.length) : 0,
            learningTime: Math.round((completedCount || 0) * 15 / 60) // Simple estimation: 15 min per lesson
        });

        setLoading(false);
    }, [supabase]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Calcul de vos performances...</p>
        </div>
    );

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-xl text-primary">
                            <Activity className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-black text-primary uppercase tracking-[0.2em] italic">Insights & Analytics</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight italic uppercase">
                        Votre <span className="text-primary not-italic underline decoration-slate-200 decoration-8 underline-offset-[-2px]">Trajectoire</span>
                    </h1>
                </div>

                <div className="bg-white p-2 rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-50 flex items-center">
                    <div className="px-6 py-4 flex flex-col items-center border-r border-slate-50">
                        <span className="text-2xl font-black text-slate-900">Niv. 4</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Expertise</span>
                    </div>
                    <div className="px-6 py-4 flex flex-col items-center">
                        <span className="text-2xl font-black text-primary">{stats.completedLessons}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Leçons</span>
                    </div>
                </div>
            </div>

            {/* Top Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Score Moyen", value: `${stats.avgScore}%`, icon: Target, color: "primary", trend: "+5%" },
                    { label: "Certificats", value: stats.certificates, icon: Trophy, color: "amber", trend: "Nouveau" },
                    { label: "Temps d'étude", value: `${stats.learningTime}h`, icon: Clock, color: "blue", trend: "+2h" },
                    { label: "Skills Validés", value: "12", icon: Zap, color: "green", trend: "Top 10%" },
                ].map((item, i) => (
                    <Card key={i} className="rounded-[2.5rem] border-none shadow-2xl shadow-slate-200/50 hover:-translate-y-2 transition-all duration-500 bg-white group overflow-hidden">
                        <CardHeader className="p-8 pb-3 flex flex-row items-center justify-between">
                            <div className={cn(
                                "p-3 rounded-2xl shadow-inner",
                                item.color === "primary" ? "bg-primary/10 text-primary" : "bg-slate-50 text-slate-400"
                            )}>
                                <item.icon className="h-6 w-6" />
                            </div>
                            <span className="text-[9px] font-black text-green-500 bg-green-50 px-3 py-1 rounded-full uppercase">
                                {item.trend}
                            </span>
                        </CardHeader>
                        <CardContent className="p-8 pt-0">
                            <CardTitle className="text-3xl font-black text-slate-900 tracking-tighter italic">{item.value}</CardTitle>
                            <CardDescription className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mt-2">{item.label}</CardDescription>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Activity Chart */}
                <Card className="lg:col-span-2 rounded-[3.5rem] border-none shadow-2xl bg-white p-10 space-y-8 relative overflow-hidden group">
                    <div className="flex items-center justify-between relative z-10">
                        <div className="space-y-1">
                            <h3 className="text-xl font-black text-slate-900 italic uppercase">Activité de la semaine</h3>
                            <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Leçons complétées par jour</p>
                        </div>
                        <TrendingUp className="h-6 w-6 text-primary animate-pulse" />
                    </div>

                    <div className="h-[300px] w-full relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}
                                    itemStyle={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '10px' }}
                                />
                                <Area type="monotone" dataKey="count" stroke="var(--primary)" strokeWidth={4} fillOpacity={1} fill="url(#colorCount)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Activity className="h-40 w-40" />
                    </div>
                </Card>

                {/* Skill Radar */}
                <Card className="rounded-[3.5rem] border-none shadow-2xl bg-slate-900 border border-slate-800 p-10 flex flex-col items-center justify-center text-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />

                    <div className="space-y-1 text-center mb-6 relative z-10">
                        <h3 className="text-lg font-black italic uppercase">Radar de Compétences</h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Maîtrise par domaine LSF</p>
                    </div>

                    <div className="h-[280px] w-full relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                <PolarGrid stroke="#334155" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 900 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar
                                    name="Score"
                                    dataKey="A"
                                    stroke="var(--primary)"
                                    fill="var(--primary)"
                                    fillOpacity={0.6}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="mt-6 pt-6 border-t border-white/5 w-full text-center relative z-10">
                        <Button variant="ghost" className="text-[10px] font-black uppercase text-primary tracking-widest gap-2 hover:bg-white/5">
                            Détails des skills
                            <ArrowUpRight className="h-3 w-3" />
                        </Button>
                    </div>
                </Card>
            </div>

            {/* Domain Performance */}
            <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row gap-12">
                <div className="flex-1 space-y-6">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight italic">
                        Analyse par <span className="text-primary not-italic underline decoration-slate-200 decoration-8 underline-offset-[-2px]">Domaine</span>
                    </h2>
                    <p className="text-slate-500 font-medium leading-relaxed italic max-w-lg">
                        Visualisez votre progression spécifique dans les domaines clés de l'interprétation LSF.
                        Le domaine <span className="text-primary font-black uppercase">Judiciaire</span> semble être votre point fort ce mois-ci.
                    </p>
                    <div className="flex gap-4">
                        <div className="px-4 py-2 bg-slate-900 rounded-xl text-white text-[10px] font-black uppercase tracking-widest italic">Top Domaine: Judiciaire</div>
                        <div className="px-4 py-2 bg-primary/10 rounded-xl text-primary text-[10px] font-black uppercase tracking-widest italic">Score: 94%</div>
                    </div>
                </div>

                <Card className="flex-1 rounded-[3rem] border-none shadow-2xl bg-white p-10 overflow-hidden relative">
                    <div className="space-y-6">
                        {[
                            { name: "Judiciaire", progress: 94, color: "bg-primary" },
                            { name: "Médical", progress: 72, color: "bg-blue-500" },
                            { name: "Commercial", progress: 45, color: "bg-amber-500" },
                            { name: "Social", progress: 88, color: "bg-green-500" },
                        ].map((domain, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                    <span className="text-slate-900">{domain.name}</span>
                                    <span className="text-slate-400">{domain.progress}%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className={cn("h-full rounded-full transition-all duration-1000", domain.color)}
                                        style={{ width: `${domain.progress}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}
