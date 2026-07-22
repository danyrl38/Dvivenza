"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/Button";
import { Section, SectionHeading } from "@/components/ui/Section";
import { COMPARISONS } from "@/lib/data";
import { VIEWPORT } from "@/lib/motion";

// -----------------------------------------------------------------------------
// Comparador "antes / después" interactivo:
//  · Se desliza solo en bucle mientras nadie lo toca.
//  · El usuario puede arrastrarlo (ratón o dedo) o usar las flechas del teclado.
//  · Tras unos segundos sin interacción, vuelve a moverse solo.
// La posición se aplica directamente al DOM (sin re-render) para ir fluido.
// -----------------------------------------------------------------------------

const SWEEP_SECONDS = 7;
const RESUME_DELAY_MS = 4000;

function Comparator({
  antes,
  despues,
  label,
}: {
  antes: string;
  despues: string;
  label: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(50);
  const manualRef = useRef(false);
  const draggingRef = useRef(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const apply = useCallback((p: number) => {
    const v = Math.max(2, Math.min(98, p));
    posRef.current = v;
    if (overlayRef.current) {
      overlayRef.current.style.clipPath = `inset(0 ${100 - v}% 0 0)`;
    }
    if (dividerRef.current) {
      dividerRef.current.style.left = `${v}%`;
    }
  }, []);

  // Barrido automático mientras no haya interacción.
  useEffect(() => {
    let raf = 0;
    let start: number | null = null;
    const loop = (t: number) => {
      if (!manualRef.current) {
        if (start === null) start = t;
        const elapsed = (t - start) / 1000;
        const phase = (elapsed / SWEEP_SECONDS) * Math.PI * 2;
        apply(50 + 34 * Math.sin(phase));
      } else {
        start = null;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [apply]);

  useEffect(
    () => () => {
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    },
    [],
  );

  const scheduleResume = () => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => {
      manualRef.current = false;
    }, RESUME_DELAY_MS);
  };

  const fromClientX = (clientX: number) => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    apply(((clientX - r.left) / r.width) * 100);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    manualRef.current = true;
    draggingRef.current = true;
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    e.currentTarget.setPointerCapture(e.pointerId);
    fromClientX(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    fromClientX(e.clientX);
  };

  const endDrag = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* el puntero ya se liberó */
    }
    scheduleResume();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    manualRef.current = true;
    apply(posRef.current + (e.key === "ArrowRight" ? 4 : -4));
    scheduleResume();
  };

  return (
    <figure>
      <div
        ref={wrapRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={onKeyDown}
        role="slider"
        tabIndex={0}
        aria-label={`Comparar antes y después: ${label}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={50}
        className="relative aspect-[4/3] cursor-ew-resize touch-pan-y select-none overflow-hidden rounded-3xl border border-beige/50 shadow-soft focus-visible:ring-2 focus-visible:ring-dorado"
      >
        {/* Después (obra final): capa base */}
        <Image
          src={despues}
          alt={`${label} — obra final pintada a mano`}
          fill
          sizes="(max-width: 640px) 100vw, 50vw"
          className="pointer-events-none object-cover"
        />

        {/* Antes (fotografía original): capa recortada */}
        <div
          ref={overlayRef}
          className="pointer-events-none absolute inset-0"
          style={{ clipPath: "inset(0 50% 0 0)" }}
        >
          <Image
            src={antes}
            alt={`${label} — fotografía original`}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        {/* Divisor arrastrable */}
        <div
          ref={dividerRef}
          className="pointer-events-none absolute inset-y-0 z-10 w-[3px] -translate-x-1/2 bg-marfil shadow-[0_0_10px_rgba(58,42,44,0.35)]"
          style={{ left: "50%" }}
        >
          <span className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-marfil text-sm font-semibold text-chocolate shadow-soft">
            ⇆
          </span>
        </div>

        {/* Etiquetas */}
        <span className="pointer-events-none absolute left-3 top-3 z-10 rounded-full bg-chocolate/75 px-3 py-1 text-xs font-medium text-marfil backdrop-blur-sm">
          Antes
        </span>
        <span className="pointer-events-none absolute right-3 top-3 z-10 rounded-full bg-dorado/90 px-3 py-1 text-xs font-medium text-marfil backdrop-blur-sm">
          Después
        </span>
      </div>
      <figcaption className="mt-3 text-center text-sm font-medium text-cafe">
        {label}
      </figcaption>
    </figure>
  );
}

export function BeforeAfter() {
  if (COMPARISONS.length === 0) return null;

  return (
    <Section id="antes-despues" className="bg-arena/20">
      <SectionHeading
        eyebrow="Antes y después"
        title="De la foto a la obra"
        description="Arrastra el control de cada pieza para comparar la fotografía original con la obra pintada a mano."
      />
      <div className="mx-auto mt-14 grid max-w-4xl gap-8 sm:grid-cols-2">
        {COMPARISONS.map((c) => (
          <Comparator
            key={c.id}
            antes={c.antes}
            despues={c.despues}
            label={c.label}
          />
        ))}
      </div>

      {/* CTA de la sección */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.5 }}
        className="mx-auto mt-16 max-w-2xl rounded-3xl border border-beige/60 bg-marfil p-8 text-center shadow-soft-sm md:p-10"
      >
        <h3 className="font-serif text-2xl text-chocolate md:text-3xl">
          Tu foto también puede ser una obra
        </h3>
        <p className="mx-auto mt-3 max-w-lg text-pretty text-cafe">
          Envíanos la fotografía que más significado tenga para ti y la
          convertimos en una pieza pintada a mano.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="/pedido" size="lg">
            Transformar mi foto
          </Button>
          <Button href="/galeria" variant="secondary" size="lg">
            Ver más obras
          </Button>
        </div>
      </motion.div>
    </Section>
  );
}
