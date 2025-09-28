-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Users table (extends Supabase auth users)
create table public.farmer_profiles (
                                        id uuid references auth.users primary key,
                                        full_name text not null,
                                        phone_number text,
                                        location text not null,
                                        farm_size numeric,
                                        primary_crops text[],
                                        created_at timestamp with time zone default timezone('utc'::text, now()) not null,
                                        updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Crops table
create table public.crops (
                              id uuid default uuid_generate_v4() primary key,
                              farmer_id uuid references public.farmer_profiles not null,
                              crop_name text not null,
                              variety text,
                              planting_date date not null,
                              plot_size numeric,
                              expected_harvest_date date,
                              status text check (status in ('active', 'harvested', 'failed')) default 'active',
                              created_at timestamp with time zone default timezone('utc'::text, now()) not null,
                              updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Disease analysis table
create table public.disease_analyses (
                                         id uuid default uuid_generate_v4() primary key,
                                         crop_id uuid references public.crops not null,
                                         image_url text not null,
                                         plant_id_response jsonb not null,
                                         ai_recommendations jsonb not null,
                                         is_healthy boolean not null,
                                         confidence_level numeric,
                                         analyzed_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Weather reports table
create table public.weather_reports (
                                        id uuid default uuid_generate_v4() primary key,
                                        farmer_id uuid references public.farmer_profiles not null,
                                        location text not null,
                                        weather_data jsonb not null,
                                        ai_recommendations jsonb,
                                        forecast_date date not null,
                                        created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Farming queries table
create table public.farming_queries (
                                        id uuid default uuid_generate_v4() primary key,
                                        farmer_id uuid references public.farmer_profiles not null,
                                        query_text text not null,
                                        crop_id uuid references public.crops,
                                        ai_response jsonb not null,
                                        category text,
                                        created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for better query performance
create index crops_farmer_id_idx on public.crops(farmer_id);
create index disease_analyses_crop_id_idx on public.disease_analyses(crop_id);
create index weather_reports_farmer_id_idx on public.weather_reports(farmer_id);
create index farming_queries_farmer_id_idx on public.farming_queries(farmer_id);

-- Row Level Security (RLS) policies
alter table public.farmer_profiles enable row level security;
alter table public.crops enable row level security;
alter table public.disease_analyses enable row level security;
alter table public.weather_reports enable row level security;
alter table public.farming_queries enable row level security;

-- RLS policies for farmer_profiles
create policy "Users can view own profile"
    on public.farmer_profiles for select
    using (auth.uid() = id);

create policy "Users can update own profile"
    on public.farmer_profiles for update
    using (auth.uid() = id);

-- RLS policies for crops
create policy "Users can view own crops"
    on public.crops for select
    using (auth.uid() = farmer_id);

create policy "Users can insert own crops"
    on public.crops for insert
    with check (auth.uid() = farmer_id);

create policy "Users can update own crops"
    on public.crops for update
    using (auth.uid() = farmer_id);

-- Similar RLS policies for other tables...
create policy "Users can view own disease analyses"
    on public.disease_analyses for select
    using (auth.uid() = (select farmer_id from public.crops where id = crop_id));

create policy "Users can insert own disease analyses"
    on public.disease_analyses for insert
    with check (auth.uid() = (select farmer_id from public.crops where id = crop_id));

create policy "Users can view own weather reports"
    on public.weather_reports for select
    using (auth.uid() = farmer_id);

create policy "Users can insert own weather reports"
    on public.weather_reports for insert
    with check (auth.uid() = farmer_id);

create policy "Users can view own farming queries"
    on public.farming_queries for select
    using (auth.uid() = farmer_id);

create policy "Users can insert own farming queries"
    on public.farming_queries for insert
    with check (auth.uid() = farmer_id);

-- ADD missing update policies
create policy "Users can update own disease analyses"
    on public.disease_analyses for update
    using (auth.uid() = (select farmer_id from public.crops where id = crop_id));

create policy "Users can update own weather reports"
    on public.weather_reports for update
    using (auth.uid() = farmer_id);

create policy "Users can update own farming queries"
    on public.farming_queries for update
    using (auth.uid() = farmer_id);

-- ADD missing delete policies
create policy "Users can delete own crops"
    on public.crops for delete
    using (auth.uid() = farmer_id);

create policy "Users can delete own disease analyses"
    on public.disease_analyses for delete
    using (auth.uid() = (select farmer_id from public.crops where id = crop_id));

create policy "Users can delete own weather reports"
    on public.weather_reports for delete
    using (auth.uid() = farmer_id);

create policy "Users can delete own farming queries"
    on public.farming_queries for delete
    using (auth.uid() = farmer_id);

-- ADD missing select policies
create policy "Users can select all crops"
    on public.crops for select
    using (auth.uid() = farmer_id);

create policy "Users can select all disease analyses"
    on public.disease_analyses for select
    using (auth.uid() = (select farmer_id from public.crops where id = crop_id));

create policy "Users can select all weather reports"
    on public.weather_reports for select
    using (auth.uid() = farmer_id);

create policy "Users can select all farming queries"
    on public.farming_queries for select
    using (auth.uid() = farmer_id);


-- Grant permissions to the authenticated role
grant all on public.farmer_profiles to authenticated;
grant all on public.crops to authenticated;
grant all on public.disease_analyses to authenticated;
grant all on public.weather_reports to authenticated;
grant all on public.farming_queries to authenticated;

-- Grant permissions to the public role
grant select on public.farmer_profiles to public;
grant select on public.crops to public;
grant select on public.disease_analyses to public;
grant select on public.weather_reports to public;
grant select on public.farming_queries to public;
