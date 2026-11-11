-- Optional migration for the existing shared_exercises table.
-- Adds an explicit Gym / Bodyweight classification without changing existing
-- exercise rows. Classify each row using its name/equipment before relying on
-- the column; the app falls back to equipment-based classification while values
-- are null.

alter table public.shared_exercises
  add column if not exists training_mode text;

do $$
begin
  alter table public.shared_exercises
    add constraint shared_exercises_training_mode_check
    check (training_mode is null or training_mode in ('Gym', 'Bodyweight'));
exception
  when duplicate_object then null;
end
$$;
