"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

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
      aria-label="Dvivenza — inicio"
    >
      <span className="relative block h-10 w-10 overflow-hidden rounded-xl shadow-soft-sm ring-1 ring-chocolate/10 md:h-12 md:w-12">
        <Image
          src="/images/logo.png"
          alt="Logo de Dvivenza"
          fill
          sizes="48px"
          className="object-cover"
          priority
        />
      </span>
      <span className="font-serif text-2xl font-semibold tracking-wide text-chocolate md:text-3xl">
        Dvivenza
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

  // Bloquear scroll y cerrar con Escape cuando el menú está abierto.
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
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled || open
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

        {/* Botón menú móvil */}
        <button
          type="button"
          className="relative z-50 -mr-2 flex h-11 w-11 shrink-0 flex-col items-center justify-center gap-1.5 lg:hidden"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className={cn(
              "h-0.5 w-6 rounded-full bg-chocolate transition-all duration-300",
              open && "translate-y-2 rotate-45",
            )}
          />
          <span
            className={cn(
              "h-0.5 w-6 rounded-full bg-chocolate transition-all duration-300",
              open && "opacity-0",
            )}
          />
          <span
            className={cn(
              "h-0.5 w-6 rounded-full bg-chocolate transition-all duration-300",
              open && "-translate-y-2 -rotate-45",
            )}
          />
        </button>
      </nav>

      {/* Menú móvil */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 top-16 z-40 overflow-y-auto overscroll-contain bg-marfil md:top-20 lg:hidden"
          >
            <div className="container-content flex min-h-full flex-col gap-1 py-8">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i + 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block border-b border-beige/40 py-4 font-serif text-2xl text-chocolate transition-colors hover:text-dorado sm:text-3xl"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8"
              >
                <Button
                  href="/pedido"
                  size="lg"
                  className="w-full justify-center"
                  onClick={() => setOpen(false)}
                >
                  Crear mi obra
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
