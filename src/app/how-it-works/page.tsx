"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import {
  Search, Calendar, Video, CheckCircle2,
  ArrowRight, ShieldCheck, Zap, Hand,
  Star, MessageSquare, CreditCard, Play
} from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    number: "01",
    title: "Trouvez votre expert",
    description: "Parcourez nos profils d'interprètes certifiés. Filtrez par domaine d'expertise : médical, juridique, social ou commercial.",
    icon: Search,
    color: "bg-blue-500"
  },
  {
    number: "02",
    title: "Réservez un créneau",
    description: "Choisissez la date et l'heure qui vous conviennent. Vidéo ou présentiel, c'est vous qui décidez.",
    icon: Calendar,
    color: "bg-primary"
  },
  {
    number: "03",
    title: "Échangez en toute confiance",
    description: "Connectez-vous en visio sécurisée ou retrouvez votre expert sur place. Communication fluide garantie.",
    icon: Video,
    color: "bg-green-500"
  },
  {
    number: "04",
    title: "Confirmez & Évaluez",
    description: "Après la session, validez la prestation et laissez un avis pour aider la communauté.",
    icon: CheckCircle2,
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
    icon: MessageSquare
  },
  {
    title: "Réponse Rapide",
    description: "Notre algorithme vous met en relation avec un expert disponible en moins de 5 minutes.",
    icon: Zap
  }
];

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] opacity-50" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[80px] opacity-40" />

        <div className="container relative z-10 text-center space-y-8 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-primary">
            <Play className="h-3.5 w-3.5 fill-primary/20" />
            Guide de démarrage
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.95] text-slate-900 italic uppercase">
            Comment <span className="text-primary not-italic underline decoration-slate-200 decoration-[12px] underline-offset-[-4px]">LSFCONNECT</span> Fonctionne ?
          </h1>

          <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed italic">
            En quelques étapes simples, accédez à un réseau d'experts certifiés en Langue des Signes Française.
          </p>

          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <Button size="lg" asChild className="h-14 px-8 rounded-[2rem] bg-slate-900 shadow-xl font-black uppercase tracking-widest text-xs gap-3 hover:-translate-y-1 transition-all">
              <Link href="/register" data-testid="hero-register-btn">
                Créer mon compte
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-14 px-8 rounded-[2rem] border-slate-200 font-black uppercase tracking-widest text-xs gap-3 hover:bg-slate-50 transition-all">
              <Link href="/experts" data-testid="hero-experts-btn">
                Voir les experts
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-24 bg-slate-50/50">
        <div className="container">
          <div className="text-center mb-20 space-y-4">
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Processus Simple</span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 italic uppercase tracking-tight">
              4 Étapes <span className="text-primary not-italic">Vers l'Inclusion</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative group">
                {/* Connector Line */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-slate-200 -z-10" />
                )}
                
                <Card className="p-8 rounded-[2.5rem] border-none shadow-2xl shadow-slate-200/50 bg-white hover:-translate-y-2 transition-all duration-500 h-full">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-6",
                        step.color
                      )}>
                        <step.icon className="h-6 w-6" />
                      </div>
                      <span className="text-4xl font-black text-slate-100 italic">{step.number}</span>
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{step.title}</h3>
                      <p className="text-slate-500 font-medium leading-relaxed italic text-sm">{step.description}</p>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Pourquoi nous choisir</span>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 italic uppercase tracking-tight leading-tight">
                Une Plateforme <span className="text-primary not-italic">Pensée Pour Vous</span>
              </h2>
              <p className="text-slate-500 font-medium leading-relaxed italic">
                LSFCONNECT a été conçu en collaboration avec des interprètes professionnels et des utilisateurs sourds pour garantir une expérience optimale.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, i) => (
                <div key={i} className="p-6 rounded-3xl bg-slate-50 border border-slate-100 space-y-3 hover:bg-white hover:shadow-xl transition-all duration-300">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-black text-slate-900 text-sm uppercase tracking-tight">{feature.title}</h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed italic">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary to-blue-600 rounded-[3rem] blur-2xl opacity-20" />
            <div className="relative aspect-square rounded-[3rem] overflow-hidden bg-slate-900 p-12 flex flex-col justify-center items-center text-center">
              <Hand className="h-24 w-24 text-primary mb-8 animate-pulse" />
              <h3 className="text-3xl font-black text-white italic uppercase tracking-tight mb-4">
                +500 Experts
              </h3>
              <p className="text-slate-400 font-medium italic">
                Certifiés et prêts à vous accompagner dans tous vos projets d'accessibilité.
              </p>
              <div className="flex items-center gap-1 mt-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">Note moyenne : 4.9/5</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 container">
        <div className="relative rounded-[4rem] bg-gradient-to-br from-primary to-blue-600 p-12 md:p-20 overflow-hidden text-center text-white shadow-2xl">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          <div className="relative z-10 flex flex-col items-center gap-8 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black italic uppercase leading-tight tracking-tighter">
              Prêt à Découvrir la <span className="text-slate-900 not-italic">Puissance de la LSF ?</span>
            </h2>
            <p className="text-lg md:text-xl font-medium italic opacity-90">
              Inscrivez-vous gratuitement et trouvez votre premier expert en quelques minutes.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild className="h-14 px-10 rounded-[2rem] bg-white text-slate-900 font-black uppercase tracking-widest text-xs hover:shadow-2xl transition-all">
                <Link href="/register" data-testid="cta-register-btn">Inscription Gratuite</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-14 px-10 rounded-[2rem] border-white/20 text-white font-black uppercase tracking-widest text-xs hover:bg-white hover:text-slate-900 transition-all">
                <Link href="/pricing" data-testid="cta-pricing-btn">Voir les Tarifs</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
