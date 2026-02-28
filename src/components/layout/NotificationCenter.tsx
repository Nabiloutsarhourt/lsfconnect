"use client";

import { useState } from "react";
import {
    Bell, CheckCheck, MessageSquare,
    Trophy, Sparkles, AlertCircle,
    ChevronRight, Info
} from "lucide-react";
import {
    Popover, PopoverContent, PopoverTrigger
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Notification = {
    id: string;
    title: string;
    content: string;
    type: 'message' | 'achievement' | 'alert' | 'info';
    created_at: string;
    is_read: boolean;
};

export function NotificationCenter() {
    const [notifications, setNotifications] = useState<Notification[]>([
        { id: '1', title: "Nouveau Message", content: "L'expert Jean D. vous a envoyé un message.", type: 'message', created_at: new Date().toISOString(), is_read: false },
        { id: '2', title: "Badge Gagné !", content: "Vous avez débloqué le badge 'Étudiant Assidu'.", type: 'achievement', created_at: new Date(Date.now() - 3600000).toISOString(), is_read: false },
        { id: '3', title: "Rappel Session Live", content: "Votre classe live 'LSF Médical' commence dans 30 min.", type: 'alert', created_at: new Date(Date.now() - 7200000).toISOString(), is_read: true },
    ]);

    const unreadCount = notifications.filter(n => !n.is_read).length;

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    };

    const getIcon = (type: Notification['type']) => {
        switch (type) {
            case 'message': return <MessageSquare className="h-4 w-4" />;
            case 'achievement': return <Trophy className="h-4 w-4" />;
            case 'alert': return <AlertCircle className="h-4 w-4" />;
            default: return <Info className="h-4 w-4" />;
        }
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <div className="relative cursor-pointer group">
                    <Button variant="ghost" size="icon" className="rounded-full bg-slate-50 border border-slate-100 shadow-inner group-hover:bg-white transition-all">
                        <Bell className="h-5 w-5 text-slate-500 group-hover:text-primary transition-all" />
                    </Button>
                    {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 h-4 w-4 bg-primary text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white animate-in zoom-in">
                            {unreadCount}
                        </span>
                    )}
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-[420px] p-0 rounded-[2.5rem] border-none shadow-3xl overflow-hidden bg-white/95 backdrop-blur-xl mt-4 mr-4 animate-in slide-in-from-top-4 duration-500">
                <div className="bg-slate-900 p-8 text-white relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-3xl" />
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-black italic uppercase tracking-tighter">Centre de <span className="text-primary not-italic">Notifications</span></h3>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1 italic">Vos alertes temps réel</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-8 rounded-lg bg-white/5 hover:bg-white/10 text-[9px] font-bold uppercase tracking-widest gap-2">
                            <CheckCheck className="h-3 w-3" /> Tout lire
                        </Button>
                    </div>
                </div>

                <div className="max-h-[450px] overflow-y-auto custom-scrollbar p-6 space-y-3">
                    {notifications.length === 0 ? (
                        <div className="py-20 text-center space-y-4">
                            <Sparkles className="h-10 w-10 text-slate-200 mx-auto" />
                            <p className="text-slate-400 font-bold italic text-sm">Zen absolu. Aucune notification.</p>
                        </div>
                    ) : (
                        notifications.map((n) => (
                            <div
                                key={n.id}
                                className={cn(
                                    "p-6 rounded-3xl transition-all cursor-pointer group flex gap-5 relative",
                                    n.is_read ? "bg-slate-50/50 hover:bg-slate-50" : "bg-primary/5 border border-primary/10 shadow-sm"
                                )}
                            >
                                <div className={cn(
                                    "h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner",
                                    n.type === 'message' && "bg-blue-50 text-blue-500",
                                    n.type === 'achievement' && "bg-amber-50 text-amber-500",
                                    n.type === 'alert' && "bg-red-50 text-red-500",
                                    n.type === 'info' && "bg-slate-100 text-slate-500"
                                )}>
                                    {getIcon(n.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                        <h4 className="font-black text-slate-900 text-[11px] uppercase tracking-wide truncate">{n.title}</h4>
                                        <span className="text-[8px] font-bold text-slate-400 whitespace-nowrap italic">{new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <p className="text-[10px] text-slate-500 font-medium leading-relaxed italic">{n.content}</p>
                                </div>
                                {!n.is_read && (
                                    <div className="absolute top-4 right-4 h-1.5 w-1.5 rounded-full bg-primary" />
                                )}
                            </div>
                        ))
                    )}
                </div>

                <div className="p-6 border-t border-slate-50">
                    <Button variant="ghost" className="w-full rounded-2xl h-12 text-[10px] font-black uppercase tracking-widest gap-2 text-slate-400 hover:text-primary transition-all group">
                        Accéder à l'historique complet
                        <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
