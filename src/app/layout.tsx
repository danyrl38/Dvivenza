import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dvivenza.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Dvivenza — Transformamos tus recuerdos en obras de arte",
    template: "%s · Dvivenza",
  },
  description:
    "Creamos retratos y piezas personalizadas hechas a mano que convierten tus momentos más importantes en recuerdos para toda la vida.",
  keywords: [
    "retratos personalizados",
    "arte personalizado",
    "cuadros personalizados",
    "retratos de mascotas",
    "regalos personalizados",
    "arte hecho a mano",
    "Dvivenza",
  ],
  authors: [{ name: "Dvivenza" }],
  creator: "Dvivenza",
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: siteUrl,
    siteName: "Dvivenza",
    title: "Dvivenza — Transformamos tus recuerdos en obras de arte",
    description:
      "Retratos y piezas personalizadas hechas a mano para conservar tus momentos más importantes.",
    images: [
      {
        url: "/images/hero.jpg",
        width: 2000,
        height: 1125,
        alt: "Obra de arte personalizada de Dvivenza",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dvivenza — Transformamos tus recuerdos en obras de arte",
    description:
      "Retratos y piezas personalizadas hechas a mano para conservar tus momentos más importantes.",
    images: ["/images/hero.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: siteUrl,
  },
};

export const viewport: Viewport = {
  themeColor: "#F8F5F1",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${cormorant.variable} ${manrope.variable}`}>
      <body>
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-chocolate focus:px-5 focus:py-2 focus:text-sm focus:text-marfil"
        >
          Saltar al contenido
        </a>
        <Navbar />
        <main id="contenido">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
