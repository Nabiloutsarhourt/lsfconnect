"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MagnifyingGlass, CalendarCheck, VideoCamera, CheckCircle,
  ArrowRight, ShieldCheck, Lightning, HandWaving,
  Star, ChatCircle, CreditCard, Play, Sparkle
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const steps = [
  {
    number: "01",
    title: "Trouvez votre expert",
    description: "Parcourez nos profils d'interprètes certifiés. Filtrez par domaine d'expertise : médical, juridique, social ou commercial.",
    icon: MagnifyingGlass,
    color: "bg-blue-600"
  },
  {
    number: "02",
    title: "Réservez un créneau",
    description: "Choisissez la date et l'heure qui vous conviennent. Vidéo ou présentiel, c'est vous qui décidez.",
    icon: CalendarCheck,
    color: "bg-indigo-900"
  },
  {
    number: "03",
    title: "Échangez en toute confiance",
    description: "Connectez-vous en visio sécurisée ou retrouvez votre expert sur place. Communication fluide garantie.",
    icon: VideoCamera,
    color: "bg-emerald-600"
  },
  {
    number: "04",
    title: "Confirmez & Évaluez",
    description: "Après la session, validez la prestation et laissez un avis pour aider la communauté.",
    icon: CheckCircle,
    color: "bg-amber-500"
  }
];

const features = [
  {
    title: "Experts Vérifiés",
    description: "Chaque interprète passe par une validation rigoureuse de ses diplômes et certifications LSF.",
    icon: ShieldCheck
  },
  {
    title: "Paiement Sécurisé",
    description: "Transactions protégées par Stripe. Vous ne payez qu'après confirmation de la session.",
    icon: CreditCard
  },
  {
    title: "Messagerie Intégrée",
    description: "Communiquez directement avec votre expert avant et après la réservation.",
    icon: ChatCircle
  },
  {
    title: "Réponse Rapide",
    description: "Notre algorithme vous met en relation avec un expert disponible en moins de 5 minutes.",
    icon: Lightning
  }
];

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 bg-white border-b border-stone-100 overflow-hidden">
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[500px] h-[500px] bg-indigo-100/50 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[300px] h-[300px] bg-amber-100/50 rounded-full blur-[100px] pointer-events-none" />

        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            className="space-y-6 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-xs font-semibold text-indigo-900">
              <Play size={14} weight="fill" className="text-indigo-600" />
              Guide de démarrage
            </div>

            <h1 className="font-heading text-4xl md:text-6xl font-bold tracking-tight text-slate-900 leading-tight" data-testid="how-it-works-page-title">
              Comment{" "}
              <span className="text-gradient">LSFCONNECT</span>
              <br />Fonctionne ?
            </h1>

            <p className="text-lg md:text-xl text-stone-600 max-w-2xl mx-auto">
              En quelques étapes simples, accédez à un réseau d'experts certifiés en Langue des Signes Française.
            </p>

            <div className="flex flex-wrap gap-4 justify-center pt-6">
              <Link
                href="/register"
                data-testid="hero-register-btn"
                className="inline-flex items-center gap-3 px-8 py-4 text-base font-semibold text-white bg-indigo-900 hover:bg-indigo-800 rounded-full shadow-xl shadow-indigo-900/20 transition-all hover:shadow-2xl active:scale-[0.98]"
              >
                Créer mon compte
                <ArrowRight size={20} weight="bold" />
              </Link>
              <Link
                href="/experts"
                data-testid="hero-experts-btn"
                className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-indigo-900 bg-white hover:bg-indigo-50 border-2 border-indigo-100 rounded-full transition-all"
              >
                Voir les experts
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-24 md:py-32 bg-stone-50/50">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-3 block">Processus Simple</span>
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">
              4 Étapes <span className="text-gradient">Vers l'Inclusion</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                className="relative group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                {/* Connector Line */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-stone-200" />
                )}
                
                <div className="p-8 rounded-3xl bg-white border border-stone-100 card-hover h-full">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110 group-hover:-rotate-3",
                        step.color
                      )}>
                        <step.icon size={26} weight="duotone" />
                      </div>
                      <span className="font-heading text-4xl font-bold text-stone-100">{step.number}</span>
                    </div>
                    <div className="space-y-3">
                      <h3 className="font-heading text-xl font-bold text-slate-900">{step.title}</h3>
                      <p className="text-stone-600 leading-relaxed text-sm">{step.description}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 md:py-32 bg-white">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="space-y-4">
                <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">Pourquoi nous choisir</span>
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                  Une Plateforme <span className="text-gradient">Pensée Pour Vous</span>
                </h2>
                <p className="text-lg text-stone-600">
                  LSFCONNECT a été conçu en collaboration avec des interprètes professionnels et des utilisateurs sourds pour garantir une expérience optimale.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {features.map((feature, i) => (
                  <motion.div
                    key={i}
                    className="p-6 rounded-2xl bg-stone-50 border border-stone-100 hover:bg-white hover:shadow-xl hover:border-indigo-100 transition-all"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-indigo-900 shadow-sm mb-4">
                      <feature.icon size={24} weight="duotone" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">{feature.title}</h3>
                    <p className="text-xs text-stone-500 leading-relaxed">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <div className="absolute -inset-4 bg-indigo-900/10 rounded-[2rem] blur-2xl pointer-events-none" />
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-indigo-900 p-12 flex flex-col justify-center items-center text-center">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                <div className="relative z-10">
                  <HandWaving size={80} weight="duotone" className="text-amber-400 mb-8 mx-auto" />
                  <h3 className="font-heading text-4xl font-bold text-white mb-4">
                    +500 Experts
                  </h3>
                  <p className="text-indigo-200 max-w-xs">
                    Certifiés et prêts à vous accompagner dans tous vos projets d'accessibilité.
                  </p>
                  <div className="flex items-center justify-center gap-1 mt-6">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} size={20} weight="fill" className="text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-indigo-300 mt-2 block">Note moyenne : 4.9/5</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="p-12 md:p-20 gradient-primary rounded-[2.5rem] text-center relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-amber-400/20 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="relative z-10 flex flex-col items-center gap-8 max-w-3xl mx-auto">
              <Sparkle size={48} weight="duotone" className="text-amber-400" />
              
              <h2 className="font-heading text-3xl md:text-5xl font-bold text-white leading-tight">
                Prêt à Découvrir la{" "}
                <span className="text-amber-400">Puissance de la LSF ?</span>
              </h2>
              
              <p className="text-lg md:text-xl text-indigo-200 max-w-2xl">
                Inscrivez-vous gratuitement et trouvez votre premier expert en quelques minutes.
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center pt-4">
                <Link
                  href="/register"
                  data-testid="cta-register-btn"
                  className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-indigo-900 bg-white hover:bg-stone-50 rounded-full shadow-xl transition-all hover:shadow-2xl active:scale-[0.98]"
                >
                  Inscription Gratuite
                  <ArrowRight size={20} weight="bold" />
                </Link>
                <Link
                  href="/pricing"
                  data-testid="cta-pricing-btn"
                  className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white border-2 border-white/20 hover:bg-white/10 rounded-full transition-all"
                >
                  Voir les Tarifs
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
