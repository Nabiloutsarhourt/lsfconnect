"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Users, Gift, Copy,
    Check, Share2, Sparkles,
    ArrowRight, Flame
} from "lucide-react";
import { cn } from "@/lib/utils";

export function ReferralCard() {
    const supabase = createClient();
    const [profile, setProfile] = useState<any>(null);
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProfile() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase
                    .from('profiles')
                    .select('referral_code')
                    .eq('id', user.id)
                    .single();
                if (data) setProfile(data);
            }
            setLoading(false);
        }
        fetchProfile();
    }, [supabase]);

    const copyToClipboard = () => {
        if (profile?.referral_code) {
            navigator.clipboard.writeText(profile.referral_code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (loading) return <div className="h-64 rounded-[2.5rem] bg-slate-100 animate-pulse" />;

    return (
        <Card className="rounded-[2.5rem] border-none shadow-2xl bg-white overflow-hidden relative group">
            {/* Decorative background */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700" />

            <CardHeader className="p-10 pb-4">
                <div className="flex items-center gap-3 mb-2">
                    <Gift className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg font-black uppercase italic text-slate-900 leading-none">Partagez <span className="text-primary not-italic">l'Expérience</span></CardTitle>
                </div>
                <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400">Offrez 200 XP à vos amis et gagnez des bonus</CardDescription>
            </CardHeader>

            <CardContent className="p-10 pt-4 space-y-8">
                <p className="text-xs text-slate-500 font-medium italic leading-relaxed">
                    Invitez vos collègues ou amis à rejoindre LSFCONNECT. S'ils s'inscrivent avec votre code, vous recevrez chacun un boost de points pour le classement !
                </p>

                <div className="space-y-4">
                    <div className="relative group/copy">
                        <div className="absolute -top-3 left-4 px-2 bg-white text-[8px] font-black uppercase tracking-widest text-primary z-10 transition-all group-focus-within/copy:scale-110">Votre Code Unique</div>
                        <div className="flex items-center gap-3 p-6 bg-slate-50 border-2 border-slate-50 rounded-2xl group-focus-within/copy:border-primary/20 transition-all">
                            <span className="flex-1 font-black text-xl tracking-[0.2em] text-slate-900 select-all uppercase">
                                {profile?.referral_code || "GEN-PROMO"}
                            </span>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={copyToClipboard}
                                className={cn(
                                    "h-12 w-12 rounded-xl transition-all",
                                    copied ? "bg-green-500 text-white" : "bg-white text-slate-400 hover:bg-slate-900 hover:text-white shadow-sm"
                                )}
                            >
                                {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                            </Button>
                        </div>
                    </div>

                    <Button className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-primary text-white font-black uppercase tracking-widest text-[10px] gap-3 shadow-xl transition-all shadow-slate-200 border-none">
                        <Share2 className="h-4 w-4" />
                        Partager le lien
                    </Button>
                </div>

                <div className="flex items-center justify-center gap-6 pt-4 grayscale opacity-40">
                    <Users className="h-4 w-4" />
                    <Sparkles className="h-4 w-4" />
                    <Flame className="h-4 w-4" />
                </div>
            </CardContent>
        </Card>
    );
}
