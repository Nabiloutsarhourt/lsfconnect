import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Toaster } from "sonner";

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
  description: "Plateforme de réservation d'interprètes et d'experts LSF en temps réel pour tous vos besoins (médical, juridique, social).",
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
      </body>
    </html>
  );
}
