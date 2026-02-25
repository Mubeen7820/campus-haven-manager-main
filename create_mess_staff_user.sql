-- Create a mess staff user in auth.users
-- Password is 'Mess@123'

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
  'vishishta.gunda@aurora.edu.in',
  crypt('Mess@123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Mess Manager"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
);

-- Ensure the profile is created/updated with the correct role
-- The trigger should handle creation, but we update role to be sure
UPDATE public.profiles
SET role = 'mess_staff'
WHERE email = 'vishishta.gunda@aurora.edu.in';
