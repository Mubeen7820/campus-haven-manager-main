-- 1. Correct the Profile Trigger to be more robust (prevents 500 errors)
create or replace function public.handle_new_user()
returns trigger as $$
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
  return new;
end;
$$ language plpgsql security definer;

-- 2. Ensure RLS doesn't block the trigger (security definer should handle this, but good to check)
alter function public.handle_new_user() security definer;

-- 3. Cleanup: If you had failed attempts, ensure no orphaned students exist with the email you tried
-- Replace 'target@email.com' with the email you were trying if it still fails.
-- DELETE FROM public.students WHERE email = 'target@email.com';
