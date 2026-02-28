"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Search, UserPlus, Shield, User, Star,
    MoreVertical, Mail, Calendar, ShieldAlert,
    Trash2, Ban, CheckCircle2, Loader2, Filter,
    ArrowUpRight
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export default function AdminUsersPage() {
    const supabase = createClient();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [updating, setUpdating] = useState<string | null>(null);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .order("created_at", { ascending: false });

        if (data) {
            setUsers(data);
        }
        setLoading(false);
    }, [supabase]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const updateRole = async (userId: string, newRole: string) => {
        setUpdating(userId);
        try {
            const { error } = await supabase
                .from("profiles")
                .update({ role: newRole })
                .eq("id", userId);

            if (!error) {
                // Also record audit log via RPC if available
                await supabase.rpc("record_audit_log", {
                    p_action: "update_role",
                    p_target_id: userId,
                    p_target_type: "user",
                    p_details: { new_role: newRole }
                });
                fetchUsers();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setUpdating(null);
        }
    };

    const toggleStatus = async (userId: string, currentStatus: boolean) => {
        setUpdating(userId);
        try {
            const { error } = await supabase
                .from("profiles")
                .update({ is_active: !currentStatus })
                .eq("id", userId);

            if (!error) {
                // Record audit log
                await supabase.rpc("record_audit_log", {
                    p_action: currentStatus ? "deactivate_user" : "activate_user",
                    p_target_id: userId,
                    p_target_type: "user",
                    p_details: { previous_status: currentStatus }
                });
                fetchUsers();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setUpdating(null);
        }
    };

    const filteredUsers = users.filter(user =>
        user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container py-10 space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">
                        Gestion des <span className="text-primary not-italic">Utilisateurs</span>
                    </h1>
                    <p className="text-slate-500 font-medium italic">Gérez les rôles, surveillez les abonnements et maintenez la sécurité.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Rechercher un nom ou email..."
                            className="pl-11 h-12 rounded-xl border-slate-100 bg-white shadow-sm font-medium italic"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" onClick={() => fetchUsers()} className="h-12 w-12 rounded-xl border-slate-100 p-0 text-slate-400">
                        <Loader2 className={cn("h-5 w-5", loading && "animate-spin")} />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {loading ? (
                    <div className="text-center py-20 animate-pulse space-y-4">
                        <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
                        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Synchronisation de la base...</p>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <Card className="rounded-[2.5rem] border-dashed border-2 border-slate-100 p-20 text-center bg-transparent shadow-none">
                        <User className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Aucun utilisateur trouvé</p>
                    </Card>
                ) : (
                    <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-50 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[1000px]">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-100">
                                        <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Utilisateur</th>
                                        <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Rôle</th>
                                        <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Statut</th>
                                        <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Date d'inscription</th>
                                        <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id} className="group hover:bg-slate-50/30 transition-colors border-b border-slate-50 last:border-0">
                                            <td className="p-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 font-black uppercase shadow-inner overflow-hidden border border-white">
                                                        {user.avatar_url ? (
                                                            <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            user.full_name?.charAt(0) || user.email?.charAt(0)
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-slate-900 leading-none mb-1">{user.full_name || "Anonyme"}</p>
                                                        <p className="text-xs text-slate-400 font-medium italic leading-none">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-8">
                                                <span className={cn(
                                                    "px-4 py-1.5 rounded-full font-black uppercase tracking-widest text-[8px] border",
                                                    user.role === 'admin' ? "bg-red-50 text-red-600 border-red-100 shadow-sm shadow-red-50" :
                                                        user.role === 'expert' ? "bg-amber-50 text-amber-600 border-amber-100 shadow-sm shadow-amber-50" :
                                                            "bg-blue-50 text-blue-600 border-blue-100 shadow-sm shadow-blue-50"
                                                )}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="p-8">
                                                <div className="flex items-center gap-2">
                                                    <span className={cn(
                                                        "px-4 py-1.5 rounded-full font-black uppercase tracking-widest text-[8px] border flex items-center gap-1.5",
                                                        user.is_active !== false ? "bg-green-50 text-green-600 border-green-100 shadow-sm" : "bg-slate-100 text-slate-400 border-slate-200"
                                                    )}>
                                                        <span className={cn("w-1.5 h-1.5 rounded-full", user.is_active !== false ? "bg-green-500" : "bg-slate-300")} />
                                                        {user.is_active !== false ? 'Actif' : 'Banni'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-8 text-xs text-slate-400 font-bold uppercase tracking-widest">
                                                {user.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                }) : "N/A"}
                                            </td>
                                            <td className="p-8">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-slate-100 text-slate-400">
                                                            {updating === user.id ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : <MoreVertical className="h-5 w-5" />}
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-56 rounded-2xl border-slate-100 shadow-2xl p-2">
                                                        <DropdownMenuLabel className="px-4 py-2 text-[10px] font-black uppercase text-slate-400 tracking-widest">Modifier le Rôle</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => updateRole(user.id, 'admin')} className="rounded-xl px-4 py-3 cursor-pointer group">
                                                            <Shield className="mr-3 h-4 w-4 text-red-500 group-hover:scale-110 transition-transform" />
                                                            <span className="font-bold text-slate-700">Passer Admin</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => updateRole(user.id, 'expert')} className="rounded-xl px-4 py-3 cursor-pointer group">
                                                            <Star className="mr-3 h-4 w-4 text-amber-500 group-hover:scale-110 transition-transform" />
                                                            <span className="font-bold text-slate-700">Passer Expert</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => updateRole(user.id, 'client')} className="rounded-xl px-4 py-3 cursor-pointer group">
                                                            <User className="mr-3 h-4 w-4 text-blue-500 group-hover:scale-110 transition-transform" />
                                                            <span className="font-bold text-slate-700">Passer Client</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator className="bg-slate-50 my-2" />
                                                        <DropdownMenuItem
                                                            onClick={() => toggleStatus(user.id, user.is_active !== false)}
                                                            className={cn(
                                                                "rounded-xl px-4 py-3 cursor-pointer group focus:bg-red-50",
                                                                user.is_active !== false ? "text-red-600" : "text-green-600"
                                                            )}
                                                        >
                                                            {user.is_active !== false ? (
                                                                <>
                                                                    <Ban className="mr-3 h-4 w-4 group-hover:scale-110 transition-transform" />
                                                                    <span className="font-bold">Désactiver</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <CheckCircle2 className="mr-3 h-4 w-4 group-hover:scale-110 transition-transform" />
                                                                    <span className="font-bold">Réactiver</span>
                                                                </>
                                                            )}
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            <div className="pt-20 border-t border-slate-100 flex flex-col md:flex-row gap-12">
                <div className="flex-1 space-y-6">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight italic">
                        Surveillance & <span className="text-primary not-italic underline decoration-slate-200 decoration-8 underline-offset-[-2px]">Conformité</span>
                    </h2>
                    <p className="text-slate-500 font-medium leading-relaxed italic max-w-lg">
                        Toutes les modifications de rôle et de statut sont tracées dans le système d'audit.
                        En tant qu'administrateur, vous êtes responsable de la conformité GDPR pour les utilisateurs basés en France.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1">
                    <Card className="rounded-[2rem] p-8 border-none bg-slate-50 flex flex-col gap-4 group hover:bg-white hover:shadow-2xl transition-all duration-500">
                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                            <ShieldAlert className="h-6 w-6" />
                        </div>
                        <h3 className="font-black text-slate-900 text-sm uppercase">Audit Logs</h3>
                        <p className="text-xs text-slate-400 font-medium leading-relaxed italic">Voir l'historique de toutes les actions administratives.</p>
                        <Button variant="ghost" className="p-0 h-auto self-start text-[10px] font-black uppercase tracking-widest text-primary gap-2 hover:bg-transparent">
                            <span>Explorer</span>
                            <ArrowRight className="h-3 w-3" />
                        </Button>
                    </Card>
                    <Card className="rounded-[2rem] p-8 border-none bg-slate-50 flex flex-col gap-4 group hover:bg-white hover:shadow-2xl transition-all duration-500">
                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                            <CheckCircle2 className="h-6 w-6" />
                        </div>
                        <h3 className="font-black text-slate-900 text-sm uppercase">GDPR Desk</h3>
                        <p className="text-xs text-slate-400 font-medium leading-relaxed italic">Gérer les demandes d'accès et de suppression de données.</p>
                        <Button variant="ghost" className="p-0 h-auto self-start text-[10px] font-black uppercase tracking-widest text-primary gap-2 hover:bg-transparent">
                            <span>Gérer</span>
                            <ArrowRight className="h-3 w-3" />
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function ArrowRight({ className }: { className?: string }) {
    return <ArrowUpRight className={cn("rotate-90", className)} />;
}
