"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { CheckCircle2, Calendar, ArrowRight, MessageSquare, Loader2 } from "lucide-react";

function BookingSuccessContent() {
    const searchParams = useSearchParams();
    const amount = searchParams.get("amount");

    return (
        <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
            <Card className="w-full max-w-lg shadow-2xl border-green-100 rounded-3xl overflow-hidden animate-in zoom-in-95 duration-500">
                <div className="bg-green-50/50 py-12 flex flex-col items-center border-b border-green-100">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
                        <CheckCircle2 className="h-10 w-10" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Réservation Confirmée !</h1>
                    <p className="text-green-700/80 font-bold uppercase tracking-widest text-[10px] mt-2">Paiement reçu : {amount}€</p>
                </div>

                <CardContent className="p-8 space-y-6">
                    <div className="space-y-4">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Prochaines étapes</h2>
                        <div className="grid gap-3">
                            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <MessageSquare className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <p className="font-bold text-sm">Discutez avec l'expert</p>
                                    <p className="text-xs text-muted-foreground leading-relaxed">Envoyez vos documents ou précisez vos besoins en LSF via le chat.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <Calendar className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <p className="font-bold text-sm">Préparez la session</p>
                                    <p className="text-xs text-muted-foreground leading-relaxed">Un lien visio ou l'adresse de rdv sera envoyé 1h avant.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                        <p className="text-xs text-primary font-medium leading-relaxed italic">
                            "L'inclusion est un droit, pas un privilège. Merci de faire confiance à LSFCONNECT pour vos besoins en communication."
                        </p>
                    </div>
                </CardContent>

                <CardFooter className="p-8 pt-0 flex flex-col gap-3">
                    <Button asChild size="lg" className="w-full h-14 text-lg font-extrabold shadow-xl shadow-primary/20 rounded-2xl">
                        <Link href="/dashboard/client">
                            Accéder à mes réservations
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                    <Button variant="ghost" asChild className="w-full h-12 font-bold text-muted-foreground">
                        <Link href="/experts">Trouver un autre expert</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

export default function BookingSuccessPage() {
    return (
        <Suspense fallback={
            <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <BookingSuccessContent />
        </Suspense>
    );
}
