"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Medal, Crown, Star, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

export function ClassroomLeaderboard() {
    const supabase = createClient();
    const [topUsers, setTopUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchLeaderboard() {
            const { data } = await supabase
                .from('profiles')
                .select('id, full_name, avatar_url, points')
                .order('points', { ascending: false })
                .limit(5);

            if (data) setTopUsers(data);
            setLoading(false);
        }
        fetchLeaderboard();
    }, [supabase]);

    const getRankIcon = (index: number) => {
        switch (index) {
            case 0: return <Crown className="h-4 w-4 text-yellow-500 fill-current" />;
            case 1: return <Medal className="h-4 w-4 text-slate-400 fill-current" />;
            case 2: return <Medal className="h-4 w-4 text-amber-600 fill-current" />;
            default: return <Star className="h-3 w-3 text-slate-300" />;
        }
    };

    return (
        <Card className="rounded-[2.5rem] border-none shadow-2xl bg-white overflow-hidden">
            <CardHeader className="p-10 border-b border-slate-50 bg-slate-50/30">
                <div className="flex items-center gap-3 mb-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg font-black uppercase italic text-slate-900 leading-none">Classement <span className="text-primary not-italic">Elite</span></CardTitle>
                </div>
                <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400">Les 5 meilleurs étudiants du mois</CardDescription>
            </CardHeader>
            <CardContent className="p-10 space-y-6">
                {loading ? (
                    Array(5).fill(0).map((_, i) => (
                        <div key={i} className="flex items-center gap-4 animate-pulse">
                            <div className="w-8 h-8 rounded-full bg-slate-100" />
                            <div className="flex-1 h-4 bg-slate-100 rounded" />
                            <div className="w-12 h-4 bg-slate-100 rounded" />
                        </div>
                    ))
                ) : topUsers.length === 0 ? (
                    <p className="text-center py-4 text-xs font-bold text-slate-300 uppercase italic">Aucune donnée disponible</p>
                ) : (
                    topUsers.map((user, idx) => (
                        <div key={user.id} className="flex items-center gap-4 group">
                            <div className="w-8 text-center font-black text-xs text-slate-300 italic group-hover:text-primary transition-colors">
                                #{idx + 1}
                            </div>
                            <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                                <AvatarImage src={user.avatar_url || ""} />
                                <AvatarFallback className="bg-primary/10 text-primary font-black text-[10px]">
                                    {user.full_name?.substring(0, 2).toUpperCase() || "LSF"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <h4 className="text-xs font-black text-slate-900 group-hover:translate-x-1 transition-transform truncate max-w-[120px]">
                                    {user.full_name || "Étudiant Anonyme"}
                                </h4>
                                <div className="flex items-center gap-1">
                                    {getRankIcon(idx)}
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                                        {idx === 0 ? "LSF Master" : idx === 1 ? "Expert" : "Apprenti"}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full">
                                <Flame className="h-3 w-3 text-orange-500 fill-current" />
                                <span className="text-xs font-black text-slate-900">{user.points || 0}</span>
                            </div>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    );
}
