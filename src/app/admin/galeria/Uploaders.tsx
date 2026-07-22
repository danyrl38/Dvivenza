"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";

import {
  createUploadTicket,
  registerGalleryMedia,
  setSiteMediaFromPath,
} from "./actions";

const BUCKET = "galeria";
const MAX_MB = 50;

/** Sube un archivo directo a Supabase con una URL firmada. Devuelve la ruta. */
async function uploadDirect(
  file: File,
  prefix = "",
): Promise<{ ok: true; path: string } | { ok: false; error: string }> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return {
      ok: false,
      error:
        "Falta configurar Supabase en el navegador (NEXT_PUBLIC_SUPABASE_URL / ANON_KEY).",
    };
  }

  if (file.size > MAX_MB * 1024 * 1024) {
    return {
      ok: false,
      error: `"${file.name}" pesa más de ${MAX_MB} MB. Reduce su tamaño e inténtalo de nuevo.`,
    };
  }

  const isVideo = file.type.startsWith("video/");
  const ticket = await createUploadTicket(file.name, isVideo, prefix);
  if (!ticket.ok) return { ok: false, error: ticket.error };

  const { error } = await supabase.storage
    .from(BUCKET)
    .uploadToSignedUrl(ticket.path, ticket.token, file);

  if (error) {
    return { ok: false, error: `No se pudo subir "${file.name}": ${error.message}` };
  }
  return { ok: true, path: ticket.path };
}

function Message({ error, info }: { error: string | null; info: string | null }) {
  if (error) {
    return (
      <p className="mt-2 rounded-xl bg-dorado/10 px-3 py-2 text-xs text-dorado">
        {error}
      </p>
    );
  }
  if (info) {
    return <p className="mt-2 text-xs text-cafe">{info}</p>;
  }
  return null;
}

// -----------------------------------------------------------------------------
// Subida de medios a la galería (varios archivos a la vez)
// -----------------------------------------------------------------------------
export function GalleryUploader() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [alt, setAlt] = useState("");
  const [busy, setBusy] = useState(false);
  const [info, setInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const files = Array.from(inputRef.current?.files ?? []);
    if (files.length === 0) return;

    setBusy(true);
    setError(null);
    let done = 0;

    for (const file of files) {
      const isVideo = file.type.startsWith("video/");
      if (!isVideo && !file.type.startsWith("image/")) continue;

      setInfo(`Subiendo ${done + 1} de ${files.length}: ${file.name}…`);

      const up = await uploadDirect(file);
      if (!up.ok) {
        setError(up.error);
        break;
      }

      const reg = await registerGalleryMedia(
        up.path,
        isVideo ? "video" : "image",
        alt,
      );
      if (!reg.ok) {
        setError(reg.error ?? "No se pudo registrar el archivo.");
        break;
      }
      done += 1;
    }

    setBusy(false);
    setInfo(done > 0 ? `Listo: ${done} archivo(s) subido(s).` : null);
    if (inputRef.current) inputRef.current.value = "";
    setAlt("");
    router.refresh();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl border border-beige bg-white p-6 shadow-soft-sm"
    >
      <p className="text-sm text-cafe">
        Sube varias imágenes o videos a la vez (JPG, PNG, WEBP, MP4, WEBM).
        Hasta {MAX_MB} MB por archivo — se suben directo a tu almacenamiento.
      </p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="block flex-1">
          <span className="mb-1 block text-sm font-medium text-chocolate">
            Archivos
          </span>
          <input
            ref={inputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            required
            disabled={busy}
            className="block w-full rounded-2xl border border-beige bg-marfil px-3 py-2 text-sm text-chocolate file:mr-3 file:rounded-full file:border-0 file:bg-chocolate file:px-4 file:py-1.5 file:text-marfil disabled:opacity-60"
          />
        </label>

        <label className="block flex-1">
          <span className="mb-1 block text-sm font-medium text-chocolate">
            Descripción (opcional)
          </span>
          <input
            type="text"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            disabled={busy}
            placeholder="Ej. Retrato de familia"
            className="block w-full rounded-2xl border border-beige bg-marfil px-3 py-2.5 text-sm text-chocolate focus:border-dorado focus:outline-none disabled:opacity-60"
          />
        </label>

        <button
          type="submit"
          disabled={busy}
          className="rounded-full bg-dorado px-6 py-2.5 text-sm font-semibold text-marfil transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? "Subiendo…" : "Subir"}
        </button>
      </div>

      <Message error={error} info={info} />
    </form>
  );
}

// -----------------------------------------------------------------------------
// Reemplazo de un hueco fijo (portada o producto)
// -----------------------------------------------------------------------------
export function SlotUploader({ slot }: { slot: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [info, setInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const file = inputRef.current?.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Selecciona una imagen.");
      return;
    }

    setBusy(true);
    setError(null);
    setInfo("Subiendo…");

    const up = await uploadDirect(file, "site/");
    if (!up.ok) {
      setError(up.error);
      setBusy(false);
      setInfo(null);
      return;
    }

    const res = await setSiteMediaFromPath(slot, up.path);
    setBusy(false);
    if (!res.ok) {
      setError(res.error ?? "No se pudo guardar la imagen.");
      setInfo(null);
      return;
    }

    setInfo("Imagen actualizada.");
    if (inputRef.current) inputRef.current.value = "";
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-auto space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        required
        disabled={busy}
        className="block w-full rounded-xl border border-beige bg-marfil px-2 py-1.5 text-xs text-chocolate file:mr-2 file:rounded-full file:border-0 file:bg-chocolate file:px-3 file:py-1 file:text-marfil disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-full bg-dorado px-3 py-1.5 text-xs font-semibold text-marfil transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy ? "Subiendo…" : "Reemplazar imagen"}
      </button>
      <Message error={error} info={info} />
    </form>
  );
}
