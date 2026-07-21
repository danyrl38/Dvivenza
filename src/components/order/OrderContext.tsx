"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  getSupabaseBrowserClient,
  STORAGE_BUCKET,
} from "@/lib/supabase/client";
import type {
  ArtType,
  OrderFormData,
  ReferenceImage,
} from "@/lib/types";
import { isValidEmail, uid } from "@/lib/utils";

export const STEPS = [
  { key: "cliente", title: "Información", subtitle: "Cuéntanos quién eres" },
  { key: "tipo", title: "Tipo de obra", subtitle: "¿Qué quieres crear?" },
  { key: "descripcion", title: "Descripción", subtitle: "La historia detrás" },
  { key: "referencias", title: "Referencias", subtitle: "Sube tus fotos" },
  { key: "detalles", title: "Detalles", subtitle: "Afinemos la pieza" },
  { key: "fecha", title: "Entrega", subtitle: "¿Para cuándo?" },
  { key: "presupuesto", title: "Presupuesto", subtitle: "Opcional" },
  { key: "resumen", title: "Resumen", subtitle: "Revisa y envía" },
] as const;

export const TOTAL_STEPS = STEPS.length;

const initialData: OrderFormData = {
  fullName: "",
  email: "",
  whatsapp: "",
  city: "",
  country: "México",
  artType: null,
  description: "",
  peopleCount: "",
  size: "",
  material: "",
  frame: "",
  customText: "",
  specialColors: "",
  desiredDate: "",
  budget: "",
};

type SubmitState = "idle" | "submitting" | "success" | "error";

interface OrderContextValue {
  step: number;
  data: OrderFormData;
  references: ReferenceImage[];
  submitState: SubmitState;
  submitMessage: string;
  setField: <K extends keyof OrderFormData>(key: K, value: OrderFormData[K]) => void;
  addReferences: (files: FileList | File[]) => void;
  removeReference: (id: string) => void;
  next: () => void;
  prev: () => void;
  goTo: (index: number) => void;
  isStepValid: (index: number) => boolean;
  submit: () => Promise<void>;
}

const OrderContext = createContext<OrderContextValue | null>(null);

export function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrder debe usarse dentro de <OrderProvider>");
  return ctx;
}

export function OrderProvider({
  children,
  initialArtType,
}: {
  children: React.ReactNode;
  initialArtType?: ArtType | null;
}) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OrderFormData>({
    ...initialData,
    artType: initialArtType ?? null,
  });
  const [references, setReferences] = useState<ReferenceImage[]>([]);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [submitMessage, setSubmitMessage] = useState("");
  const progressTimers = useRef<Record<string, ReturnType<typeof setInterval>>>({});
  // Espejo de `references` para leer la longitud actual sin efectos en los updaters.
  const referencesRef = useRef<ReferenceImage[]>([]);
  useEffect(() => {
    referencesRef.current = references;
  }, [references]);

  const setField = useCallback(
    <K extends keyof OrderFormData>(key: K, value: OrderFormData[K]) => {
      setData((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  // Simula una barra de carga por imagen para dar feedback visual.
  const scheduleProgress = useCallback((id: string) => {
    const timer = setInterval(() => {
      setReferences((cur) =>
        cur.map((r) =>
          r.id === id
            ? {
                ...r,
                progress: Math.min(100, r.progress + 20),
                status: r.progress + 20 >= 100 ? "done" : "uploading",
              }
            : r,
        ),
      );
    }, 120);
    progressTimers.current[id] = timer;
    setTimeout(() => {
      clearInterval(progressTimers.current[id]);
      delete progressTimers.current[id];
    }, 900);
  }, []);

  const addReferences = useCallback(
    (files: FileList | File[]) => {
      const list = Array.from(files);
      const remaining = 20 - referencesRef.current.length;
      const accepted = list
        .filter((f) => f.type.startsWith("image/") || /\.(heic|heif)$/i.test(f.name))
        .filter((f) => f.size <= 15 * 1024 * 1024)
        .slice(0, Math.max(0, remaining));

      if (accepted.length === 0) return;

      const newItems: ReferenceImage[] = accepted.map((file) => ({
        id: uid(),
        file,
        previewUrl: URL.createObjectURL(file),
        progress: 0,
        status: "uploading" as const,
      }));

      referencesRef.current = [...referencesRef.current, ...newItems];
      setReferences((prev) => [...prev, ...newItems]);
      newItems.forEach((item) => scheduleProgress(item.id));
    },
    [scheduleProgress],
  );

  const removeReference = useCallback((id: string) => {
    const target = referencesRef.current.find((r) => r.id === id);
    if (target) URL.revokeObjectURL(target.previewUrl);
    if (progressTimers.current[id]) {
      clearInterval(progressTimers.current[id]);
      delete progressTimers.current[id];
    }
    referencesRef.current = referencesRef.current.filter((r) => r.id !== id);
    setReferences((prev) => prev.filter((r) => r.id !== id));
  }, []);

  // Limpieza al desmontar: cancelar timers y liberar object URLs.
  useEffect(() => {
    const timers = progressTimers.current;
    return () => {
      Object.values(timers).forEach(clearInterval);
      referencesRef.current.forEach((r) => URL.revokeObjectURL(r.previewUrl));
    };
  }, []);

  const isStepValid = useCallback(
    (index: number): boolean => {
      switch (index) {
        case 0:
          return (
            data.fullName.trim().length > 1 &&
            isValidEmail(data.email) &&
            data.whatsapp.trim().length >= 7 &&
            data.city.trim().length > 0 &&
            data.country.trim().length > 0
          );
        case 1:
          return data.artType !== null;
        case 2:
          return data.description.trim().length >= 10;
        default:
          return true;
      }
    },
    [data],
  );

  const next = useCallback(() => {
    setStep((s) => Math.min(TOTAL_STEPS - 1, s + 1));
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  const prev = useCallback(() => {
    setStep((s) => Math.max(0, s - 1));
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  const goTo = useCallback((index: number) => {
    setStep(Math.max(0, Math.min(TOTAL_STEPS - 1, index)));
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  const submit = useCallback(async () => {
    setSubmitState("submitting");
    setSubmitMessage("");

    try {
      // 1) Subir referencias a Supabase Storage si está configurado.
      let referencePaths: string[] = [];
      const supabase = getSupabaseBrowserClient();

      if (supabase && references.length > 0) {
        const folder = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const uploads = await Promise.all(
          references.map(async (ref, i) => {
            const ext = ref.file.name.split(".").pop() || "jpg";
            const path = `${folder}/${i + 1}.${ext}`;
            const { error } = await supabase.storage
              .from(STORAGE_BUCKET)
              .upload(path, ref.file, { upsert: false });
            return error ? null : path;
          }),
        );
        referencePaths = uploads.filter((p): p is string => p !== null);
      }

      // 2) Enviar el pedido a la API.
      const res = await fetch("/api/pedido", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: data.fullName,
          email: data.email,
          whatsapp: data.whatsapp,
          city: data.city,
          country: data.country,
          artType: data.artType,
          description: data.description,
          peopleCount: data.peopleCount,
          size: data.size,
          material: data.material,
          frame: data.frame,
          customText: data.customText,
          specialColors: data.specialColors,
          desiredDate: data.desiredDate,
          budget: data.budget,
          referencePaths,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.error || "No pudimos enviar tu solicitud.");
      }

      setSubmitState("success");
      setSubmitMessage(
        json.message ||
          "¡Gracias! Recibimos tu solicitud y te enviaremos tu cotización muy pronto.",
      );
    } catch (err) {
      setSubmitState("error");
      setSubmitMessage(
        err instanceof Error
          ? err.message
          : "Ocurrió un error. Por favor, inténtalo de nuevo.",
      );
    }
  }, [data, references]);

  const value = useMemo<OrderContextValue>(
    () => ({
      step,
      data,
      references,
      submitState,
      submitMessage,
      setField,
      addReferences,
      removeReference,
      next,
      prev,
      goTo,
      isStepValid,
      submit,
    }),
    [
      step,
      data,
      references,
      submitState,
      submitMessage,
      setField,
      addReferences,
      removeReference,
      next,
      prev,
      goTo,
      isStepValid,
      submit,
    ],
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}
