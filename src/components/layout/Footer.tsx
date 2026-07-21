import Link from "next/link";

import { CONTACT } from "@/lib/contact";

const socials = [
  { label: "Instagram", href: CONTACT.instagram },
  { label: "TikTok", href: CONTACT.tiktok },
  { label: "WhatsApp", href: CONTACT.whatsappUrl },
  { label: "Correo", href: `mailto:${CONTACT.email}` },
];

const legals = [
  { label: "Políticas", href: "/politicas" },
  { label: "Aviso de privacidad", href: "/privacidad" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-beige/50 bg-arena/40">
      <div className="container-content py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          {/* Marca */}
          <div className="max-w-sm">
            <p className="font-serif text-3xl font-semibold text-chocolate">
              Dvivenza
            </p>
            <p className="mt-4 text-pretty leading-relaxed text-cafe">
              Transformamos tus recuerdos en obras de arte personalizadas, hechas a
              mano para conservar tus momentos más importantes.
            </p>
            <Link
              href="/pedido"
              className="mt-6 inline-block font-serif text-lg text-dorado link-underline"
            >
              Crear mi obra →
            </Link>
          </div>

          {/* Contacto / redes */}
          <nav aria-label="Redes y contacto">
            <h3 className="eyebrow mb-5">Síguenos</h3>
            <ul className="space-y-3">
              {socials.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="text-cafe transition-colors hover:text-chocolate link-underline"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Legales */}
          <nav aria-label="Enlaces legales">
            <h3 className="eyebrow mb-5">Legal</h3>
            <ul className="space-y-3">
              {legals.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-cafe transition-colors hover:text-chocolate link-underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-beige/50 pt-8 text-sm text-cafe md:flex-row">
          <p>© {year} Dvivenza. Todos los derechos reservados.</p>
          <p className="text-cafe/70">Arte personalizado hecho a mano.</p>
        </div>
      </div>
    </footer>
  );
}
