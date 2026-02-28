"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Users, BookOpen, CreditCard, Star,
    ArrowUpRight, ArrowDownRight, Activity,
    Zap, Calendar, GraduationCap
} from "lucide-react";
import { BusinessIntelligence } from "@/components/admin/BusinessIntelligence";

export default function AdminOverviewPage() {
    const supabase = createClient();

    return (
        <div className="container py-10 space-y-12 animate-in fade-in duration-700">
            <div className="space-y-1">
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">
                    Performance <span className="text-primary not-italic">Globale</span>
                </h1>
                <p className="text-slate-500 font-medium italic">Analyse avancée de l'activité LSFCONNECT.</p>
            </div>

            <BusinessIntelligence />
        </div>
    );
}

function ArrowRight({ className }: { className?: string }) {
    return <ArrowUpRight className={cn("rotate-90", className)} />;
}
