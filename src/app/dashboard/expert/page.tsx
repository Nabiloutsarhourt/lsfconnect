"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MessageSquare, Video, Settings, UserCheck } from "lucide-react";

export default function ExpertDashboard() {
    return (
        <div className="container py-8 flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Tableau de bord Expert</h1>
                    <p className="text-muted-foreground">Gérez vos disponibilités et vos réservations LSF.</p>
                </div>
                <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Disponible
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Réservations à venir</CardTitle>
                        <Video className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">3</div>
                        <p className="text-xs text-muted-foreground">Prochaine : Aujourd'hui à 14:30</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Nouveaux Messages</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <p className="text-xs text-muted-foreground">+2 depuis ce matin</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Score Satisfaction</CardTitle>
                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">4.9/5</div>
                        <p className="text-xs text-muted-foreground">Basé sur 45 avis</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Dernières demandes</CardTitle>
                        <CardDescription>Vous avez 2 nouvelles demandes en attente de confirmation.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        {[1, 2].map((i) => (
                            <div key={i} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                                        JD
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Jean Dupont</p>
                                        <p className="text-xs text-muted-foreground">Interprétation Médicale (Visio)</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline">Décliner</Button>
                                    <Button size="sm">Confirmer</Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Calendrier Rapide</CardTitle>
                        <CardDescription>Aperçu de votre semaine.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <div className="h-48 bg-muted rounded-md flex items-center justify-center text-muted-foreground italic">
                            Composant Calendrier (En cours de développement)
                        </div>
                        <Button variant="outline" className="w-full">Gérer mes disponibilités</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
