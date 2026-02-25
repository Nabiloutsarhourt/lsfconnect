"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Users, BookOpen, CreditCard, Star,
    ArrowUpRight, ArrowDownRight, Activity,
    Zap, Calendar, GraduationCap
} from "lucide-react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, AreaChart, Area
} from "recharts";

const data = [
    { name: "Jan", revenue: 4000, users: 2400 },
    { name: "Feb", revenue: 3000, users: 1398 },
    { name: "Mar", revenue: 2000, users: 9800 },
    { name: "Apr", revenue: 2780, users: 3908 },
    { name: "May", revenue: 1890, users: 4800 },
    { name: "Jun", revenue: 2390, users: 3800 },
    { name: "Jul", revenue: 3490, users: 4300 },
];

export default function AdminOverviewPage() {
    const supabase = createClient();
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeSubscriptions: 0,
        totalCourses: 0,
        successRate: 85
    });

    useEffect(() => {
        const fetchStats = async () => {
            const { count: usersCount } = await supabase.from("profiles").select("*", { count: 'exact', head: true });
            const { count: coursesCount } = await supabase.from("courses").select("*", { count: 'exact', head: true });
            const { count: subCount } = await supabase.from("subscriptions").select("*", { count: 'exact', head: true }).eq('status', 'active');

            setStats({
                totalUsers: usersCount || 0,
                activeSubscriptions: subCount || 0,
                totalCourses: coursesCount || 0,
                successRate: 88
            });
        };
        fetchStats();
    }, [supabase]);

    return (
        <div className="container py-10 space-y-12 animate-in fade-in duration-700">
            <div className="space-y-1">
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">
                    Tableau de <span className="text-primary not-italic">Bord Admin</span>
                </h1>
                <p className="text-slate-500 font-medium italic italic">Performance globale et statistiques de la plateforme.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { title: "Utilisateurs", value: stats.totalUsers, icon: Users, trend: "+12%", color: "blue" },
                    { title: "Abonnements Pro", value: stats.activeSubscriptions, icon: Zap, trend: "+5%", color: "primary" },
                    { title: "Cours Publiés", value: stats.totalCourses, icon: BookOpen, trend: "0%", color: "amber" },
                    { title: "Taux de Réussite", value: `${stats.successRate}%`, icon: GraduationCap, trend: "+2%", color: "green" },
                ].map((stat, i) => (
                    <Card key={i} className="rounded-[2.5rem] border-none shadow-2xl shadow-slate-200/50 hover:-translate-y-2 transition-all duration-500 bg-white/80 backdrop-blur-xl overflow-hidden group">
                        <CardHeader className="p-8 pb-4 flex flex-row items-center justify-between">
                            <div className={cn(
                                "p-3 rounded-2xl shadow-inner",
                                stat.color === "primary" ? "bg-primary/10 text-primary" : "bg-slate-50 text-slate-400"
                            )}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                            <span className="text-[10px] font-black text-green-500 flex items-center gap-1 bg-green-50 px-3 py-1 rounded-full uppercase tracking-widest">
                                <ArrowUpRight className="h-3 w-3" />
                                {stat.trend}
                            </span>
                        </CardHeader>
                        <CardContent className="p-8 pt-0">
                            <CardTitle className="text-4xl font-black text-slate-900 tracking-tighter">{stat.value}</CardTitle>
                            <CardDescription className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mt-2">{stat.title}</CardDescription>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 rounded-[3rem] border-none shadow-2xl bg-white p-10 space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h3 className="text-xl font-black text-slate-900 leading-none">Croissance & Revenus</h3>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Activité des 6 derniers mois</p>
                        </div>
                        <Button variant="outline" className="rounded-xl border-slate-100 font-black uppercase text-[10px] tracking-widest gap-2">
                            <Calendar className="h-4 w-4" />
                            Semestriel
                        </Button>
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
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
                                <Area type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="rounded-[3rem] border-none shadow-2xl bg-slate-900 p-10 space-y-8 text-white relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
                    <div className="relative space-y-6">
                        <div className="space-y-1">
                            <h3 className="text-xl font-black leading-none italic uppercase">Activités <span className="text-primary not-italic">Récentes</span></h3>
                            <p className="text-xs text-slate-400 font-bold tracking-widest uppercase italic">Logs système en temps réel</p>
                        </div>

                        <div className="space-y-4">
                            {[
                                { user: "Jean M.", action: "Abonné à Pro", time: "Il y a 2 min", icon: Zap, color: "text-primary" },
                                { user: "Admin", action: "Nouveau cours publié", time: "Il y a 15 min", icon: BookOpen, color: "text-amber-400" },
                                { user: "Marie L.", action: "Certificat obtenu", time: "Il y a 1h", icon: GraduationCap, color: "text-green-400" },
                                { user: "Lucas T.", action: "Nouveau compte", time: "Il y a 3h", icon: Users, color: "text-blue-400" },
                            ].map((log, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                    <div className={cn("p-2 rounded-lg bg-white/5", log.color)}>
                                        <log.icon className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-black truncate">{log.user}</p>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{log.action}</p>
                                    </div>
                                    <span className="text-[9px] text-slate-600 font-black uppercase tracking-tighter whitespace-nowrap">{log.time}</span>
                                </div>
                            ))}
                        </div>

                        <Button variant="ghost" className="w-full rounded-xl text-slate-400 hover:text-white hover:bg-white/5 font-black uppercase tracking-[0.2em] text-[10px] gap-2">
                            Voir tous les logs
                            <ArrowRight className="h-3 w-3" />
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}

function ArrowRight({ className }: { className?: string }) {
    return <ArrowUpRight className={cn("rotate-90", className)} />;
}
