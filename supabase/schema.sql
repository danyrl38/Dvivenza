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
