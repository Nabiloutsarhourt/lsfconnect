"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Shield, Globe, Mail, Bell,
    Smartphone, Lock, Palette,
    Save, Loader2, Info, CheckCircle2, Zap
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminSettingsPage() {
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => {
            setSaving(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        }, 1500);
    };

    return (
        <div className="container py-10 space-y-12 animate-in fade-in duration-700">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">
                        Paramètres <span className="text-primary not-italic">Plateforme</span>
                    </h1>
                    <p className="text-slate-500 font-medium italic">Configurez le branding, la sécurité et la conformité GDPR.</p>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] gap-3 px-8 shadow-xl shadow-primary/20"
                >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                    {saving ? "Sauvegarde..." : saved ? "Sauvegardé" : "Enregistrer"}
                </Button>
            </div>

            <Tabs defaultValue="branding" className="space-y-8">
                <TabsList className="bg-slate-100 p-1 rounded-2xl border border-slate-200 h-auto grid grid-cols-2 md:inline-flex w-full md:w-auto">
                    {[
                        { id: "branding", label: "Branding", icon: Palette },
                        { id: "emails", label: "Emails", icon: Mail },
                        { id: "security", label: "Sécurité", icon: Shield },
                        { id: "gdpr", label: "GDPR", icon: Lock },
                    ].map((tab) => (
                        <TabsTrigger
                            key={tab.id}
                            value={tab.id}
                            className="rounded-xl px-8 py-3 font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-lg"
                        >
                            <tab.icon className="h-4 w-4 mr-2" />
                            {tab.label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <TabsContent value="branding" className="space-y-6">
                    <Card className="rounded-[3rem] border-none shadow-2xl bg-white overflow-hidden">
                        <CardHeader className="p-10 pb-6 border-b border-slate-50">
                            <CardTitle className="text-xl font-black text-slate-900 leading-none mb-1">Identité Visuelle</CardTitle>
                            <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400">Logos, couleurs et typographies.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-10 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nom de la Plateforme</Label>
                                    <Input defaultValue="InterPro Learning" className="h-14 rounded-2xl border-slate-100 font-bold italic text-slate-900" />
                                </div>
                                <div className="space-y-4">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Couleur Primaire</Label>
                                    <div className="flex items-center gap-3">
                                        <div className="h-14 w-14 rounded-2xl bg-primary shadow-inner border-4 border-white" />
                                        <Input defaultValue="#7c3aed" className="h-14 rounded-2xl border-slate-100 font-mono text-xs font-bold" />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description Meta (SEO)</Label>
                                <Textarea className="rounded-2xl border-slate-100 font-medium italic min-h-[100px]" placeholder="Entrez la description SEO..." />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security" className="space-y-6">
                    <Card className="rounded-[3rem] border-none shadow-2xl bg-white overflow-hidden">
                        <CardHeader className="p-10 pb-6 border-b border-slate-50">
                            <CardTitle className="text-xl font-black text-slate-900 leading-none mb-1">Politiques de Sécurité</CardTitle>
                            <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400">Rate-limiting, Sessions et CSRF.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-10 space-y-8">
                            {[
                                { title: "Rate Limiting", desc: "Empêcher les attaques par force brute sur les formulaires d'auth.", icon: Zap },
                                { title: "Session Persistance", desc: "Maintenir les sessions utilisateurs pendant 30 jours.", icon: Smartphone },
                                { title: "Audit Trail", desc: "Enregistrer toutes les modifications CRUD par les admins.", icon: Shield },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between group">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                                            <item.icon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-900 text-sm leading-none mb-1">{item.title}</p>
                                            <p className="text-xs text-slate-400 font-medium italic">{item.desc}</p>
                                        </div>
                                    </div>
                                    <Switch defaultChecked className="data-[state=checked]:bg-primary" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="gdpr" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="rounded-[3rem] border-none shadow-2xl bg-white p-10 space-y-6">
                            <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center gap-4">
                                <Lock className="h-6 w-6 text-primary" />
                                <span className="text-[10px] font-black uppercase tracking-widest italic">Conformité France / EU</span>
                            </div>
                            <h3 className="text-xl font-black text-slate-900">Droit à l'oubli</h3>
                            <p className="text-slate-500 font-medium italic italic leading-relaxed text-sm">
                                Permettre aux utilisateurs de supprimer définitivement leur compte et leurs données personnelles en un clic.
                            </p>
                            <Button variant="outline" className="w-full h-14 rounded-2xl border-slate-100 font-black uppercase text-[10px] tracking-widest">
                                Configurer l'Auto-suppression
                            </Button>
                        </Card>

                        <Card className="rounded-[3rem] border-none shadow-2xl bg-slate-50 p-10 space-y-6 border border-slate-100">
                            <div className="p-4 rounded-2xl bg-white flex items-center gap-4 shadow-sm">
                                <Info className="h-6 w-6 text-primary" />
                                <span className="text-[10px] font-black uppercase tracking-widest italic">Exportation de Données</span>
                            </div>
                            <h3 className="text-xl font-black text-slate-900">Portabilité GDPR</h3>
                            <p className="text-slate-500 font-medium italic leading-relaxed text-sm">
                                Générer un fichier JSON contenant toutes les informations stockées sur l'utilisateur pour exportation.
                            </p>
                            <Button className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black uppercase text-[10px] tracking-widest shadow-xl">
                                Test de Génération JSON
                            </Button>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
