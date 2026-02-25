"use client";

import Link from "next/link";
import { LSFVideoPlayer } from "@/components/ui-custom/LSFVideoPlayer";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2, ShieldCheck, Zap, Hand,
  ArrowRight, Globe, Users, Trophy,
  Play, Star, Sparkles, MessageCircle,
  Gavel, Stethoscope, Briefcase, Heart,
  Quote
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="flex flex-col bg-white overflow-hidden">
      {/* Hero Section - The "WOW" Entrance */}
      <section className="relative min-h-[90vh] flex items-center pt-20 pb-12 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[100px] opacity-50 animate-pulse" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[80px] opacity-40" />

        <div className="container relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-primary italic">
              <Sparkles className="h-3.5 w-3.5 fill-primary/20" />
              L'inclusion au bout des doigts
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] text-slate-900 italic uppercase">
              La Puissance de la <span className="text-primary not-italic underline decoration-slate-200 decoration-[16px] underline-offset-[-4px]">LSF</span> Entre Vos Mains.
            </h1>

            <p className="text-xl text-slate-500 font-medium max-w-[550px] leading-relaxed italic">
              Réservez un expert certifié ou maîtrisez la Langue des Signes Française avec la première plateforme de SaaS e-learning tout-en-un.
            </p>

            <div className="flex flex-wrap gap-6 pt-4">
              <Button size="lg" asChild className="h-16 px-10 rounded-[2rem] bg-slate-900 shadow-2xl shadow-slate-900/20 font-black uppercase tracking-widest text-xs gap-3 hover:-translate-y-1 transition-all">
                <Link href="/register">
                  Commencer l'Aventure
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-16 px-10 rounded-[2rem] border-slate-200 font-black uppercase tracking-widest text-xs gap-3 hover:bg-slate-50 transition-all">
                <Link href="/how-it-works">
                  Voir la Démo
                </Link>
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-6 border-t border-slate-100">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-xl border-2 border-white bg-slate-100 overflow-hidden shadow-sm">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="user" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />)}
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">+500 experts vérifiés</span>
              </div>
            </div>
          </div>

          <div className="relative group animate-in fade-in zoom-in-95 duration-1000 delay-200">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary to-blue-600 rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000" />
            <div className="relative aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white bg-slate-900">
              <LSFVideoPlayer
                src="https://www.w3schools.com/html/mov_bbb.mp4"
                title="Introduction à LSFCONNECT"
                hasLSFInterpretation={true}
                className="w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent pointer-events-none" />
              <div className="absolute bottom-8 left-8 flex items-center gap-4">
                <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white">
                  <Play className="h-5 w-5 fill-white" />
                </div>
                <span className="text-white font-black uppercase tracking-widest text-[10px]">Démo en LSF</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Domains - Marquee-like grid */}
      <section className="py-20 border-y border-slate-50 bg-slate-50/30 overflow-hidden">
        <div className="container relative overflow-hidden">
          <div className="flex flex-col items-center mb-12 text-center">
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4">Domaines d'Intervention</span>
            <h2 className="text-3xl font-black text-slate-900 italic uppercase">L'expertise <span className="text-primary not-italic">Omniprésente</span></h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: "Juridique", icon: Gavel, color: "bg-blue-500" },
              { name: "Médical", icon: Stethoscope, color: "bg-red-500" },
              { name: "Entreprise", icon: Briefcase, color: "bg-slate-900" },
              { name: "Social", icon: Heart, color: "bg-green-500" },
            ].map((domain, i) => (
              <div key={i} className="flex flex-col items-center gap-4 group cursor-default">
                <div className={cn(
                  "w-20 h-20 rounded-[2rem] flex items-center justify-center text-white shadow-2xl transition-all duration-500 group-hover:-translate-y-2 group-hover:rotate-6",
                  domain.color
                )}>
                  <domain.icon className="h-8 w-8" />
                </div>
                <span className="text-sm font-black uppercase tracking-widest text-slate-900">{domain.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features - High-end Cards */}
      <section className="py-32 container">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {[
            {
              title: "Validation Expertise",
              description: "Chaque interprète subit une vérification manuelle de ses diplômes et de son badge 'Expert Certifié'.",
              icon: ShieldCheck,
              tag: "Sécurité"
            },
            {
              title: "Matching Temps Réel",
              description: "Besoin d'aide immédiate ? Notre algorithme vous connecte à un expert en moins de 300 secondes.",
              icon: Zap,
              tag: "Rapidité"
            },
            {
              title: "Apprentissage LSF",
              description: "Des centaines de leçons vidéo haute définition pour maîtriser tous les domaines de la LSF.",
              icon: GraduationCap,
              tag: "Formation"
            },
          ].map((feature, i) => (
            <Card key={i} className="group relative rounded-[3rem] border-none shadow-2xl shadow-slate-200/50 p-12 bg-white hover:-translate-y-4 transition-all duration-700 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-slate-50 group-hover:bg-primary transition-colors" />
              <div className="w-16 h-16 rounded-[1.5rem] bg-slate-50 flex items-center justify-center text-slate-900 group-hover:bg-primary group-hover:text-white transition-all duration-500 mb-10 shadow-inner">
                <feature.icon className="h-7 w-7" />
              </div>
              <div className="space-y-4">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">{feature.tag}</span>
                <h3 className="text-2xl font-black text-slate-900 italic uppercase leading-none">{feature.title}</h3>
                <p className="text-slate-500 font-medium italic leading-relaxed">{feature.description}</p>
              </div>
              <div className="mt-8 pt-8 border-t border-slate-50 flex justify-end">
                <div className="p-3 rounded-xl bg-slate-50 text-slate-300 group-hover:text-primary group-hover:bg-primary/5 transition-all">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[100px] -mr-20 -mt-20" />
        <div className="container relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          {[
            { label: "Utilisateurs", value: "10K+", icon: Users },
            { label: "Experts", value: "500+", icon: ShieldCheck },
            { label: "Diplômes", value: "3.2K", icon: Trophy },
            { label: "Échanges", value: "45K", icon: MessageCircle },
          ].map((stat, i) => (
            <div key={i} className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-white/5 mx-auto flex items-center justify-center text-primary mb-6">
                <stat.icon className="h-6 w-6" />
              </div>
              <h4 className="text-5xl font-black italic tracking-tighter">{stat.value}</h4>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials - Social Proof */}
      <section className="py-32 bg-slate-50/50 relative overflow-hidden">
        <div className="container relative z-10">
          <div className="flex flex-col items-center mb-20 text-center space-y-4">
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] italic">Paroles d'Étudiants</span>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 italic uppercase tracking-tighter">
              Leurs <span className="text-primary not-italic underline decoration-slate-200 decoration-[12px] underline-offset-[-2px]">Histoires</span> de Succès
            </h2>
            <p className="text-slate-500 font-medium italic max-w-xl">
              Découvrez comment LSFCONNECT transforme le quotidien des apprenants et des professionnels de la LSF.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Marie L.",
                role: "Infirmière",
                content: "Grâce au module Médical, je peux enfin communiquer avec mes patients sourds en toute autonomie. Une révolution pour ma pratique.",
                avatar: "https://i.pravatar.cc/100?img=32",
                domain: "Médical"
              },
              {
                name: "Thomas D.",
                role: "Étudiant Droit",
                content: "Le lexique Juridique est d'une précision incroyable. La plateforme m'a permis de valider mon stage en cabinet avec brio.",
                avatar: "https://i.pravatar.cc/100?img=12",
                domain: "Judidique"
              },
              {
                name: "Sophie R.",
                role: "Consultante RH",
                content: "L'interface est d'une fluidité rare. Les experts réservés via la plateforme sont d'un professionnalisme exemplaire.",
                avatar: "https://i.pravatar.cc/100?img=45",
                domain: "Entreprise"
              }
            ].map((testimonial, i) => (
              <Card key={i} className="rounded-[3.5rem] p-10 bg-white border-none shadow-3xl shadow-slate-200/40 relative group hover:-translate-y-2 transition-all duration-700">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-slate-50 shadow-inner">
                    <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 uppercase text-sm">{testimonial.name}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black text-primary uppercase tracking-widest">{testimonial.domain}</span>
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <Quote className="absolute -top-4 -left-2 h-10 w-10 text-slate-50 -z-10" />
                  <p className="text-slate-600 font-medium italic leading-relaxed relative z-10">
                    "{testimonial.content}"
                  </p>
                </div>
                <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />)}
                  </div>
                  <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Achat Vérifié</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 container">
        <div className="relative rounded-[4rem] bg-gradient-to-br from-primary to-blue-600 p-16 md:p-24 overflow-hidden text-center text-white shadow-2xl">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          <div className="relative z-10 flex flex-col items-center gap-10">
            <h2 className="text-4xl md:text-6xl font-black italic uppercase leading-tight tracking-tighter max-w-4xl">
              Prêt à Transformer Votre <span className="text-slate-900 not-italic">Accessibilité ?</span>
            </h2>
            <p className="text-xl md:text-2xl font-medium italic opacity-90 max-w-2xl">
              Rejoignez la révolution de l'inclusion et accédez aux meilleurs interprètes de France dès aujourd'hui.
            </p>
            <div className="flex flex-wrap gap-6 justify-center">
              <Button size="lg" variant="secondary" asChild className="h-16 px-12 rounded-[2rem] bg-white text-slate-900 font-black uppercase tracking-widest text-xs hover:shadow-2xl transition-all">
                <Link href="/register">Inscrivez-vous Gratuitement</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-16 px-12 rounded-[2rem] border-white/20 text-white font-black uppercase tracking-widest text-xs hover:bg-white hover:text-slate-900 transition-all">
                <Link href="/pricing">Voir les Plans Pro</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Card({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("bg-white", className)}>
      {children}
    </div>
  );
}

function GraduationCap({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("lucide lucide-graduation-cap", className)}>
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}
