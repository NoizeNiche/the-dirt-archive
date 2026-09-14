-- The Dirt Archive: initial Supabase schema
-- Safe starting point for the public reference layer.
-- Technical/IP boundary: this schema intentionally has no schematic,
-- PCB-layout, gutshot, or complete bill-of-materials tables.

create extension if not exists pgcrypto;

create table if not exists builders (
  builder_id text primary key,
  name text not null unique,
  aliases text,
  country text,
  status text,
  founded integer,
  ended integer,
  website text,
  description text,
  primary_source text,
  source_confidence text
);

create table if not exists pedals (
  pedal_id text primary key,
  primary_builder_id text references builders(builder_id),
  model_name text not null,
  primary_category text not null check (primary_category in ('Fuzz','Overdrive','Distortion')),
  subcategory text,
  introduced_year integer,
  discontinued_year integer,
  production_status text,
  description text,
  archive_status text,
  confidence text
);

create table if not exists generations (
  generation_id text primary key,
  pedal_id text not null references pedals(pedal_id),
  name text not null,
  start_year integer,
  end_year integer,
  summary text,
  description text,
  confidence text
);

create table if not exists production_periods (
  run_id text primary key,
  generation_id text not null references generations(generation_id),
  start_year integer,
  end_year integer,
  date_quality text,
  summary text,
  source_url text
);

create table if not exists distinguishers (
  distinguisher_id text primary key,
  generation_id text not null references generations(generation_id),
  type text not null,
  description text not null,
  identification_value text,
  status text,
  source_url text
);

create table if not exists specimens (
  specimen_id text primary key,
  pedal_id text not null references pedals(pedal_id),
  likely_generation_id text references generations(generation_id),
  serial_number text,
  date_code text,
  country text,
  purchase_year integer,
  condition text,
  modifications text,
  notes text,
  identification_confidence text,
  public_display boolean default true
);

create table if not exists specimen_media (
  media_id uuid primary key default gen_random_uuid(),
  specimen_id text references specimens(specimen_id) on delete cascade,
  media_type text not null check (media_type in ('front','back','bottom','side','label','serial','box','manual','receipt','advertisement','other')),
  storage_url text,
  source_url text,
  rights_status text,
  credit_line text,
  notes text
);

create table if not exists sources (
  source_id text primary key,
  type text,
  title text,
  author text,
  publisher text,
  date text,
  url text,
  description text,
  reliability text
);

create table if not exists claims (
  claim_id text primary key,
  pedal_id text references pedals(pedal_id),
  subject_id text,
  model_name text,
  statement text not null,
  status text not null check (status in ('Confirmed','Probable','Reported','Unverified')),
  confidence text,
  source_id text references sources(source_id),
  notes text
);

create table if not exists relationships (
  relationship_id text primary key,
  pedal_a text references pedals(pedal_id),
  pedal_b text references pedals(pedal_id),
  relationship_type text,
  description text,
  source_id text references sources(source_id),
  confidence text
);

create index if not exists idx_pedals_builder on pedals(primary_builder_id);
create index if not exists idx_pedals_category on pedals(primary_category);
create index if not exists idx_generations_pedal on generations(pedal_id);
create index if not exists idx_runs_generation on production_periods(generation_id);
create index if not exists idx_distinguishers_generation on distinguishers(generation_id);
create index if not exists idx_specimens_pedal on specimens(pedal_id);
create index if not exists idx_claims_pedal on claims(pedal_id);
