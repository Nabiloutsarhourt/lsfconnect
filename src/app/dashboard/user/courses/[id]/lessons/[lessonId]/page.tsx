"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    ChevronLeft, ChevronRight, PlayCircle, CheckCircle2,
    Video, FileText, ListTodo, MoreHorizontal, BookOpen,
    Loader2, ArrowRight, Download, Lock
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { getSubscriptionStatus } from "@/lib/subscription";
import { LSFVideoPlayer } from "@/components/ui-custom/LSFVideoPlayer";

export default function LessonViewerPage() {
    const { id: courseId, lessonId } = useParams();
    const router = useRouter();
    const supabase = createClient();

    const [lesson, setLesson] = useState<any>(null);
    const [modules, setModules] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [markingComplete, setMarkingComplete] = useState(false);
    const [hasQuiz, setHasQuiz] = useState(false);
    const [isPro, setIsPro] = useState(false);

    const fetchData = useCallback(async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Check sub first
        const { isPro: proStatus } = await getSubscriptionStatus(supabase);
        setIsPro(proStatus);

        // Fetch lesson details + user progress
        const { data: lessonData } = await supabase
            .from("lessons")
            .select(`
        *,
        user_progress(is_completed)
      `)
            .eq("id", lessonId)
            .single();

        if (lessonData) {
            setLesson({
                ...lessonData,
                is_completed: !!lessonData.user_progress?.[0]?.is_completed
            });
        }

        // Fetch exercises for this lesson
        const { data: exercises } = await supabase
            .from("exercises")
            .select("id")
            .eq("lesson_id", lessonId);
        setHasQuiz(!!(exercises && exercises.length > 0));

        // Fetch curriculum for sidebar
        const { data: curriculum } = await supabase
            .from("modules")
            .select(`
        *,
        lessons(
          id, title, order,
          user_progress(is_completed)
        )
      `)
            .eq("course_id", courseId)
            .order("order", { ascending: true })
            .order("order", { foreignTable: "lessons", ascending: true });

        if (curriculum) {
            setModules(curriculum.map((m: any) => ({
                ...m,
                lessons: m.lessons.map((l: any) => ({
                    ...l,
                    is_completed: !!l.user_progress?.[0]?.is_completed
                }))
            })));
        }
        setLoading(false);
    }, [courseId, lessonId, supabase]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const toggleComplete = async () => {
        setMarkingComplete(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        try {
            if (lesson.is_completed) {
                await supabase.from("user_progress").delete().eq("user_id", user.id).eq("lesson_id", lessonId);
            } else {
                await supabase.from("user_progress").upsert({
                    user_id: user.id,
                    lesson_id: lessonId,
                    is_completed: true,
                    completed_at: new Date().toISOString()
                });
            }
            setLesson({ ...lesson, is_completed: !lesson.is_completed });
            fetchData(); // Refresh sidebar progress
        } catch (err) {
            console.error(err);
        } finally {
            setMarkingComplete(false);
        }
    };

    if (loading) return <div className="p-20 text-center animate-pulse">Chargement de la leçon...</div>;
    if (!lesson) return <div className="p-20 text-center">Leçon non trouvée.</div>;

    if (!isPro) {
        return (
            <div className="container py-20 animate-in fade-in duration-700">
                <Card className="max-w-xl mx-auto rounded-[3rem] border-none shadow-2xl overflow-hidden bg-white text-center p-12 space-y-8">
                    <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto text-primary">
                        <Lock className="h-10 w-10" />
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Contenu Premium</h2>
                        <p className="text-slate-500 font-medium leading-relaxed italic">
                            Cette leçon est réservée aux membres <span className="text-primary font-black">LSFCONNECT Pro</span>. Rejoignez notre communauté pour débloquer l'accès complet.
                        </p>
                    </div>
                    <Button asChild className="w-full h-16 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 gap-3">
                        <Link href="/pricing">
                            Voir les abonnements
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                    <Button variant="ghost" asChild className="w-full h-12 rounded-xl text-slate-400 font-bold">
                        <Link href={`/dashboard/user/courses/${courseId}`}>
                            Retour au programme
                        </Link>
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-100px)] -m-4 overflow-hidden bg-slate-50">
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-0 bg-white">
                {/* Top Header */}
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild className="rounded-full h-10 w-10 border border-slate-100 hover:bg-slate-50">
                            <Link href={`/dashboard/user/courses/${courseId}`}>
                                <ChevronLeft className="h-5 w-5" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-xl font-black text-slate-900 tracking-tight">{lesson.title}</h1>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Leçon en cours</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant={lesson.is_completed ? "outline" : "default"}
                            onClick={toggleComplete}
                            disabled={markingComplete}
                            className={cn(
                                "h-11 rounded-xl font-black uppercase tracking-widest text-[10px] gap-2 px-6",
                                lesson.is_completed ? "border-green-200 text-green-700 hover:bg-green-50" : "shadow-lg shadow-primary/20"
                            )}
                        >
                            {markingComplete ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className={cn("h-4 w-4", lesson.is_completed && "fill-current")} />}
                            {lesson.is_completed ? "Terminé" : "Marquer comme fini"}
                        </Button>

                        {hasQuiz && (
                            <Button variant="secondary" asChild className="h-11 rounded-xl font-black uppercase tracking-widest text-[10px] gap-2 px-6">
                                <Link href={`/dashboard/user/courses/${courseId}/lessons/${lessonId}/quiz`}>
                                    <ListTodo className="h-4 w-4" />
                                    Passer le Quiz
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>

                {/* Video Player */}
                <div className="flex-1 bg-slate-950 relative overflow-hidden group flex flex-col items-center justify-center p-4">
                    {lesson.video_url ? (
                        <LSFVideoPlayer
                            src={lesson.video_url}
                            title={lesson.title}
                            hasLSFInterpretation={true}
                            className="max-h-full w-auto max-w-full aspect-video shadow-2xl"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-900 border-4 border-dashed border-slate-800 rounded-[2rem]">
                            <div className="text-center space-y-4">
                                <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center mx-auto border border-slate-700">
                                    <Video className="h-10 w-10 text-slate-500" />
                                </div>
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Aucune vidéo LSF disponible</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Content Tabs / Info */}
                <div className="p-8 border-t border-slate-100 bg-white">
                    <div className="flex flex-col md:flex-row items-start justify-between gap-12">
                        <div className="flex-1 space-y-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-primary">
                                    <BookOpen className="h-5 w-5" />
                                    <h2 className="text-sm font-black uppercase tracking-widest">Guide d'Apprentissage</h2>
                                </div>
                                <p className="text-slate-600 text-lg font-medium leading-relaxed italic max-w-3xl">
                                    {lesson.content || "Suivez attentivement cette leçon vidéo pour maîtriser les concepts clés de ce module. Prenez le temps d'observer chaque signe et utilisez les contrôles de vitesse pour un apprentissage optimal."}
                                </p>
                            </div>

                            {/* Resource Section */}
                            <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white rounded-lg shadow-sm">
                                            <FileText className="h-4 w-4 text-slate-400" />
                                        </div>
                                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Matériel de cours</h3>
                                    </div>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">1.2 MB . PDF</span>
                                </div>

                                <p className="text-xs text-slate-500 font-medium italic">
                                    Téléchargez le support de cours complet incluant le lexique illustré et les schémas de configuration manuelle.
                                </p>

                                <div className="flex gap-4">
                                    {lesson.pdf_url ? (
                                        <Button asChild variant="outline" className="h-12 rounded-xl bg-white border-slate-200 font-black uppercase tracking-widest text-[9px] gap-2 px-6 shadow-sm hover:border-primary hover:text-primary transition-all">
                                            <a href={lesson.pdf_url} download target="_blank" rel="noopener noreferrer">
                                                <Download className="h-4 w-4" />
                                                Télécharger le PDF
                                            </a>
                                        </Button>
                                    ) : (
                                        <Button disabled variant="outline" className="h-12 rounded-xl bg-white border-slate-200 opacity-50 font-black uppercase tracking-widest text-[9px] gap-2 px-6">
                                            <Download className="h-4 w-4" />
                                            PDF non disponible
                                        </Button>
                                    )}
                                    <Button variant="ghost" className="h-12 rounded-xl font-black uppercase tracking-widest text-[9px] text-slate-400">
                                        Voir en ligne
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sidebar Curriculum */}
            <div className="w-full lg:w-[400px] border-l border-slate-100 bg-white flex flex-col h-full shadow-2xl overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Contenu du cours</h3>
                    <span className="text-[10px] font-bold text-primary uppercase bg-primary/10 px-3 py-1 rounded-full">Explorer</span>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-8 pb-20">
                    {modules.map((m: any) => (
                        <div key={m.id} className="space-y-4">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">{m.title}</h4>
                            <div className="space-y-2">
                                {m.lessons.map((l: any) => (
                                    <Link
                                        key={l.id}
                                        href={`/dashboard/user/courses/${courseId}/lessons/${l.id}`}
                                        className={cn(
                                            "flex items-center gap-4 p-4 rounded-2xl transition-all border",
                                            l.id === lessonId
                                                ? "bg-primary text-primary-foreground border-primary shadow-xl shadow-primary/20 scale-[1.02]"
                                                : "bg-white text-slate-600 border-slate-50 hover:border-slate-200 hover:bg-slate-50/50"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                                            l.id === lessonId ? "bg-white/20" : l.is_completed ? "bg-green-100 text-green-600" : "bg-slate-100"
                                        )}>
                                            {l.is_completed ? <CheckCircle2 className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold leading-tight truncate">{l.title}</p>
                                            <p className={cn(
                                                "text-[9px] font-bold uppercase tracking-widest mt-1 opacity-60",
                                                l.id === lessonId ? "text-white" : "text-slate-400"
                                            )}>15 minutes</p>
                                        </div>
                                        {l.id === lessonId && <ArrowRight className="h-4 w-4" />}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
