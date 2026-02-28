"use client";

import { GradingHub } from "@/components/admin/GradingHub";

export default function AdminGradingPage() {
    return (
        <div className="container py-10 space-y-12 animate-in fade-in duration-700">
            <div className="space-y-1">
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">
                    Hub de <span className="text-primary not-italic">Correction</span>
                </h1>
                <p className="text-slate-500 font-medium italic">Evaluation manuelle et feedback sur les études de cas.</p>
            </div>

            <GradingHub />
        </div>
    );
}
