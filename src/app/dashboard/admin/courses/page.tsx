"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, BookOpen, Video, FileText, MoreVertical, Edit, Trash, Globe, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Course {
    id: string;
    title: string;
    description: string;
    domain: string;
    is_published: boolean;
    created_at: string;
}

export default function AdminCoursesPage() {
    const supabase = createClient();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCourses() {
            const { data, error } = await supabase
                .from("courses")
                .select("*")
                .order("created_at", { ascending: false });

            if (data) setCourses(data);
            setLoading(false);
        }
        fetchCourses();
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Gestion des Cours</h1>
                    <p className="text-muted-foreground font-medium text-sm mt-1">Créez et gérez vos programmes pédagogiques LSF.</p>
                </div>
                <Button asChild className="h-12 px-6 rounded-2xl shadow-xl shadow-primary/20 font-bold gap-2">
                    <Link href="/dashboard/admin/courses/new">
                        <Plus className="h-5 w-5" />
                        Nouveau Cours
                    </Link>
                </Button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-64 rounded-3xl bg-slate-100 animate-pulse" />
                    ))}
                </div>
            ) : courses.length === 0 ? (
                <Card className="border-dashed border-2 py-20 flex flex-col items-center justify-center text-center bg-slate-50/50 rounded-3xl">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                        <BookOpen className="h-10 w-10 text-slate-300" />
                    </div>
                    <CardTitle className="text-xl font-bold">Aucun cours pour le moment</CardTitle>
                    <CardDescription className="max-w-xs mt-2 font-medium">
                        Commencez par créer votre premier module de formation pour la communauté LSF.
                    </CardDescription>
                    <Button asChild variant="outline" className="mt-8 rounded-xl h-12 font-bold px-8">
                        <Link href="/dashboard/admin/courses/new">Créer mon premier cours</Link>
                    </Button>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <Card key={course.id} className="group overflow-hidden rounded-3xl border-slate-200 transition-all hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1">
                            <div className="h-40 bg-slate-100 relative overflow-hidden">
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <span className={cn(
                                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-sm",
                                        course.is_published ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                                    )}>
                                        {course.is_published ? (
                                            <>
                                                <Globe className="h-3 w-3" />
                                                Publié
                                            </>
                                        ) : (
                                            <>
                                                <Lock className="h-3 w-3" />
                                                Brouillon
                                            </>
                                        )}
                                    </span>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity">
                                    <BookOpen className="h-24 w-24 text-primary" />
                                </div>
                            </div>
                            <CardHeader className="p-6">
                                <div className="text-[10px] font-extrabold text-primary uppercase tracking-[0.2em] mb-2">{course.domain}</div>
                                <CardTitle className="text-lg font-bold leading-tight group-hover:text-primary transition-colors">
                                    {course.title}
                                </CardTitle>
                                <CardDescription className="line-clamp-2 text-sm font-medium mt-2 leading-relaxed">
                                    {course.description || "Aucune description fournie."}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 pt-0 flex items-center gap-4 text-slate-400">
                                <div className="flex items-center gap-1.5 text-xs font-bold">
                                    <Video className="h-4 w-4" />
                                    <span>8 Leçons</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs font-bold">
                                    <FileText className="h-4 w-4" />
                                    <span>2 Quiz</span>
                                </div>
                            </CardContent>
                            <div className="p-4 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
                                <Button variant="ghost" size="sm" asChild className="font-bold text-xs rounded-lg hover:bg-white transition-all">
                                    <Link href={`/dashboard/admin/courses/${course.id}`}>Gérer le contenu</Link>
                                </Button>
                                <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-white text-slate-400 hover:text-primary">
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-white text-slate-400 hover:text-destructive">
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
