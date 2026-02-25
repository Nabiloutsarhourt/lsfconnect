"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    ChevronLeft, Plus, Video, FileText, Settings, Trash, Edit,
    GripVertical, Loader2, Globe, Eye, CheckCircle2, Layout, BookOpen, ListTodo
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { LessonModal } from "@/components/admin/LessonModal";

interface Course {
    id: string;
    title: string;
    description: string;
    domain: string;
    is_published: boolean;
}

interface Module {
    id: string;
    title: string;
    order: number;
    lessons: Lesson[];
}

interface Lesson {
    id: string;
    title: string;
    order: number;
    video_url: string | null;
    pdf_url: string | null;
}

export default function CourseDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const supabase = createClient();

    const [course, setCourse] = useState<Course | null>(null);
    const [modules, setModules] = useState<Module[]>([]);
    const [loading, setLoading] = useState(true);
    const [addingModule, setAddingModule] = useState(false);
    const [newModuleTitle, setNewModuleTitle] = useState("");

    // Lesson Modal State
    const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
    const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
    const [editingLesson, setEditingLesson] = useState<any>(null);

    const fetchData = useCallback(async () => {
        const { data: courseData } = await supabase
            .from("courses")
            .select("*")
            .eq("id", id)
            .single();

        if (courseData) setCourse(courseData);

        const { data: moduleData } = await supabase
            .from("modules")
            .select("*, lessons(*)")
            .eq("course_id", id)
            .order("order", { ascending: true })
            .order("order", { foreignTable: "lessons", ascending: true });

        if (moduleData) setModules(moduleData);
        setLoading(false);
    }, [id, supabase]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAddModule = async () => {
        if (!newModuleTitle.trim()) return;
        const { data, error } = await supabase
            .from("modules")
            .insert({
                course_id: id,
                title: newModuleTitle.trim(),
                order: modules.length
            })
            .select()
            .single();

        if (data) {
            setModules([...modules, { ...data, lessons: [] }]);
            setNewModuleTitle("");
            setAddingModule(false);
        }
    };

    const togglePublish = async () => {
        if (!course) return;
        const { error } = await supabase
            .from("courses")
            .update({ is_published: !course.is_published })
            .eq("id", id);

        if (!error) {
            setCourse({ ...course, is_published: !course.is_published });
        }
    };

    const handleDeleteModule = async (moduleId: string) => {
        if (!confirm("Voulez-vous vraiment supprimer ce module et toutes ses leçons ?")) return;
        const { error } = await supabase.from("modules").delete().eq("id", moduleId);
        if (!error) {
            setModules(modules.filter(m => m.id !== moduleId));
        }
    };

    const handleDeleteLesson = async (lessonId: string) => {
        if (!confirm("Voulez-vous vraiment supprimer cette leçon ?")) return;
        const { error } = await supabase.from("lessons").delete().eq("id", lessonId);
        if (!error) {
            setModules(modules.map(m => ({
                ...m,
                lessons: m.lessons.filter(l => l.id !== lessonId)
            })));
        }
    };

    if (loading) return <div className="container py-20 text-center animate-pulse">Chargement du programme...</div>;
    if (!course) return <div className="container py-20 text-center">Cours non trouvé.</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-1000">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <Button variant="ghost" size="icon" asChild className="rounded-full h-12 w-12 border border-slate-200 bg-white shadow-xl hover:-translate-x-1 transition-all active:scale-90">
                        <Link href="/dashboard/admin/courses">
                            <ChevronLeft className="h-6 w-6" />
                        </Link>
                    </Button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-black text-slate-900 tracking-tighter">{course.title}</h1>
                            <span className={cn(
                                "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm",
                                course.is_published ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                            )}>
                                {course.is_published ? "Public" : "Brouillon"}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs font-bold text-primary uppercase tracking-widest">{course.domain}</span>
                            <span className="text-slate-300">•</span>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Contenu Pédagogique</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-12 rounded-xl font-bold px-6 shadow-sm border-slate-200 hover:bg-slate-50 gap-2">
                        <Eye className="h-4 w-4" />
                        Aperçu
                    </Button>
                    <Button
                        variant={course.is_published ? "outline" : "default"}
                        onClick={togglePublish}
                        className={cn(
                            "h-12 rounded-xl font-extrabold px-6 gap-2 transition-all active:scale-95",
                            course.is_published ? "border-green-200 text-green-700 hover:bg-green-50" : "shadow-xl shadow-primary/20"
                        )}
                    >
                        {course.is_published ? <CheckCircle2 className="h-5 w-5" /> : <Globe className="h-5 w-5" />}
                        {course.is_published ? "Publié" : "Publier"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex flex-col gap-6">
                        {modules.map((module) => (
                            <Card key={module.id} className="rounded-3xl shadow-xl shadow-slate-200/50 border-slate-100 overflow-hidden group">
                                <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-sm text-slate-400 cursor-grab active:cursor-grabbing">
                                            <GripVertical className="h-4 w-4" />
                                        </div>
                                        <h3 className="text-lg font-black text-slate-800">{module.title}</h3>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-white text-slate-400 hover:text-primary">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDeleteModule(module.id)}
                                            className="h-9 w-9 rounded-xl hover:bg-white text-slate-400 hover:text-destructive"
                                        >
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <CardContent className="p-6">
                                    <div className="space-y-3">
                                        {module.lessons.map((lesson) => (
                                            <div key={lesson.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-white hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all group/lesson">
                                                <div className="flex items-center gap-4">
                                                    <div className={cn(
                                                        "w-10 h-10 rounded-xl flex items-center justify-center",
                                                        lesson.video_url ? "bg-primary/10 text-primary" : "bg-slate-100 text-slate-400"
                                                    )}>
                                                        {lesson.video_url ? <Video className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-bold text-slate-700">{lesson.title}</h4>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                                                            {lesson.video_url ? "Vidéo LSF" : "Document PDF"}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 opacity-0 group-hover/lesson:opacity-100 transition-opacity">
                                                    <Button variant="ghost" size="icon" asChild className="h-8 w-8 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-primary">
                                                        <Link href={`/dashboard/admin/courses/${id}/lessons/${lesson.id}/exercises`}>
                                                            <ListTodo className="h-3.5 w-3.5" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => {
                                                            setSelectedModuleId(module.id);
                                                            setEditingLesson(lesson);
                                                            setIsLessonModalOpen(true);
                                                        }}
                                                        className="h-8 w-8 rounded-lg hover:bg-slate-50"
                                                    >
                                                        <Edit className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDeleteLesson(lesson.id)}
                                                        className="h-8 w-8 rounded-lg hover:bg-slate-50 hover:text-destructive"
                                                    >
                                                        <Trash className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                        <Button
                                            variant="ghost"
                                            onClick={() => {
                                                setSelectedModuleId(module.id);
                                                setEditingLesson(null);
                                                setIsLessonModalOpen(true);
                                            }}
                                            className="w-full h-14 border-2 border-dashed border-slate-100 rounded-2xl font-bold text-slate-400 hover:text-primary hover:border-primary/20 hover:bg-primary/5 gap-2 group/add"
                                        >
                                            <Plus className="h-4 w-4 group-hover/add:rotate-90 transition-transform" />
                                            Ajouter une leçon
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {addingModule ? (
                            <Card className="rounded-3xl border-2 border-primary/20 shadow-2xl shadow-primary/5 overflow-hidden ring-4 ring-primary/5">
                                <CardContent className="p-8 space-y-4">
                                    <div className="flex items-center gap-3 text-primary">
                                        <Layout className="h-5 w-5" />
                                        <h4 className="text-sm font-black uppercase tracking-widest">Nouveau Module</h4>
                                    </div>
                                    <Input
                                        autoFocus
                                        placeholder="Ex : Vocabulaire de base LSF"
                                        value={newModuleTitle}
                                        onChange={(e) => setNewModuleTitle(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleAddModule()}
                                        className="h-14 rounded-2xl border-primary/20 focus:ring-primary/40 font-bold text-lg"
                                    />
                                    <div className="flex items-center justify-end gap-3 mt-4">
                                        <Button variant="ghost" onClick={() => setAddingModule(false)} className="rounded-xl font-bold h-11 px-6">Annuler</Button>
                                        <Button onClick={handleAddModule} className="rounded-xl font-extrabold h-11 px-8 shadow-lg shadow-primary/20">Créer le module</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <Button
                                onClick={() => setAddingModule(true)}
                                className="h-20 border-2 border-dashed border-primary/20 bg-primary/5 text-primary rounded-3xl font-black text-xl hover:bg-primary/10 hover:border-primary/40 transition-all gap-4 shadow-xl shadow-primary/5"
                            >
                                <Plus className="h-8 w-8" />
                                Ajouter un Module
                            </Button>
                        )}
                    </div>
                </div>

                <div className="space-y-8">
                    <Card className="rounded-3xl shadow-xl shadow-slate-200/50 border-slate-100 overflow-hidden">
                        <CardHeader className="bg-slate-50/50 p-6 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                                <Settings className="h-5 w-5 text-slate-400" />
                                <CardTitle className="text-sm font-black uppercase tracking-widest">Informations</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description</label>
                                <p className="text-sm font-medium text-slate-600 mt-2 leading-relaxed italic">
                                    {course.description || "Aucune description."}
                                </p>
                            </div>
                            <div className="pt-6 border-t border-slate-50 space-y-4">
                                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-tight">
                                    <span className="text-slate-400">Total Leçons</span>
                                    <span className="text-primary">{modules.reduce((acc, m) => acc + m.lessons.length, 0)}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-tight">
                                    <span className="text-slate-400">Total Modules</span>
                                    <span className="text-primary">{modules.length}</span>
                                </div>
                            </div>
                        </CardContent>
                        <div className="p-6 bg-slate-50/30 border-t border-slate-50">
                            <Button variant="ghost" className="w-full rounded-xl h-12 font-bold text-slate-400 hover:text-primary gap-2">
                                <Edit className="h-4 w-4" />
                                Modifier le programme
                            </Button>
                        </div>
                    </Card>

                    <div className="bg-primary text-primary-foreground p-8 rounded-[2.5rem] shadow-2xl shadow-primary/30 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                            <BookOpen className="h-32 w-32" />
                        </div>
                        <h3 className="text-2xl font-black leading-tight relative">Prêt à<br />diffuser ?</h3>
                        <p className="text-sm font-medium opacity-80 mt-4 leading-relaxed relative">
                            Une fois vos leçons prêtes, publiez votre cours pour qu'il soit visible par toute la communauté LSF.
                        </p>
                        {!course.is_published && (
                            <Button onClick={togglePublish} className="w-full mt-8 bg-white text-primary hover:bg-slate-50 rounded-2xl h-14 font-black uppercase tracking-widest text-xs relative shadow-xl active:scale-95 transition-all">
                                Publier Maintenant
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {selectedModuleId && (
                <LessonModal
                    isOpen={isLessonModalOpen}
                    onClose={() => setIsLessonModalOpen(false)}
                    moduleId={selectedModuleId}
                    lesson={editingLesson}
                    onSuccess={fetchData}
                />
            )}
        </div>
    );
}
