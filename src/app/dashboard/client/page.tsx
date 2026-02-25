"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Video, MapPin, Search, Star, MessageSquare, Hand } from "lucide-react";
import Link from "next/link";

interface Booking {
    id: string;
    scheduled_at: string;
    status: string;
    type: string;
    price: number;
    expert: {
        full_name: string;
        avatar_url: string;
    };
}

export default function ClientDashboard() {
    const supabase = createClient();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchBookings() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase
                    .from("bookings")
                    .select(`
                        id,
                        scheduled_at,
                        status,
                        type,
                        price,
                        expert:expert_id (
                            full_name,
                            avatar_url
                        )
                    `)
                    .eq("client_id", user.id)
                    .order("scheduled_at", { ascending: false });

                if (data) setBookings(data as any);
            }
            setLoading(false);
        }
        fetchBookings();
    }, []);

    return (
        <div className="container py-12 space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight">Bonjour, l'inclusion vous attend.</h1>
                    <p className="text-muted-foreground text-lg">Retrouvez toutes vos réservations et vos échanges avec nos experts.</p>
                </div>
                <Button asChild size="lg" className="h-14 px-8 text-lg font-extrabold shadow-xl shadow-primary/20">
                    <Link href="/experts">
                        <Search className="mr-2 h-5 w-5" />
                        Trouver un expert
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Bookings List */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Calendar className="h-6 w-6 text-primary" />
                        Mes Réservations
                    </h2>

                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2].map(i => <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-2xl" />)}
                        </div>
                    ) : bookings.length > 0 ? (
                        <div className="grid gap-4">
                            {bookings.map(booking => (
                                <Card key={booking.id} className="overflow-hidden border-slate-200 hover:border-primary/30 transition-all rounded-2xl group">
                                    <div className="flex flex-col md:flex-row items-center p-6 gap-6">
                                        <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border-2 border-white shadow-md">
                                            {booking.expert?.avatar_url ? (
                                                <img src={booking.expert.avatar_url} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center font-bold bg-slate-800 text-white">
                                                    {booking.expert?.full_name?.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 space-y-1 text-center md:text-left">
                                            <h3 className="text-xl font-bold">{booking.expert?.full_name}</h3>
                                            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs font-medium text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {new Date(booking.scheduled_at).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {new Date(booking.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    {booking.type === 'video' ? <Video className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
                                                    {booking.type === 'video' ? 'En visio' : 'Présentiel'}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center md:items-end gap-2">
                                            <div className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest border ${booking.status === 'confirmed' ? 'bg-green-50 text-green-700 border-green-100' :
                                                booking.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                                                    'bg-slate-50 text-slate-500 border-slate-100'
                                                }`}>
                                                {booking.status}
                                            </div>
                                            <div className="text-lg font-bold text-primary">{booking.price}€</div>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50/50 p-4 flex justify-between items-center border-t">
                                        <Button variant="ghost" size="sm" className="font-bold text-xs h-8">Modifier</Button>
                                        <Button variant="outline" size="sm" className="font-bold text-xs h-8 text-primary border-primary/20 hover:bg-primary/5">
                                            <MessageSquare className="mr-2 h-3 w-3" />
                                            Contacter l'expert
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="p-12 text-center border-dashed rounded-3xl">
                            <Video className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-slate-900">Aucun rendez-vous</h3>
                            <p className="text-slate-500 mb-6">Vous n'avez pas encore réservé d'expert LSF.</p>
                            <Button asChild variant="outline" className="font-bold">
                                <Link href="/experts">Parcourir les profils</Link>
                            </Button>
                        </Card>
                    )}
                </div>

                {/* Sidebar / Stats */}
                <div className="space-y-6">
                    <Card className="bg-primary text-primary-foreground p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                        <div className="relative z-10 space-y-4">
                            <h3 className="text-2xl font-bold leading-tight">Vérifiez vos notifications</h3>
                            <p className="text-sm opacity-90 leading-relaxed font-medium">
                                Restez informé des confirmations de vos experts en temps réel.
                            </p>
                            <Button className="w-full bg-white text-primary hover:bg-slate-100 font-extrabold h-12 shadow-lg">
                                Voir mes messages
                            </Button>
                        </div>
                        <Hand className="absolute -bottom-10 -right-10 h-40 w-40 opacity-10 rotate-12" />
                    </Card>

                    <Card className="rounded-3xl border-slate-200 p-6 space-y-4">
                        <h3 className="text-lg font-bold">Favoris</h3>
                        <div className="space-y-4">
                            {[1, 2].map(i => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-100" />
                                    <div className="flex-1">
                                        <div className="h-3 w-20 bg-slate-100 rounded mb-1" />
                                        <div className="h-2 w-full bg-slate-50 rounded" />
                                    </div>
                                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
