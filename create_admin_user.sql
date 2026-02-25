-- Create an admin user in auth.users
-- Note: This requires the pgcrypto extension, which is usually enabled by default in Supabase
-- If not, run: create extension if not exists "pgcrypto";

INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@example.com',
  crypt('admin123', gen_salt('bf')), -- Password is 'admin123'
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"System Admin"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
);

-- The trigger handle_new_user() should automatically create the profile entry
-- but let's update it to ensure it has the 'admin' role
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'admin@example.com';
