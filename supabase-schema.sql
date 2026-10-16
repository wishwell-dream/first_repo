-- Run this whole file in Supabase SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.payments (
  capture_id text primary key,
  order_id text not null,
  amount text not null,
  currency text not null,
  status text not null check (status in ('completed')),
  used boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.wishes (
  id uuid primary key default gen_random_uuid(),
  text text not null default '' check (char_length(text) <= 240),
  name text not null default 'Anonymous' check (char_length(name) <= 24),
  hearts integer not null default 0 check (hearts >= 0),
  audio_url text,
  created_at timestamptz not null default now()
);

alter table public.payments enable row level security;
alter table public.wishes enable row level security;
-- No public table writes. All writes go through server API using service-role key.
drop policy if exists "Public can read wishes" on public.wishes;
create policy "Public can read wishes" on public.wishes for select to anon, authenticated using (true);

insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('wish-audio','wish-audio',true,5000000,array['audio/webm','audio/ogg','audio/mp4','audio/mpeg'])
on conflict (id) do update set public=true,file_size_limit=5000000,allowed_mime_types=array['audio/webm','audio/ogg','audio/mp4','audio/mpeg'];

create or replace function public.submit_paid_wish(
  p_capture_id text,
  p_text text,
  p_name text,
  p_audio_url text
) returns public.wishes
language plpgsql
security definer
set search_path = public
as $$
declare
  p public.payments;
  w public.wishes;
begin
  select * into p from public.payments where capture_id = p_capture_id for update;
  if not found or p.status <> 'completed' or p.used or p.amount <> '0.99' or p.currency <> 'USD' then
    raise exception 'Payment invalid or already used';
  end if;
  update public.payments set used = true where capture_id = p_capture_id;
  insert into public.wishes(text,name,audio_url)
  values (coalesce(p_text,''),coalesce(nullif(left(trim(p_name),24),''),'Anonymous'),p_audio_url)
  returning * into w;
  return w;
end;
$$;

revoke all on function public.submit_paid_wish(text,text,text,text) from public, anon, authenticated;
grant execute on function public.submit_paid_wish(text,text,text,text) to service_role;
grant select on public.wishes to anon, authenticated;
