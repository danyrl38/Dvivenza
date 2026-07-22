import type {
  ArtType,
  BudgetRange,
  FaqItem,
  GalleryCategory,
  GalleryItem,
  HowStep,
  Product,
  Testimonial,
} from "./types";

// -----------------------------------------------------------------------------
// Contenido editorial del sitio. Todo el texto y las referencias a imágenes
// viven aquí para facilitar su edición sin tocar los componentes.
// -----------------------------------------------------------------------------

export const HERO = {
  eyebrow: "Arte personalizado hecho a mano",
  title: "Transformamos tus recuerdos en obras de arte.",
  subtitle:
    "Creamos retratos y piezas personalizadas que convierten tus momentos más importantes en recuerdos para toda la vida.",
  primaryCta: "Crear mi obra",
  secondaryCta: "Ver galería",
} as const;

export const HOW_STEPS: HowStep[] = [
  {
    number: "01",
    title: "Sube tus fotografías",
    description:
      "Comparte las imágenes que guardan ese momento. Nosotros cuidamos cada detalle.",
  },
  {
    number: "02",
    title: "Cuéntanos tu idea",
    description:
      "Describe la historia, los colores y la emoción que quieres conservar para siempre.",
  },
  {
    number: "03",
    title: "Recibe tu obra",
    description:
      "Creamos una pieza hecha especialmente para ti, lista para acompañarte toda la vida.",
  },
];

export const GALLERY_FILTERS: { value: GalleryCategory | "todos"; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "retratos", label: "Retratos" },
  { value: "mascotas", label: "Mascotas" },
  { value: "parejas", label: "Parejas" },
  { value: "familia", label: "Familia" },
  { value: "prendas", label: "Prendas" },
  { value: "fundas", label: "Fundas" },
];

// Generado a partir del material fotográfico optimizado en /public/images/gallery
export const GALLERY: GalleryItem[] = [
  { id: "retratos-1", src: "/images/gallery/retratos-1.jpg", category: "retratos", width: 1179, height: 1177, alt: "Retrato personalizado pintado a mano" },
  { id: "retratos-2", src: "/images/gallery/retratos-2.jpg", category: "retratos", width: 1179, height: 950, alt: "Retrato artístico sobre fotografía" },
  { id: "retratos-3", src: "/images/gallery/retratos-3.jpg", category: "retratos", width: 1179, height: 1167, alt: "Retrato personalizado en tonos cálidos" },
  { id: "retratos-4", src: "/images/gallery/retratos-4.jpg", category: "retratos", width: 1179, height: 944, alt: "Ilustración de retrato hecha a mano" },
  { id: "retratos-5", src: "/images/gallery/retratos-5.jpg", category: "retratos", width: 1400, height: 788, alt: "Obra de arte personalizada enmarcada" },
  { id: "retratos-6", src: "/images/gallery/retratos-6.jpg", category: "retratos", width: 720, height: 1280, alt: "Retrato vertical hecho a mano" },
  { id: "retratos-7", src: "/images/gallery/retratos-7.jpg", category: "retratos", width: 1400, height: 788, alt: "Detalle de retrato personalizado" },
  { id: "mascotas-1", src: "/images/gallery/mascotas-1.jpg", category: "mascotas", width: 828, height: 828, alt: "Retrato de mascota personalizado" },
  { id: "mascotas-2", src: "/images/gallery/mascotas-2.jpg", category: "mascotas", width: 780, height: 757, alt: "Ilustración de gato hecha a mano" },
  { id: "mascotas-3", src: "/images/gallery/mascotas-3.jpg", category: "mascotas", width: 646, height: 1400, alt: "Retrato vertical de mascota" },
  { id: "mascotas-4", src: "/images/gallery/mascotas-4.jpg", category: "mascotas", width: 1400, height: 788, alt: "Obra personalizada de mascota" },
  { id: "mascotas-5", src: "/images/gallery/mascotas-5.jpg", category: "mascotas", width: 1400, height: 788, alt: "Retrato artístico de mascota" },
  { id: "mascotas-6", src: "/images/gallery/mascotas-6.jpg", category: "mascotas", width: 1400, height: 788, alt: "Retrato de perro hecho a mano" },
  { id: "mascotas-7", src: "/images/gallery/mascotas-7.jpg", category: "mascotas", width: 1400, height: 788, alt: "Ilustración de mascota personalizada" },
  { id: "mascotas-8", src: "/images/gallery/mascotas-8.jpg", category: "mascotas", width: 1400, height: 1050, alt: "Retrato de mascota en tonos cálidos" },
  { id: "mascotas-9", src: "/images/gallery/mascotas-9.jpg", category: "mascotas", width: 1400, height: 1050, alt: "Obra de arte de mascota" },
  { id: "mascotas-10", src: "/images/gallery/mascotas-10.jpg", category: "mascotas", width: 1400, height: 1050, alt: "Retrato personalizado de perro" },
  { id: "mascotas-11", src: "/images/gallery/mascotas-11.jpg", category: "mascotas", width: 1400, height: 788, alt: "Detalle de retrato de mascota" },
  { id: "mascotas-12", src: "/images/gallery/mascotas-12.jpg", category: "mascotas", width: 1400, height: 788, alt: "Ilustración artística de mascota" },
  { id: "parejas-1", src: "/images/gallery/parejas-1.jpg", category: "parejas", width: 960, height: 1280, alt: "Retrato de pareja personalizado" },
  { id: "parejas-2", src: "/images/gallery/parejas-2.jpg", category: "parejas", width: 1400, height: 788, alt: "Obra de arte para parejas" },
  { id: "parejas-3", src: "/images/gallery/parejas-3.jpg", category: "parejas", width: 1400, height: 788, alt: "Retrato de pareja hecho a mano" },
  { id: "familia-1", src: "/images/gallery/familia-1.jpg", category: "familia", width: 646, height: 1400, alt: "Retrato familiar personalizado" },
  { id: "familia-2", src: "/images/gallery/familia-2.jpg", category: "familia", width: 646, height: 1400, alt: "Obra de arte familiar" },
  { id: "familia-3", src: "/images/gallery/familia-3.jpg", category: "familia", width: 646, height: 1400, alt: "Retrato de familia hecho a mano" },
  { id: "prendas-1", src: "/images/gallery/prendas-1.jpg", category: "prendas", width: 1125, height: 1400, alt: "Prenda personalizada pintada a mano" },
  { id: "fundas-1", src: "/images/gallery/fundas-1.jpg", category: "fundas", width: 646, height: 1400, alt: "Funda personalizada con arte" },
];

export const PRODUCTS: Product[] = [
  {
    slug: "retrato-pintado",
    name: "Retrato pintado a mano",
    description:
      "Una obra original creada a partir de tu fotografía favorita, con la calidez del trazo hecho a mano.",
    productionTime: "2 a 3 semanas",
    image: "/images/products/retrato.jpg",
    artType: "retrato",
  },
  {
    slug: "cuadro-personalizado",
    name: "Cuadro personalizado",
    description:
      "Piezas listas para colgar que transforman tus recuerdos en el centro de cualquier espacio.",
    productionTime: "2 a 4 semanas",
    image: "/images/products/cuadro.jpg",
    artType: "familia",
  },
  {
    slug: "funda-personalizada",
    name: "Funda personalizada",
    description:
      "Lleva tu obra contigo. Fundas resistentes con arte hecho especialmente para ti.",
    productionTime: "1 a 2 semanas",
    image: "/images/products/funda.jpg",
    artType: "funda",
  },
  {
    slug: "prenda-personalizada",
    name: "Prenda personalizada",
    description:
      "Ropa intervenida a mano que convierte una imagen especial en una pieza única para vestir.",
    productionTime: "2 a 3 semanas",
    image: "/images/products/prenda.jpg",
    artType: "prenda",
  },
  {
    slug: "arte-para-regalos",
    name: "Arte para regalos",
    description:
      "El detalle perfecto y memorable. Obras pensadas para emocionar en fechas importantes.",
    productionTime: "2 a 3 semanas",
    image: "/images/products/regalo.jpg",
    artType: "otro",
  },
  {
    slug: "accesorios",
    name: "Accesorios",
    description:
      "Pequeñas piezas con gran significado, personalizadas con el mismo cuidado artesanal.",
    productionTime: "1 a 2 semanas",
    image: "/images/products/accesorio.jpg",
    artType: "otro",
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "María Fernanda",
    location: "Ciudad de México",
    quote:
      "El retrato superó todas mis expectativas. Capturaron la esencia de mi mamá de una forma que me hizo llorar de felicidad.",
    avatar: "/images/avatars/avatar-1.jpg",
    rating: 5,
  },
  {
    id: "t2",
    name: "Alejandro R.",
    location: "Guadalajara",
    quote:
      "Pedí un cuadro de mi perro y quedó espectacular. Se nota el amor y el detalle en cada pincelada. Un regalo inolvidable.",
    avatar: "/images/avatars/avatar-2.jpg",
    rating: 5,
  },
  {
    id: "t3",
    name: "Sofía L.",
    location: "Monterrey",
    quote:
      "La experiencia completa se sintió premium desde el primer mensaje. La obra final es una joya que conservaré toda la vida.",
    avatar: "/images/avatars/avatar-3.jpg",
    rating: 5,
  },
];

export const FAQS: FaqItem[] = [
  {
    question: "¿Cómo empiezo mi pedido?",
    answer:
      "Muy sencillo. Entra a la página de pedido, sube tus fotografías, cuéntanos tu idea y nosotros nos encargamos del resto. Te enviaremos una cotización personalizada.",
  },
  {
    question: "¿Cuánto tarda en estar lista mi obra?",
    answer:
      "El tiempo de producción depende del tipo de pieza, normalmente entre 1 y 4 semanas. Si necesitas una fecha específica, podemos ofrecer un servicio urgente.",
  },
  {
    question: "¿Qué tipo de fotografías necesito?",
    answer:
      "Entre más nítidas y con buena iluminación, mejor. Puedes subir hasta 20 imágenes de referencia para que capturemos cada detalle importante.",
  },
  {
    question: "¿Hacen envíos?",
    answer:
      "Sí. Realizamos envíos a todo el país con empaque especial que protege tu obra. Los costos y tiempos se confirman en tu cotización.",
  },
  {
    question: "¿Puedo pedir un estilo o colores específicos?",
    answer:
      "Por supuesto. Cada obra es única y trabajamos contigo para reflejar el estilo, los colores y la emoción que imaginas.",
  },
  {
    question: "¿Cómo se realiza el pago?",
    answer:
      "Tras aprobar tu cotización, solicitamos un anticipo para comenzar y el resto al finalizar. Te acompañamos en todo el proceso por WhatsApp.",
  },
];

// --- Opciones del formulario de pedido ------------------------------------

export const ART_TYPE_OPTIONS: { value: ArtType; label: string; description: string }[] = [
  { value: "retrato", label: "Retrato", description: "Una persona protagonista" },
  { value: "mascota", label: "Mascota", description: "Tu compañero de vida" },
  { value: "pareja", label: "Pareja", description: "Dos personas y su historia" },
  { value: "familia", label: "Familia", description: "Varios seres queridos" },
  { value: "prenda", label: "Prenda", description: "Arte para vestir" },
  { value: "funda", label: "Funda", description: "Lleva tu arte contigo" },
  { value: "otro", label: "Otro", description: "Cuéntanos tu idea" },
];

export const BUDGET_OPTIONS: { value: BudgetRange; label: string }[] = [
  { value: "sin-presupuesto", label: "No tengo presupuesto" },
  { value: "menos-2000", label: "Menos de $2,000" },
  { value: "2000-4000", label: "$2,000 – $4,000" },
  { value: "4000-8000", label: "$4,000 – $8,000" },
  { value: "mas-8000", label: "Más de $8,000" },
];

export const SIZE_OPTIONS = [
  "Pequeño (hasta 20×30 cm)",
  "Mediano (30×40 cm)",
  "Grande (40×60 cm)",
  "Extra grande (60×90 cm)",
  "No estoy seguro/a",
];

export const MATERIAL_OPTIONS = [
  "Canvas / Lienzo",
  "Papel fine art",
  "Madera",
  "Acrílico",
  "Digital",
  "No estoy seguro/a",
];

export const FRAME_OPTIONS = [
  "Sin marco",
  "Marco de madera natural",
  "Marco negro minimalista",
  "Marco dorado mate",
  "No estoy seguro/a",
];

export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
];

export const MAX_REFERENCE_IMAGES = 20;
export const MAX_FILE_SIZE_MB = 15;

// --- Comparaciones "antes / después" (foto original → obra pintada) --------

export interface Comparison {
  id: string;
  antes: string; // foto de referencia
  despues: string; // obra final pintada a mano
  label: string;
}

export const COMPARISONS: Comparison[] = [
  {
    id: "amigos",
    antes: "/images/comparativa/amigos-antes.jpg",
    despues: "/images/comparativa/amigos-despues.jpg",
    label: "Amigos",
  },
  {
    id: "familia",
    antes: "/images/comparativa/familia-antes.jpg",
    despues: "/images/comparativa/familia-despues.jpg",
    label: "Familia",
  },
  {
    id: "gatos",
    antes: "/images/comparativa/gatos-antes.jpg",
    despues: "/images/comparativa/gatos-despues.jpg",
    label: "Mascotas",
  },
];
