"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
    ChevronLeft, Plus, MessageSquare,
    Send, Loader2, Sparkles, AlertCircle
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

function NewThreadContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const supabase = createClient();

    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [categoryId, setCategoryId] = useState(searchParams.get("cat") || "");

    useEffect(() => {
        async function fetchCats() {
            const { data } = await supabase.from("forum_categories").select("*").order("order_index", { ascending: true });
            if (data) setCategories(data);
            setFetching(false);
        }
        fetchCats();
    }, [supabase]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim() || !categoryId) return;

        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase.from("forum_threads").insert({
            title,
            content,
            category_id: categoryId,
            author_id: user.id
        }).select().single();

        if (!error && data) {
            router.push(`/dashboard/user/forum/thread/${data.id}`);
        } else {
            console.error(error);
            setLoading(false);
        }
    };

    if (fetching) return <div className="p-20 text-center animate-pulse">Chargement...</div>;

    return (
        <div className="max-w-3xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Header */}
            <div className="space-y-6">
                <Button variant="ghost" asChild className="text-slate-400 hover:text-primary gap-2 p-0 h-auto">
                    <Link href="/dashboard/user/forum">
                        <ChevronLeft className="h-4 w-4" />
                        Retour au Forum
                    </Link>
                </Button>

                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-xl text-primary">
                            <Plus className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-black text-primary uppercase tracking-[0.2em] italic">Commencer</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight italic uppercase">
                        Nouvelle <span className="text-primary not-italic underline decoration-slate-200 decoration-8 underline-offset-[-2px]">Discussion</span>
                    </h1>
                </div>
            </div>

            <Card className="rounded-[3rem] border-none shadow-2xl bg-white overflow-hidden p-10 border border-slate-50">
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-4">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Catégorie</Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setCategoryId(cat.id)}
                                    className={cn(
                                        "px-6 py-4 rounded-2xl border transition-all text-left font-bold text-sm italic group",
                                        categoryId === cat.id
                                            ? "bg-primary text-white border-primary shadow-xl shadow-primary/20 scale-[1.02]"
                                            : "bg-white text-slate-500 border-slate-100 hover:border-slate-300 hover:bg-slate-50/50"
                                    )}
                                >
                                    {cat.title}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Titre de la Discussion</Label>
                        <Input
                            placeholder="De quoi voulez-vous parler ?"
                            className="h-16 rounded-2xl border-slate-100 bg-slate-50/50 font-black italic text-lg focus:bg-white transition-all px-6"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-4">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Message</Label>
                        <Textarea
                            placeholder="Détails de votre question ou partage..."
                            className="rounded-[2rem] border-slate-100 bg-slate-50/50 min-h-[250px] font-medium italic text-lg focus:bg-white transition-all p-8"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-6">
                        <div className="flex items-center gap-2 text-slate-400">
                            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                            <span className="text-[10px] font-bold uppercase tracking-widest italic leading-none">Soyez précis pour obtenir de meilleures réponses</span>
                        </div>
                        <Button
                            type="submit"
                            disabled={loading || !title.trim() || !content.trim() || !categoryId}
                            className="h-16 px-12 rounded-[2.5rem] bg-slate-900 shadow-2xl font-black uppercase tracking-widest text-xs gap-3 hover:-translate-y-1 transition-all"
                        >
                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                            Lancer la discussion
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}

export default function NewThreadPage() {
    return (
        <Suspense fallback={<div className="p-20 text-center animate-pulse">Chargement en cours...</div>}>
            <NewThreadContent />
        </Suspense>
    );
}
