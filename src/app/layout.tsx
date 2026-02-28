import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
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
  title: "LSFCONNECT | Formation LSF & Interprétation Professionnelle",
  description: "La plateforme SaaS leader pour maîtriser la Langue des Signes Française. Formations certifiantes (Médical, Juridique, Social) et mise en relation avec des experts LSF.",
  keywords: ["LSF", "Langue des Signes Française", "Formation LSF", "Interprète LSF", "Accessibilité", "E-learning LSF", "LSF Médical", "LSF Juridique"],
  manifest: "/manifest.json",
  themeColor: "#E11D48",
  openGraph: {
    title: "LSFCONNECT | L'Expertise LSF à portée de main",
    description: "Devenez expert en LSF ou trouvez un interprète certifié pour vos besoins professionnels.",
    url: "https://lsfconnect.fr",
    siteName: "LSFCONNECT",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LSFCONNECT | Le Futur de l'Inclusion LSF",
    description: "Apprenez la LSF avec des pros. Plateforme certifiante et innovante.",
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
        <Footer />
        <Toaster position="top-center" richColors />
        <LSFBuddy />
        <CookieBanner />
      </body>
    </html>
  );
}
