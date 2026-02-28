"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Trophy, Download, ChevronLeft, Calendar,
    Award, Star, ShieldCheck, Share2, BookOpen,
    Loader2, Sparkles, CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import jsPDF from "jspdf";
import confetti from "canvas-confetti";

interface Certificate {
    id: string;
    issued_at: string;
    user: {
        full_name: string;
    };
    course: {
        title: string;
        domain: string;
    };
}

export default function UserCertificatesPage() {
    const supabase = createClient();
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);
    const [generatingId, setGeneratingId] = useState<string | null>(null);

    useEffect(() => {
        async function fetchCertificates() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data } = await supabase
                .from("certificates")
                .select(`
                    id,
                    issued_at,
                    user:profiles(full_name),
                    course:courses(title, domain)
                `)
                .eq("user_id", user.id);

            if (data) setCertificates(data as any);
            setLoading(false);
        }
        fetchCertificates();
    }, [supabase]);

    const handleCelebration = () => {
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
    };

    const downloadPDF = async (cert: Certificate) => {
        setGeneratingId(cert.id);
        handleCelebration();

        const doc = new jsPDF({
            orientation: "landscape",
            unit: "mm",
            format: "a4"
        });

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        doc.setFillColor(15, 23, 42);
        doc.rect(0, 0, pageWidth, pageHeight, "F");

        doc.setDrawColor(245, 158, 11);
        doc.setLineWidth(2);
        doc.rect(10, 10, pageWidth - 20, pageHeight - 20, "D");

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(40);
        doc.setFont("helvetica", "bold");
        doc.text("CERTIFICAT DE RÉUSSITE", pageWidth / 2, 40, { align: "center" });

        doc.setTextColor(245, 158, 11);
        doc.setFontSize(32);
        doc.text(cert.user.full_name || "Étudiant LSFCONNECT", pageWidth / 2, 85, { align: "center" });

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.text(cert.course.title, pageWidth / 2, 120, { align: "center" });

        doc.save(`Certificat_LSF_${cert.id.substring(0, 8)}.pdf`);
        setGeneratingId(null);
    };

    const shareToLinkedIn = (cert: Certificate) => {
        const url = encodeURIComponent(`${window.location.origin}/certificates/verify/${cert.id}`);
        const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        window.open(linkedinUrl, '_blank', 'width=600,height=600');
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Authentification de vos diplômes...</p>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-1000 pb-20 mt-12">
            <div className="space-y-4">
                <Button variant="ghost" size="sm" asChild className="rounded-xl border border-slate-100 bg-white hover:-translate-x-1 transition-all">
                    <Link href="/dashboard/user/courses" className="flex items-center gap-2 font-bold text-slate-400">
                        <ChevronLeft className="h-4 w-4" />
                        Retour aux cours
                    </Link>
                </Button>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Sparkles className="h-4 w-4 text-amber-500 fill-amber-500/20" />
                            <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest italic">Prestiges & Réussites</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter leading-tight italic uppercase">
                            Vos <span className="text-amber-500 not-italic underline decoration-amber-100 decoration-[14px] underline-offset-[-2px]">Graduations</span>
                        </h1>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {certificates.map((cert) => (
                    <Card key={cert.id} className="group rounded-[3rem] border-none shadow-2xl overflow-hidden bg-white hover:-translate-y-4 transition-all">
                        <div className="h-56 bg-slate-900 relative">
                            <div className="absolute bottom-8 left-8 flex flex-col gap-1">
                                <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest italic">{cert.course.domain}</span>
                                <h3 className="text-xl font-black text-white italic uppercase">{cert.course.title}</h3>
                            </div>
                        </div>
                        <CardContent className="p-10 space-y-8 bg-white">
                            <div className="grid grid-cols-1 gap-4">
                                <Button
                                    onClick={() => downloadPDF(cert)}
                                    disabled={generatingId === cert.id}
                                    className="h-16 rounded-[2rem] bg-slate-900 shadow-2xl font-black uppercase tracking-widest text-[10px] gap-3"
                                >
                                    {generatingId === cert.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                                    Télécharger le PDF
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() => shareToLinkedIn(cert)}
                                    className="h-14 rounded-2xl font-black uppercase tracking-widest text-[9px] gap-2"
                                >
                                    <Share2 className="h-4 w-4" />
                                    Partager sur LinkedIn
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
