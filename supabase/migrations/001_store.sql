-- PORWAL GHARANA store foundation
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role text not null default 'customer' check (role in ('customer','admin')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  image_url text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  code text not null unique,
  name text not null,
  slug text not null unique,
  description text,
  price numeric(12,2) not null check (price >= 0),
  mrp numeric(12,2) not null check (mrp >= price),
  image_url text,
  images jsonb not null default '[]'::jsonb,
  colors jsonb not null default '[]'::jsonb,
  sizes jsonb not null default '[]'::jsonb,
  rating numeric(3,2) not null default 0,
  reviews_count int not null default 0,
  stock int not null default 0 check (stock >= 0),
  is_featured boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  sku text not null unique,
  color text,
  size text,
  price numeric(12,2),
  mrp numeric(12,2),
  stock int not null default 0 check (stock >= 0),
  image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  type text not null check (type in ('percentage','fixed')),
  value numeric(12,2) not null check (value >= 0),
  min_cart_value numeric(12,2) not null default 0,
  max_discount numeric(12,2),
  usage_limit int,
  used_count int not null default 0,
  per_customer_limit int,
  starts_at timestamptz,
  ends_at timestamptz,
  first_order_only boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.delivery_rules (
  id uuid primary key default gen_random_uuid(),
  min_items int not null default 1,
  max_items int,
  charge numeric(12,2) not null default 0,
  free_shipping boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  name text not null,
  email text,
  phone text,
  address text,
  city text,
  pin text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_id uuid references public.customers(id) on delete set null,
  user_id uuid references public.profiles(id) on delete set null,
  customer_name text not null,
  customer_phone text not null,
  address text not null,
  city text not null,
  pin text not null,
  subtotal numeric(12,2) not null default 0,
  product_discount numeric(12,2) not null default 0,
  coupon_code text,
  coupon_discount numeric(12,2) not null default 0,
  delivery_charge numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  payment_method text not null default 'test' check (payment_method in ('test','razorpay','cod')),
  payment_status text not null default 'pending' check (payment_status in ('pending','paid','failed','refunded')),
  status text not null default 'new' check (status in ('new','processing','shipped','delivered','cancelled')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_code text not null,
  product_name text not null,
  sku text,
  color text,
  size text,
  quantity int not null check (quantity > 0),
  unit_price numeric(12,2) not null check (unit_price >= 0),
  line_total numeric(12,2) not null check (line_total >= 0)
);

create table if not exists public.store_settings (
  id boolean primary key default true check (id),
  store_name text not null default 'PORWAL GHARANA',
  support_phone text,
  support_email text,
  instagram text,
  free_shipping_threshold numeric(12,2),
  store_open boolean not null default true,
  updated_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin' and p.is_active = true); $$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$ begin insert into public.profiles(id, full_name) values(new.id, coalesce(new.raw_user_meta_data->>'full_name', '')) on conflict (id) do nothing; return new; end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

insert into public.categories(name,slug,sort_order) values
('Silk Sarees','silk-sarees',1),('Banarasi','banarasi',2),('Designer','designer',3),('Festive','festive',4),('Daily Wear','daily-wear',5),('Party Wear','party-wear',6)
on conflict (slug) do nothing;

insert into public.delivery_rules(min_items,max_items,charge,free_shipping) values
(1,2,99,false),(3,null,0,true)
on conflict do nothing;

insert into public.store_settings(id) values(true) on conflict (id) do nothing;

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.coupons enable row level security;
alter table public.delivery_rules enable row level security;
alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.store_settings enable row level security;

drop policy if exists "public read active categories" on public.categories;
create policy "public read active categories" on public.categories for select using (is_active = true or public.is_admin());
drop policy if exists "public read active products" on public.products;
create policy "public read active products" on public.products for select using (is_active = true or public.is_admin());
drop policy if exists "public read active variants" on public.product_variants;
create policy "public read active variants" on public.product_variants for select using (is_active = true or public.is_admin());
drop policy if exists "public read settings" on public.store_settings;
create policy "public read settings" on public.store_settings for select using (true);

create policy "admin profiles" on public.profiles for all using (public.is_admin() or id = auth.uid()) with check (public.is_admin() or id = auth.uid());
create policy "admin categories" on public.categories for all using (public.is_admin()) with check (public.is_admin());
create policy "admin products" on public.products for all using (public.is_admin()) with check (public.is_admin());
create policy "admin variants" on public.product_variants for all using (public.is_admin()) with check (public.is_admin());
create policy "admin coupons" on public.coupons for all using (public.is_admin()) with check (public.is_admin());
create policy "admin delivery" on public.delivery_rules for all using (public.is_admin()) with check (public.is_admin());
create policy "admin customers" on public.customers for all using (public.is_admin() or user_id = auth.uid()) with check (public.is_admin() or user_id = auth.uid());
create policy "customer create orders" on public.orders for insert with check (user_id = auth.uid() or auth.uid() is null);
create policy "customer read own orders" on public.orders for select using (public.is_admin() or user_id = auth.uid());
create policy "admin orders" on public.orders for update using (public.is_admin()) with check (public.is_admin());
create policy "admin order items" on public.order_items for all using (public.is_admin() or exists(select 1 from public.orders o where o.id=order_id and o.user_id=auth.uid())) with check (public.is_admin() or exists(select 1 from public.orders o where o.id=order_id and o.user_id=auth.uid()));
create policy "admin settings" on public.store_settings for all using (public.is_admin()) with check (public.is_admin());

create index if not exists products_category_idx on public.products(category_id);
create index if not exists products_active_idx on public.products(is_active, is_featured);
create index if not exists variants_product_idx on public.product_variants(product_id);
create index if not exists orders_created_idx on public.orders(created_at desc);
create index if not exists orders_status_idx on public.orders(status, payment_status);
create index if not exists customers_phone_idx on public.customers(phone);
