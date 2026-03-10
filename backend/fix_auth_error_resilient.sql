-- RESILIENT AUTH TRIGGER
-- This script prevents 500 errors by handling conflicts and ignoring non-critical failures

create or replace function public.handle_new_user()
returns trigger as $$
begin
  begin
    insert into public.profiles (id, email, full_name, role)
    values (
      new.id, 
      new.email, 
      coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)), 
      coalesce(new.raw_user_meta_data->>'role', 'student')
    )
    on conflict (id) do update set
      email = excluded.email,
      full_name = excluded.full_name,
      role = excluded.role;
  exception when others then
    -- Log the error but allow the auth.user to be created anyway
    -- This prevents the "500 Database error" from stopping the signup
    raise warning 'Error in handle_new_user for %: %', new.email, SQLERRM;
  end;
  return new;
end;
$$ language plpgsql security definer;

-- Re-attach trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- CLEANUP potential blockers
-- If a student/profile exists with an email but no auth user, the signup might still fail.
-- Uncomment and run the lines below ONLY if you are still getting 500 errors 
-- for a SPECIFIC email (change 'test@email.com' to that email):

-- DELETE FROM public.profiles WHERE email = 'test@example.com';
-- DELETE FROM public.students WHERE email = 'test@example.com';
