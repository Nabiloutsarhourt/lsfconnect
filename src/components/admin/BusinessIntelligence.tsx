"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
    BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, AreaChart, Area
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    TrendingUp, Users, CreditCard,
    Target, Zap, ArrowUpRight,
    TrendingDown, Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

const MOCK_REVENUE_DATA = [
    { name: 'Jan', value: 4500 },
    { name: 'Feb', value: 5200 },
    { name: 'Mar', value: 4800 },
    { name: 'Apr', value: 6100 },
    { name: 'May', value: 5900 },
    { name: 'Jun', value: 7200 },
];

const MOCK_COMPLETION_DATA = [
    { name: 'Judiciaire', rate: 78 },
    { name: 'Médical', rate: 65 },
    { name: 'Commercial', rate: 42 },
    { name: 'Social', rate: 89 },
];

export function BusinessIntelligence() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    if (loading) return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {Array(4).fill(0).map((_, i) => (
                <div key={i} className="h-32 bg-slate-100 rounded-3xl" />
            ))}
            <div className="col-span-full h-80 bg-slate-100 rounded-[3rem]" />
        </div>
    );

    return (
        <div className="space-y-10 animate-in fade-in duration-1000">

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Revenu Total", value: "33,700 €", change: "+12%", icon: CreditCard, color: "text-green-500", trend: "up" },
                    { label: "Utilisateurs Actifs", value: "1,240", change: "+5%", icon: Users, color: "text-blue-500", trend: "up" },
                    { label: "Taux de Succès", value: "82%", change: "-2%", icon: Target, color: "text-primary", trend: "down" },
                    { label: "Sessions Live/J", value: "14", change: "+18%", icon: Activity, color: "text-orange-500", trend: "up" },
                ].map((kpi, i) => (
                    <Card key={i} className="rounded-[2rem] border-none shadow-xl bg-white p-6 flex flex-col justify-between group hover:-translate-y-1 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className={cn("p-3 rounded-2xl bg-slate-50", kpi.color)}>
                                <kpi.icon className="h-5 w-5" />
                            </div>
                            <div className={cn(
                                "flex items-center gap-1 text-[10px] font-black uppercase tracking-widest",
                                kpi.trend === 'up' ? "text-green-500" : "text-red-500"
                            )}>
                                {kpi.change}
                                <ArrowUpRight className={cn("h-3 w-3", kpi.trend === 'down' && "rotate-90")} />
                            </div>
                        </div>
                        <div>
                            <CardDescription className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">{kpi.label}</CardDescription>
                            <CardTitle className="text-2xl font-black text-slate-900">{kpi.value}</CardTitle>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* Revenue Chart */}
                <Card className="lg:col-span-8 rounded-[3.5rem] border-none shadow-2xl bg-white p-10 space-y-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-black italic uppercase text-slate-900 leading-none">Croissance <span className="text-primary not-italic">Revenus</span></h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Performance financière du semestre</p>
                        </div>
                        <Button variant="ghost" className="rounded-xl font-black uppercase tracking-widest text-[9px] gap-2 border border-slate-100 italic">Exporter CSV</Button>
                    </div>

                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={MOCK_REVENUE_DATA}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#E11D48" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#E11D48" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '10px', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#E11D48" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Completion Chart */}
                <Card className="lg:col-span-4 rounded-[3.5rem] border-none shadow-2xl bg-slate-900 text-white p-10 space-y-8">
                    <div>
                        <h3 className="text-xl font-black italic uppercase leading-none">Complétion <span className="text-primary not-italic">Domaines</span></h3>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2">Taux moyen de réussite</p>
                    </div>

                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={MOCK_COMPLETION_DATA} layout="vertical">
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 8, fontWeight: 900, fill: '#94a3b8', textTransform: 'uppercase' }}
                                    width={80}
                                />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Bar
                                    dataKey="rate"
                                    fill="#E11D48"
                                    radius={[0, 10, 10, 0]}
                                    barSize={30}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

            </div>
        </div>
    );
}
