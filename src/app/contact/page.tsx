"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
    EnvelopeSimple, Phone, MapPin,
    PaperPlaneTilt, ChatCircleDots, Clock
} from "@phosphor-icons/react";
import { toast } from "sonner";

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        toast.success("Message envoyé ! Notre équipe vous contactera sous 24h.");
        setIsSubmitting(false);
        (e.target as HTMLFormElement).reset();
    };

    return (
        <div className="flex flex-col bg-stone-50/30 min-h-screen">
            {/* Hero */}
            <section className="py-20 bg-white border-b border-stone-100">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-4 max-w-2xl mx-auto">
                        <h1 className="font-heading text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
                            Parlons de votre <span className="text-gradient">Avenir LSF</span>
                        </h1>
                        <p className="text-lg text-stone-600">
                            Questions sur nos formations, besoins d'interprétation sur mesure ou support technique ? Nous sommes là pour vous.
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-20">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                        {/* Info Column */}
                        <div className="lg:col-span-5 space-y-10">
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-slate-900">Coordonnées</h2>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                                            <EnvelopeSimple size={24} weight="duotone" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">Email</p>
                                            <p className="text-stone-500">contact@lsfconnect.fr</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                                            <Phone size={24} weight="duotone" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">Téléphone</p>
                                            <p className="text-stone-500">+33 1 23 45 67 89</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                                            <MapPin size={24} weight="duotone" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">Siège Social</p>
                                            <p className="text-stone-500">75008 Paris, France</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 bg-indigo-900 rounded-[2rem] text-white relative overflow-hidden shadow-xl shadow-indigo-900/20">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <ChatCircleDots size={80} weight="fill" />
                                </div>
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <Clock size={20} weight="duotone" className="text-amber-400" />
                                    Disponibilité
                                </h3>
                                <p className="text-indigo-200 text-sm leading-relaxed mb-6">
                                    Notre équipe de support est disponible du lundi au vendredi, de 9h à 18h.
                                    Nous répondons généralement en moins de 4 heures.
                                </p>
                                <Button className="bg-white text-indigo-900 hover:bg-stone-100 rounded-full font-bold">
                                    Ouvrir le Chat LSF
                                </Button>
                            </div>
                        </div>

                        {/* Form Column */}
                        <motion.div
                            className="lg:col-span-7 bg-white p-8 md:p-12 rounded-[3rem] shadow-xl border border-stone-100"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-900 ml-1 italic">Votre Nom</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="Jean Dupont"
                                            className="w-full px-6 py-4 rounded-2xl bg-stone-50 border border-stone-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-900 ml-1 italic">Votre Email</label>
                                        <input
                                            required
                                            type="email"
                                            placeholder="jean@exemple.fr"
                                            className="w-full px-6 py-4 rounded-2xl bg-stone-50 border border-stone-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-900 ml-1 italic">Sujet</label>
                                    <select className="w-full px-6 py-4 rounded-2xl bg-stone-50 border border-stone-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all">
                                        <option>Formation Pro</option>
                                        <option>Interprétation sur mesure</option>
                                        <option>Problème technique</option>
                                        <option>Autre</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-900 ml-1 italic">Votre Message</label>
                                    <textarea
                                        required
                                        rows={5}
                                        placeholder="Comment pouvons-nous vous aider ?"
                                        className="w-full px-6 py-4 rounded-2xl bg-stone-50 border border-stone-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all resize-none"
                                    ></textarea>
                                </div>
                                <Button
                                    disabled={isSubmitting}
                                    type="submit"
                                    className="w-full gradient-primary text-white py-6 rounded-2xl font-bold shadow-xl shadow-indigo-900/20 hover:shadow-2xl transition-all flex items-center justify-center gap-3"
                                >
                                    {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
                                    <PaperPlaneTilt size={20} weight="bold" />
                                </Button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}
