-- Run this entire script in Supabase SQL Editor
-- If you already ran the old schema, run the ALTER TABLE lines at the bottom too

create table if not exists persons (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  created_at timestamp with time zone default now()
);

create table if not exists settings (
  id int primary key default 1,
  opening_cash numeric not null default 0
);

insert into settings (id, opening_cash) values (1, 0)
on conflict (id) do nothing;

create table if not exists transactions (
  id uuid default gen_random_uuid() primary key,
  date date not null default current_date,
  description text not null,
  person_id uuid references persons(id) on delete set null,
  category text default 'General',
  given_out numeric default 0,
  spent_by_person numeric default 0,
  returned numeric default 0,
  settled boolean default false,
  created_at timestamp with time zone default now()
);

-- Seed persons
insert into persons (name) values ('SAMEER') on conflict do nothing;
insert into persons (name) values ('ASIF') on conflict do nothing;
insert into persons (name) values ('SAMIULLAH') on conflict do nothing;
insert into persons (name) values ('PHARMACY CASH') on conflict do nothing;

-- ─────────────────────────────────────────────────────────────
-- IF YOU ALREADY HAVE THE OLD TABLE, run these two lines too:
-- alter table transactions add column if not exists category text default 'General';
-- alter table transactions add column if not exists settled boolean default false;
-- ─────────────────────────────────────────────────────────────
