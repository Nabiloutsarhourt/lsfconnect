"use client";

import { useState } from "react";
import { LSFVideoPlayer } from "@/components/ui-custom/LSFVideoPlayer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
    Send, Info, AlertCircle,
    CheckCircle2, Loader2, Sparkles,
    MessageSquareQuote
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CaseStudyExerciseProps {
    exerciseId: string;
    title: string;
    videoUrl?: string;
    instructions?: string;
    onComplete: (answers: { interpretation: string }) => Promise<void>;
}

export function CaseStudyExercise({
    exerciseId,
    title,
    videoUrl,
    instructions,
    onComplete
}: CaseStudyExerciseProps) {
    const [interpretation, setInterpretation] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async () => {
        if (!interpretation.trim()) return;

        setIsSubmitting(true);
        try {
            await onComplete({ interpretation });
            setIsSubmitted(true);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <Card className="rounded-[3rem] border-none shadow-2xl bg-white overflow-hidden animate-in zoom-in-95 duration-500">
                <CardContent className="p-16 flex flex-col items-center text-center gap-8">
                    <div className="w-24 h-24 bg-green-50 rounded-[2rem] flex items-center justify-center text-green-500 shadow-inner">
                        <CheckCircle2 className="h-12 w-12" />
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-3xl font-black text-slate-900 uppercase italic">Étude envoyée !</h2>
                        <p className="text-slate-500 font-medium italic max-w-sm mx-auto">
                            Votre interprétation a été soumise avec succès. Un expert LSF certifié va maintenant procéder à la correction manuelle.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Observation Area */}
            <div className="space-y-8">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px]">
                        <Sparkles className="h-4 w-4 fill-primary/20" />
                        Phase d'Observation
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">
                        {title}
                    </h2>
                </div>

                <LSFVideoPlayer
                    src={videoUrl || ""}
                    title={title}
                    hasLSFInterpretation={false}
                    className="shadow-3xl border-8 border-white rounded-[2.5rem]"
                />

                <Card className="rounded-3xl border-slate-100 bg-slate-50/50 shadow-sm overflow-hidden">
                    <CardContent className="p-6 flex gap-4">
                        <div className="p-2 bg-blue-100 rounded-xl text-blue-600 h-fit">
                            <Info className="h-4 w-4" />
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Instructions</h4>
                            <p className="text-xs text-slate-500 font-medium italic leading-relaxed">
                                {instructions || "Regardez attentivement cette mise en situation. Identifiez les configurations manuelles clés et saisissez votre proposition d'interprétation dans le champ ci-contre."}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Interpretation Area */}
            <div className="flex flex-col gap-8">
                <div className="flex-1 flex flex-col gap-6">
                    <div className="flex items-center gap-2 text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">
                        <MessageSquareQuote className="h-4 w-4" />
                        Votre Proposition
                    </div>

                    <div className="relative flex-1 flex flex-col">
                        <Textarea
                            placeholder="Saisissez votre interprétation ici..."
                            className="flex-1 min-h-[300px] rounded-[2rem] border-slate-100 p-8 shadow-inner text-slate-700 font-medium italic focus-visible:ring-primary/20 transition-all text-lg resize-none"
                            value={interpretation}
                            onChange={(e) => setInterpretation(e.target.value)}
                        />
                        <div className="absolute top-6 right-6 p-2 bg-slate-50/50 rounded-lg text-slate-300">
                            <Languages className="h-4 w-4" />
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-slate-900 rounded-[2rem] text-white flex items-center justify-between shadow-2xl">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-xl">
                            <AlertCircle className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-80">
                            Correction manuelle requise
                        </span>
                    </div>

                    <Button
                        onClick={handleSubmit}
                        disabled={!interpretation.trim() || isSubmitting}
                        className="h-12 px-8 rounded-xl bg-primary text-white font-black uppercase tracking-widest text-[10px] gap-2 hover:-translate-y-1 transition-all"
                    >
                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 fill-current" />}
                        Soumettre l'étude
                    </Button>
                </div>
            </div>
        </div>
    );
}

function Languages({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("lucide lucide-languages", className)}>
            <path d="m5 8 6 6" /><path d="m4 14 6-6 2-3" /><path d="M2 5h12" /><path d="M7 2h1" /><path d="m22 22-5-10-5 10" /><path d="M14 18h6" />
        </svg>
    )
}
