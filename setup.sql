-- ═══════════════════════════════════════════════════════
-- DESPENSA APP — Script SQL para Supabase
-- Ejecuta esto en: Supabase > SQL Editor > New query
-- Si ya tenías las tablas creadas, ejecuta solo el ALTER TABLE al final
-- ═══════════════════════════════════════════════════════

-- 1. TABLA INVENTARIO
create table if not exists inventory (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  qty numeric not null default 0,
  unit text not null default 'ud',
  min_qty numeric not null default 1,
  category text not null default '📦 Otros',
  store text default '',
  price numeric default null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. TABLA LISTA DE LA COMPRA
create table if not exists shopping_list (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  qty text default '',
  store text default '',
  done boolean default false,
  auto boolean default false,
  created_at timestamptz default now()
);

-- 3. TABLA HISTORIAL DE CHAT
create table if not exists chat_history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz default now()
);

-- 4. ROW LEVEL SECURITY
alter table inventory enable row level security;
alter table shopping_list enable row level security;
alter table chat_history enable row level security;

-- 5. POLÍTICAS DE ACCESO
drop policy if exists "inventory_policy" on inventory;
create policy "inventory_policy" on inventory
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "shopping_policy" on shopping_list;
create policy "shopping_policy" on shopping_list
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "chat_policy" on chat_history;
create policy "chat_policy" on chat_history
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 6. REALTIME
alter publication supabase_realtime add table inventory;
alter publication supabase_realtime add table shopping_list;

-- ═══════════════════════════════════════════════════════
-- SI YA TENÍAS LAS TABLAS: ejecuta solo esto para añadir precio
-- ═══════════════════════════════════════════════════════
alter table inventory add column if not exists price numeric default null;

-- ✅ Listo.
