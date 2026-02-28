"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Sparkles, GraduationCap, Gavel,
    Stethoscope, Users, Lock,
    CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, any> = {
    'Sparkles': Sparkles,
    'GraduationCap': GraduationCap,
    'Gavel': Gavel,
    'Stethoscope': Stethoscope,
    'Users': Users,
};

export function BadgeShowcase() {
    const supabase = createClient();
    const [badges, setBadges] = useState<any[]>([]);
    const [earnedBadgeIds, setEarnedBadgeIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Fetch all badges
            const { data: allBadges } = await supabase.from('badges').select('*').order('created_at');
            if (allBadges) setBadges(allBadges);

            // Fetch earned badges
            const { data: earned } = await supabase
                .from('user_badges')
                .select('badge_id')
                .eq('user_id', user.id);

            if (earned) {
                setEarnedBadgeIds(new Set(earned.map(e => e.badge_id)));
            }
            setLoading(false);
        }
        fetchData();
    }, [supabase]);

    return (
        <Card className="rounded-[2.5rem] border-none shadow-2xl bg-white overflow-hidden h-full">
            <CardHeader className="p-10 border-b border-slate-50 bg-slate-50/30">
                <div className="flex items-center gap-3 mb-2">
                    <Sparkles className="h-5 w-5 text-primary fill-current" />
                    <CardTitle className="text-lg font-black uppercase italic text-slate-900 leading-none">Mes <span className="text-primary not-italic">Succès</span></CardTitle>
                </div>
                <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400">Progressez pour débloquer des récompenses</CardDescription>
            </CardHeader>
            <CardContent className="p-10">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                    {loading ? (
                        Array(3).fill(0).map((_, i) => (
                            <div key={i} className="aspect-square rounded-3xl bg-slate-100 animate-pulse" />
                        ))
                    ) : badges.map((badge) => {
                        const Icon = ICON_MAP[badge.icon_type] || Sparkles;
                        const isEarned = earnedBadgeIds.has(badge.id);

                        return (
                            <div
                                key={badge.id}
                                className={cn(
                                    "relative aspect-square rounded-[2rem] border-2 flex flex-col items-center justify-center p-4 transition-all group",
                                    isEarned
                                        ? "border-primary/20 bg-primary/5 shadow-inner scale-[1.05]"
                                        : "border-slate-50 bg-slate-50/50 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 hover:border-slate-100"
                                )}
                            >
                                <div className={cn(
                                    "p-3 rounded-2xl mb-2",
                                    isEarned ? "bg-white text-primary shadow-sm" : "bg-slate-100 text-slate-400"
                                )}>
                                    <Icon className="h-6 w-6" />
                                </div>
                                <span className="text-[8px] font-black uppercase text-center tracking-widest leading-tight">
                                    {badge.name}
                                </span>

                                {isEarned ? (
                                    <div className="absolute -top-1 -right-1 p-1 bg-green-500 rounded-full border-2 border-white text-white">
                                        <CheckCircle2 className="h-2 w-2" />
                                    </div>
                                ) : (
                                    <div className="absolute top-2 right-2 text-slate-300">
                                        <Lock className="h-3 w-3" />
                                    </div>
                                )}

                                {/* Tooltip on hover */}
                                <div className="absolute inset-0 bg-slate-900/90 text-white rounded-[2rem] p-4 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                                    <p className="text-[7px] font-black uppercase tracking-tighter mb-1 text-primary">Mission</p>
                                    <p className="text-[10px] font-bold text-center italic leading-tight">{badge.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
