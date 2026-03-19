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
  title: "LSFCONNECT | Interprétation & Traduction Professionnelle",
  description: "La plateforme leader pour trouver des interprètes et traducteurs certifiés (LSF, Langues parlées, Médical, Juridique, Entreprise).",
  keywords: ["Interprète", "Traducteur", "Traduction", "LSF", "Langue des Signes", "Accessibilité", "Langues étrangères"],
  manifest: "/manifest.json",
  themeColor: "#E11D48",
  openGraph: {
    title: "LSFCONNECT | L'Expertise en Interprétation à portée de main",
    description: "Trouvez un interprète ou traducteur certifié pour vos besoins professionnels.",
    url: "https://lsfconnect.fr",
    siteName: "LSFCONNECT",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LSFCONNECT | L'Excellence en Interprétation et Traduction",
    description: "Réservez les meilleurs professionnels certifiés. Plateforme innovante et réactive.",
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
