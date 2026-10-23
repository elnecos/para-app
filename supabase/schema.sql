-- Para: schemat bazy. Serwer przechowuje tylko zaszyfrowane wpisy (nonce + box).
-- Wklej całość w Supabase: SQL Editor → New query → Run.

create extension if not exists pgcrypto;

create table if not exists public.pairs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now()
);

create table if not exists public.members (
  pair_id uuid not null references public.pairs(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('ona','on')),
  joined_at timestamptz not null default now(),
  primary key (pair_id, user_id)
);

create table if not exists public.events (
  id bigint generated always as identity primary key,
  pair_id uuid not null references public.pairs(id) on delete cascade,
  author uuid not null default auth.uid() references auth.users(id) on delete cascade,
  nonce text not null,
  box text not null,
  created_at timestamptz not null default now()
);
create index if not exists events_pair_idx on public.events(pair_id, id);

alter table public.pairs enable row level security;
alter table public.members enable row level security;
alter table public.events enable row level security;

-- Pary, do których należy zalogowany użytkownik
create or replace function public.my_pairs()
returns setof uuid language sql stable security definer set search_path = public as $$
  select pair_id from public.members where user_id = auth.uid()
$$;

drop policy if exists "pairs: członkowie widzą" on public.pairs;
create policy "pairs: członkowie widzą" on public.pairs
  for select to authenticated using (id in (select public.my_pairs()));

drop policy if exists "members: członkowie widzą" on public.members;
create policy "members: członkowie widzą" on public.members
  for select to authenticated using (pair_id in (select public.my_pairs()));

drop policy if exists "events: członkowie czytają" on public.events;
create policy "events: członkowie czytają" on public.events
  for select to authenticated using (pair_id in (select public.my_pairs()));

drop policy if exists "events: członkowie dodają" on public.events;
create policy "events: członkowie dodają" on public.events
  for insert to authenticated with check (author = auth.uid() and pair_id in (select public.my_pairs()));

drop policy if exists "events: autor usuwa" on public.events;
create policy "events: autor usuwa" on public.events
  for delete to authenticated using (author = auth.uid());

-- Ona zakłada parę
create or replace function public.create_pair()
returns uuid language plpgsql security definer set search_path = public as $$
declare p uuid;
begin
  if auth.uid() is null then raise exception 'Brak logowania'; end if;
  insert into public.pairs default values returning id into p;
  insert into public.members(pair_id, user_id, role) values (p, auth.uid(), 'ona');
  return p;
end $$;

-- On dołącza po zeskanowaniu kodu (maks. 2 osoby w parze)
create or replace function public.join_pair(p uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'Brak logowania'; end if;
  if not exists (select 1 from public.pairs where id = p) then raise exception 'Nie ma takiej pary'; end if;
  if exists (select 1 from public.members where pair_id = p and user_id = auth.uid()) then return; end if;
  if (select count(*) from public.members where pair_id = p) >= 2 then raise exception 'Ta para ma już dwie osoby'; end if;
  insert into public.members(pair_id, user_id, role) values (p, auth.uid(), 'on');
end $$;

revoke all on function public.create_pair() from public, anon;
revoke all on function public.join_pair(uuid) from public, anon;
grant execute on function public.create_pair() to authenticated;
grant execute on function public.join_pair(uuid) to authenticated;

-- Powiadomienia na żywo o nowych wpisach
do $$ begin
  alter publication supabase_realtime add table public.events;
exception when duplicate_object then null; end $$;
