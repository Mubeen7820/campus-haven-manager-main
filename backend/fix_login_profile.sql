-- Ensure profile exists for the user
INSERT INTO public.profiles (id, email, full_name, role)
SELECT id, email, raw_user_meta_data->>'full_name', 'admin'
FROM auth.users
WHERE email = 'mubeenahmed.shaik@aurora.edu.in'
ON CONFLICT (id) DO UPDATE
SET role = 'admin';
