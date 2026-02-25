"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Activity, Shield, User, Globe,
    Zap, AlertTriangle, Search, Filter,
    Eye, MoreHorizontal, History, Fingerprint
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function AdminAuditLogsPage() {
    const supabase = createClient();
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchLogs = async () => {
            const { data } = await supabase
                .from("audit_logs")
                .select(`
                    *,
                    admin:profiles(full_name, avatar_url)
                `)
                .order("created_at", { ascending: false });

            if (data) setLogs(data);
            setLoading(false);
        };
        fetchLogs();
    }, [supabase]);

    const filteredLogs = logs.filter(log =>
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.target_type?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container py-10 space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">
                        Journaux d'<span className="text-primary not-italic">Audit</span>
                    </h1>
                    <p className="text-slate-500 font-medium italic">Historique complet des actions administratives et événements système.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Rechercher une action..."
                            className="pl-11 h-12 rounded-xl border-slate-100 font-medium italic"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {loading ? (
                    <div className="p-20 text-center animate-pulse space-y-4 bg-white rounded-[2.5rem]">
                        <Activity className="h-10 w-10 animate-bounce text-primary mx-auto" />
                        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Extraction des journaux...</p>
                    </div>
                ) : filteredLogs.length === 0 ? (
                    <Card className="rounded-[2.5rem] border-dashed border-2 border-slate-100 p-20 text-center bg-transparent shadow-none">
                        <Fingerprint className="h-12 w-12 text-slate-100 mx-auto mb-4" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Aucun log enregistré</p>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {filteredLogs.map((log) => (
                            <Card key={log.id} className="rounded-3xl border-none shadow-xl shadow-slate-100/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 bg-white group overflow-hidden">
                                <div className="p-1 flex flex-col md:flex-row md:items-center gap-6">
                                    <div className={cn(
                                        "p-6 rounded-2xl flex items-center justify-center transition-colors",
                                        log.action.includes('delete') ? "bg-red-50 text-red-500" : "bg-slate-50 text-slate-400 group-hover:bg-primary/5 group-hover:text-primary"
                                    )}>
                                        <History className="h-6 w-6" />
                                    </div>

                                    <div className="flex-1 p-4 md:p-0">
                                        <div className="flex flex-wrap items-center gap-3 mb-2">
                                            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-slate-100 rounded-full text-slate-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                {log.action}
                                            </span>
                                            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-slate-900 text-white rounded-full italic">
                                                {log.target_type}
                                            </span>
                                            <span className="text-[9px] text-slate-400 font-bold ml-auto uppercase tracking-tighter">
                                                {new Date(log.created_at).toLocaleString('fr-FR')}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-slate-100 overflow-hidden shadow-inner">
                                                {log.admin?.avatar_url ? (
                                                    <img src={log.admin.avatar_url} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="flex items-center justify-center w-full h-full text-[8px] font-black uppercase text-slate-400">
                                                        {log.admin?.full_name?.charAt(0) || "A"}
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-sm font-medium text-slate-600">
                                                <span className="font-black text-slate-900">{log.admin?.full_name || "Système"}</span> a modifié <span className="italic">{log.target_id || "un objet"}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="p-4 md:p-8 flex items-center gap-2 border-t md:border-t-0 md:border-l border-slate-50">
                                        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl hover:bg-slate-50">
                                            <Eye className="h-5 w-5 text-slate-400" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
