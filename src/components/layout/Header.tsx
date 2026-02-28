"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { List, X, HandWaving, User, CaretRight, GraduationCap, Activity } from "@phosphor-icons/react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NotificationCenter } from "./NotificationCenter";
import { Button } from "@/components/ui/button";

export function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

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
                        { href: "/experts", label: "Trouver un Expert", testId: "nav-experts-link" },
                        { href: "/how-it-works", label: "Comment ça marche", testId: "nav-how-it-works-link" },
                        { href: "/pricing", label: "Tarifs", testId: "nav-pricing-link" },
                        { href: "/dashboard/user", label: "Tableau de Bord", testId: "nav-dashboard-link" },
                    ].map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            data-testid={link.testId}
                            className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-full transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link href="/dashboard/admin/grading" className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-full transition-colors flex items-center gap-2">
                        <GraduationCap size={16} weight="duotone" />
                        Correction
                    </Link>
                    <Link href="/dashboard/admin/logs" className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-full transition-colors flex items-center gap-2">
                        <Activity size={16} weight="duotone" />
                        Audit
                    </Link>
                </nav>

                <div className="hidden md:flex items-center gap-3">
                    <NotificationCenter />
                    <Link
                        href="/login"
                        data-testid="nav-login-link"
                        className="px-5 py-2.5 text-sm font-semibold text-indigo-900 hover:bg-indigo-50 rounded-full transition-colors"
                    >
                        Connexion
                    </Link>
                    <Link
                        href="/register"
                        data-testid="nav-register-link"
                        className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-indigo-900 hover:bg-indigo-800 rounded-full shadow-lg shadow-indigo-900/20 transition-all hover:shadow-xl active:scale-95"
                    >
                        S'inscrire
                        <CaretRight size={16} weight="bold" />
                    </Link>
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
