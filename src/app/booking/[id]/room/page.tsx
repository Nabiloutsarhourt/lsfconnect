"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { JitsiMeeting } from "@/components/live/JitsiMeeting";
import { Loader2, ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function BookingRoomPage() {
    const { id: bookingId } = useParams() as { id: string };
    const router = useRouter();
    const supabase = createClient();

    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        const verifyAccess = async () => {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (!authUser) {
                router.push('/login');
                return;
            }

            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', authUser.id)
                .single();
            
            setUser(profile);

            // Fetch booking
            const { data: booking, error } = await supabase
                .from('bookings')
                .select('client_id, expert_id, type, status')
                .eq('id', bookingId)
                .single();

            if (error || !booking) {
                setErrorMsg("Réservation introuvable.");
                setLoading(false);
                return;
            }

            if (booking.status !== 'confirmed') {
                setErrorMsg("La réservation n'est pas confirmée ou a été annulée.");
                setLoading(false);
                return;
            }

            if (booking.type !== 'video') {
                setErrorMsg("Cette consultation est prévue en présentiel, et non en Visio.");
                setLoading(false);
                return;
            }

            // Verify access: current user MUST be client or expert
            if (authUser.id !== booking.client_id && authUser.id !== booking.expert_id && profile?.role !== 'admin') {
                setErrorMsg("Accès refusé. Vous n'êtes pas participant à cette consultation.");
                setLoading(false);
                return;
            }

            setAuthorized(true);
            setLoading(false);
        };

        if (bookingId) verifyAccess();
    }, [bookingId, router, supabase]);

    const goBack = () => {
        if (!user) return router.back();
        if (user.role === 'expert') router.push('/dashboard/expert');
        else router.push('/dashboard/client');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    if (!authorized) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 text-center space-y-4">
                <AlertCircle className="h-16 w-16 text-destructive" />
                <h1 className="text-3xl font-bold">Accès Non Autorisé</h1>
                <p className="text-muted-foreground text-lg max-w-md">{errorMsg}</p>
                <Button onClick={goBack} className="mt-6 shadow-xl" size="lg">
                    Retour au tableau de bord
                </Button>
            </div>
        );
    }

    return (
        <div className="container max-w-6xl mx-auto py-8 flex flex-col min-h-[calc(100vh-4rem)] space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={goBack} className="hover:bg-transparent font-bold tracking-widest text-[10px] uppercase text-slate-500 hover:text-slate-900">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Quitter la salle
                </Button>
                <div className="flex items-center gap-3 px-4 py-1.5 bg-red-100/50 text-red-700 rounded-full text-xs font-black uppercase tracking-widest border border-red-200">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    Consultation Sécurisée (Visio)
                </div>
            </div>

            <div className="flex-1 rounded-[3rem] overflow-hidden shadow-2xl border-4 border-slate-100 bg-slate-900 relative">
                <JitsiMeeting
                    roomName={bookingId}
                    userName={user?.full_name || "Utilisateur"}
                    userEmail={user?.email}
                    className="w-full h-full min-h-[700px] border-none rounded-none"
                    onClose={goBack}
                />
            </div>
        </div>
    );
}
