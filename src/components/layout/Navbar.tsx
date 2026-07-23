"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/#como-funciona", label: "Cómo funciona" },
  { href: "/galeria", label: "Galería" },
  { href: "/#antes-despues", label: "Antes y después" },
  { href: "/#productos", label: "Productos" },
  { href: "/#opiniones", label: "Opiniones" },
  { href: "/#faq", label: "Preguntas" },
];

function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      href="/"
      className="flex shrink-0 items-center gap-2.5"
      onClick={onClick}
      aria-label="D'Vivenza — inicio"
    >
      {/* El logo es un PNG con transparencia: se muestra sin recuadro ni sombra. */}
      <span className="relative block h-11 w-11 shrink-0 md:h-14 md:w-14">
        <Image
          src="/images/logo.png"
          alt="Logo de D'Vivenza"
          fill
          sizes="56px"
          className="object-contain"
          priority
        />
      </span>
      <span className="font-serif text-2xl font-semibold tracking-wide text-chocolate md:text-3xl">
        D&apos;Vivenza
      </span>
    </Link>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Bloquear scroll del fondo y cerrar con Escape mientras el menú está abierto.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled
          ? "border-b border-beige/40 bg-marfil/90 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <nav className="container-content flex h-16 items-center justify-between gap-4 md:h-20">
        <Logo onClick={() => setOpen(false)} />

        <ul className="hidden items-center gap-6 lg:flex xl:gap-8">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="link-underline whitespace-nowrap text-sm font-medium text-chocolate/80 transition-colors hover:text-chocolate"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden shrink-0 lg:block">
          <Button href="/pedido" size="sm">
            Crear mi obra
          </Button>
        </div>

        {/* Botón abrir menú (móvil) */}
        <button
          type="button"
          className="-mr-2 flex h-11 w-11 shrink-0 flex-col items-center justify-center gap-1.5 lg:hidden"
          aria-label="Abrir menú"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(true)}
        >
          <span className="h-0.5 w-6 rounded-full bg-chocolate" />
          <span className="h-0.5 w-6 rounded-full bg-chocolate" />
          <span className="h-0.5 w-6 rounded-full bg-chocolate" />
        </button>
      </nav>

      {/* Menú móvil: overlay a pantalla completa. Siempre visible cuando está
          abierto (no depende de animaciones JS para mostrarse). */}
      {open && (
        <div
          id="mobile-menu"
          className="animate-fade-up fixed inset-0 z-[60] flex flex-col bg-marfil lg:hidden"
        >
          <div className="container-content flex h-16 items-center justify-between md:h-20">
            <Logo onClick={() => setOpen(false)} />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Cerrar menú"
              className="-mr-2 flex h-11 w-11 items-center justify-center rounded-full text-2xl text-chocolate transition-colors hover:bg-arena/50"
            >
              ✕
            </button>
          </div>

          <nav className="container-content flex flex-1 flex-col overflow-y-auto pb-10 pt-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block border-b border-beige/40 py-4 font-serif text-2xl text-chocolate transition-colors hover:text-dorado"
              >
                {link.label}
              </Link>
            ))}

            <Button
              href="/pedido"
              size="lg"
              className="mt-8 w-full justify-center"
              onClick={() => setOpen(false)}
            >
              Crear mi obra
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
