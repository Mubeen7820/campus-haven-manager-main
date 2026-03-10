-- SYNC PROFILES SCRIPT
-- This script ensures all existing auth users have a corresponding profile entry.
-- Run this in the Supabase SQL Editor to fix login issues for existing users.

INSERT INTO public.profiles (id, email, full_name, role)
SELECT 
  id, 
  email, 
  COALESCE(raw_user_meta_data->>'full_name', split_part(email, '@', 1)), 
  COALESCE(raw_user_meta_data->>'role', 'student')
FROM auth.users
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role;

-- If you want to force specific roles for known users, do it here:
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'admin@example.com';
-- UPDATE public.profiles SET role = 'mess_staff' WHERE email = 'mess@example.com';
