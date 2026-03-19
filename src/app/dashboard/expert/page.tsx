"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MessageSquare, Video, Settings, UserCheck, MapPin } from "lucide-react";

export default function ExpertDashboard() {
    const supabase = createClient();
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if(!user) return;

            // Simple fetch without joining to avoid foreign key errors, 
            // since we have two foreign keys to 'profiles'
            const { data: bookingsData } = await supabase
                .from('bookings')
                .select('*')
                .eq('expert_id', user.id)
                .order('scheduled_at', { ascending: true });
                
            if (bookingsData) {
                // Enrich with client profiles
                for (let b of bookingsData) {
                    const { data: client } = await supabase
                        .from('profiles')
                        .select('full_name, avatar_url')
                        .eq('id', b.client_id)
                        .single();
                    b.client = client;
                }
                setBookings(bookingsData);
            }
            setLoading(false);
        };
        fetchDashboardData();
    }, []);

    const updateStatus = async (id: string, newStatus: string) => {
        await supabase.from('bookings').update({ status: newStatus }).eq('id', id);
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
    };

    if (loading) return <div className="container py-8 text-center text-muted-foreground">Chargement de votre espace expert...</div>;

    const upcomingBookings = bookings.filter(b => b.status === "confirmed" && new Date(b.scheduled_at) >= new Date());
    const pendingRequests = bookings.filter(b => b.status === "pending");

    return (
        <div className="container py-8 flex flex-col gap-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Tableau de bord Expert</h1>
                    <p className="text-muted-foreground">Gérez vos disponibilités et vos réservations.</p>
                </div>
                <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium w-fit">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    En ligne
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-t-4 border-t-primary">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Réservations à venir</CardTitle>
                        <Video className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{upcomingBookings.length}</div>
                        <p className="text-xs text-muted-foreground">
                            {upcomingBookings.length > 0 ? `Prochaine : ${new Date(upcomingBookings[0].scheduled_at).toLocaleDateString('fr-FR')}` : "Aucune réservation confirmée"}
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-t-4 border-t-amber-400">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Nouveaux Messages</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">Tous vos messages sont lus</p>
                    </CardContent>
                </Card>
                <Card className="border-t-4 border-t-emerald-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Score Satisfaction</CardTitle>
                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">5.0/5</div>
                        <p className="text-xs text-muted-foreground">Continuez comme ça !</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="col-span-1 border-primary/20 shadow-lg">
                    <CardHeader>
                        <CardTitle>Demandes en attente</CardTitle>
                        <CardDescription>Vous avez {pendingRequests.length} demandes en attente d'acceptation (Paiement non finalisé).</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        {pendingRequests.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground text-sm italic">
                                Aucune nouvelle demande
                            </div>
                        )}
                        {pendingRequests.map((req) => (
                            <div key={req.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary overflow-hidden">
                                        {req.client?.avatar_url ? <img src={req.client.avatar_url} alt="" /> : req.client?.full_name?.charAt(0) || 'C'}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">{req.client?.full_name || 'Client A.'}</p>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium mt-0.5">
                                            {req.type === 'video' ? <Video className="w-3 h-3 text-indigo-500" /> : <MapPin className="w-3 h-3 text-amber-500" />}
                                            {new Date(req.scheduled_at).toLocaleString('fr-FR')}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline" className="text-destructive border-destructive hover:bg-destructive/10" onClick={() => updateStatus(req.id, 'cancelled')}>Décliner</Button>
                                    <Button size="sm" onClick={() => updateStatus(req.id, 'confirmed')}>Accepter</Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="col-span-1 shadow-md">
                    <CardHeader>
                        <CardTitle>Sessions Confirmées</CardTitle>
                        <CardDescription>Vos rendez-vous à honorer.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        {upcomingBookings.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-48 bg-muted/50 border border-dashed rounded-xl text-muted-foreground">
                                <Calendar className="w-8 h-8 mb-2 opacity-50" />
                                <span className="text-sm font-medium">Agenda libre</span>
                            </div>
                        )}
                        {upcomingBookings.map((b) => (
                            <div key={b.id} className="p-4 bg-primary/5 border border-primary/20 rounded-xl relative overflow-hidden">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <p className="text-sm font-bold">{b.client?.full_name || 'Client'}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs bg-white text-primary font-bold px-2 py-0.5 rounded shadow-sm">
                                                    {new Date(b.scheduled_at).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}
                                                </span>
                                                <span className="text-xs text-muted-foreground font-medium flex items-center gap-1 uppercase tracking-wider">
                                                    {b.type === 'video' ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                                                    {b.type}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <Button size="sm" className="font-bold">Rejoindre / Contacter</Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
