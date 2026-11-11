-- Add/rename the two coach profiles in the existing public.coaches table.
-- Existing coach IDs and linked plan references are preserved.

begin;

update public.coaches
set full_name = 'Thulshi'
where full_name = 'Coach A'
  and not exists (
    select 1
    from public.coaches existing
    where existing.full_name = 'Thulshi'
  );

update public.coaches
set full_name = 'Pratiksha'
where full_name = 'Coach B'
  and not exists (
    select 1
    from public.coaches existing
    where existing.full_name = 'Pratiksha'
  );

insert into public.coaches (full_name, email)
select 'Thulshi', 'thulshi@gmail.com'
where not exists (
  select 1 from public.coaches where full_name = 'Thulshi'
);

insert into public.coaches (full_name, email)
select 'Pratiksha', 'Pratiksha@gmail.com'
where not exists (
  select 1 from public.coaches where full_name = 'Pratiksha'
);

update public.coaches
set email = 'thulshi@gmail.com'
where full_name = 'Thulshi'
  and email <> 'thulshi@gmail.com';

update public.coaches
set email = 'Pratiksha@gmail.com'
where full_name = 'Pratiksha'
  and email <> 'Pratiksha@gmail.com';

commit;
