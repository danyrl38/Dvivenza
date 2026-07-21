# Dvivenza

> Transformamos tus recuerdos en obras de arte personalizadas.

Sitio web premium para una marca boutique de arte personalizado, construido con
**Next.js 15**, **React 19**, **TypeScript**, **Tailwind CSS** y **Framer Motion**.
Incluye un asistente de pedido de 8 pasos y está preparado para integrarse con
**Supabase** (base de datos + almacenamiento de imágenes) y desplegarse en **Vercel**.

---

## ✨ Características

- **Diseño premium y editorial** inspirado en marcas como Apple, Aesop y Jenni Kayne.
- **Paleta cálida** (marfil, arena, beige, café, chocolate, dorado mate) y tipografías
  Cormorant Garamond + Manrope.
- **Home completo**: Hero, Cómo funciona, Galería tipo masonry con filtros,
  Productos, Opiniones (carrusel), Preguntas frecuentes (acordeón) y CTA de cierre.
- **Asistente de pedido `/pedido`** en 8 pasos: datos del cliente, tipo de obra,
  descripción, subida de referencias (drag & drop, vista previa, barra de carga,
  hasta 20 imágenes), detalles, fecha de entrega con aviso de urgencia, presupuesto
  y resumen.
- **Microanimaciones** con Framer Motion, scroll suave, transiciones de ~300 ms,
  skeletons de carga y hover elegante.
- **Accesibilidad**: navegación por teclado, `aria-*`, foco visible, `prefers-reduced-motion`.
- **SEO**: metadatos Open Graph/Twitter, `sitemap.xml`, `robots.txt` y datos
  estructurados JSON-LD.
- **100% responsive** (móvil y escritorio).

---

## 🗂️ Estructura del proyecto

```
src/
├── app/
│   ├── layout.tsx          # Layout raíz, fuentes, SEO global
│   ├── page.tsx            # Home (todas las secciones + JSON-LD)
│   ├── globals.css         # Estilos base y utilidades
│   ├── loading.tsx         # Skeleton de carga
│   ├── not-found.tsx       # Página 404
│   ├── sitemap.ts          # Sitemap dinámico
│   ├── robots.ts           # robots.txt
│   ├── pedido/page.tsx     # Página del asistente de pedido
│   ├── politicas/          # Página legal
│   ├── privacidad/         # Aviso de privacidad
│   └── api/pedido/route.ts # Endpoint que guarda el pedido en Supabase
├── components/
│   ├── layout/             # Navbar, Footer, LegalLayout
│   ├── sections/           # Hero, HowItWorks, Gallery, Products, Testimonials, FAQ, ClosingCTA
│   ├── ui/                 # Button, Section, Reveal, Skeleton
│   └── order/              # OrderContext, OrderWizard, Stepper, fields, steps/
├── lib/
│   ├── data.ts             # Contenido editorial (galería, productos, FAQs...)
│   ├── types.ts            # Tipos compartidos
│   ├── motion.ts           # Variantes de Framer Motion
│   ├── contact.ts          # Datos de contacto (env)
│   ├── utils.ts            # Utilidades
│   └── supabase/           # Clientes de Supabase (browser + server)
└── ...
public/images/              # Imágenes optimizadas (galería, productos, avatares, hero)
supabase/schema.sql         # Esquema SQL para Supabase
```

---

## 🚀 Puesta en marcha (local)

Requisitos: **Node.js 18.18+** (recomendado 20 LTS).

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.local.example .env.local
# (edita .env.local con tus valores)

# 3. Ejecutar en desarrollo
npm run dev
```

Abre <http://localhost:3000>.

> **Nota:** El sitio funciona en **modo demo** sin Supabase: el formulario de
> pedido se envía correctamente y responde con un mensaje de éxito, pero los datos
> no se persisten hasta configurar Supabase.

---

## 🗄️ Configurar Supabase

1. Crea un proyecto en <https://supabase.com>.
2. En **SQL Editor**, ejecuta el contenido de [`supabase/schema.sql`](supabase/schema.sql)
   para crear la tabla `orders`.
3. En **Storage**, crea un bucket llamado `referencias` (privado).
4. Copia tus credenciales desde **Project Settings → API** a `.env.local`:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=referencias
   ```

Las imágenes de referencia se suben desde el navegador al bucket y el pedido se
guarda en la tabla `orders` mediante la ruta `/api/pedido` (con la Service Role Key
en el servidor).

---

## 🐙 Subir a GitHub

El repositorio ya está inicializado con un commit inicial. Para publicarlo:

```bash
# Crea un repo vacío en github.com (sin README) y luego:
git remote add origin https://github.com/<tu-usuario>/dvivenza.git
git branch -M main
git push -u origin main
```

O con GitHub CLI:

```bash
gh repo create dvivenza --private --source=. --push
```

---

## ▲ Desplegar en Vercel

1. Entra a <https://vercel.com/new> e importa el repositorio de GitHub.
2. Vercel detecta Next.js automáticamente (no requiere configuración extra).
3. En **Settings → Environment Variables**, agrega las mismas variables de
   `.env.local`.
4. Despliega. `vercel.json` ya incluye cabeceras de seguridad y caché.

---

## 🎨 Personalización rápida

- **Textos y contenido**: `src/lib/data.ts`.
- **Colores y tipografías**: `tailwind.config.ts`.
- **Datos de contacto / redes**: variables `NEXT_PUBLIC_*` en `.env.local`.
- **Imágenes**: reemplaza los archivos en `public/images/` (mantén las rutas).

---

## 📝 Scripts

| Comando         | Descripción                     |
| --------------- | ------------------------------- |
| `npm run dev`   | Servidor de desarrollo          |
| `npm run build` | Compilación de producción       |
| `npm run start` | Servir la compilación           |
| `npm run lint`  | Linter (ESLint)                 |

---

Hecho con cariño para **Dvivenza** · Arte personalizado hecho a mano.
