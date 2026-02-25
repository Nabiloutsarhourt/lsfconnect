"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    MessageSquare, Users, Star,
    ArrowRight, Search, Plus,
    Hand, Gavel, Stethoscope, GraduationCap,
    Clock, MessageCircle, ChevronRight, Loader2
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const iconMap: any = {
    Hand: Hand,
    Gavel: Gavel,
    Stethoscope: Stethoscope,
    Users: Users,
    GraduationCap: GraduationCap
};

export default function ForumPage() {
    const supabase = createClient();
    const [categories, setCategories] = useState<any[]>([]);
    const [recentThreads, setRecentThreads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const { data: catData } = await supabase
                .from("forum_categories")
                .select("*")
                .order("order_index", { ascending: true });

            const { data: threadData } = await supabase
                .from("forum_threads")
                .select(`
                    *,
                    author:profiles(full_name, avatar_url),
                    category:forum_categories(title),
                    forum_posts(count)
                `)
                .order("created_at", { ascending: false })
                .limit(5);

            if (catData) setCategories(catData);
            if (threadData) setRecentThreads(threadData.map(t => ({
                ...t,
                posts_count: t.forum_posts?.[0]?.count || 0
            })));
            setLoading(false);
        }
        fetchData();
    }, [supabase]);

    if (loading) return (
        <div className="p-20 text-center animate-pulse space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
            <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Ouverture du forum...</p>
        </div>
    );

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-xl text-primary">
                            <MessageSquare className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-black text-primary uppercase tracking-[0.2em] italic">Communauté LSF</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight italic uppercase">
                        Forum de <span className="text-primary not-italic underline decoration-slate-200 decoration-8 underline-offset-[-2px]">Partage</span>
                    </h1>
                </div>

                <Button className="h-16 rounded-[2rem] px-8 bg-slate-900 shadow-2xl shadow-slate-900/20 font-black uppercase tracking-widest text-xs gap-3 hover:-translate-y-1 transition-all">
                    <Plus className="h-5 w-5" />
                    Nouvelle Discussion
                </Button>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.map((cat) => {
                    const Icon = iconMap[cat.icon] || MessageSquare;
                    return (
                        <Link key={cat.id} href={`/dashboard/user/forum/cat/${cat.slug}`}>
                            <Card className="group relative h-full rounded-[3rem] border-none shadow-2xl shadow-slate-200/50 overflow-hidden hover:-translate-y-2 transition-all duration-500 bg-white">
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-700">
                                    <Icon className="h-24 w-24 text-primary" />
                                </div>
                                <CardHeader className="p-10 pb-4">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-500 mb-6 shadow-inner">
                                        <Icon className="h-7 w-7" />
                                    </div>
                                    <CardTitle className="text-2xl font-black text-slate-900 group-hover:text-primary transition-colors leading-tight">
                                        {cat.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-10 pt-0">
                                    <CardDescription className="text-sm font-medium text-slate-500 leading-relaxed italic line-clamp-2">
                                        {cat.description}
                                    </CardDescription>
                                    <div className="mt-8 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        <span>Explorer</span>
                                        <ChevronRight className="h-4 w-4 text-primary group-hover:translate-x-2 transition-transform" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    );
                })}
            </div>

            {/* Recent Discussions */}
            <div className="pt-12 border-t border-slate-100 space-y-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black text-slate-900 italic uppercase">Discussions <span className="text-primary not-italic">Récentes</span></h2>
                    <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-slate-400 gap-2">
                        Voir tout
                        <ArrowRight className="h-3 w-3" />
                    </Button>
                </div>

                <div className="space-y-4">
                    {recentThreads.map((thread) => (
                        <Link key={thread.id} href={`/dashboard/user/forum/thread/${thread.id}`}>
                            <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-100/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 bg-white group overflow-hidden">
                                <div className="p-4 md:p-8 flex flex-col md:flex-row md:items-center gap-6">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors overflow-hidden border border-white">
                                        {thread.author?.avatar_url ? (
                                            <img src={thread.author.avatar_url} className="w-full h-full object-cover" />
                                        ) : (
                                            <Users className="h-6 w-6" />
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-slate-50 text-slate-400 rounded-full italic">
                                                {thread.category?.title}
                                            </span>
                                            <span className="text-[9px] text-slate-300 font-bold uppercase tracking-tighter">
                                                {new Date(thread.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-black text-slate-900 group-hover:text-primary transition-colors leading-tight">{thread.title}</h3>
                                        <p className="text-sm text-slate-400 font-medium italic mt-1">{thread.author?.full_name || "Étudiant Anonyme"}</p>
                                    </div>

                                    <div className="flex items-center gap-8 px-6 border-t md:border-t-0 md:border-l border-slate-50 pt-4 md:pt-0">
                                        <div className="flex flex-col items-center">
                                            <span className="text-lg font-black text-slate-900">{thread.posts_count}</span>
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Réponses</span>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <span className="text-lg font-black text-slate-900">{thread.views}</span>
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Vues</span>
                                        </div>
                                        <Button variant="ghost" size="icon" className="group-hover:translate-x-1 transition-transform">
                                            <ChevronRight className="h-5 w-5 text-primary" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
