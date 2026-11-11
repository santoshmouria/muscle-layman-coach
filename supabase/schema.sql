-- ALTERNATIVE schema for a NEW, empty Supabase project only.
-- Do not run this file against the existing client_onboarding /
-- coach_assigned_plans schema. See README.md for existing-table integration.
-- All sample client records are fictional demo data, not real health information.
-- Run in a new Supabase project using the SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.coaches (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid references auth.users (id) on delete set null,
  name text not null unique check (char_length(name) between 1 and 80),
  created_at timestamptz not null default now()
);

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  age smallint not null check (age between 18 and 110),
  sex text not null,
  height_cm numeric(5, 1) not null check (height_cm between 100 and 250),
  weight_kg numeric(5, 1) not null check (weight_kg between 30 and 350),
  goal text not null,
  activity_level text not null,
  medical_constraints text not null default '',
  training_history text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.shared_foods (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  serving text not null,
  calories integer not null check (calories >= 0),
  protein_g numeric(7, 2) not null default 0 check (protein_g >= 0),
  carbs_g numeric(7, 2) not null default 0 check (carbs_g >= 0),
  fat_g numeric(7, 2) not null default 0 check (fat_g >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.shared_exercises (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  mode text not null check (mode in ('gym', 'bodyweight')),
  category text not null,
  equipment text not null default '',
  description text not null default '',
  created_at timestamptz not null default now(),
  unique (name, mode)
);

create table if not exists public.assigned_plans (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid not null references public.coaches (id) on delete cascade,
  client_id uuid not null references public.clients (id) on delete cascade,
  plan_data jsonb not null default '{"macros":{"calories":0,"protein":0,"carbs":0,"fat":0},"workouts":[],"mode":"gym"}'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'completed')),
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (coach_id, client_id)
);

create index if not exists assigned_plans_client_id_idx on public.assigned_plans (client_id);
create index if not exists assigned_plans_coach_status_idx on public.assigned_plans (coach_id, status);

-- Preserve existing coach ids and linked auth users when upgrading from the
-- original demo profile names.
update public.coaches
set name = 'Thulshi'
where name = 'Coach A'
  and not exists (select 1 from public.coaches where name = 'Thulshi');

update public.coaches
set name = 'Pratiksha'
where name = 'Coach B'
  and not exists (select 1 from public.coaches where name = 'Pratiksha');

insert into public.coaches (name) values
  ('Thulshi'),
  ('Pratiksha')
on conflict (name) do nothing;

insert into public.shared_foods (name, serving, calories, protein_g, carbs_g, fat_g) values
  ('Greek yogurt, plain', '170 g', 100, 17, 6, 0),
  ('Lentils, cooked', '1 cup', 230, 18, 40, 1),
  ('Chicken breast, cooked', '100 g', 165, 31, 0, 4),
  ('Tofu, firm', '100 g', 145, 16, 4, 9),
  ('Rolled oats, dry', '40 g', 150, 5, 27, 3),
  ('Salmon, cooked', '100 g', 206, 22, 0, 13),
  ('Brown rice, cooked', '1 cup', 216, 5, 45, 2),
  ('Egg, whole', '1 large', 72, 6, 0, 5),
  ('Black beans, cooked', '1 cup', 227, 15, 41, 1),
  ('Cottage cheese, low-fat', '100 g', 82, 11, 4, 2),
  ('Quinoa, cooked', '1 cup', 222, 8, 39, 4),
  ('Banana', '1 medium', 105, 1, 27, 0)
on conflict (name) do nothing;

insert into public.shared_exercises (name, mode, category, equipment, description) values
  ('Goblet squat', 'gym', 'Lower body', 'Dumbbell', 'Use a comfortable, controlled range of motion.'),
  ('Leg press', 'gym', 'Lower body', 'Machine', 'Use a comfortable range; avoid forcing depth.'),
  ('Dumbbell Romanian deadlift', 'gym', 'Posterior chain', 'Dumbbells', 'Use a comfortable load and controlled hip hinge.'),
  ('Seated leg curl', 'gym', 'Posterior chain', 'Machine', 'Adjust the machine to a comfortable range.'),
  ('Hip thrust', 'gym', 'Glutes', 'Barbell / bench', 'Begin with a comfortable load and controlled motion.'),
  ('Cable row', 'gym', 'Upper body', 'Cable', 'Maintain a comfortable torso position.'),
  ('Chest-supported row', 'gym', 'Upper body', 'Bench / dumbbells', 'Use a supported position and controlled range.'),
  ('Machine chest press', 'gym', 'Upper body', 'Machine', 'Adjust the seat and range for comfort.'),
  ('Dumbbell bench press', 'gym', 'Upper body', 'Dumbbells / bench', 'Use a stable setup and controlled reps.'),
  ('Lat pulldown', 'gym', 'Upper body', 'Cable', 'Pull with a controlled, comfortable range.'),
  ('Pallof press', 'gym', 'Core stability', 'Cable / band', 'Use a light resistance and comfortable stance.'),
  ('Recumbent bike', 'gym', 'Cardio', 'Machine', 'Adjust seat position for a comfortable ride.'),
  ('Box squat', 'bodyweight', 'Lower body', 'Chair / box', 'Choose a stable seat height and comfortable range.'),
  ('Supported split squat', 'bodyweight', 'Lower body', 'Wall / chair', 'Use hand support and a comfortable step length.'),
  ('Glute bridge', 'bodyweight', 'Glutes', 'Mat', 'Use a comfortable range and controlled motion.'),
  ('Bird dog', 'bodyweight', 'Core stability', 'Mat', 'Move slowly and stay in a comfortable range.'),
  ('Dead bug', 'bodyweight', 'Core stability', 'Mat', 'Scale the range to maintain comfort and control.'),
  ('Incline push-up', 'bodyweight', 'Upper body', 'Wall / counter', 'Choose an incline that allows comfortable control.'),
  ('Wall push-up', 'bodyweight', 'Upper body', 'Wall', 'Adjust distance from the wall to suit the client.'),
  ('Wall sit', 'bodyweight', 'Lower body', 'Wall', 'Use a comfortable knee bend and hold time.'),
  ('Step-up', 'bodyweight', 'Lower body', 'Low step', 'Choose a low, stable step and use support as needed.'),
  ('Standing calf raise', 'bodyweight', 'Lower body', 'Chair for support', 'Hold a support and use a comfortable range.'),
  ('Side-lying clam', 'bodyweight', 'Glutes', 'Mat', 'Use a small, controlled range.'),
  ('March in place', 'bodyweight', 'Cardio', 'None', 'Use support if helpful and set a comfortable pace.')
on conflict (name, mode) do nothing;

-- Seed exactly 100 fictional, adult sample profiles. Replace demo data before any
-- real coaching workflow and collect only the health data your practice needs.
-- Migrate the original anonymous demo names in place so their client UUIDs and
-- existing plan assignments remain intact.
update public.clients c
set
  name = (array[
    'Aarav Sharma', 'Ananya Iyer', 'Arjun Patel', 'Diya Nair', 'Ishaan Mehta',
    'Kavya Reddy', 'Kabir Singh', 'Meera Kulkarni', 'Rohan Desai', 'Saanvi Rao',
    'Vihaan Joshi', 'Aditi Menon', 'Dev Malhotra', 'Pooja Verma', 'Karan Kapoor',
    'Ira Chatterjee', 'Neel Shah', 'Riya Banerjee', 'Aditya Rao', 'Nisha Gupta',
    'Rahul Pillai', 'Sneha Das', 'Vikram Sethi', 'Lakshmi Krishnan', 'Siddharth Bose'
  ])[((substring(c.name from '[0-9]+')::int - 1) % 25) + 1]
    || ' ' || lpad(substring(c.name from '[0-9]+'), 3, '0'),
  sex = case
    when (substring(c.name from '[0-9]+')::int - 1) % 25 in (0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24)
      then 'Man'
    else 'Woman'
  end
where c.name ~ '^Client [0-9]{3}$'
  and substring(c.name from '[0-9]+')::int between 1 and 100;

insert into public.clients
  (name, age, sex, height_cm, weight_kg, goal, activity_level, medical_constraints, training_history)
select
  (array[
    'Aarav Sharma', 'Ananya Iyer', 'Arjun Patel', 'Diya Nair', 'Ishaan Mehta',
    'Kavya Reddy', 'Kabir Singh', 'Meera Kulkarni', 'Rohan Desai', 'Saanvi Rao',
    'Vihaan Joshi', 'Aditi Menon', 'Dev Malhotra', 'Pooja Verma', 'Karan Kapoor',
    'Ira Chatterjee', 'Neel Shah', 'Riya Banerjee', 'Aditya Rao', 'Nisha Gupta',
    'Rahul Pillai', 'Sneha Das', 'Vikram Sethi', 'Lakshmi Krishnan', 'Siddharth Bose'
  ])[((n - 1) % 25) + 1] || ' ' || lpad(n::text, 3, '0'),
  (24 + ((n * 7) % 42))::smallint,
  case when n % 25 in (1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 0)
    then 'Man'
    else 'Woman'
  end,
  (155 + ((n * 3) % 37))::numeric(5, 1),
  (54 + ((n * 5) % 52))::numeric(5, 1),
  (array['Strength & energy', 'Build consistency', 'Body recomposition', 'General fitness', 'Build strength'])[((n - 1) % 5) + 1],
  (array['Lightly active', 'Moderately active', 'Active'][(n % 3) + 1]),
  case when n = 7
    then 'FICTIONAL DEMO ONLY: history of L4–L5 disc bulges. Confirm current symptoms and movement tolerance with the client; follow guidance from their licensed clinician.'
    else 'No constraints recorded in this fictional demo. Ask about current health, medications, symptoms and movement preferences.'
  end,
  (array[
    'Returning after a long break; prefers gradual progress.',
    'Enjoys walking; new to structured resistance training.',
    'Some previous gym experience; consistency varies.',
    'Regular recreational activity; wants a sustainable routine.'
  ])[((n - 1) % 4) + 1]
from generate_series(1, 100) as series(n)
where not exists (
  select 1 from public.clients c where c.name = (array[
    'Aarav Sharma', 'Ananya Iyer', 'Arjun Patel', 'Diya Nair', 'Ishaan Mehta',
    'Kavya Reddy', 'Kabir Singh', 'Meera Kulkarni', 'Rohan Desai', 'Saanvi Rao',
    'Vihaan Joshi', 'Aditi Menon', 'Dev Malhotra', 'Pooja Verma', 'Karan Kapoor',
    'Ira Chatterjee', 'Neel Shah', 'Riya Banerjee', 'Aditya Rao', 'Nisha Gupta',
    'Rahul Pillai', 'Sneha Das', 'Vikram Sethi', 'Lakshmi Krishnan', 'Siddharth Bose'
  ])[((n - 1) % 25) + 1] || ' ' || lpad(n::text, 3, '0')
);

alter table public.coaches enable row level security;
alter table public.clients enable row level security;
alter table public.shared_foods enable row level security;
alter table public.shared_exercises enable row level security;
alter table public.assigned_plans enable row level security;

drop policy if exists "Authenticated coaches can read coach profiles" on public.coaches;
create policy "Authenticated coaches can read coach profiles"
  on public.coaches for select to authenticated
  using (auth_user_id = (select auth.uid()));

drop policy if exists "Linked coaches can read shared clients" on public.clients;
create policy "Linked coaches can read shared clients"
  on public.clients for select to authenticated
  using (exists (
    select 1 from public.coaches c where c.auth_user_id = (select auth.uid())
  ));

drop policy if exists "Linked coaches can read shared foods" on public.shared_foods;
create policy "Linked coaches can read shared foods"
  on public.shared_foods for select to authenticated
  using (exists (
    select 1 from public.coaches c where c.auth_user_id = (select auth.uid())
  ));

drop policy if exists "Linked coaches can read shared exercises" on public.shared_exercises;
create policy "Linked coaches can read shared exercises"
  on public.shared_exercises for select to authenticated
  using (exists (
    select 1 from public.coaches c where c.auth_user_id = (select auth.uid())
  ));

drop policy if exists "Coaches can read their assigned plans" on public.assigned_plans;
create policy "Coaches can read their assigned plans"
  on public.assigned_plans for select to authenticated
  using (exists (
    select 1 from public.coaches c where c.id = assigned_plans.coach_id and c.auth_user_id = (select auth.uid())
  ));

drop policy if exists "Coaches can create their assigned plans" on public.assigned_plans;
create policy "Coaches can create their assigned plans"
  on public.assigned_plans for insert to authenticated
  with check (exists (
    select 1 from public.coaches c where c.id = assigned_plans.coach_id and c.auth_user_id = (select auth.uid())
  ));

drop policy if exists "Coaches can update their assigned plans" on public.assigned_plans;
create policy "Coaches can update their assigned plans"
  on public.assigned_plans for update to authenticated
  using (exists (
    select 1 from public.coaches c where c.id = assigned_plans.coach_id and c.auth_user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.coaches c where c.id = assigned_plans.coach_id and c.auth_user_id = (select auth.uid())
  ));

grant usage on schema public to authenticated;
grant select on public.coaches, public.clients, public.shared_foods, public.shared_exercises, public.assigned_plans to authenticated;
grant insert, update on public.assigned_plans to authenticated;
