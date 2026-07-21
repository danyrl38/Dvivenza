// -----------------------------------------------------------------------------
// Tipos compartidos de Dvivenza
// -----------------------------------------------------------------------------

export type GalleryCategory =
  | "retratos"
  | "mascotas"
  | "parejas"
  | "familia"
  | "prendas"
  | "fundas";

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  category: GalleryCategory;
  /** Dimensiones intrínsecas para el layout tipo masonry y next/image */
  width: number;
  height: number;
}

export interface Product {
  slug: string;
  name: string;
  description: string;
  productionTime: string;
  image: string;
  /** Tipo de obra preseleccionado al ir a /pedido */
  artType: ArtType;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  quote: string;
  avatar: string;
  rating: number;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface HowStep {
  number: string;
  title: string;
  description: string;
}

// --- Flujo de pedido -------------------------------------------------------

export type ArtType =
  | "retrato"
  | "mascota"
  | "pareja"
  | "familia"
  | "prenda"
  | "funda"
  | "otro";

export type BudgetRange =
  | "sin-presupuesto"
  | "menos-2000"
  | "2000-4000"
  | "4000-8000"
  | "mas-8000";

export interface ReferenceImage {
  id: string;
  file: File;
  previewUrl: string;
  progress: number; // 0 - 100
  status: "pending" | "uploading" | "done" | "error";
}

export interface OrderFormData {
  // Paso 1 — Cliente
  fullName: string;
  email: string;
  whatsapp: string;
  city: string;
  country: string;
  // Paso 2 — Tipo de obra
  artType: ArtType | null;
  // Paso 3 — Descripción
  description: string;
  // Paso 5 — Detalles
  peopleCount: string;
  size: string;
  material: string;
  frame: string;
  customText: string;
  specialColors: string;
  // Paso 6 — Fecha
  desiredDate: string; // ISO yyyy-mm-dd
  // Paso 7 — Presupuesto
  budget: BudgetRange | "";
}

/** Estructura que se persiste en Supabase (tabla `orders`). */
export interface OrderRecord {
  full_name: string;
  email: string;
  whatsapp: string;
  city: string;
  country: string;
  art_type: string;
  description: string;
  people_count: string | null;
  size: string | null;
  material: string | null;
  frame: string | null;
  custom_text: string | null;
  special_colors: string | null;
  desired_date: string | null;
  budget: string | null;
  reference_paths: string[];
  status: OrderStatus;
}

export type OrderStatus =
  | "nuevo"
  | "en_revision"
  | "cotizado"
  | "en_produccion"
  | "entregado"
  | "cancelado";
