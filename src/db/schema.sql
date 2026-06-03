-- Database Schema DDL for Kannada Seva
-- Tech Stack: PostgreSQL (Supabase)
-- Implements School and Student analytics, AI Risk indicators, and Intervention tracking.

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create User Authority Roles Enum
create type user_role as enum ('school_admin', 'dept_officer', 'ngo_viewer');

-- Create Profiles Table (extends Supabase auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  name text not null,
  role user_role not null default 'ngo_viewer',
  district text,
  taluk text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on Profiles
alter table public.profiles enable row level security;

create policy "Allow public read access to profiles" on public.profiles
  for select using (true);

create policy "Allow users to update their own profiles" on public.profiles
  for update using (auth.uid() = id);

-- Create Schools Table
create table if not exists public.schools (
  id uuid default uuid_generate_v4() primary key,
  name_en text not null,
  name_kn text not null,
  district text not null,
  taluk text not null,
  total_students integer not null default 0,
  at_risk_students integer not null default 0,
  enrolment_decline_rate numeric(5,2) not null default 0.00,
  risk_score numeric(5,2) not null default 0.00,
  primary_medium text not null default 'kannada',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on Schools
alter table public.schools enable row level security;

create policy "Allow read access to schools for authenticated users" on public.schools
  for select using (auth.role() = 'authenticated');

create policy "Allow school write access to department officers and school admins" on public.schools
  for all using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('dept_officer', 'school_admin')
    )
  );

-- Create Students Table
create table if not exists public.students (
  id uuid default uuid_generate_v4() primary key,
  school_id uuid references public.schools(id) on delete cascade not null,
  name_en text not null,
  name_kn text not null,
  grade integer not null,
  attendance_rate numeric(5,2) not null default 100.00,
  kannada_proficiency numeric(5,2) not null default 100.00,
  english_proficiency numeric(5,2) not null default 100.00,
  risk_level text not null check (risk_level in ('High', 'Medium', 'Low')),
  risk_score numeric(5,2) not null default 0.00,
  risk_reasons text[] not null default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on Students
alter table public.students enable row level security;

create policy "Allow read access to students for authenticated users" on public.students
  for select using (auth.role() = 'authenticated');

create policy "Allow write access to students for school admins and department officers" on public.students
  for all using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('dept_officer', 'school_admin')
    )
  );

-- Create Interventions Table
create table if not exists public.interventions (
  id uuid default uuid_generate_v4() primary key,
  school_id uuid references public.schools(id) on delete cascade not null,
  student_id uuid references public.students(id) on delete set null,
  title_en text not null,
  title_kn text not null,
  description_en text not null,
  description_kn text not null,
  category text not null check (category in ('bilingual', 'attendance', 'kits', 'transport')),
  status text not null default 'pending' check (status in ('pending', 'in_progress', 'completed')),
  assigned_to uuid references public.profiles(id) on delete set null,
  target_date date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on Interventions
alter table public.interventions enable row level security;

create policy "Allow read access to interventions for authenticated users" on public.interventions
  for select using (auth.role() = 'authenticated');

create policy "Allow update/insert of interventions for active authorities" on public.interventions
  for all using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('dept_officer', 'school_admin')
    )
  );

-- Create Enrolment Trends Table
create table if not exists public.enrolment_trends (
  id uuid default uuid_generate_v4() primary key,
  school_id uuid references public.schools(id) on delete cascade not null,
  year integer not null,
  medium text not null check (medium in ('kannada', 'english')),
  count integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on Enrolment Trends
alter table public.enrolment_trends enable row level security;

create policy "Allow read access to enrolment trends for authenticated users" on public.enrolment_trends
  for select using (auth.role() = 'authenticated');
