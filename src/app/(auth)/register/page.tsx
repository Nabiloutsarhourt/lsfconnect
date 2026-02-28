"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { User, ShieldCheck, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
    const router = useRouter();
    const supabase = createClient();

    const [role, setRole] = useState<"client" | "expert">("client");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const fullName = formData.get("fullName") as string;

        try {
            const { data, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        role: role,
                    },
                },
            });

            if (authError) throw authError;

            if (data.user) {
                router.push("/login?message=Consultez vos emails pour confirmer votre compte.");
            }
        } catch (err: any) {
            setError(err.message || "Une erreur est survenue lors de l'inscription.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
            <Card className="w-full max-w-lg shadow-lg border-primary/10">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-3xl font-bold tracking-tight">Créer un compte</CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Rejoignez la communauté LSFCONNECT et commencez à échanger.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleRegister}>
                    <CardContent className="grid gap-6">
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setRole("client")}
                                className={cn(
                                    "flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-4 transition-all hover:bg-accent",
                                    role === "client" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-muted"
                                )}
                            >
                                <User className={cn("h-8 w-8", role === "client" ? "text-primary" : "text-muted-foreground")} />
                                <div className="text-sm font-bold">Client</div>
                                <p className="text-[10px] text-muted-foreground text-center">Je cherche un expert LSF</p>
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole("expert")}
                                className={cn(
                                    "flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-4 transition-all hover:bg-accent",
                                    role === "expert" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-muted"
                                )}
                            >
                                <ShieldCheck className={cn("h-8 w-8", role === "expert" ? "text-primary" : "text-muted-foreground")} />
                                <div className="text-sm font-bold">Expert</div>
                                <p className="text-[10px] text-muted-foreground text-center">Je suis un professionnel LSF</p>
                            </button>
                        </div>

                        {error && (
                            <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20 text-center">
                                {error}
                            </div>
                        )}

                        <div className="grid gap-2 text-left">
                            <label className="text-sm font-semibold text-foreground/80" htmlFor="fullName">
                                Nom complet
                            </label>
                            <input
                                id="fullName"
                                name="fullName"
                                type="text"
                                required
                                placeholder="Jean Dupont"
                                className="flex h-11 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            />
                        </div>
                        <div className="grid gap-2 text-left">
                            <label className="text-sm font-semibold text-foreground/80" htmlFor="email">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                placeholder="m@example.com"
                                className="flex h-11 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            />
                        </div>
                        <div className="grid gap-2 text-left">
                            <label className="text-sm font-semibold text-foreground/80" htmlFor="password">
                                Mot de passe
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="flex h-11 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            />
                        </div>

                        {role === "expert" && (
                            <div className="rounded-lg bg-blue-50/50 p-4 border border-blue-100 dark:bg-blue-900/10 dark:border-blue-800">
                                <p className="text-xs text-blue-700 dark:text-blue-400 font-medium leading-relaxed">
                                    <span className="font-bold">Info :</span> En tant qu'expert, vous devrez télécharger une vidéo de présentation LSF et vos certifications après l'inscription.
                                </p>
                            </div>
                        )}

                        <Button type="submit" data-testid="register-submit-btn" className="w-full h-12 text-base font-bold" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Créer mon compte"}
                        </Button>
                    </CardContent>
                </form>
                <CardFooter className="flex flex-wrap items-center justify-center gap-1 text-sm text-muted-foreground pb-8">
                    Vous avez déjà un compte ?{" "}
                    <Link href="/login" className="text-primary hover:underline font-bold transition-all">
                        Se connecter
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
