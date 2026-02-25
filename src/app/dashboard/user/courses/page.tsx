"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    BookOpen, PlayCircle, Trophy, Clock, CheckCircle2,
    ChevronRight, Layout, Star, GraduationCap, ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface CourseWithProgress {
    id: string;
    title: string;
    description: string;
    domain: string;
    is_published: boolean;
    progress?: number;
}

export default function UserCoursesPage() {
    const supabase = createClient();
    const [courses, setCourses] = useState<CourseWithProgress[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: coursesData } = await supabase
                .from("courses")
                .select(`
          *,
          modules(
            lessons(
              id,
              user_progress(is_completed)
            )
          )
        `)
                .eq("is_published", true);

            if (coursesData) {
                const formatted = coursesData.map(course => {
                    let totalLessons = 0;
                    let completedLessons = 0;

                    course.modules?.forEach((m: any) => {
                        m.lessons?.forEach((l: any) => {
                            totalLessons++;
                            if (l.user_progress?.[0]?.is_completed) completedLessons++;
                        });
                    });

                    return {
                        ...course,
                        progress: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
                    };
                });
                setCourses(formatted);
            }
            setLoading(false);
        }
        fetchData();
    }, [supabase]);

    if (loading) {
        return (
            <div className="container py-20">
                <div className="flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs animate-pulse">Chargement de votre académie...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-primary/10 rounded-xl text-primary">
                            <GraduationCap className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-black text-primary uppercase tracking-[0.2em]">Mon Apprentissage</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight">
                        Continuez votre <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">formation LSF</span>
                    </h1>
                </div>

                <div className="flex items-center gap-6 bg-white p-4 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                    <div className="flex flex-col items-center px-4">
                        <span className="text-2xl font-black text-slate-900">{courses.length}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cours</span>
                    </div>
                    <div className="w-px h-10 bg-slate-100" />
                    <div className="flex flex-col items-center px-4">
                        <span className="text-2xl font-black text-primary">{Math.max(0, ...courses.map(c => c.progress || 0))}%</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Max Prog.</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.map((course) => (
                    <Link key={course.id} href={`/dashboard/user/courses/${course.id}`}>
                        <Card className="group relative h-full rounded-[2.5rem] border-none shadow-2xl shadow-slate-200/60 overflow-hidden hover:-translate-y-2 transition-all duration-500 bg-white">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700">
                                <BookOpen className="h-24 w-24 text-primary" />
                            </div>

                            <CardHeader className="p-8 pb-0">
                                <div className="flex items-center justify-between mb-6">
                                    <span className="px-4 py-1.5 rounded-full bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest">
                                        {course.domain}
                                    </span>
                                    {course.progress === 100 ? (
                                        <Trophy className="h-5 w-5 text-amber-400 drop-shadow-lg" />
                                    ) : (
                                        <Clock className="h-5 w-5 text-slate-300" />
                                    )}
                                </div>
                                <CardTitle className="text-2xl font-black text-slate-900 group-hover:text-primary transition-colors leading-tight">
                                    {course.title}
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="p-8 space-y-6">
                                <CardDescription className="text-sm font-medium text-slate-500 line-clamp-2 leading-relaxed italic">
                                    {course.description || "Découvrez ce programme passionnant pour maîtriser la LSF dans le domaine " + course.domain}
                                </CardDescription>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-slate-400">Progression</span>
                                        <span className="text-primary">{course.progress}%</span>
                                    </div>
                                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-50">
                                        <div
                                            className="h-full bg-gradient-to-r from-primary to-blue-500 rounded-full transition-all duration-1000 shadow-sm"
                                            style={{ width: `${course.progress}%` }}
                                        />
                                    </div>
                                </div>
                            </CardContent>

                            <div className="p-8 pt-0 mt-auto">
                                <Button className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs gap-3 group-hover:shadow-xl group-hover:shadow-primary/20 transition-all">
                                    {course.progress === 0 ? "Commencer" : course.progress === 100 ? "Réviser" : "Continuer"}
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                        </Card>
                    </Link>
                ))}

                {courses.length === 0 && (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6 border border-slate-100">
                            <Layout className="h-10 w-10 text-slate-300" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900">Aucun cours disponible</h3>
                        <p className="text-slate-400 font-medium max-w-sm mt-2">Revenez bientôt ! Nos experts préparent de nouveaux programmes passionnants.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
