"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import {
    ChevronLeft, CheckCircle2, XCircle, AlertCircle,
    HelpCircle, Trophy, RefreshCw, ArrowRight, Loader2, Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { CaseStudyExercise } from "@/components/exercises/CaseStudyExercise";
import { awardPoints } from "@/lib/gamification";
import { checkCourseCompletion } from "@/lib/lms";

export default function StudentQuizPage() {
    const { id: courseId, lessonId } = useParams();
    const router = useRouter();
    const supabase = createClient();

    const [loading, setLoading] = useState(true);
    const [exercise, setExercise] = useState<any>(null);
    const [lesson, setLesson] = useState<any>(null);
    const [questions, setQuestions] = useState<any[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const fetchData = useCallback(async () => {
        // Fetch lesson for video context
        const { data: lessonData } = await supabase
            .from("lessons")
            .select("*")
            .eq("id", lessonId)
            .single();
        if (lessonData) setLesson(lessonData);

        const { data: exerciseData } = await supabase
            .from("exercises")
            .select("*")
            .eq("lesson_id", lessonId)
            .single();

        if (exerciseData) {
            setExercise(exerciseData);
            if (exerciseData.type === 'mcq') {
                const { data: questionData } = await supabase
                    .from("questions")
                    .select("*")
                    .eq("exercise_id", exerciseData.id)
                    .order("order", { ascending: true });
                if (questionData) setQuestions(questionData);
            }
        }
        setLoading(false);
    }, [lessonId, supabase]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleNext = async () => {
        const currentQuestion = questions[currentQuestionIndex];
        if (currentQuestion.options[selectedOption!].isCorrect) {
            setScore(prev => prev + 1);
        }

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedOption(null);
        } else {
            await submitResults();
        }
    };

    const submitResults = async () => {
        setSubmitting(true);
        const finalScore = (questions[currentQuestionIndex].options[selectedOption!].isCorrect ? score + 1 : score);
        const percentage = Math.round((finalScore / questions.length) * 100);
        const passed = percentage >= (exercise?.passing_score || 80);

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            await supabase.from("exercise_attempts").insert({
                user_id: user.id,
                exercise_id: exercise.id,
                score: percentage,
                is_passed: passed
            });

            // If passed, mark lesson as progress completed too
            if (passed) {
                await supabase.from("user_progress").upsert({
                    user_id: user.id,
                    lesson_id: lessonId,
                    is_completed: true,
                    completed_at: new Date().toISOString()
                });

                // Award Gamification Points
                const isPerfect = percentage === 100;
                await awardPoints(user.id, isPerfect ? 'QUIZ_PERFECT' : 'QUIZ_PASS');

                // Check for course completion and issue certificate
                await checkCourseCompletion(user.id, courseId as string);
            }
        }

        setShowResult(true);
        setSubmitting(false);
    };

    const resetQuiz = () => {
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setScore(0);
        setShowResult(false);
    };

    const handleCaseStudyComplete = async (answers: { interpretation: string }) => {
        setSubmitting(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            await supabase.from("case_study_submissions").insert({
                user_id: user.id,
                exercise_id: exercise.id,
                content: answers.interpretation,
                status: 'pending'
            });

            // We don't mark lesson as completed for case studies until an admin reviews it
            // but we show the specialized results view
            setShowResult(true);
        }
        setSubmitting(false);
    };

    if (loading) return <div className="p-20 text-center animate-pulse">Chargement de l'exercice...</div>;
    if (!exercise) return <div className="p-20 text-center">Aucun exercice trouvé pour cette leçon.</div>;

    // Specialized render for Case Study type
    if (exercise.type === 'case_study') {
        return (
            <div className="container py-12">
                <div className="mb-12 flex items-center justify-between">
                    <Button variant="ghost" asChild className="rounded-xl hover:bg-white border border-transparent hover:border-slate-100">
                        <Link href={`/dashboard/user/courses/${courseId}/lessons/${lessonId}`} className="flex items-center gap-2 font-bold uppercase tracking-widest text-[10px] text-slate-400">
                            <ChevronLeft className="h-4 w-4" />
                            Quitter l'étude
                        </Link>
                    </Button>
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Session d'Étude Interactive</span>
                    </div>
                </div>

                <CaseStudyExercise
                    exerciseId={exercise.id}
                    title={exercise.title}
                    videoUrl={lesson?.video_url}
                    onComplete={handleCaseStudyComplete}
                />
            </div>
        );
    }

    if (questions.length === 0) return <div className="p-20 text-center">Aucune question dans ce quiz.</div>;

    if (showResult) {
        // Result view for MCQ
        if (exercise.type === 'mcq') {
            const finalPercentage = Math.round((score / questions.length) * 100);
            const passed = finalPercentage >= (exercise?.passing_score || 80);

            return (
                <div className="max-w-xl mx-auto py-20 animate-in zoom-in-95 duration-700">
                    <Card className="rounded-[3rem] border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden bg-white text-center">
                        <div className={cn(
                            "p-12 space-y-6",
                            passed ? "bg-green-50/50" : "bg-red-50/50"
                        )}>
                            <div className={cn(
                                "w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto shadow-xl",
                                passed ? "bg-green-500 text-white shadow-green-200" : "bg-red-500 text-white shadow-red-200"
                            )}>
                                {passed ? <Trophy className="h-12 w-12" /> : <AlertCircle className="h-12 w-12" />}
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                                    {passed ? "Félicitations !" : "Encore un effort !"}
                                </h2>
                                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
                                    {passed ? "Vous avez validé cette leçon" : "Vous n'avez pas atteint le score requis"}
                                </p>
                            </div>
                        </div>

                        <CardContent className="p-12 space-y-8">
                            <div className="flex items-center justify-center gap-12">
                                <div className="text-center">
                                    <span className="block text-4xl font-black text-slate-900">{finalPercentage}%</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Score Final</span>
                                </div>
                                <div className="w-px h-12 bg-slate-100" />
                                <div className="text-center">
                                    <span className="block text-4xl font-black text-slate-900">{score}/{questions.length}</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Questions</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {passed ? (
                                    <Button asChild className="w-full h-16 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 gap-3">
                                        <Link href={`/dashboard/user/courses/${courseId}`}>
                                            Retour au programme
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                ) : (
                                    <Button onClick={resetQuiz} className="w-full h-16 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 gap-3">
                                        Réessayer le quiz
                                        <RefreshCw className="h-4 w-4" />
                                    </Button>
                                )}
                                <Button variant="ghost" asChild className="w-full h-12 rounded-xl border border-slate-100 font-bold text-slate-400">
                                    <Link href={`/dashboard/user/courses/${courseId}/lessons/${lessonId}`}>
                                        Revoir la leçon
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            );
        }

        // Result view for Case Study (Success redirection)
        return (
            <div className="max-w-xl mx-auto py-20 animate-in zoom-in-95 duration-700">
                <Card className="rounded-[3rem] border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden bg-white text-center">
                    <div className="p-12 space-y-6 bg-primary/5">
                        <div className="w-24 h-24 rounded-[2rem] bg-primary text-white flex items-center justify-center mx-auto shadow-xl shadow-primary/20">
                            <Sparkles className="h-10 w-10 fill-current" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">Analyse Soumise</h2>
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Attente de correction experte</p>
                        </div>
                    </div>
                    <CardContent className="p-12 space-y-6 text-slate-500 font-medium italic italic leading-relaxed">
                        <p>Votre étude de cas a été transmise à notre équipe pédagogique. Vous recevrez une notification dès que votre note aura été validée.</p>
                        <Button asChild className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] gap-2">
                            <Link href={`/dashboard/user/courses/${courseId}`}>
                                Retour à la formation
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="max-w-2xl mx-auto py-12 space-y-8 animate-in slide-in-from-bottom-8 duration-1000">
            <div className="flex items-center justify-between text-slate-400">
                <Button variant="ghost" size="sm" asChild className="rounded-xl hover:bg-white border border-transparent hover:border-slate-100">
                    <Link href={`/dashboard/user/courses/${courseId}/lessons/${lessonId}`} className="flex items-center gap-2 font-bold uppercase tracking-widest text-[10px]">
                        <ChevronLeft className="h-4 w-4" />
                        Quitter le Quiz
                    </Link>
                </Button>
                <div className="text-[10px] font-black uppercase tracking-widest underline underline-offset-8 decoration-primary decoration-4">
                    Question {currentQuestionIndex + 1} / {questions.length}
                </div>
            </div>

            <div className="space-y-8">
                <div className="relative p-1">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-[3rem] blur-2xl opacity-50" />
                    <Card className="rounded-[3rem] border-none shadow-2xl overflow-hidden bg-white relative">
                        <CardHeader className="p-10 pb-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-primary/10 rounded-xl text-primary">
                                    <HelpCircle className="h-5 w-5" />
                                </div>
                                <span className="text-[10px] font-black text-primary uppercase tracking-widest">Evaluation</span>
                            </div>
                            <CardTitle className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
                                {currentQuestion.content}
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="p-10 pt-0 space-y-3">
                            {currentQuestion.options.map((option: any, idx: number) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedOption(idx)}
                                    className={cn(
                                        "w-full flex items-center justify-between p-6 rounded-2xl border-2 transition-all text-left group",
                                        selectedOption === idx
                                            ? "bg-primary border-primary text-primary-foreground shadow-xl shadow-primary/20 scale-[1.02]"
                                            : "bg-white border-slate-50 hover:border-primary/20 hover:bg-slate-50/50"
                                    )}
                                >
                                    <span className="font-bold text-lg">{option.text}</span>
                                    <div className={cn(
                                        "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                                        selectedOption === idx
                                            ? "bg-white border-white text-primary"
                                            : "border-slate-200 group-hover:border-primary/40"
                                    )}>
                                        {selectedOption === idx && <CheckCircle2 className="h-4 w-4 fill-current" />}
                                    </div>
                                </button>
                            ))}
                        </CardContent>

                        <CardFooter className="p-10 pt-0">
                            <Button
                                onClick={handleNext}
                                disabled={selectedOption === null || submitting}
                                className="w-full h-16 rounded-2xl font-black uppercase tracking-widest text-xs gap-3 shadow-xl shadow-primary/20group"
                            >
                                {submitting ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <>
                                        {currentQuestionIndex === questions.length - 1 ? "Terminer le Quiz" : "Question Suivante"}
                                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>

                <div className="px-10 flex gap-1 h-1">
                    {questions.map((_, idx) => (
                        <div
                            key={idx}
                            className={cn(
                                "flex-1 rounded-full transition-all duration-500",
                                idx <= currentQuestionIndex ? "bg-primary" : "bg-slate-100"
                            )}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
