-- supabase/schema.sql

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- USERS TABLE (Handled mainly by Auth, but we can store extra metadata here if needed, or rely on profiles)
-- Supabase handles Auth users in `auth.users`. We will tie custom profiles to it.

-- PROFILES TABLE
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  first_name text,
  last_name text,
  goal text check (goal in ('weight loss', 'muscle gain', 'maintenance', 'longevity', 'diabetic friendly')),
  diet text check (diet in ('vegetarian', 'eggetarian', 'non veg', 'vegan')),
  preferences text[], -- e.g., ['high protein', 'low carb', 'low fat', 'high fiber']
  age int,
  gender text,
  weight numeric, -- in kg or lbs
  height numeric, -- in cm or inches
  activity_level text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- SCANS TABLE
create table public.scans (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  restaurant_name text,
  menu_image_url text,
  extracted_text text,
  restaurant_health_score int,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RECOMMENDATIONS TABLE
create table public.recommendations (
  id uuid default uuid_generate_v4() primary key,
  scan_id uuid references public.scans(id) on delete cascade not null,
  dish_name text not null,
  category text check (category in ('best', 'healthy', 'avoid', 'highProtein', 'fatLoss', 'longevity', 'swap')),
  reasoning text,
  estimated_calories int,
  protein_g int,
  carbs_g int,
  fat_g int,
  confidence_score numeric,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- SETUP ROW LEVEL SECURITY
alter table public.profiles enable row level security;
alter table public.scans enable row level security;
alter table public.recommendations enable row level security;

-- POLICIES
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

create policy "Users can view own scans" on public.scans for select using (auth.uid() = user_id);
create policy "Users can insert own scans" on public.scans for insert with check (auth.uid() = user_id);
create policy "Users can update own scans" on public.scans for update using (auth.uid() = user_id);
create policy "Users can delete own scans" on public.scans for delete using (auth.uid() = user_id);

create policy "Users can view recommendations of own scans" on public.recommendations for select 
  using (
    exists (
      select 1 from public.scans 
      where scans.id = recommendations.scan_id and scans.user_id = auth.uid()
    )
  );
create policy "Users can insert recommendations to own scans" on public.recommendations for insert 
  with check (
    exists (
      select 1 from public.scans 
      where scans.id = recommendations.scan_id and scans.user_id = auth.uid()
    )
  );

-- TRIGGERS for updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_profile_updated
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
