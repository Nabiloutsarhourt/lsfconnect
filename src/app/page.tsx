"use client";

import Link from "next/link";
import { LSFVideoPlayer } from "@/components/ui-custom/LSFVideoPlayer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ShieldCheck, Lightning, HandWaving, ArrowRight,
  GlobeSimple, Users, Trophy, ChatCircle,
  Gavel, Stethoscope, Briefcase, Heart,
  Quotes, Play, Star, CheckCircle, Sparkle
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import Image from "next/image";

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
};

export default function Home() {
  return (
    <div className="flex flex-col overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-12 pb-20 gradient-hero overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-indigo-200/40 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-amber-200/30 rounded-full blur-[120px] pointer-events-none" />

        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <motion.div
              className="lg:col-span-6 flex flex-col gap-8"
              initial="initial"
              animate="animate"
              variants={staggerContainer}
            >
              <motion.div
                variants={fadeInUp}
                className="inline-flex items-center gap-2 w-fit rounded-full border border-indigo-200 bg-white/80 backdrop-blur px-4 py-2 text-xs font-semibold text-indigo-900 shadow-sm"
              >
                <Sparkle size={16} weight="duotone" className="text-amber-500" />
                La traduction d'excellence
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] text-slate-900"
              >
                L'Expertise en{" "}
                <span className="text-gradient">Traduction</span>
                <br />
                Entre Vos Mains.
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-lg md:text-xl text-stone-600 max-w-xl leading-relaxed"
              >
                Réservez instantanément un traducteur ou un interprète certifié (LSF et Langues Parlées) avec la plateforme SaaS la plus performante.
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap gap-4 pt-2"
              >
                <Link
                  href="/register"
                  data-testid="hero-cta-primary"
                  className="inline-flex items-center gap-3 px-8 py-4 text-base font-semibold text-white bg-indigo-900 hover:bg-indigo-800 rounded-full shadow-xl shadow-indigo-900/20 transition-all hover:shadow-2xl active:scale-[0.98]"
                >
                  Commencer l'Aventure
                  <ArrowRight size={20} weight="bold" />
                </Link>
                <Link
                  href="/how-it-works"
                  data-testid="hero-cta-secondary"
                  className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-indigo-900 bg-white hover:bg-indigo-50 border-2 border-indigo-100 rounded-full transition-colors"
                >
                  <Play size={20} weight="fill" />
                  Voir la Démo
                </Link>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="flex items-center gap-6 pt-6 border-t border-stone-200"
              >
                <div className="flex -space-x-3">
                  {[
                    "https://images.unsplash.com/photo-1666113604293-d34734339acb?w=100&h=100&fit=crop",
                    "https://images.unsplash.com/photo-1657771072153-878f8b0ce74a?w=100&h=100&fit=crop",
                    "https://images.unsplash.com/photo-1542577731-5ee4fc6152d2?w=100&h=100&fit=crop"
                  ].map((url, i) => (
                    <div
                      key={i}
                      className="w-11 h-11 rounded-full border-3 border-white bg-stone-100 overflow-hidden shadow-md"
                    >
                      <Image
                        src={url}
                        alt="Expert"
                        width={44}
                        height={44}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  <div className="w-11 h-11 rounded-full border-3 border-white bg-indigo-900 flex items-center justify-center text-white text-xs font-bold shadow-md">
                    +500
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} size={14} weight="fill" className="text-amber-400" />
                    ))}
                    <span className="text-sm font-semibold text-slate-900 ml-1">4.9</span>
                  </div>
                  <span className="text-xs font-medium text-stone-500">+500 experts vérifiés</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Content - Video */}
            <motion.div
              className="lg:col-span-6 relative"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="absolute -inset-4 bg-indigo-900/10 rounded-[2rem] blur-2xl pointer-events-none" />
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900">
                <LSFVideoPlayer
                  src="https://www.w3schools.com/html/mov_bbb.mp4"
                  title="Introduction à LSFCONNECT"
                  hasLSFInterpretation={true}
                  className="w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 flex items-center gap-3">
                  <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-white">
                    <Play size={20} weight="fill" />
                  </div>
                  <span className="text-white font-semibold text-sm">Découvrez nos services</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Domains */}
      <section className="py-20 bg-white border-y border-stone-100">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="flex flex-col items-center mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-3">Domaines d'Intervention</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-900">
              L'expertise <span className="text-gradient">Omniprésente</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { name: "Judiciaire", icon: Gavel, color: "bg-blue-600", desc: "Tribunaux, avocats", slug: "judicial" },
              { name: "Médical", icon: Stethoscope, color: "bg-rose-500", desc: "Hôpitaux, cliniques", slug: "medical" },
              { name: "Commercial", icon: Briefcase, color: "bg-indigo-900", desc: "Réunions, RH", slug: "commercial" },
              { name: "Social", icon: Heart, color: "bg-emerald-600", desc: "Famille, éducation", slug: "social" },
            ].map((domain, i) => (
              <Link
                key={i}
                href={`/domains/${domain.slug}`}
                className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-stone-50 hover:bg-white hover:shadow-xl border border-transparent hover:border-stone-100 transition-colors group cursor-pointer"
              >
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110 group-hover:-rotate-3",
                  domain.color
                )}>
                  <domain.icon size={28} weight="duotone" />
                </div>
                <div className="text-center">
                  <span className="text-base font-bold text-slate-900 block group-hover:text-indigo-900 transition-colors">{domain.name}</span>
                  <span className="text-xs text-stone-500">{domain.desc}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 md:py-32 container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-3 block">Pourquoi Nous Choisir</span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-slate-900 max-w-3xl mx-auto">
            Une plateforme pensée pour <span className="text-gradient">l'accessibilité</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Experts Vérifiés",
              description: "Chaque interprète subit une vérification manuelle de ses diplômes et obtient un badge 'Expert Certifié'.",
              icon: ShieldCheck,
              tag: "Confiance"
            },
            {
              title: "Matching Rapide",
              description: "Besoin d'aide immédiate ? Notre algorithme vous connecte à un expert disponible en moins de 5 minutes.",
              icon: Lightning,
              tag: "Rapidité"
            },
            {
              title: "Traduction & Interprétation",
              description: "Plateforme unifiée pour toutes vos demandes : Langue des Signes Française (LSF) et multiples langues étrangères.",
              icon: GlobeSimple,
              tag: "Polyvalence"
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              className="group relative p-8 md:p-10 rounded-3xl bg-white border border-stone-100 card-hover"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-stone-100 group-hover:bg-indigo-600 rounded-t-3xl transition-colors" />

              <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-900 group-hover:bg-indigo-900 group-hover:text-white transition-all mb-8">
                <feature.icon size={28} weight="duotone" />
              </div>

              <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">{feature.tag}</span>
              <h3 className="font-heading text-2xl font-bold text-slate-900 mt-2 mb-4">{feature.title}</h3>
              <p className="text-stone-600 leading-relaxed">{feature.description}</p>

              <div className="mt-8 pt-6 border-t border-stone-100 flex justify-end">
                <div className="p-2 rounded-xl bg-stone-50 text-stone-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors">
                  <ArrowRight size={20} weight="bold" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-indigo-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/20 rounded-full blur-[150px] pointer-events-none" />

        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {[
              { label: "Utilisateurs", value: "10K+", icon: Users },
              { label: "Experts Certifiés", value: "500+", icon: ShieldCheck },
              { label: "Certificats", value: "3.2K", icon: Trophy },
              { label: "Échanges", value: "45K", icon: ChatCircle },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="w-14 h-14 rounded-2xl bg-white/10 mx-auto flex items-center justify-center text-amber-400 mb-5">
                  <stat.icon size={28} weight="duotone" />
                </div>
                <h4 className="font-heading text-4xl md:text-5xl font-bold tracking-tight">{stat.value}</h4>
                <p className="text-sm font-medium text-indigo-200 mt-2 uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 md:py-32 bg-stone-50/50">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-3 block">Témoignages</span>
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-slate-900">
              Leurs <span className="text-gradient">Histoires</span> de Succès
            </h2>
            <p className="text-stone-600 mt-4 max-w-2xl mx-auto">
              Découvrez comment LSFCONNECT transforme le quotidien des apprenants et professionnels.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Marie L.",
                role: "Infirmière",
                content: "Grâce au module Médical, je peux enfin communiquer avec mes patients sourds en toute autonomie. Une révolution pour ma pratique.",
                avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
                domain: "Médical"
              },
              {
                name: "Thomas D.",
                role: "Étudiant Droit",
                content: "Le lexique Juridique est d'une précision incroyable. La plateforme m'a permis de valider mon stage en cabinet avec brio.",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
                domain: "Juridique"
              },
              {
                name: "Sophie R.",
                role: "Consultante RH",
                content: "L'interface est d'une fluidité rare. Les experts réservés via la plateforme sont d'un professionnalisme exemplaire.",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
                domain: "Entreprise"
              }
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                className="p-8 rounded-3xl bg-white border border-stone-100 card-hover"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-stone-100">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      width={56}
                      height={56}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{testimonial.name}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">{testimonial.domain}</span>
                      <CheckCircle size={14} weight="fill" className="text-emerald-500" />
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <Quotes size={32} weight="fill" className="text-stone-100 absolute -top-2 -left-1" />
                  <p className="text-stone-600 leading-relaxed relative z-10 pl-4">
                    "{testimonial.content}"
                  </p>
                </div>

                <div className="mt-6 pt-6 border-t border-stone-100 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} weight="fill" className="text-amber-400" />)}
                  </div>
                  <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">Avis vérifié</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="relative rounded-[2.5rem] gradient-primary p-12 md:p-20 overflow-hidden text-center text-white shadow-2xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-amber-400/20 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center gap-8 max-w-3xl mx-auto">
            <HandWaving size={56} weight="duotone" className="text-amber-400" />

            <h2 className="font-heading text-3xl md:text-5xl font-bold leading-tight">
              Prêt à Faciliter Vos{" "}
              <span className="text-amber-400">Échanges Internationaux ?</span>
            </h2>

            <p className="text-lg md:text-xl text-indigo-200 max-w-2xl">
              Rejoignez la plateforme de référence et collaborez avec les meilleurs traducteurs et interprètes.
            </p>

            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-indigo-900 bg-white hover:bg-stone-50 rounded-full shadow-xl transition-shadow hover:shadow-2xl active:scale-[0.98]"
              >
                Inscrivez-vous Gratuitement
                <ArrowRight size={20} weight="bold" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white border-2 border-white/20 hover:bg-white/10 rounded-full transition-colors"
              >
                Voir les Plans Pro
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

function GraduationCap({ size, weight, className }: { size?: number; weight?: string; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 256 256" className={className}>
      <path fill="currentColor" d="M251.76 88.94l-120-64a8 8 0 00-7.52 0l-120 64a8 8 0 000 14.12L32 117.87v48.42a15.91 15.91 0 004.06 10.65C49.16 191.53 78.51 216 128 216a130 130 0 0048-8.76V240a8 8 0 0016 0v-40.49a115.63 115.63 0 0027.94-22.57 15.91 15.91 0 004.06-10.65v-48.42l27.76-14.81a8 8 0 000-14.12zM128 200c-43.27 0-68.72-21.14-80-33.71V126.4l76.24 40.66a8 8 0 007.52 0L176 143.47v46.34c-12.6 5.88-28.31 10.19-48 10.19zm80-33.75a97.83 97.83 0 01-16 14.25V134.93l16-8.53zm-80-20.59L43.76 96 128 46.34 212.24 96z" />
    </svg>
  );
}
