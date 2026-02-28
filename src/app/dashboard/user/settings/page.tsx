"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
    User, Mail, Camera, Save,
    Loader2, CheckCircle2, ShieldCheck,
    Bell, Globe, Trash2, Smartphone
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function UserSettingsPage() {
    const supabase = createClient();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [notifications, setNotifications] = useState(true);
    const [studentMode, setStudentMode] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        async function fetchProfile() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", user.id)
                    .single();

                if (data) {
                    setProfile(data);
                    setFullName(data.full_name || "");
                    setEmail(data.email || "");
                    setNotifications(data.notification_enabled ?? true);
                    setStudentMode(data.student_mode ?? false);
                }
            }
            setLoading(false);
        }
        fetchProfile();
    }, [supabase]);

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const fileExt = file.name.split('.').pop();
        const filePath = `${user.id}-${Math.random()}.${fileExt}`;

        try {
            const { error: uploadError } = await supabase.storage
                .from('profiles')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('profiles')
                .getPublicUrl(filePath);

            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: publicUrl })
                .eq('id', user.id);

            if (updateError) throw updateError;

            setProfile({ ...profile, avatar_url: publicUrl });
            alert("Photo de profil mise à jour !");
        } catch (error: any) {
            alert("Erreur lors de l'upload: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { error } = await supabase
                .from("profiles")
                .update({
                    full_name: fullName,
                    notification_enabled: notifications,
                    student_mode: studentMode,
                })
                .eq("id", user.id);

            if (!error) {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            }
        }
        setSaving(false);
    };

    if (loading) return <div className="p-20 text-center animate-pulse">Chargement de vos paramètres...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-xl text-primary">
                            <User className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-black text-primary uppercase tracking-[0.2em] italic">Mon Compte</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight italic uppercase">
                        Réglages du <span className="text-primary not-italic underline decoration-slate-200 decoration-8 underline-offset-[-2px]">Profil</span>
                    </h1>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Profile Overview Card */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="rounded-[3rem] border-none shadow-2xl bg-white overflow-hidden p-8 flex flex-col items-center text-center group">
                        <div className="relative mb-6">
                            <div className="w-32 h-32 rounded-[2.5rem] bg-slate-100 flex items-center justify-center text-slate-400 font-black text-4xl overflow-hidden border-4 border-white shadow-2xl transition-transform group-hover:scale-105 duration-500">
                                {uploading ? (
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                ) : profile?.avatar_url ? (
                                    <img src={profile.avatar_url} className="w-full h-full object-cover" />
                                ) : (
                                    fullName?.charAt(0) || email?.charAt(0)
                                )}
                            </div>
                            <input
                                type="file"
                                id="avatar-upload"
                                className="hidden"
                                accept="image/*"
                                onChange={handleAvatarUpload}
                                disabled={uploading}
                            />
                            <Button
                                size="icon"
                                className="absolute -bottom-2 -right-2 h-10 w-10 rounded-xl bg-slate-900 shadow-xl hover:bg-primary transition-colors"
                                onClick={() => document.getElementById('avatar-upload')?.click()}
                                disabled={uploading}
                            >
                                <Camera className="h-4 w-4" />
                            </Button>
                        </div>
                        <h2 className="text-xl font-black text-slate-900 leading-none mb-1">{fullName || "Étudiant"}</h2>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">{profile?.role}</p>

                        <div className="mt-8 pt-6 border-t border-slate-50 w-full space-y-4">
                            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 italic">
                                <span>Abonnement</span>
                                <span className="text-primary">{profile?.subscription_tier || 'Free'}</span>
                            </div>
                            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 italic">
                                <span>Lieu</span>
                                <span>France</span>
                            </div>
                        </div>
                    </Card>

                    <Card className="rounded-[2.5rem] border-none shadow-xl bg-slate-900 p-8 text-white space-y-4 overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <ShieldCheck className="h-20 w-20" />
                        </div>
                        <h3 className="text-xs font-black uppercase tracking-widest italic relative z-10 text-primary">Confidentialité</h3>
                        <p className="text-[10px] text-slate-400 font-medium italic leading-relaxed relative z-10">
                            Vos données sont protégées conformément au RGPD. Vous pouvez exporter vos données ou supprimer votre compte à tout moment.
                        </p>
                        <Button variant="ghost" className="p-0 h-auto text-[10px] font-black uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors relative z-10">
                            Gérer les données
                        </Button>
                    </Card>
                </div>

                {/* Form Area */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="rounded-[3rem] border-none shadow-2xl bg-white p-10 border border-slate-50">
                        <form onSubmit={handleSave} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Nom Complet</Label>
                                    <div className="relative group">
                                        <User className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-hover:text-primary transition-colors" />
                                        <Input
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="h-16 rounded-2xl border-slate-100 bg-slate-50/50 pl-16 font-bold italic text-slate-900 focus:bg-white transition-all shadow-inner"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Adresse Email</Label>
                                    <div className="relative group opacity-60">
                                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                                        <Input
                                            value={email}
                                            disabled
                                            className="h-16 rounded-2xl border-slate-100 bg-slate-50/50 pl-16 font-bold italic text-slate-900 cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6 pt-8 border-t border-slate-50">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <h3 className="font-black text-slate-900 uppercase text-sm">Notifications Email</h3>
                                        <p className="text-[10px] font-bold text-slate-400 italic uppercase">Recevoir des alertes pour les nouveaux cours</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setNotifications(!notifications)}
                                        className={cn(
                                            "w-12 h-6 rounded-full relative shadow-inner transition-colors",
                                            notifications ? "bg-primary" : "bg-slate-200"
                                        )}
                                    >
                                        <div className={cn(
                                            "absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all",
                                            notifications ? "right-1" : "left-1"
                                        )} />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <h3 className="font-black text-slate-900 uppercase text-sm">Mode Étudiant</h3>
                                        <p className="text-[10px] font-bold text-slate-400 italic uppercase">Afficher les statistiques avancées</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setStudentMode(!studentMode)}
                                        className={cn(
                                            "w-12 h-6 rounded-full relative shadow-inner transition-colors",
                                            studentMode ? "bg-primary" : "bg-slate-200"
                                        )}
                                    >
                                        <div className={cn(
                                            "absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all",
                                            studentMode ? "right-1" : "left-1"
                                        )} />
                                    </button>
                                </div>
                            </div>

                            <div className="pt-8 flex items-center justify-between">
                                <button
                                    type="button"
                                    onClick={async () => {
                                        if (confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) {
                                            const { error } = await supabase.rpc('delete_user');
                                            if (error) {
                                                alert("Erreur lors de la suppression du compte: " + error.message);
                                            } else {
                                                await supabase.auth.signOut();
                                                window.location.href = "/";
                                            }
                                        }
                                    }}
                                    className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors uppercase tracking-widest flex items-center gap-2"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Supprimer mon compte
                                </button>
                                <Button
                                    type="submit"
                                    disabled={saving}
                                    className="h-16 px-12 rounded-[2rem] bg-slate-900 shadow-2xl font-black uppercase tracking-widest text-xs gap-3 hover:-translate-y-1 transition-all"
                                >
                                    {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : saved ? <CheckCircle2 className="h-5 w-5" /> : <Save className="h-5 w-5" />}
                                    {saving ? "Enregistrement..." : saved ? "Enregistré" : "Enregistrer"}
                                </Button>
                            </div>
                        </form>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="rounded-[2rem] p-8 border-none bg-slate-50 flex items-center gap-6 group hover:bg-white hover:shadow-2xl transition-all duration-500">
                            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                                <Smartphone className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-black text-slate-900 text-sm uppercase">App Mobile</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">Synchroniser vos cours</p>
                            </div>
                        </Card>
                        <Card className="rounded-[2rem] p-8 border-none bg-slate-50 flex items-center gap-6 group hover:bg-white hover:shadow-2xl transition-all duration-500">
                            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                                <Globe className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-black text-slate-900 text-sm uppercase">Langue LSF</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">Région: France (LSF)</p>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
