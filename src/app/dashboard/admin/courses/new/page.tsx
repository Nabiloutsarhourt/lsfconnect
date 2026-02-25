"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { ChevronLeft, Save, Loader2, BookOpen, Layers } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const DOMAINS = ["Judicial", "Medical", "Commercial", "Social"];

export default function NewCoursePage() {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        domain: "Judicial",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();

            const { data, error } = await supabase
                .from("courses")
                .insert({
                    ...formData,
                    instructor_id: user?.id,
                    is_published: false,
                })
                .select()
                .single();

            if (error) throw error;
            if (data) {
                router.push(`/dashboard/admin/courses/${data.id}`);
            }
        } catch (err: any) {
            console.error("Error creating course:", err);
            alert("Erreur lors de la création du cours.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild className="rounded-full h-10 w-10 border border-slate-200 hover:bg-white shadow-sm transition-all active:scale-95">
                    <Link href="/dashboard/admin/courses">
                        <ChevronLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">Nouveau Programme</h1>
            </div>

            <form onSubmit={handleSubmit}>
                <Card className="rounded-3xl shadow-2xl border-slate-200 overflow-hidden">
                    <div className="bg-primary/5 p-8 flex items-center gap-6 border-b border-slate-100">
                        <div className="w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20 rotate-3">
                            <BookOpen className="h-8 w-8" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold leading-tight">Détails du Cours</h2>
                            <p className="text-xs font-bold text-primary/60 uppercase tracking-widest mt-1">Étape 1 : Configuration initiale</p>
                        </div>
                    </div>

                    <CardContent className="p-8 space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Titre du Programme</label>
                            <Input
                                required
                                placeholder="Ex : Introduction au Droit de la Famille en LSF"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="h-14 rounded-xl border-slate-200 font-bold focus:ring-primary/20 text-lg transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Domaine LSF</label>
                                <div className="grid grid-cols-1 gap-2">
                                    {DOMAINS.map((domain) => (
                                        <button
                                            key={domain}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, domain })}
                                            className={cn(
                                                "h-12 rounded-xl flex items-center px-4 font-bold text-sm border-2 transition-all active:scale-[0.98]",
                                                formData.domain === domain
                                                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/10"
                                                    : "bg-white text-slate-400 border-slate-100 hover:border-slate-300"
                                            )}
                                        >
                                            {domain}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col gap-4">
                                    <div className="flex items-center gap-3">
                                        <Layers className="h-5 w-5 text-primary" />
                                        <span className="text-sm font-extrabold uppercase tracking-tight">Status initial</span>
                                    </div>
                                    <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                                        Votre cours sera créé en mode <span className="font-bold text-amber-600">Brouillon</span>.
                                        Vous pourrez ajouter des modules et des leçons avant de le publier.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Description (Optionnel)</label>
                            <textarea
                                rows={4}
                                placeholder="Décrivez les objectifs pédagogiques et les compétences visées..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full rounded-xl border-slate-200 p-4 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all border outline-none"
                            />
                        </div>
                    </CardContent>

                    <CardFooter className="p-8 bg-slate-50/50 flex justify-end">
                        <Button
                            type="submit"
                            disabled={loading || !formData.title}
                            className="h-14 px-10 rounded-2xl shadow-xl shadow-primary/20 font-black uppercase tracking-widest gap-3 transition-all active:scale-95"
                        >
                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                            Créer le Programme
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}
