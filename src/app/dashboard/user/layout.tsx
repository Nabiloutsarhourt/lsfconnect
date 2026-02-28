"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
    LayoutDashboard, GraduationCap, Trophy,
    BarChart3, MessageSquare, Settings,
    LogOut, ChevronRight, Library, Video
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const sidebarLinks = [
    { name: "Vue d'ensemble", href: "/dashboard/user", icon: LayoutDashboard },
    { name: "Mes Cours", href: "/dashboard/user/courses", icon: GraduationCap },
    { name: "Classes Live", href: "/dashboard/user/live", icon: Video },
    { name: "Analytiques", href: "/dashboard/user/analytics", icon: BarChart3 },
    { name: "Certificats", href: "/dashboard/user/certificates", icon: Trophy },
    { name: "Forum", href: "/dashboard/user/forum", icon: Library },
    { name: "Messages", href: "/dashboard/user/messages", icon: MessageSquare },
    { name: "Paramètres", href: "/dashboard/user/settings", icon: Settings },
];

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="flex min-h-[calc(100vh-64px)] bg-slate-50/50">
            {/* Sidebar */}
            <aside className="w-80 border-r border-slate-100 bg-white hidden lg:flex flex-col sticky top-16 h-[calc(100vh-64px)] shadow-2xl shadow-slate-200/20">
                <div className="p-8 pb-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Espace Étudiant</span>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {sidebarLinks.map((link) => {
                        const isActive = pathname.startsWith(link.href);
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group relative",
                                    isActive
                                        ? "bg-primary text-white shadow-xl shadow-primary/20 translate-x-1"
                                        : "hover:bg-slate-50 text-slate-500 hover:text-slate-900"
                                )}
                            >
                                <link.icon className={cn(
                                    "h-5 w-5 transition-transform duration-500",
                                    isActive ? "scale-110" : "group-hover:scale-110"
                                )} />
                                <span className="text-sm font-black uppercase tracking-widest">{link.name}</span>
                                {isActive && (
                                    <div className="absolute right-4">
                                        <ChevronRight className="h-4 w-4 opacity-50" />
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-8 border-t border-slate-50 space-y-4">
                    <div className="p-6 rounded-[2rem] bg-slate-900 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 rounded-full -mr-8 -mt-8 blur-2xl group-hover:scale-150 transition-transform duration-1000" />
                        <h4 className="text-xs font-black uppercase tracking-widest relative z-10 italic">Passer à Pro</h4>
                        <p className="text-[10px] text-slate-400 mt-2 font-medium leading-relaxed relative z-10">Débloquez tous les domaines et obtenez des certificats officiels.</p>
                        <Button variant="secondary" size="sm" asChild className="w-full mt-4 h-10 rounded-xl bg-white text-slate-900 font-black uppercase text-[9px] tracking-[0.15em] relative z-10">
                            <Link href="/pricing">Mettre à jour</Link>
                        </Button>
                    </div>

                    <Button variant="ghost" className="w-full justify-start gap-4 px-6 h-12 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all font-bold">
                        <LogOut className="h-5 w-5" />
                        Déconnexion
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-12 overflow-y-auto max-w-[1600px] mx-auto">
                {children}
            </main>
        </div>
    );
}
