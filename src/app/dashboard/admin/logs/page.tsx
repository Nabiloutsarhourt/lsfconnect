"use client";

import { AuditLogsViewer } from "@/components/admin/AuditLogsViewer";

export default function AdminLogsPage() {
    return (
        <div className="container py-10 space-y-12 animate-in fade-in duration-700">
            <div className="space-y-1">
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">
                    Journaux <span className="text-primary not-italic">d'Audit</span>
                </h1>
                <p className="text-slate-500 font-medium italic">Transparence totale sur les actions administratives et la sécurité.</p>
            </div>

            <AuditLogsViewer />
        </div>
    );
}
