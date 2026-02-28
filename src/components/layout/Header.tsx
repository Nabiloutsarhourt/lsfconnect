"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Hand, User, Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center space-x-2">
                        <Hand className="h-6 w-6 text-primary" aria-hidden="true" />
                        <span className="inline-block font-bold text-xl tracking-tight">
                            LSF<span className="text-primary">CONNECT</span>
                        </span>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                    <Link href="/experts" data-testid="nav-experts-link" className="transition-colors hover:text-primary">
                        Trouver un Expert
                    </Link>
                    <Link href="/how-it-works" data-testid="nav-how-it-works-link" className="transition-colors hover:text-primary">
                        Comment ça marche
                    </Link>
                    <Link href="/pricing" data-testid="nav-pricing-link" className="transition-colors hover:text-primary">
                        Tarifs
                    </Link>
                </nav>

                <div className="hidden md:flex items-center gap-4">
                    <Link
                        href="/login"
                        data-testid="nav-login-link"
                        className="text-sm font-medium transition-colors hover:text-primary"
                    >
                        Connexion
                    </Link>
                    <Link
                        href="/register"
                        data-testid="nav-register-link"
                        className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    >
                        S'inscrire
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="inline-flex items-center justify-center rounded-md p-2 md:hidden"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-expanded={isOpen}
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Navigation */}
            {isOpen && (
                <div className="container md:hidden pb-4 pb-6 border-b bg-background">
                    <nav className="flex flex-col gap-4 text-sm font-medium">
                        <Link href="/experts" onClick={() => setIsOpen(false)}>
                            Trouver un Expert
                        </Link>
                        <Link href="/how-it-works" onClick={() => setIsOpen(false)}>
                            Comment ça marche
                        </Link>
                        <Link href="/pricing" onClick={() => setIsOpen(false)}>
                            Tarifs
                        </Link>
                        <hr />
                        <Link href="/login" onClick={() => setIsOpen(false)}>
                            Connexion
                        </Link>
                        <Link href="/register" className="text-primary font-bold" onClick={() => setIsOpen(false)}>
                            S'inscrire
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
}
