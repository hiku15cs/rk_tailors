-- Run this script in the Supabase SQL Editor.
-- Public visitors can browse active designs. Order records are private; customer
-- tracking is provided through lookup_order(order number + phone), which returns
-- only non-identifying progress details.

create extension if not exists pgcrypto with schema extensions;

create table if not exists public.designs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text not null,
  category text not null check (category in ('Blouse', 'Kurti', 'Suit', 'Gents')),
  starting_price numeric not null check (starting_price >= 0),
  image_url text not null,
  tags text[] not null default '{}',
  is_active boolean not null default true
);

create index if not exists designs_active_created_at_idx
  on public.designs (is_active, created_at desc);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_no text unique not null,
  customer_name text not null,
  customer_phone text not null,
  garment_type text not null,
  status text not null default 'Received'
    check (status in ('Received', 'Cutting', 'Stitching', 'Ready for Trial', 'Delivered')),
  trial_date date,
  total_amount numeric check (total_amount is null or total_amount >= 0),
  created_at timestamptz not null default now()
);

create index if not exists orders_created_at_idx
  on public.orders (created_at desc);

alter table public.designs enable row level security;
alter table public.orders enable row level security;

drop policy if exists "Public can read active designs" on public.designs;
create policy "Public can read active designs"
  on public.designs
  for select
  to anon, authenticated
  using (is_active = true);

drop policy if exists "Authenticated users can manage designs" on public.designs;
create policy "Authenticated users can manage designs"
  on public.designs
  for all
  to authenticated
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

-- Customer contact data must never be readable by the anon role. Dashboard
-- access and all order writes require a Supabase-authenticated user.
drop policy if exists "Authenticated users can read orders" on public.orders;
create policy "Authenticated users can read orders"
  on public.orders
  for select
  to authenticated
  using (auth.uid() is not null);

drop policy if exists "Authenticated users can insert orders" on public.orders;
create policy "Authenticated users can insert orders"
  on public.orders
  for insert
  to authenticated
  with check (auth.uid() is not null);

drop policy if exists "Authenticated users can update orders" on public.orders;
create policy "Authenticated users can update orders"
  on public.orders
  for update
  to authenticated
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

drop policy if exists "Authenticated users can delete orders" on public.orders;
create policy "Authenticated users can delete orders"
  on public.orders
  for delete
  to authenticated
  using (auth.uid() is not null);

grant select on public.designs to anon, authenticated;
grant insert, update, delete on public.designs to authenticated;
grant select, insert, update, delete on public.orders to authenticated;
revoke all on public.orders from anon;

-- Narrow customer order tracking: require both the order number and phone.
-- The response intentionally excludes customer name and phone.
create or replace function public.lookup_order(
  p_order_no text,
  p_customer_phone text
)
returns table (
  order_no text,
  garment_type text,
  status text,
  trial_date date,
  total_amount numeric,
  created_at timestamptz
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    o.order_no,
    o.garment_type,
    o.status,
    o.trial_date,
    o.total_amount,
    o.created_at
  from public.orders as o
  where lower(o.order_no) = lower(trim(p_order_no))
    and regexp_replace(o.customer_phone, '[^0-9]', '', 'g')
      = regexp_replace(coalesce(p_customer_phone, ''), '[^0-9]', '', 'g')
  limit 1;
$$;

revoke all on function public.lookup_order(text, text) from public;
grant execute on function public.lookup_order(text, text) to anon, authenticated;

-- Public design image delivery; only authenticated users can upload or delete.
insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'design-images',
  'design-images',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read design images" on storage.objects;
create policy "Public can read design images"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'design-images');

drop policy if exists "Authenticated users can upload design images" on storage.objects;
create policy "Authenticated users can upload design images"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'design-images' and auth.uid() is not null);

drop policy if exists "Authenticated users can delete design images" on storage.objects;
create policy "Authenticated users can delete design images"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'design-images' and auth.uid() is not null);
