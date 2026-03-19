"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { LSFVideoPlayer } from "@/components/ui-custom/LSFVideoPlayer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { Hand, MapPin, Star, Calendar, Clock, ShieldCheck, Mail, MessageSquare, ArrowLeft, CheckCircle2, Video, Users } from "lucide-react";
import Link from "next/link";

interface ExpertDetail {
    id: string;
    full_name: string;
    avatar_url: string;
    experts: {
        bio: string;
        specialties: string[];
        hourly_rate: number;
        lsf_video_url: string;
        certificate_url: string;
        is_verified: boolean;
        availability: any[];
    };
}

export default function ExpertDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const supabase = createClient();
    const [expert, setExpert] = useState<ExpertDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [bookingPhase, setBookingPhase] = useState<"idle" | "selecting" | "confirming" | "confirmed">("idle");
    const [isChatOpen, setIsChatOpen] = useState(false);
    
    // Booking Form State
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [selectedTime, setSelectedTime] = useState<string>("09:00");
    const [serviceType, setServiceType] = useState<"video" | "in_person">("video");

    // Generate next 3 days
    const nextDays = Array.from({ length: 3 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i + 1); // Tomorrow, etc.
        return {
            val: d.toISOString().split('T')[0],
            label: d.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric" })
        };
    });

    useEffect(() => {
        if (!selectedDate && nextDays.length > 0) {
            setSelectedDate(nextDays[0].val);
        }
    }, [nextDays]);

    useEffect(() => {
        async function fetchExpert() {
            const { data, error } = await supabase
                .from("profiles")
                .select(`
                    id,
                    full_name,
                    avatar_url,
                    experts (
                        bio,
                        specialties,
                        hourly_rate,
                        lsf_video_url,
                        certificate_url,
                        is_verified,
                        availability
                    )
                `)
                .eq("id", id)
                .single();

            if (data) setExpert(data as any);
            setLoading(false);
        }
        if (id) fetchExpert();
    }, [id]);

    const handleBooking = async () => {
        if (!expert || !selectedDate || !selectedTime) return;

        setBookingPhase("confirming");
        try {
            // Reconstruct DateTime from user selection
            const scheduledAt = new Date(`${selectedDate}T${selectedTime}:00`);
            
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    expertId: expert.id,
                    expertName: expert.full_name,
                    amount: expert.experts.hourly_rate + 2.5,
                    scheduledAt: scheduledAt.toISOString(),
                    serviceType: serviceType
                }),
            });

            const { url, error } = await response.json();
            if (error) throw new Error(error);

            if (url) {
                window.location.href = url;
            }
        } catch (err: any) {
            console.error("Booking failed:", err);
            setBookingPhase("idle");
            alert("Une erreur est survenue lors de la réservation.");
        }
    };

    if (loading) return <div className="container py-20 text-center">Chargement du profil...</div>;
    if (!expert) return <div className="container py-20 text-center">Expert non trouvé.</div>;

    return (
        <div className="flex flex-col min-h-screen pb-20">
            <div className="container py-6">
                <Button variant="ghost" asChild className="-ml-4 text-muted-foreground hover:text-primary transition-colors">
                    <Link href="/experts">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Retour aux experts
                    </Link>
                </Button>
            </div>

            <main className="container grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left Column: Expert Info */}
                <div className="lg:col-span-2 space-y-8">
                    <section className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="w-40 h-40 rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-slate-100 shrink-0">
                            {expert.avatar_url ? (
                                <img src={expert.avatar_url} alt={expert.full_name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl font-bold bg-slate-800 text-white">
                                    {expert.full_name.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-4xl font-extrabold tracking-tight">{expert.full_name}</h1>
                                    {expert.experts.is_verified && (
                                        <div className="bg-primary/10 text-primary px-3 py-1 rounded-full flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest border border-primary/20">
                                            <ShieldCheck className="h-3 w-3" />
                                            Certifié
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-4 text-muted-foreground font-medium">
                                    <div className="flex items-center gap-1">
                                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                        <span className="text-slate-900">4.9</span> (45 avis)
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MapPin className="h-4 w-4" />
                                        Paris (Expertise Vidéo)
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {expert.experts.specialties.map(s => (
                                    <span key={s} className="bg-slate-100 text-slate-700 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-tight">
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold border-b pb-2">Présentation LSF</h2>
                        <div className="aspect-video rounded-2xl overflow-hidden border shadow-inner">
                            <LSFVideoPlayer
                                src={expert.experts.lsf_video_url || "https://www.w3schools.com/html/mov_bbb.mp4"}
                                hasLSFInterpretation={true}
                                title={`Présentation de ${expert.full_name}`}
                                className="w-full h-full"
                            />
                        </div>
                        <p className="text-slate-600 leading-relaxed text-lg italic">
                            {expert.experts.bio || "Pas de biographie disponible."}
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold border-b pb-2">Expertise & Diplômes</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 border rounded-xl flex items-center gap-4 bg-slate-50">
                                <CheckCircle2 className="h-6 w-6 text-green-500" />
                                <div>
                                    <p className="font-bold">Interprétation Médicale</p>
                                    <p className="text-xs text-muted-foreground">Confirmé (10 ans)</p>
                                </div>
                            </div>
                            <div className="p-4 border rounded-xl flex items-center gap-4 bg-slate-50">
                                <CheckCircle2 className="h-6 w-6 text-green-500" />
                                <div>
                                    <p className="font-bold">Traduction Juridique</p>
                                    <p className="text-xs text-muted-foreground">Diplôme National</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Column: Booking Widget */}
                <div className="space-y-6">
                    <Card className="sticky top-24 border-primary/20 shadow-2xl rounded-3xl overflow-hidden">
                        <div className="bg-primary text-primary-foreground p-6 text-center">
                            <div className="text-3xl font-extrabold tracking-tighter">{expert.experts.hourly_rate}€<span className="text-sm font-medium opacity-80">/heure</span></div>
                            <p className="text-xs opacity-90 font-bold uppercase tracking-widest mt-1">Meilleur tarif garanti</p>
                        </div>
                        <CardContent className="p-6 space-y-6">
                            {bookingPhase === "confirmed" ? (
                                <div className="py-12 text-center space-y-4">
                                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle2 className="h-8 w-8" />
                                    </div>
                                    <h3 className="text-2xl font-bold">Réservation Envoyée !</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        L'expert a été notifié. Vous recevrez une confirmation sous peu.
                                    </p>
                                    <Button variant="outline" onClick={() => setBookingPhase("idle")} className="w-full font-bold">
                                        Faire une autre demande
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-3">
                                        <p className="text-sm font-bold flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-primary" />
                                            Choisir une date
                                        </p>
                                        <div className="grid grid-cols-3 gap-2">
                                            {nextDays.map(d => (
                                                <button 
                                                    key={d.val} 
                                                    onClick={() => setSelectedDate(d.val)}
                                                    className={`py-2 border rounded-lg text-xs font-bold transition-all active:scale-95 ${selectedDate === d.val ? 'bg-primary text-primary-foreground border-primary shadow-md' : 'hover:bg-primary/5 hover:border-primary'}`}
                                                >
                                                    {d.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <p className="text-sm font-bold flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-primary" />
                                            Créneau disponible
                                        </p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {["09:00", "11:30", "14:00", "16:30"].map(t => (
                                                <button 
                                                    key={t} 
                                                    onClick={() => setSelectedTime(t)}
                                                    className={`py-2 border rounded-lg text-xs font-bold transition-all active:scale-95 ${selectedTime === t ? 'bg-primary text-primary-foreground border-primary shadow-md' : 'hover:bg-primary/5 hover:border-primary'}`}
                                                >
                                                    {t}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <p className="text-sm font-bold flex items-center gap-2">
                                            <Users className="h-4 w-4 text-primary" />
                                            Type de service
                                        </p>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button 
                                                onClick={() => setServiceType('video')}
                                                className={`py-2.5 border rounded-lg text-xs font-bold transition-all flex justify-center items-center gap-1 active:scale-95 ${serviceType === 'video' ? 'bg-primary text-primary-foreground border-primary shadow-md' : 'hover:bg-primary/5'}`}
                                            >
                                                <Video className="w-4 h-4" /> Visio
                                            </button>
                                            <button 
                                                onClick={() => setServiceType('in_person')}
                                                className={`py-2.5 border rounded-lg text-xs font-bold transition-all flex justify-center items-center gap-1 active:scale-95 ${serviceType === 'in_person' ? 'bg-primary text-primary-foreground border-primary shadow-md' : 'hover:bg-primary/5'}`}
                                            >
                                                <MapPin className="w-4 h-4" /> Sur place
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t">
                                        <div className="flex justify-between text-sm font-medium">
                                            <span className="text-muted-foreground">Durée (1h)</span>
                                            <span className="font-bold">{expert.experts.hourly_rate}€</span>
                                        </div>
                                        <div className="flex justify-between text-sm font-medium">
                                            <span className="text-muted-foreground">Frais de service</span>
                                            <span className="font-bold">2.50€</span>
                                        </div>
                                        <div className="flex justify-between text-lg font-bold border-t pt-2">
                                            <span>Total</span>
                                            <span className="text-primary">{expert.experts.hourly_rate + 2.5}€</span>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={handleBooking}
                                        className="w-full h-14 text-lg font-extrabold shadow-lg shadow-primary/20 active:scale-95 transition-all"
                                    >
                                        Réserver maintenant
                                    </Button>
                                    <p className="text-[10px] text-center text-muted-foreground italic">
                                        Vous ne serez débité qu'après confirmation par l'expert.
                                    </p>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    <div className="flex flex-col gap-3">
                        <Button
                            onClick={() => setIsChatOpen(true)}
                            variant="outline"
                            className="h-12 font-bold flex items-center gap-2"
                        >
                            <MessageSquare className="h-4 w-4" />
                            Envoyer un message
                        </Button>
                        <Button variant="ghost" className="h-12 font-bold text-muted-foreground hover:text-destructive">
                            Signaler ce profil
                        </Button>
                    </div>
                </div>
            </main>

            {/* Floating Chat Window */}
            {isChatOpen && (
                <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
                    <ChatWindow
                        recipientId={expert.id}
                        recipientName={expert.full_name}
                        onClose={() => setIsChatOpen(false)}
                    />
                </div>
            )}
        </div>
    );
}
