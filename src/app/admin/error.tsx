"use client";

import { useEffect } from "react";

// -----------------------------------------------------------------------------
// Límite de error del panel: si algo falla en el cliente, mostramos un mensaje
// claro con opción de reintentar en lugar de una pantalla en blanco.
// -----------------------------------------------------------------------------

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[admin] Error en el panel:", error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-marfil px-6">
      <div className="w-full max-w-md rounded-3xl border border-beige bg-white p-8 text-center shadow-soft-sm">
        <h1 className="font-serif text-2xl text-chocolate">
          Algo salió mal en el panel
        </h1>
        <p className="mt-3 text-sm text-cafe">
          No se pudo completar la operación. Vuelve a intentarlo; si el problema
          persiste, recarga la página.
        </p>
        {error.message && (
          <p className="mt-4 break-words rounded-xl bg-arena/40 px-3 py-2 text-left text-xs text-cafe">
            {error.message}
          </p>
        )}
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={reset}
            className="rounded-full bg-chocolate px-5 py-2 text-sm font-medium text-marfil transition-colors hover:bg-cafe"
          >
            Reintentar
          </button>
          <a
            href="/admin/galeria"
            className="rounded-full border border-beige px-5 py-2 text-sm text-chocolate transition-colors hover:bg-arena/40"
          >
            Volver al panel
          </a>
        </div>
      </div>
    </main>
  );
}
