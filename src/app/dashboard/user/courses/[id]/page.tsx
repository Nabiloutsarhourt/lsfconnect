"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    ChevronLeft, Play, Lock, CheckCircle2, Video,
    FileText, Trophy, Clock, BookOpen, ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Episode {
    id: string;
    title: string;
    order: number;
    video_url: string | null;
    pdf_url: string | null;
    is_completed?: boolean;
}

interface Module {
    id: string;
    title: string;
    order: number;
    lessons: Episode[];
}

export default function StudentCourseDetailPage() {
    const { id } = useParams();
    const supabase = createClient();
    const [course, setCourse] = useState<any>(null);
    const [modules, setModules] = useState<Module[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: courseData } = await supabase
            .from("courses")
            .select("*")
            .eq("id", id)
            .single();

        if (courseData) setCourse(courseData);

        const { data: moduleData } = await supabase
            .from("modules")
            .select(`
        *,
        lessons(
          *,
          user_progress(is_completed)
        )
      `)
            .eq("course_id", id)
            .order("order", { ascending: true })
            .order("order", { foreignTable: "lessons", ascending: true });

        if (moduleData) {
            setModules(moduleData.map((m: any) => ({
                ...m,
                lessons: m.lessons.map((l: any) => ({
                    ...l,
                    is_completed: l.user_progress?.[0]?.is_completed || false
                }))
            })));

            // Auto-issue certificate if 100% complete
            if (courseData) {
                let total = 0;
                let done = 0;
                moduleData.forEach((m: any) => {
                    m.lessons?.forEach((l: any) => {
                        total++;
                        if (l.user_progress?.[0]?.is_completed) done++;
                    });
                });

                if (total > 0 && total === done) {
                    const { data: cert } = await supabase
                        .from("certificates")
                        .select("id")
                        .eq("user_id", user.id)
                        .eq("course_id", id)
                        .single();

                    if (!cert) {
                        await supabase.from("certificates").insert({
                            user_id: user.id,
                            course_id: id,
                            issued_at: new Date().toISOString()
                        });
                    }
                }
            }
        }
        setLoading(false);
    }, [id, supabase]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (loading) return <div className="p-20 text-center animate-pulse">Chargement du programme...</div>;
    if (!course) return <div className="p-20 text-center">Cours non trouvé.</div>;

    const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
    const completedLessons = modules.reduce((acc, m) => acc + m.lessons.filter(l => l.is_completed).length, 0);
    const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    return (
        <div className="space-y-12 animate-in fade-in duration-1000 pb-20">
            <div className="flex flex-col md:flex-row gap-12">
                <div className="flex-1 space-y-8">
                    <div className="space-y-6">
                        <Button variant="ghost" size="sm" asChild className="rounded-xl border border-slate-100 bg-white hover:-translate-x-1 transition-all">
                            <Link href="/dashboard/user/courses" className="flex items-center gap-2 font-bold text-slate-400">
                                <ChevronLeft className="h-4 w-4" />
                                Retour à mes cours
                            </Link>
                        </Button>
                        <div className="space-y-4">
                            <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                                {course.domain}
                            </span>
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight">
                                {course.title}
                            </h1>
                            <p className="text-lg text-slate-500 font-medium leading-relaxed italic max-w-2xl">
                                {course.description || "Aucune description fournie pour ce programme."}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Programme de la formation</h2>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{completedLessons} / {totalLessons} Leçons</span>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {modules.map((module) => (
                                <div key={module.id} className="space-y-4">
                                    <h3 className="text-sm font-black text-primary uppercase tracking-[0.2em] ml-2 flex items-center gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                        {module.title}
                                    </h3>
                                    <div className="space-y-3">
                                        {module.lessons.map((lesson) => (
                                            <Link
                                                key={lesson.id}
                                                href={`/dashboard/user/courses/${id}/lessons/${lesson.id}`}
                                                className="block"
                                            >
                                                <div className={cn(
                                                    "flex items-center justify-between p-5 rounded-[1.5rem] border transition-all group",
                                                    lesson.is_completed
                                                        ? "bg-green-50/30 border-green-100 opacity-80"
                                                        : "bg-white border-slate-100 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
                                                )}>
                                                    <div className="flex items-center gap-5">
                                                        <div className={cn(
                                                            "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                                                            lesson.is_completed
                                                                ? "bg-green-100 text-green-600"
                                                                : "bg-slate-50 text-slate-400 group-hover:bg-primary group-hover:text-primary-foreground"
                                                        )}>
                                                            {lesson.is_completed ? <CheckCircle2 className="h-6 w-6" /> : <Play className="h-5 w-5 fill-current" />}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-slate-800">{lesson.title}</h4>
                                                            <div className="flex items-center gap-3 mt-1">
                                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                                                    <Video className="h-3 w-3" /> Vidéo LSF
                                                                </span>
                                                                {lesson.pdf_url && (
                                                                    <>
                                                                        <span className="text-slate-200">•</span>
                                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                                                            <FileText className="h-3 w-3" /> PDF
                                                                        </span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <ArrowRight className="h-5 w-5 text-slate-200 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="md:w-96 space-y-8">
                    <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-slate-200/50 p-8 space-y-8 sticky top-8">
                        <div className="space-y-4">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Votre Progression</h3>
                            <div className="h-20 w-20 flex items-center justify-center rounded-3xl bg-slate-50 border border-slate-100">
                                <span className="text-2xl font-black text-primary">{progressPercent}%</span>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                                    <Clock className="h-4 w-4 text-primary" />
                                    <span>Durée estimée : {totalLessons * 15} min</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                                    <Trophy className="h-4 w-4 text-amber-400" />
                                    <span>Certificat à l'issue</span>
                                </div>
                            </div>

                            <Button className="w-full h-16 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 gap-3 group">
                                {progressPercent === 0 ? "Commencer le cours" : "Reprendre la lecture"}
                                <Play className="h-4 w-4 fill-current group-hover:scale-110 transition-transform" />
                            </Button>
                        </div>

                        {progressPercent === 100 && (
                            <div className="p-6 bg-green-50 border border-green-100 rounded-3xl space-y-4">
                                <div className="flex items-center gap-3 text-green-700">
                                    <Trophy className="h-5 w-5" />
                                    <span className="font-black text-xs uppercase tracking-widest">Félicitations !</span>
                                </div>
                                <p className="text-xs font-medium text-green-600/80 leading-relaxed">
                                    Vous avez terminé ce programme. Votre certificat est désormais disponible dans votre profil.
                                </p>
                                <Button variant="outline" asChild className="w-full h-12 rounded-xl border-green-200 text-green-700 hover:bg-green-100 font-black uppercase tracking-widest text-[10px]">
                                    <Link href="/dashboard/user/certificates">Voir mon certificat</Link>
                                </Button>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}
