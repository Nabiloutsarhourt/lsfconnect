"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    ChevronLeft, MessageSquare, Send,
    CheckCircle2, Loader2, User, Clock,
    Share2, ShieldCheck, MoreVertical
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ThreadPage() {
    const { id: threadId } = useParams();
    const router = useRouter();
    const supabase = createClient();

    const [thread, setThread] = useState<any>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [replying, setReplying] = useState(false);
    const [newPost, setNewPost] = useState("");

    const fetchData = useCallback(async () => {
        // Fetch thread + author
        const { data: threadData } = await supabase
            .from("forum_threads")
            .select(`
                *,
                author:profiles(full_name, avatar_url, role),
                category:forum_categories(title, slug)
            `)
            .eq("id", threadId)
            .single();

        if (threadData) {
            setThread(threadData);

            // Fetch posts (replies)
            const { data: postsData } = await supabase
                .from("forum_posts")
                .select(`
                    *,
                    author:profiles(full_name, avatar_url, role)
                `)
                .eq("thread_id", threadId)
                .order("created_at", { ascending: true });

            if (postsData) setPosts(postsData);
        }
        setLoading(false);
    }, [threadId, supabase]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleReply = async () => {
        if (!newPost.trim()) return;
        setReplying(true);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase.from("forum_posts").insert({
            thread_id: threadId,
            author_id: user.id,
            content: newPost
        });

        if (!error) {
            setNewPost("");
            fetchData();
        }
        setReplying(false);
    };

    if (loading) return (
        <div className="p-20 text-center animate-pulse space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
            <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Chargement de la discussion...</p>
        </div>
    );

    if (!thread) return <div className="p-20 text-center">Discussion non trouvée.</div>;

    return (
        <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-1000">
            {/* Thread Header / OP */}
            <div className="space-y-6">
                <Button variant="ghost" asChild className="text-slate-400 hover:text-primary gap-2 p-0 h-auto">
                    <Link href={`/dashboard/user/forum/cat/${thread.category?.slug}`}>
                        <ChevronLeft className="h-4 w-4" />
                        Retour à {thread.category?.title}
                    </Link>
                </Button>

                <Card className="rounded-[3rem] border-none shadow-2xl bg-white overflow-hidden border border-slate-50">
                    <div className="p-10 space-y-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black shadow-inner overflow-hidden border border-white">
                                    {thread.author?.avatar_url ? (
                                        <img src={thread.author.avatar_url} className="w-full h-full object-cover" />
                                    ) : (
                                        thread.author?.full_name?.charAt(0) || "U"
                                    )}
                                </div>
                                <div>
                                    <p className="font-black text-slate-900 flex items-center gap-2 leading-none mb-1">
                                        {thread.author?.full_name || "Anonyme"}
                                        {thread.author?.role === 'expert' && <ShieldCheck className="h-4 w-4 text-primary" />}
                                    </p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2 leading-none">
                                        <Clock className="h-3 w-3" />
                                        {new Date(thread.created_at).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="rounded-xl text-slate-400 hover:bg-slate-50">
                                <Share2 className="h-5 w-5" />
                            </Button>
                        </div>

                        <div className="space-y-6">
                            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter leading-tight italic">{thread.title}</h1>
                            <div className="text-slate-600 font-medium italic leading-relaxed text-lg whitespace-pre-wrap">
                                {thread.content}
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Replies List */}
            <div className="space-y-8">
                <div className="flex items-center justify-between px-4">
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest italic flex items-center gap-3">
                        <MessageSquare className="h-5 w-5 text-primary" />
                        {posts.length} Réponses
                    </h2>
                </div>

                <div className="space-y-6">
                    {posts.map((post) => (
                        <div key={post.id} className="flex gap-6 group">
                            <div className="flex-shrink-0">
                                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-black text-xs shadow-inner overflow-hidden border border-white mt-2">
                                    {post.author?.avatar_url ? (
                                        <img src={post.author.avatar_url} className="w-full h-full object-cover" />
                                    ) : (
                                        post.author?.full_name?.charAt(0) || "U"
                                    )}
                                </div>
                            </div>
                            <Card className="flex-1 rounded-[2rem] border-none shadow-xl shadow-slate-100/30 group-hover:shadow-primary/5 transition-all duration-500 bg-white p-8">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <p className="text-sm font-black text-slate-900 flex items-center gap-1.5 leading-none">
                                            {post.author?.full_name || "Anonyme"}
                                            {post.author?.role === 'expert' && <ShieldCheck className="h-3.3 w-3.5 text-primary" />}
                                        </p>
                                        <span className="text-[10px] text-slate-300 font-bold uppercase tracking-tighter">
                                            {new Date(post.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                        <MoreVertical className="h-4 w-4 text-slate-300" />
                                    </Button>
                                </div>
                                <div className="text-slate-600 font-medium italic leading-relaxed whitespace-pre-wrap">
                                    {post.content}
                                </div>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Reply Form */}
            <Card className="rounded-[2.5rem] border-none shadow-2xl bg-slate-900 p-8 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/5 rounded-xl text-primary">
                            <Send className="h-4 w-4" />
                        </div>
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] italic">Participer à la discussion</h3>
                    </div>
                    <Textarea
                        placeholder="Votre réponse ici..."
                        className="bg-white/5 border-white/5 rounded-2xl min-h-[150px] font-medium italic placeholder:text-slate-600 focus:bg-white/10 transition-colors"
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                    />
                    <div className="flex items-center justify-between">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">Soyez respectueux et constructif.</p>
                        <Button
                            onClick={handleReply}
                            disabled={replying || !newPost.trim()}
                            className="h-14 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-xs gap-3 shadow-xl shadow-primary/20"
                        >
                            {replying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                            Publier la réponse
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
