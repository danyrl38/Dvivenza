import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Gallery } from "@/components/sections/Gallery";
import { BeforeAfter } from "@/components/sections/BeforeAfter";
import { Products } from "@/components/sections/Products";
import { Testimonials } from "@/components/sections/Testimonials";
import { FAQ } from "@/components/sections/FAQ";
import { ClosingCTA } from "@/components/sections/ClosingCTA";
import { FAQS } from "@/lib/data";
import { getGalleryMedia } from "@/lib/gallery";
import { getSiteMedia } from "@/lib/siteMedia";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dvivenza.com";

// Regenera la home cada 5 min (y al vuelo cuando editas la galería).
export const revalidate = 300;

// Datos estructurados para SEO (JSON-LD)
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "Dvivenza",
      url: siteUrl,
      description:
        "Retratos y piezas personalizadas hechas a mano para conservar tus momentos más importantes.",
      slogan: "Transformamos tus recuerdos en obras de arte.",
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQS.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
  ],
};

export default async function HomePage() {
  const [galleryMedia, siteMedia] = await Promise.all([
    getGalleryMedia(),
    getSiteMedia(),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero
        imageSrc={siteMedia["hero"]}
        productImageSrc={siteMedia["hero-producto"]}
      />
      <HowItWorks />
      <Gallery media={galleryMedia} />
      <BeforeAfter />
      <Products images={siteMedia} />
      <Testimonials />
      <FAQ />
      <ClosingCTA />
    </>
  );
}
