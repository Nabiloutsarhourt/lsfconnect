"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Palette, Upload, Save,
    Settings2, Globe, Sparkles,
    Link2, Mail, Phone,
    CheckCircle2, Loader2, Image as ImageIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminBrandingPage() {
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        }, 1500);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.3em] text-[10px]">
                        <Palette className="h-4 w-4" />
                        Identité Visuelle
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 italic uppercase leading-none tracking-tighter">
                        Personnalisation <span className="text-primary not-italic">de la Plateforme</span>
                    </h1>
                </div>

                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="h-14 px-10 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest text-xs gap-3 shadow-2xl transition-all hover:-translate-y-1"
                >
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : (saved ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />)}
                    {saved ? "Modifications Enregistrées" : "Enregistrer les Changements"}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* General Settings */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="rounded-[2.5rem] border-none shadow-2xl bg-white overflow-hidden">
                        <CardHeader className="p-10 border-b border-slate-50 bg-slate-50/30">
                            <CardTitle className="text-lg font-black uppercase italic text-slate-900 flex items-center gap-3">
                                <Settings2 className="h-5 w-5 text-primary" />
                                Informations Générales
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-10 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nom du Site</Label>
                                    <Input defaultValue="LSFCONNECT" className="h-14 rounded-xl border-slate-100 font-bold italic" />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tagline (Hero)</Label>
                                    <Input defaultValue="La Puissance de la LSF Entre Vos Mains" className="h-14 rounded-xl border-slate-100 font-bold italic" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description Méta (SEO)</Label>
                                <Textarea
                                    defaultValue="Plateforme de réservation d'interprètes et d'experts LSF en temps réel pour tous vos besoins."
                                    className="min-h-[120px] rounded-2xl border-slate-100 font-medium italic resize-none"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[2.5rem] border-none shadow-2xl bg-white overflow-hidden">
                        <CardHeader className="p-10 border-b border-slate-50 bg-slate-50/30">
                            <CardTitle className="text-lg font-black uppercase italic text-slate-900 flex items-center gap-3">
                                <ImageIcon className="h-5 w-5 text-primary" />
                                Assets Graphiques
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-4">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Logo Principal</Label>
                                    <div className="aspect-video rounded-[2rem] border-4 border-dashed border-slate-100 bg-slate-50 flex flex-col items-center justify-center gap-4 group cursor-pointer hover:bg-white hover:border-primary/20 transition-all">
                                        <Upload className="h-8 w-8 text-slate-300 group-hover:text-primary transition-colors" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Click to Upload</span>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Favicon (1:1)</Label>
                                    <div className="w-40 h-40 rounded-[2rem] border-4 border-dashed border-slate-100 bg-slate-50 flex flex-col items-center justify-center gap-4 group cursor-pointer hover:bg-white hover:border-primary/20 transition-all mx-auto md:mx-0">
                                        <Upload className="h-6 w-6 text-slate-300 group-hover:text-primary transition-colors" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Controls */}
                <div className="space-y-8">
                    <Card className="rounded-[2.5rem] border-none shadow-2xl bg-slate-900 text-white overflow-hidden">
                        <div className="p-10 space-y-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/20 rounded-xl text-primary">
                                    <Sparkles className="h-5 w-5 fill-current" />
                                </div>
                                <h3 className="text-lg font-black uppercase italic leading-none">Global Palette</h3>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-40">Couleur Primaire</Label>
                                    <div className="flex gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-primary border-4 border-white/10" />
                                        <Input defaultValue="#7c3aed" className="bg-white/5 border-white/10 text-white font-mono uppercase h-12" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-40">Couleur Accent</Label>
                                    <div className="flex gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-blue-500 border-4 border-white/10" />
                                        <Input defaultValue="#3b82f6" className="bg-white/5 border-white/10 text-white font-mono uppercase h-12" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="rounded-[2.5rem] border-none shadow-2xl bg-white overflow-hidden">
                        <CardHeader className="p-8 border-b border-slate-50">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">Support Client</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input defaultValue="support@lsfconnect.fr" className="pl-12 h-12 rounded-xl border-slate-100 text-xs font-bold" />
                                </div>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input defaultValue="+33 1 23 45 67 89" className="pl-12 h-12 rounded-xl border-slate-100 text-xs font-bold" />
                                </div>
                                <div className="relative">
                                    <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input defaultValue="https://lsfconnect.fr/help" className="pl-12 h-12 rounded-xl border-slate-100 text-xs font-bold" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="p-8 bg-primary/5 rounded-[2rem] border border-primary/10 flex gap-4">
                        <Globe className="h-6 w-6 text-primary shrink-0" />
                        <p className="text-[10px] font-bold italic text-primary leading-relaxed">
                            Les modifications de branding s'appliquent en temps réel sur toutes les sessions utilisateurs connectées via-Supabase Realtime.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
