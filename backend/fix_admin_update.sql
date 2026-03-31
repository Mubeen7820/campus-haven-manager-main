-- Fix 1: Allow Admins to update user profiles (so they can save profile pictures for students)
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING ( public.is_admin() );

-- Fix 2: Give the Mess Staff a proper name instead of just 'mess'
-- (This will update any mess staff profile whose name isn't set properly)
UPDATE public.profiles
SET full_name = 'Kitchen Master'
WHERE role = 'mess_staff' AND (full_name IS NULL OR full_name = '' OR full_name ILIKE '%mess%');
