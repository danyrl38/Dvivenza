"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { useOrder } from "@/components/order/OrderContext";
import { MAX_REFERENCE_IMAGES } from "@/lib/data";
import { cn, formatBytes } from "@/lib/utils";

export function StepReferences() {
  const { references, addReferences, removeReference } = useOrder();
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const remaining = MAX_REFERENCE_IMAGES - references.length;

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files?.length) addReferences(e.dataTransfer.files);
  };

  return (
    <div>
      {/* Zona de drop */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        aria-label="Subir imágenes de referencia"
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed px-6 py-14 text-center transition-all duration-300",
          dragging
            ? "border-dorado bg-arena/50"
            : "border-beige bg-arena/10 hover:border-cafe/40 hover:bg-arena/20",
          remaining <= 0 && "pointer-events-none opacity-50",
        )}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-arena/60 text-2xl text-cafe">
          ↑
        </div>
        <p className="mt-4 font-medium text-chocolate">
          Arrastra tus imágenes aquí o haz clic para seleccionar
        </p>
        <p className="mt-1 text-sm text-cafe/70">
          JPG, PNG, WEBP o HEIC · hasta {MAX_REFERENCE_IMAGES} imágenes
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) addReferences(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {references.length > 0 && (
        <div className="mt-5 flex items-center justify-between text-sm text-cafe">
          <span>
            {references.length} de {MAX_REFERENCE_IMAGES} imágenes
          </span>
          <span className="text-cafe/60">{remaining} disponibles</span>
        </div>
      )}

      {/* Vista previa */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {references.map((ref) => (
            <motion.div
              key={ref.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              className="group relative aspect-square overflow-hidden rounded-2xl border border-beige bg-arena/40"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ref.previewUrl}
                alt={ref.file.name}
                className="h-full w-full object-cover"
              />

              {/* Barra de carga */}
              {ref.status !== "done" && (
                <div className="absolute inset-x-0 bottom-0 h-1 bg-marfil/40">
                  <motion.div
                    className="h-full bg-dorado"
                    initial={{ width: 0 }}
                    animate={{ width: `${ref.progress}%` }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
              )}

              {/* Overlay + eliminar */}
              <div className="absolute inset-0 flex items-start justify-end bg-chocolate/0 p-2 transition-colors duration-300 group-hover:bg-chocolate/20">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeReference(ref.id);
                  }}
                  aria-label={`Eliminar ${ref.file.name}`}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-marfil/90 text-chocolate opacity-0 shadow-soft-sm transition-opacity duration-300 hover:bg-marfil group-hover:opacity-100"
                >
                  ✕
                </button>
              </div>

              <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-chocolate/70 to-transparent px-2 pb-1 pt-4 text-[11px] text-marfil">
                {formatBytes(ref.file.size)}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <p className="mt-6 text-sm text-cafe/70">
        Este paso es opcional, pero entre más referencias compartas, mejor
        capturaremos tu idea.
      </p>
    </div>
  );
}
