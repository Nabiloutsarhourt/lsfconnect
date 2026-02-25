"use client";

import { useState, useEffect } from "react";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Video, FileText, Save, Loader2, BookOpen } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface LessonModalProps {
    isOpen: boolean;
    onClose: () => void;
    moduleId: string;
    lesson?: any; // If provided, we are editing
    onSuccess: () => void;
}

export function LessonModal({ isOpen, onClose, moduleId, lesson, onSuccess }: LessonModalProps) {
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        video_url: "",
        pdf_url: "",
    });

    useEffect(() => {
        if (lesson) {
            setFormData({
                title: lesson.title || "",
                content: lesson.content || "",
                video_url: lesson.video_url || "",
                pdf_url: lesson.pdf_url || "",
            });
        } else {
            setFormData({
                title: "",
                content: "",
                video_url: "",
                pdf_url: "",
            });
        }
    }, [lesson, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (lesson) {
                const { error } = await supabase
                    .from("lessons")
                    .update(formData)
                    .eq("id", lesson.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from("lessons")
                    .insert({
                        ...formData,
                        module_id: moduleId,
                        order: 0, // Should be calculated
                    });
                if (error) throw error;
            }
            onSuccess();
            onClose();
        } catch (err: any) {
            console.error("Error saving lesson:", err);
            alert("Erreur lors de l'enregistrement de la leçon.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
                <DialogHeader className="bg-primary/5 p-8 border-b border-slate-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary text-primary-foreground rounded-2xl shadow-lg shadow-primary/20 rotate-3">
                            <BookOpen className="h-6 w-6" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">
                                {lesson ? "Modifier la Leçon" : "Nouvelle Leçon"}
                            </DialogTitle>
                            <DialogDescription className="text-xs font-bold text-primary/60 uppercase tracking-widest mt-1">
                                Configurez le contenu pédagogique et les supports
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Titre de la leçon</Label>
                            <Input
                                required
                                placeholder="Ex : Les bases de la syntaxe LSF"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="h-12 rounded-xl border-slate-200 font-bold focus:ring-primary/20"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Contenu / Instructions</Label>
                            <Textarea
                                placeholder="Description de la leçon ou contenu pédagogique..."
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                className="min-h-[120px] rounded-xl border-slate-200 font-medium text-sm focus:ring-primary/20"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Vidéo LSF (URL)</Label>
                                <div className="relative">
                                    <Input
                                        placeholder="https://supabase.co/..."
                                        value={formData.video_url}
                                        onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                                        className="h-12 rounded-xl border-slate-200 pl-10 font-medium text-xs focus:ring-primary/20"
                                    />
                                    <Video className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Support PDF (URL)</Label>
                                <div className="relative">
                                    <Input
                                        placeholder="Lien vers le document..."
                                        value={formData.pdf_url}
                                        onChange={(e) => setFormData({ ...formData, pdf_url: e.target.value })}
                                        className="h-12 rounded-xl border-slate-200 pl-10 font-medium text-xs focus:ring-primary/20"
                                    />
                                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="bg-slate-50/50 -mx-8 -mb-8 p-8 border-t border-slate-100 flex items-center justify-between">
                        <Button variant="ghost" type="button" onClick={onClose} className="rounded-xl font-bold h-12 px-6">
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading || !formData.title}
                            className="h-12 px-8 rounded-xl shadow-xl shadow-primary/20 font-black uppercase tracking-widest text-xs gap-3 active:scale-95 transition-all"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            {lesson ? "Mettre à jour" : "Enregistrer la leçon"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
