"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import {
    ChevronLeft, Plus, Trash, Edit, Save, Loader2,
    HelpCircle, CheckCircle, XCircle, AlertCircle, ListTodo
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Exercise {
    id: string;
    title: string;
    type: string;
    passing_score: number;
}

interface Question {
    id: string;
    content: string;
    options: any[];
    order: number;
}

export default function ExerciseManagementPage() {
    const { id: courseId, lessonId } = useParams();
    const supabase = createClient();
    const router = useRouter();

    const [lesson, setLesson] = useState<any>(null);
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const fetchData = useCallback(async () => {
        const { data: lessonData } = await supabase
            .from("lessons")
            .select("*, modules(course_id)")
            .eq("id", lessonId)
            .single();

        if (lessonData) setLesson(lessonData);

        const { data: exerciseData } = await supabase
            .from("exercises")
            .select("*")
            .eq("lesson_id", lessonId);

        if (exerciseData && exerciseData.length > 0) {
            setExercises(exerciseData);
            const { data: questionData } = await supabase
                .from("questions")
                .select("*")
                .eq("exercise_id", exerciseData[0].id)
                .order("order", { ascending: true });
            if (questionData) setQuestions(questionData);
        } else {
            // Auto-create an exercise if none exists for simplicity in this demo
            const { data: newEx } = await supabase
                .from("exercises")
                .insert({ lesson_id: lessonId, title: "Quiz de fin de leçon", type: "mcq", passing_score: 80 })
                .select()
                .single();
            if (newEx) setExercises([newEx]);
        }
        setLoading(false);
    }, [lessonId, supabase]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAddQuestion = () => {
        const newQuestion: Question = {
            id: `new-${Date.now()}`,
            content: "",
            options: [
                { id: 1, text: "", isCorrect: true },
                { id: 2, text: "", isCorrect: false },
            ],
            order: questions.length,
        };
        setQuestions([...questions, newQuestion]);
    };

    const handleUpdateQuestion = (id: string, updates: Partial<Question>) => {
        setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q));
    };

    const handleSave = async () => {
        if (exercises.length === 0) return;
        setSaving(true);
        try {
            const exerciseId = exercises[0].id;

            // Delete old questions (simplified logic for demo)
            await supabase.from("questions").delete().eq("exercise_id", exerciseId);

            // Insert new questions
            const formattedQuestions = questions.map((q, idx) => ({
                exercise_id: exerciseId,
                content: q.content,
                options: q.options,
                order: idx
            }));

            const { error } = await supabase.from("questions").insert(formattedQuestions);
            if (error) throw error;

            alert("Quiz enregistré avec succès !");
            router.push(`/dashboard/admin/courses/${courseId}`);
        } catch (err) {
            console.error(err);
            alert("Erreur lors de l'enregistrement.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-20 text-center animate-pulse">Chargement du Quiz...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-700 pb-20">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild className="rounded-full h-10 w-10 border border-slate-200 hover:bg-white shadow-sm transition-all active:scale-95">
                        <Link href={`/dashboard/admin/courses/${courseId}`}>
                            <ChevronLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">Gestion du Quiz</h1>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Leçon : {lesson?.title}</p>
                    </div>
                </div>
                <Button onClick={handleSave} disabled={saving} className="h-12 px-8 rounded-xl shadow-xl shadow-primary/20 font-black uppercase tracking-widest text-xs gap-3 active:scale-95 transition-all">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Enregistrer le Quiz
                </Button>
            </div>

            <div className="space-y-6">
                {questions.length === 0 ? (
                    <Card className="border-dashed border-2 py-20 flex flex-col items-center justify-center text-center bg-slate-50/50 rounded-3xl">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 rotate-6">
                            <ListTodo className="h-8 w-8 text-slate-300" />
                        </div>
                        <CardTitle className="text-xl font-bold italic text-slate-400">Aucune question pour le moment</CardTitle>
                        <Button onClick={handleAddQuestion} variant="outline" className="mt-8 rounded-xl h-12 font-bold px-8 border-primary text-primary hover:bg-primary/5">
                            Ajouter ma première question
                        </Button>
                    </Card>
                ) : (
                    questions.map((q, idx) => (
                        <Card key={q.id} className="rounded-3xl border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                            <CardHeader className="p-8 pb-0 flex flex-row items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-xs font-black">
                                        {idx + 1}
                                    </span>
                                    <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">Question</CardTitle>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setQuestions(questions.filter(item => item.id !== q.id))}
                                    className="h-8 w-8 text-slate-300 hover:text-destructive rounded-lg"
                                >
                                    <Trash className="h-4 w-4" />
                                </Button>
                            </CardHeader>
                            <CardContent className="p-8 space-y-6">
                                <Input
                                    placeholder="Quelle est la signification de ce signe ?"
                                    value={q.content}
                                    onChange={(e) => handleUpdateQuestion(q.id, { content: e.target.value })}
                                    className="h-14 rounded-xl border-slate-200 font-bold text-lg focus:ring-primary/20"
                                />

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Options de réponse</label>
                                    {q.options.map((option: any, optIdx: number) => (
                                        <div key={optIdx} className="flex items-center gap-3 group">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newOptions = q.options.map((o: any, i: number) => ({
                                                        ...o,
                                                        isCorrect: i === optIdx
                                                    }));
                                                    handleUpdateQuestion(q.id, { options: newOptions });
                                                }}
                                                className={cn(
                                                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-95",
                                                    option.isCorrect ? "bg-green-100 text-green-600" : "bg-slate-50 text-slate-300 hover:bg-slate-100"
                                                )}
                                            >
                                                {option.isCorrect ? <CheckCircle className="h-5 w-5" /> : <HelpCircle className="h-5 w-5" />}
                                            </button>
                                            <Input
                                                placeholder={`Option ${optIdx + 1}`}
                                                value={option.text}
                                                onChange={(e) => {
                                                    const newOptions = [...q.options];
                                                    newOptions[optIdx].text = e.target.value;
                                                    handleUpdateQuestion(q.id, { options: newOptions });
                                                }}
                                                className={cn(
                                                    "h-12 rounded-xl border-slate-100 font-bold transition-all",
                                                    option.isCorrect ? "bg-green-50/50 border-green-100" : "bg-white"
                                                )}
                                            />
                                            {q.options.length > 2 && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => {
                                                        const newOptions = q.options.filter((_: any, i: number) => i !== optIdx);
                                                        handleUpdateQuestion(q.id, { options: newOptions });
                                                    }}
                                                    className="h-8 w-8 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Trash className="h-3.5 w-3.5" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                    <Button
                                        variant="ghost"
                                        onClick={() => {
                                            const newOptions = [...q.options, { id: q.options.length + 1, text: "", isCorrect: false }];
                                            handleUpdateQuestion(q.id, { options: newOptions });
                                        }}
                                        className="h-10 rounded-xl font-bold text-xs text-primary/60 hover:text-primary gap-2"
                                    >
                                        <Plus className="h-3.5 w-3.5" />
                                        Ajouter une option
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}

                <Button
                    onClick={handleAddQuestion}
                    className="w-full h-20 border-2 border-dashed border-primary/20 bg-primary/5 text-primary rounded-[2rem] font-black text-xl hover:bg-primary/10 hover:border-primary/40 transition-all gap-4 shadow-xl shadow-primary/5"
                >
                    <Plus className="h-8 w-8" />
                    Ajouter une Question
                </Button>
            </div>
        </div>
    );
}
