"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save, Upload, Video, FileText, CheckCircle2 } from "lucide-react";

export default function ExpertSettingsPage() {
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [expertData, setExpertData] = useState<any>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        async function fetchSettings() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase
                    .from("experts")
                    .select("*")
                    .eq("id", user.id)
                    .single();
                setExpertData(data);
            }
            setLoading(false);
        }
        fetchSettings();
    }, []);

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);
        setSuccess(false);

        const formData = new FormData(e.currentTarget);
        const updates = {
            bio: formData.get("bio"),
            hourly_rate: parseFloat(formData.get("hourly_rate") as string),
            specialties: (formData.get("specialties") as string).split(",").map(s => s.trim()),
        };

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { error } = await supabase
                .from("experts")
                .update(updates)
                .eq("id", user.id);

            if (!error) setSuccess(true);
        }
        setSaving(false);
    };

    if (loading) return <div className="container py-20 text-center">Chargement...</div>;

    return (
        <div className="container py-12 max-w-4xl space-y-12">
            <div>
                <h1 className="text-4xl font-extrabold tracking-tight">Paramètres du Profil</h1>
                <p className="text-muted-foreground text-lg">Gérez vos informations publiques et vos certifications.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Navigation Latérale */}
                <div className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start font-bold text-primary bg-primary/5">Informations de base</Button>
                    <Button variant="ghost" className="w-full justify-start font-medium text-muted-foreground">Disponibilités</Button>
                    <Button variant="ghost" className="w-full justify-start font-medium text-muted-foreground">Documents & Vidéo</Button>
                    <Button variant="ghost" className="w-full justify-start font-medium text-muted-foreground">Paiements (Stripe)</Button>
                </div>

                {/* Formulaire Principal */}
                <div className="md:col-span-2 space-y-8">
                    <form onSubmit={handleSave}>
                        <Card className="shadow-lg border-primary/10 rounded-2xl">
                            <CardHeader>
                                <CardTitle>Biographie & Expertise</CardTitle>
                                <CardDescription>Ces informations seront visibles par les clients sur votre profil public.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {success && (
                                    <div className="p-4 bg-green-50 text-green-700 rounded-xl flex items-center gap-3 border border-green-100 font-medium">
                                        <CheckCircle2 className="h-5 w-5" />
                                        Profil mis à jour avec succès !
                                    </div>
                                )}

                                <div className="grid gap-2">
                                    <label className="text-sm font-bold" htmlFor="bio">Biographie LSF</label>
                                    <textarea
                                        id="bio"
                                        name="bio"
                                        defaultValue={expertData?.bio}
                                        rows={4}
                                        placeholder="Présentez votre parcours et votre expérience..."
                                        className="flex min-h-[100px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <label className="text-sm font-bold" htmlFor="hourly_rate">Tarif Horaire (€)</label>
                                        <input
                                            id="hourly_rate"
                                            name="hourly_rate"
                                            type="number"
                                            defaultValue={expertData?.hourly_rate}
                                            className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <label className="text-sm font-bold" htmlFor="specialties">Spécialités (séparées par des virgules)</label>
                                        <input
                                            id="specialties"
                                            name="specialties"
                                            type="text"
                                            defaultValue={expertData?.specialties?.join(", ")}
                                            placeholder="Médical, Juridique..."
                                            className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="bg-slate-50/50 p-6 flex justify-end">
                                <Button type="submit" disabled={saving} className="font-extrabold h-11 px-8">
                                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                    Enregistrer les modifications
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>

                    {/* Section Vidéo & Documents */}
                    <Card className="shadow-lg border-primary/10 rounded-2xl">
                        <CardHeader>
                            <CardTitle>Médias & Certifications</CardTitle>
                            <CardDescription>Téléchargez vos preuves de compétences pour être vérifié.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-4">
                                <div className="p-6 border-2 border-dashed rounded-2xl flex flex-col items-center gap-2 hover:bg-slate-50 transition-colors cursor-pointer group">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                        <Video className="h-6 w-6" />
                                    </div>
                                    <p className="font-bold">Vidéo de présentation LSF</p>
                                    <p className="text-xs text-muted-foreground">Formats acceptés : MP4, MOV. Max 50MB.</p>
                                    <Button variant="outline" size="sm" className="mt-2">Choisir un fichier</Button>
                                </div>

                                <div className="p-6 border-2 border-dashed rounded-2xl flex flex-col items-center gap-2 hover:bg-slate-50 transition-colors cursor-pointer group">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                        <FileText className="h-6 w-6" />
                                    </div>
                                    <p className="font-bold">Certificat de qualification</p>
                                    <p className="text-xs text-muted-foreground">Formats acceptés : PDF, JPG. Max 5MB.</p>
                                    <Button variant="outline" size="sm" className="mt-2">Choisir un fichier</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
