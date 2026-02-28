"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
    CreditCard, User, Calendar,
    CheckCircle, XCircle, Clock,
    Search, Funnel
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface SubscriptionRecord {
    id: string;
    user_id: string;
    stripe_subscription_id: string;
    status: string;
    plan_id: string;
    current_period_end: string;
    profiles: {
        full_name: string;
        email: string;
    };
}

export default function AdminSubscriptionsPage() {
    const supabase = createClient();
    const [subscriptions, setSubscriptions] = useState<SubscriptionRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    const fetchSubscriptions = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("subscriptions")
            .select(`
                *,
                profiles:user_id (full_name, email)
            `)
            .order("created_at", { ascending: false });

        if (error) {
            toast.error("Erreur lors de la récupération des abonnements");
        } else {
            setSubscriptions(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const handleCancel = async (subId: string) => {
        if (!confirm("Êtes-vous sûr de vouloir annuler cet abonnement ?")) return;

        const { error } = await supabase
            .from("subscriptions")
            .update({ status: "canceled" })
            .eq("id", subId);

        if (error) {
            toast.error("Échec de l'annulation");
        } else {
            toast.success("Abonnement annulé");
            fetchSubscriptions();
        }
    };

    const filtered = subscriptions.filter(s => {
        if (filter === "all") return true;
        return s.status === filter;
    });

    return (
        <div className="container py-10 space-y-10 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">
                        Gestion des <span className="text-primary not-italic">Abonnements</span>
                    </h1>
                    <p className="text-slate-500 font-medium italic">Suivi commercial et facturation en temps réel.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-stone-100 flex items-center gap-2">
                        <Funnel className="h-4 w-4 text-slate-400" />
                        <select
                            className="bg-transparent text-xs font-bold uppercase outline-none cursor-pointer"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="all">Tous les statuts</option>
                            <option value="active">Actifs</option>
                            <option value="canceled">Annulés</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-2xl border border-stone-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-stone-100">
                            <tr>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Utilisateur</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Plan</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Statut</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Échéance</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-50">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-8 py-6"><div className="h-10 bg-slate-50 rounded-xl" /></td>
                                    </tr>
                                ))
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center font-bold text-slate-400 italic">Aucun abonnement trouvé.</td>
                                </tr>
                            ) : filtered.map((sub) => (
                                <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                <User className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 group-hover:text-primary transition-colors">{sub.profiles?.full_name || 'Utilisateur inconnu'}</p>
                                                <p className="text-[10px] font-medium text-slate-400 tracking-tight">{sub.profiles?.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black uppercase italic text-indigo-900">{sub.plan_id.includes('year') ? 'Elite Annuel' : sub.plan_id.includes('month') ? 'Pro Mensuel' : 'Plan Standard'}</span>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{sub.stripe_subscription_id}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className={cn(
                                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                                            sub.status === 'active' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700 text-opacity-80"
                                        )}>
                                            {sub.status === 'active' ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                                            {sub.status === 'active' ? 'Actif' : 'Annulé'}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-600 italic">
                                            <Clock className="h-3.5 w-3.5 text-slate-400" />
                                            {new Date(sub.current_period_end).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        {sub.status === 'active' && (
                                            <Button
                                                onClick={() => handleCancel(sub.id)}
                                                variant="ghost"
                                                className="text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl italic"
                                            >
                                                Annuler
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
