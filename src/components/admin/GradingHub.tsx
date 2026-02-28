"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
    CheckCircle2, Clock, AlertCircle,
    Search, Filter, GraduationCap,
    MessageSquare, Star, Send,
    ChevronRight, ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";

type Submission = {
    id: string;
    content: string;
    grade: number | null;
    feedback: string | null;
    status: 'pending' | 'graded';
    created_at: string;
    exercise: { title: string };
    profiles: { full_name: string; email: string };
};

export function GradingHub() {
    const supabase = createClient();
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
    const [isGrading, setIsGrading] = useState(false);
    const [grade, setGrade] = useState("");
    const [feedback, setFeedback] = useState("");

    const fetchSubmissions = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('case_study_submissions')
            .select(`
        *,
        exercise:exercises(title),
        profiles:user_id(full_name, email)
      `)
            .order('created_at', { ascending: false });

        if (data) setSubmissions(data as any);
        setLoading(false);
    };

    useEffect(() => { fetchSubmissions(); }, []);

    const handleGrade = async () => {
        if (!selectedSubmission || !grade) return;
        setIsGrading(true);

        const { error } = await supabase
            .from('case_study_submissions')
            .update({
                grade: parseInt(grade),
                feedback,
                status: 'graded',
                graded_by: (await supabase.auth.getUser()).data.user?.id
            })
            .eq('id', selectedSubmission.id);

        if (!error) {
            setSelectedSubmission(null);
            fetchSubmissions();
        }
        setIsGrading(false);
    };

    const filtered = submissions.filter(s =>
        s.profiles.full_name.toLowerCase().includes(search.toLowerCase()) ||
        s.exercise.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-10 animate-in fade-in duration-1000">

            {/* Header Controls */}
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Rechercher un élève ou exercice..."
                        className="pl-12 rounded-2xl border-slate-100 bg-white/50 backdrop-blur-xl focus:bg-white transition-all h-12"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3">
                    <Badge variant="outline" className="px-4 py-2 rounded-xl bg-amber-50 text-amber-600 border-amber-100 font-bold gap-2">
                        <Clock className="h-3 w-3" />
                        {submissions.filter(s => s.status === 'pending').length} En attente
                    </Badge>
                    <Badge variant="outline" className="px-4 py-2 rounded-xl bg-green-50 text-green-600 border-green-100 font-bold gap-2">
                        <CheckCircle2 className="h-3 w-3" />
                        {submissions.filter(s => s.status === 'graded').length} Corrigés
                    </Badge>
                </div>
            </div>

            {/* Submissions List */}
            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    Array(3).fill(0).map((_, i) => <div key={i} className="h-32 bg-slate-100 rounded-[2rem] animate-pulse" />)
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                        <AlertCircle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500 font-bold italic">Aucune soumission trouvée.</p>
                    </div>
                ) : filtered.map((sub) => (
                    <Card key={sub.id} className="group rounded-[2.5rem] border-none shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all bg-white overflow-hidden">
                        <CardContent className="p-8 flex items-center gap-6">
                            <div className={cn(
                                "h-16 w-16 rounded-2xl flex items-center justify-center shrink-0 shadow-inner",
                                sub.status === 'pending' ? "bg-amber-50 text-amber-500" : "bg-green-50 text-green-500"
                            )}>
                                <GraduationCap className="h-8 w-8" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-black text-slate-900 truncate">{sub.profiles.full_name}</h4>
                                    {sub.status === 'graded' && <Badge className="bg-green-500/10 text-green-600 border-none font-black text-[9px] uppercase tracking-widest">{sub.grade}/100</Badge>}
                                </div>
                                <p className="text-xs font-bold text-slate-400 flex items-center gap-2">
                                    <span className="truncate">{sub.exercise.title}</span>
                                    <span className="h-1 w-1 rounded-full bg-slate-300" />
                                    <span className="whitespace-nowrap italic">{new Date(sub.created_at).toLocaleDateString()}</span>
                                </p>
                            </div>

                            <Button
                                onClick={() => {
                                    setSelectedSubmission(sub);
                                    setGrade(sub.grade?.toString() || "");
                                    setFeedback(sub.feedback || "");
                                }}
                                variant="ghost"
                                className="rounded-2xl h-14 px-6 font-black uppercase tracking-widest text-[10px] gap-3 bg-slate-50 hover:bg-primary hover:text-white transition-all group-hover:pl-8"
                            >
                                {sub.status === 'pending' ? 'Corriger' : 'Voir'}
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Grading Modal */}
            <Dialog open={!!selectedSubmission} onOpenChange={(open) => !open && setSelectedSubmission(null)}>
                <DialogContent className="max-w-4xl rounded-[3rem] border-none shadow-3xl p-0 overflow-hidden bg-slate-50">
                    {selectedSubmission && (
                        <>
                            <div className="bg-slate-900 p-10 text-white relative">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-32 -mt-32" />
                                <DialogHeader className="relative items-start">
                                    <Badge className="bg-primary/20 text-primary border-none font-black text-[10px] uppercase tracking-[0.2em] mb-4">Étude de Cas</Badge>
                                    <DialogTitle className="text-3xl font-black italic uppercase leading-tight tracking-tighter">
                                        Correction de <span className="text-primary not-italic">{selectedSubmission.profiles.full_name}</span>
                                    </DialogTitle>
                                    <DialogDescription className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-2 italic">
                                        {selectedSubmission.exercise.title}
                                    </DialogDescription>
                                </DialogHeader>
                            </div>

                            <div className="p-10 space-y-10 max-h-[60vh] overflow-y-auto custom-scrollbar">
                                <section className="space-y-4">
                                    <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2 leading-none">
                                        <MessageSquare className="h-3 w-3" /> Réponse de l'élève
                                    </h5>
                                    <div className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-inner font-medium text-slate-700 leading-relaxed whitespace-pre-wrap">
                                        {selectedSubmission.content}
                                    </div>
                                </section>

                                <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                                    <section className="md:col-span-3 space-y-4">
                                        <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2 leading-none">
                                            <Star className="h-3 w-3" /> Note / 100
                                        </h5>
                                        <Input
                                            type="number"
                                            min="0"
                                            max="100"
                                            placeholder="85"
                                            className="h-20 rounded-2xl text-3xl font-black text-center border-2 border-slate-100 focus:border-primary focus:ring-primary/20 transition-all bg-white"
                                            value={grade}
                                            onChange={(e) => setGrade(e.target.value)}
                                            disabled={selectedSubmission.status === 'graded'}
                                        />
                                    </section>
                                    <section className="md:col-span-9 space-y-4">
                                        <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2 leading-none">
                                            <MessageSquare className="h-3 w-3" /> Feedback pédagogique
                                        </h5>
                                        <textarea
                                            placeholder="Excellent travail, attention à la structure..."
                                            className="w-full h-40 p-6 rounded-3xl bg-white border-2 border-slate-100 focus:border-primary focus:ring-primary/20 transition-all font-medium text-slate-700 text-sm resize-none outline-none shadow-sm"
                                            value={feedback}
                                            onChange={(e) => setFeedback(e.target.value)}
                                            disabled={selectedSubmission.status === 'graded'}
                                        />
                                    </section>
                                </div>
                            </div>

                            <DialogFooter className="p-8 bg-white border-t border-slate-100">
                                <div className="flex items-center gap-4 w-full justify-between">
                                    <Button variant="ghost" className="rounded-xl font-black uppercase text-[10px] tracking-widest gap-2" onClick={() => setSelectedSubmission(null)}>
                                        <ArrowLeft className="h-4 w-4" /> Abandonner
                                    </Button>
                                    {selectedSubmission.status === 'pending' && (
                                        <Button
                                            onClick={handleGrade}
                                            disabled={isGrading || !grade}
                                            className="h-14 px-10 rounded-2xl bg-slate-900 hover:bg-primary font-black uppercase tracking-[0.2em] text-[10px] gap-3 transition-all"
                                        >
                                            {isGrading ? <Clock className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                            Publier la correction
                                        </Button>
                                    )}
                                </div>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
