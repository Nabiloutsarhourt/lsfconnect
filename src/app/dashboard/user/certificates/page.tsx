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

        // 1. Background / Frame
        doc.setFillColor(15, 23, 42); // slate-900
        doc.rect(0, 0, pageWidth, pageHeight, "F");

        // Border
        doc.setDrawColor(245, 158, 11); // amber-500
        doc.setLineWidth(2);
        doc.rect(10, 10, pageWidth - 20, pageHeight - 20, "D");

        // Secondary border
        doc.setDrawColor(245, 158, 11);
        doc.setLineWidth(0.5);
        doc.rect(12, 12, pageWidth - 24, pageHeight - 24, "D");

        // 2. Headings
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(40);
        doc.setFont("helvetica", "bold");
        doc.text("CERTIFICAT DE RÉUSSITE", pageWidth / 2, 40, { align: "center" });

        doc.setDrawColor(245, 158, 11);
        doc.setLineWidth(1);
        doc.line(pageWidth / 2 - 40, 45, pageWidth / 2 + 40, 45);

        doc.setFontSize(16);
        doc.setFont("helvetica", "normal");
        doc.text("Ce document atteste que", pageWidth / 2, 65, { align: "center" });

        // 3. User Name
        doc.setTextColor(245, 158, 11);
        doc.setFontSize(32);
        doc.setFont("helvetica", "bold");
        doc.text(cert.user.full_name || "Étudiant LSFCONNECT", pageWidth / 2, 85, { align: "center" });

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.setFont("helvetica", "normal");
        doc.text("a complété avec succès le programme de formation", pageWidth / 2, 105, { align: "center" });

        // 4. Course Title
        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        doc.text(cert.course.title, pageWidth / 2, 120, { align: "center" });

        doc.setFontSize(14);
        doc.setTextColor(148, 163, 184); // slate-400
        doc.text(`Domaine : ${cert.course.domain}`, pageWidth / 2, 130, { align: "center" });

        // 5. Decorative Seal / Logo
        doc.setDrawColor(245, 158, 11);
        doc.circle(pageWidth / 2, 160, 15, "D");
        doc.setTextColor(245, 158, 11);
        doc.setFontSize(10);
        doc.text("VERIFIED", pageWidth / 2, 161, { align: "center" });

        // 6. Dates & Sig
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.text(`Délivré le : ${new Date(cert.issued_at).toLocaleDateString()}`, 40, 185, { align: "left" });
        doc.text("ID Certificat : " + cert.id.substring(0, 8), 40, 192, { align: "left" });

        doc.text("LSFCONNECT ACADEMY", pageWidth - 40, 185, { align: "right" });
        doc.line(pageWidth - 80, 180, pageWidth - 40, 180);

        // Save
        doc.save(`Certificat_LSF_${cert.id.substring(0, 8)}.pdf`);
        setGeneratingId(null);
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
                        <p className="text-lg text-slate-500 font-medium italic mt-4">Félicitations pour votre engagement. Voici vos titres officiels.</p>
                    </div>

                    <div className="bg-amber-500/10 px-8 py-6 rounded-[3rem] border border-amber-200 flex items-center gap-6 shadow-2xl shadow-amber-200/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-700">
                            <Award className="h-12 w-12" />
                        </div>
                        <div className="w-14 h-14 bg-amber-500 text-white rounded-2xl flex items-center justify-center shadow-lg relative z-10">
                            <Trophy className="h-7 w-7" />
                        </div>
                        <div className="relative z-10">
                            <span className="block text-3xl font-black text-amber-600 leading-none mb-1">{certificates.length}</span>
                            <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] italic leading-none">Réussites</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {certificates.map((cert) => (
                    <Card key={cert.id} className="group rounded-[3rem] border-none shadow-2xl shadow-slate-200/30 overflow-hidden bg-white hover:shadow-amber-200/40 transition-all duration-700 hover:-translate-y-4">
                        <div className="h-56 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />

                            <div className="absolute inset-0 flex items-center justify-center">
                                <Award className="h-24 w-24 text-amber-400/10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700" />
                            </div>

                            <div className="absolute top-8 right-8">
                                <div className="p-2 bg-amber-400 rounded-xl shadow-lg shadow-amber-400/20 animate-pulse">
                                    <ShieldCheck className="h-5 w-5 text-slate-900" />
                                </div>
                            </div>

                            <div className="absolute bottom-8 left-8 flex flex-col gap-1">
                                <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest italic">{cert.course.domain}</span>
                                <h3 className="text-xl font-black text-white italic uppercase tracking-tighter leading-tight drop-shadow-md">
                                    {cert.course.title}
                                </h3>
                            </div>
                        </div>

                        <CardContent className="p-10 space-y-8 relative bg-white">
                            <div className="absolute -top-12 right-10">
                                <div className="w-20 h-20 rounded-[2rem] bg-white shadow-2xl flex items-center justify-center border border-slate-50 relative group/icon">
                                    <div className="absolute inset-1 bg-amber-50 rounded-[1.8rem] opacity-0 group-hover/icon:opacity-100 transition-opacity duration-500" />
                                    <BookOpen className="h-8 w-8 text-primary relative z-10" />
                                </div>
                            </div>

                            <div className="flex items-center gap-6 py-4 border-y border-slate-50">
                                <div className="flex flex-col items-center flex-1 border-r border-slate-50">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Délivré</span>
                                    <span className="text-xs font-black text-slate-900">{new Date(cert.issued_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' })}</span>
                                </div>
                                <div className="flex flex-col items-center flex-1">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Statut</span>
                                    <div className="flex items-center gap-1.5 text-green-500">
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        <span className="text-xs font-black">ACTIF</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <Button
                                    onClick={() => downloadPDF(cert)}
                                    disabled={generatingId === cert.id}
                                    className="h-16 rounded-[2rem] bg-slate-900 shadow-2xl font-black uppercase tracking-widest text-[10px] gap-3 hover:-translate-y-1 transition-all"
                                >
                                    {generatingId === cert.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                                    Télécharger le PDF Officiel
                                </Button>
                                <Button variant="ghost" className="h-14 rounded-2xl font-black uppercase tracking-widest text-[9px] gap-2 text-slate-400 hover:text-primary hover:bg-primary/5">
                                    <Share2 className="h-4 w-4" />
                                    Partager sur LinkedIn
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {certificates.length === 0 && (
                    <div className="col-span-full py-32 flex flex-col items-center justify-center text-center space-y-8 bg-slate-50/20 rounded-[4rem] border-4 border-dashed border-slate-100">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 blur-[40px] rounded-full animate-pulse" />
                            <div className="w-28 h-28 bg-white rounded-[2.5rem] shadow-2xl flex items-center justify-center relative z-10 border border-slate-50">
                                <Award className="h-14 w-14 text-slate-200" />
                            </div>
                        </div>
                        <div className="space-y-4 px-6">
                            <h3 className="text-3xl font-black text-slate-900 italic uppercase">En quête de gloire ?</h3>
                            <p className="text-slate-500 font-medium italic max-w-sm mx-auto">Terminez vos modules pour débloquer des certificats certifiés par l'Academy.</p>
                        </div>
                        <Button asChild className="h-16 px-12 rounded-[2rem] bg-primary shadow-2xl shadow-primary/20 font-black uppercase tracking-widest text-xs">
                            <Link href="/dashboard/user/courses">Lancer un Cours</Link>
                        </Button>
                    </div>
                )}
            </div>

            {/* LinkedIn-like "Add to profile" section */}
            <section className="mt-20 p-12 rounded-[3.5rem] bg-slate-50 border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8 group hover:bg-white hover:shadow-3xl transition-all duration-700">
                <div className="space-y-3 text-center md:text-left">
                    <h3 className="text-2xl font-black text-slate-900 italic uppercase">Valorisez vos compétences</h3>
                    <p className="text-slate-500 font-medium italic max-w-md">Ajoutez vos certificats LSFCONNECT à votre profil professionnel pour booster votre employabilité.</p>
                </div>
                <Button className="h-16 px-10 rounded-[2rem] bg-blue-600 text-white font-black uppercase tracking-widest text-[10px] gap-3">
                    <Sparkles className="h-4 w-4 fill-white" />
                    Intégré LinkedIn
                </Button>
            </section>
        </div>
    );
}
