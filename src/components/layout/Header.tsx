"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { List, X, HandWaving, User, CaretRight, GraduationCap, Activity } from "@phosphor-icons/react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { NotificationCenter } from "./NotificationCenter";
import { Button } from "@/components/ui/button";

export function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const supabase = createClient();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);

        async function getSession() {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setUser(session.user);
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();
                if (profileData) setProfile(profileData);
            }
        }
        getSession();

        return () => window.removeEventListener("scroll", handleScroll);
    }, [supabase]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = "/";
    };

    const isAdmin = profile?.role === 'admin';

    return (
        <header
            className={cn(
                "sticky top-0 z-50 w-full transition-all duration-300",
                scrolled
                    ? "bg-white/95 backdrop-blur-xl border-b border-stone-200 shadow-sm"
                    : "bg-transparent"
            )}
        >
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-20 items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href="/" className="flex items-center gap-2 group" data-testid="logo-link">
                        <div className="w-10 h-10 rounded-xl bg-indigo-900 flex items-center justify-center group-hover:scale-105 transition-transform">
                            <HandWaving size={24} weight="duotone" className="text-amber-400" />
                        </div>
                        <span className="font-heading font-bold text-xl tracking-tight text-slate-900">
                            LSF<span className="text-indigo-900">CONNECT</span>
                        </span>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-1">
                    {[
                        { href: "/experts", label: "Experts" },
                        { href: "/pricing", label: "Tarifs" },
                        { href: "/how-it-works", label: "Guide" },
                        { href: "/contact", label: "Contact" },
                    ].map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-indigo-900 hover:bg-slate-50 rounded-full transition-all"
                        >
                            {link.label}
                        </Link>
                    ))}

                    {user && (
                        <Link href="/dashboard/user" className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-indigo-900 hover:bg-slate-50 rounded-full transition-all">
                            Ma Formation
                        </Link>
                    )}

                    {isAdmin && (
                        <>
                            <div className="w-px h-6 bg-slate-100 mx-2" />
                            <Link href="/dashboard/admin" className="px-4 py-2 text-sm font-black text-primary hover:bg-primary/5 rounded-full transition-all flex items-center gap-2 italic uppercase tracking-tighter">
                                <Activity size={16} weight="duotone" />
                                Admin
                            </Link>
                            <Link href="/dashboard/admin/grading" className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-indigo-900 hover:bg-slate-50 rounded-full transition-all flex items-center gap-2">
                                <GraduationCap size={16} weight="duotone" />
                                Correction
                            </Link>
                        </>
                    )}
                </nav>

                <div className="hidden md:flex items-center gap-4">
                    <NotificationCenter />
                    {user ? (
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard/user/settings" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden hover:ring-2 hover:ring-primary/20 transition-all">
                                {profile?.avatar_url ? (
                                    <Image
                                        src={profile.avatar_url}
                                        alt="Profil"
                                        width={40}
                                        height={40}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User size={20} weight="bold" className="text-slate-400" />
                                )}
                            </Link>
                            <Button variant="ghost" onClick={handleLogout} className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-destructive">
                                Déconnexion
                            </Button>
                        </div>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-indigo-900 transition-colors"
                            >
                                Connexion
                            </Link>
                            <Link
                                href="/register"
                                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-black text-white bg-indigo-900 hover:bg-slate-900 rounded-full shadow-lg shadow-indigo-900/20 transition-all hover:shadow-xl active:scale-95 uppercase italic tracking-tighter"
                            >
                                Rejoindre
                                <CaretRight size={16} weight="bold" />
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="inline-flex items-center justify-center w-10 h-10 rounded-xl md:hidden hover:bg-stone-100 transition-colors"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-expanded={isOpen}
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X size={24} weight="bold" /> : <List size={24} weight="bold" />}
                </button>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t border-stone-100 overflow-hidden"
                    >
                        <nav className="container max-w-7xl mx-auto px-4 py-6 flex flex-col gap-2">
                            {[
                                { href: "/experts", label: "Trouver un Expert" },
                                { href: "/how-it-works", label: "Comment ça marche" },
                                { href: "/pricing", label: "Tarifs" },
                                { href: "/contact", label: "Contact" },
                            ].map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="px-4 py-3 text-base font-medium text-stone-700 hover:text-indigo-900 hover:bg-indigo-50 rounded-xl transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <hr className="my-3 border-stone-100" />
                            <Link
                                href="/login"
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-3 text-base font-medium text-stone-700 hover:bg-stone-50 rounded-xl transition-colors"
                            >
                                Connexion
                            </Link>
                            <Link
                                href="/register"
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-3 text-base font-semibold text-white bg-indigo-900 rounded-xl text-center mt-2"
                            >
                                S'inscrire gratuitement
                            </Link>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header >
    );
}
