import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Toaster } from "sonner";
import { LSFBuddy } from "@/components/ai/LSFBuddy";
import { CookieBanner } from "@/components/gdpr/CookieBanner";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "LSFCONNECT - Trouvez votre expert en Langue des Signes Française",
  description: "Plateforme SaaS d'élite pour l'apprentissage de la LSF et la mise en relation avec des experts (médical, juridique, social).",
  manifest: "/manifest.json",
  themeColor: "#E11D48",
  openGraph: {
    title: "LSFCONNECT | Expertise & Formation LSF",
    description: "Rejoignez la plateforme leader pour maîtriser la Langue des Signes Française.",
    url: "https://lsfconnect.fr",
    siteName: "LSFCONNECT",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LSFCONNECT | Expertise LSF",
    description: "Trouvez votre expert LSF en quelques clics.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${outfit.variable} ${plusJakarta.variable} font-sans antialiased min-h-screen flex flex-col bg-background`}
      >
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <footer className="border-t border-stone-200 bg-stone-50">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-between gap-4 py-8 md:h-24 md:flex-row">
            <p className="text-balance text-center text-sm leading-loose text-stone-600 md:text-left font-medium">
              &copy; 2026 LSFCONNECT. Tous droits réservés.
            </p>
            <div className="flex items-center gap-6 text-sm text-stone-500">
              <a href="#" className="hover:text-indigo-900 transition-colors">Confidentialité</a>
              <a href="#" className="hover:text-indigo-900 transition-colors">CGU</a>
              <a href="#" className="hover:text-indigo-900 transition-colors">Contact</a>
            </div>
          </div>
        </footer>
        <Toaster position="top-center" richColors />
        <LSFBuddy />
        <CookieBanner />
      </body>
    </html>
  );
}
