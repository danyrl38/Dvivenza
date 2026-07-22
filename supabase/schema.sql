-- =============================================================================
-- Dvivenza — Esquema de base de datos (Supabase / PostgreSQL)
-- Ejecuta este script en el SQL Editor de tu proyecto de Supabase.
-- =============================================================================

-- Extensión para generar UUIDs.
create extension if not exists "pgcrypto";

-- Estado de los pedidos.
do $$
begin
  if not exists (select 1 from pg_type where typname = 'order_status') then
    create type order_status as enum (
      'nuevo',
      'en_revision',
      'cotizado',
      'en_produccion',
      'entregado',
      'cancelado'
    );
  end if;
end$$;

-- -----------------------------------------------------------------------------
-- Tabla principal de pedidos.
-- -----------------------------------------------------------------------------
create table if not exists public.orders (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  -- Cliente
  full_name       text not null,
  email           text not null,
  whatsapp        text,
  city            text,
  country         text,

  -- Obra
  art_type        text not null,
  description     text not null,
  people_count    text,
  size            text,
  material        text,
  frame           text,
  custom_text     text,
  special_colors  text,

  -- Logística
  desired_date    date,
  budget          text,

  -- Archivos (rutas dentro del bucket de Storage)
  reference_paths text[] not null default '{}',

  -- Gestión interna
  status          order_status not null default 'nuevo',
  comments        text
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_status_idx on public.orders (status);

-- Mantener updated_at al día.
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Seguridad a nivel de fila (RLS).
-- Los pedidos se insertan desde el servidor con la Service Role Key, que
-- ignora RLS. Dejamos RLS activado y SIN políticas públicas de lectura para
-- proteger los datos de los clientes. Gestiona los pedidos desde el panel de
-- Supabase o creando políticas para usuarios autenticados de tu equipo.
-- -----------------------------------------------------------------------------
alter table public.orders enable row level security;

-- =============================================================================
-- Storage: bucket para las imágenes de referencia.
-- Crea el bucket 'referencias' desde el panel (Storage) o con:
--   insert into storage.buckets (id, name, public) values ('referencias','referencias', false);
--
-- Política sugerida para permitir subidas anónimas al bucket 'referencias'
-- (solo INSERT). Ajusta según tus necesidades de seguridad.
-- =============================================================================
-- insert into storage.buckets (id, name, public)
--   values ('referencias', 'referencias', false)
--   on conflict (id) do nothing;
--
-- create policy "Subidas anónimas de referencias"
--   on storage.objects for insert to anon
--   with check (bucket_id = 'referencias');

-- =============================================================================
-- Galería editable: medios (imágenes/videos) que se muestran en la home.
-- El administrador los gestiona desde /admin/galeria. La home los lee en
-- público (RLS de solo lectura). Si la tabla está vacía, la web usa las
-- imágenes por defecto incluidas en el código.
-- =============================================================================
create table if not exists public.gallery_media (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  kind         text not null default 'image' check (kind in ('image', 'video')),
  storage_path text not null,
  public_url   text not null,
  alt          text not null default '',
  category     text not null default 'retratos',
  sort_order   int  not null default 0
);

create index if not exists gallery_media_order_idx
  on public.gallery_media (sort_order asc, created_at desc);

alter table public.gallery_media enable row level security;

-- Lectura pública de la galería (para mostrarla en la home).
drop policy if exists "Lectura publica de galeria" on public.gallery_media;
create policy "Lectura publica de galeria"
  on public.gallery_media for select to anon, authenticated
  using (true);

-- Bucket público donde viven las imágenes/videos de la galería.
insert into storage.buckets (id, name, public)
  values ('galeria', 'galeria', true)
  on conflict (id) do nothing;

-- =============================================================================
-- Imágenes editables de secciones fijas (portada / productos).
-- Cada "slot" identifica un hueco de imagen de la página:
--   'hero'                       → imagen de la portada
--   'product-<slug>'             → foto de cada tarjeta de producto
-- Si un slot no existe, la web usa la imagen por defecto del código.
-- =============================================================================
create table if not exists public.site_media (
  slot         text primary key,
  public_url   text not null,
  storage_path text,
  updated_at   timestamptz not null default now()
);

alter table public.site_media enable row level security;

drop policy if exists "Lectura publica de site_media" on public.site_media;
create policy "Lectura publica de site_media"
  on public.site_media for select to anon, authenticated
  using (true);
