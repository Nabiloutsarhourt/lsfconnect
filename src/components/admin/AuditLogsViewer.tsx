"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
    Activity, Shield, User,
    Calendar, Search, Filter,
    Eye, ChevronRight, AlertTriangle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";

type AuditLog = {
    id: string;
    action: string;
    target_type: string;
    details: any;
    created_at: string;
    profiles: { full_name: string; email: string; role: string } | null;
};

export function AuditLogsViewer() {
    const supabase = createClient();
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

    useEffect(() => {
        const fetchLogs = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('audit_logs')
                .select(`
                    *,
                    profiles:admin_id(full_name, email, role)
                `)
                .order('created_at', { ascending: false })
                .limit(50);

            if (data) setLogs(data as any);
            setLoading(false);
        };
        fetchLogs();
    }, []);

    const filteredLogs = logs.filter(log =>
        log.action.toLowerCase().includes(search.toLowerCase()) ||
        log.profiles?.full_name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-10 animate-in fade-in duration-1000">
            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Rechercher une action ou un admin..."
                        className="pl-12 rounded-2xl border-slate-100 bg-white shadow-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Badge variant="outline" className="px-4 py-2 rounded-xl bg-slate-50 text-slate-500 border-slate-100 font-bold gap-2 italic">
                    <Activity className="h-3 w-3" />
                    50 derniers événements
                </Badge>
            </div>

            {/* Logs Table */}
            <Card className="rounded-[3rem] border-none shadow-2xl overflow-hidden bg-white">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                <th className="p-8">Action</th>
                                <th className="p-8">Administrateur</th>
                                <th className="p-8">Date</th>
                                <th className="p-8 text-right">Détails</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={4} className="p-8 h-20 bg-slate-50/20" />
                                    </tr>
                                ))
                            ) : filteredLogs.map((log) => (
                                <tr key={log.id} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="p-8">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                                <Shield className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900 text-sm tracking-tight capitalize">{log.action.replace('_', ' ')}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{log.target_type}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                                                <User className="h-4 w-4 text-slate-400" />
                                            </div>
                                            <p className="text-xs font-bold text-slate-700">{log.profiles?.full_name || "Système"}</p>
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 italic">
                                            <Calendar className="h-3.5 w-3.5" />
                                            {new Date(log.created_at).toLocaleString('fr-FR')}
                                        </div>
                                    </td>
                                    <td className="p-8 text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="rounded-xl hover:bg-white hover:shadow-lg transition-all"
                                            onClick={() => setSelectedLog(log)}
                                        >
                                            <Eye className="h-4 w-4 text-slate-400" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Detail Modal */}
            <Dialog open={!!selectedLog} onOpenChange={(open: boolean) => !open && setSelectedLog(null)}>
                <DialogContent className="max-w-2xl rounded-[3rem] border-none shadow-3xl p-10 bg-white">
                    {selectedLog && (
                        <div className="space-y-8">
                            <DialogHeader>
                                <Badge className="bg-primary/10 text-primary border-none font-black text-[10px] uppercase tracking-[0.2em] mb-4 w-fit">Audit Logs</Badge>
                                <DialogTitle className="text-3xl font-black italic uppercase italic leading-tight">Détails de <span className="text-primary not-italic">l'événement</span></DialogTitle>
                                <DialogDescription className="font-bold text-slate-400 uppercase tracking-widest text-xs mt-2 italic">
                                    Identifiant: {selectedLog.id}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-6">
                                <section className="p-8 rounded-[2rem] bg-slate-900 text-white relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-2xl" />
                                    <div className="relative space-y-2">
                                        <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2 leading-none">Payload JSON</h5>
                                        <pre className="text-xs font-mono bg-white/5 p-4 rounded-xl overflow-x-auto text-slate-300">
                                            {JSON.stringify(selectedLog.details, null, 2)}
                                        </pre>
                                    </div>
                                </section>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Origine IP</p>
                                        <p className="font-black text-slate-900 font-mono">Simulated-Access-Dev</p>
                                    </div>
                                    <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Statut</p>
                                        <Badge className="bg-green-500 text-white border-none font-black uppercase text-[8px] tracking-widest">Success</Badge>
                                    </div>
                                </div>
                            </div>

                            <Button onClick={() => setSelectedLog(null)} className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-primary transition-all font-black uppercase tracking-widest text-[10px]">
                                Fermer le rapport
                            </Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
