"use client";

import Link from "next/link";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const supabase = createClient();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const message = searchParams.get("message");

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) throw authError;

            if (data.user) {
                // Determine user role and redirect
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("role")
                    .eq("id", data.user.id)
                    .single();

                if (profile?.role === "expert") {
                    router.push("/dashboard/expert");
                } else {
                    router.push("/experts");
                }
            }
        } catch (err: any) {
            setError(err.message || "Email ou mot de passe incorrect.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
            <Card className="w-full max-w-md shadow-lg border-primary/10">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-3xl font-bold tracking-tight">Connexion</CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Entrez vos identifiants pour accéder à votre compte.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardContent className="grid gap-4">
                        {message && (
                            <div className="p-3 rounded-md bg-blue-50 text-blue-700 text-sm font-medium border border-blue-100 text-center">
                                {message}
                            </div>
                        )}
                        {error && (
                            <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20 text-center">
                                {error}
                            </div>
                        )}
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
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-semibold text-foreground/80" htmlFor="password">
                                    Mot de passe
                                </label>
                                <Link
                                    href="/forgot-password"
                                    className="text-xs text-muted-foreground hover:underline font-medium"
                                >
                                    Mot de passe oublié ?
                                </Link>
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="flex h-11 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            />
                        </div>
                        <Button type="submit" data-testid="login-submit-btn" className="w-full h-11 text-base font-bold" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Se connecter"}
                        </Button>
                    </CardContent>
                </form>
                <CardFooter className="flex flex-wrap items-center justify-center gap-1 text-sm text-muted-foreground pb-8">
                    Vous n'avez pas de compte ?{" "}
                    <Link href="/register" className="text-primary hover:underline font-bold">
                        S'inscrire
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}
