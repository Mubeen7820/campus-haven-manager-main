-- 1. Add email column to students table
alter table public.students add column if not exists email text unique;

-- 2. Update existing students to have emails from their profiles (if they were already linked)
update public.students s
set email = p.email
from public.profiles p
where s.profile_id = p.id
and s.email is null;

-- 3. Update the handle_new_user function to automatically link matching students
create or replace function public.handle_new_user()
returns trigger as $$
declare
  existing_student_id bigint;
begin
  -- Insert into profiles
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'student');

  -- Look for a student record with this email that isn't already linked
  select id into existing_student_id
  from public.students
  where email = new.email
  and profile_id is null
  limit 1;

  -- If found, link it
  if existing_student_id is not null then
    update public.students
    set profile_id = new.id
    where id = existing_student_id;
  end if;

  return new;
end;
$$ language plpgsql security definer;
