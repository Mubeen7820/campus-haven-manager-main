-- 1. Reload the schema cache
NOTIFY pgrst, 'reload config';

-- 2. Ensure pgcrypto extension is enabled for password hashing
create extension if not exists "pgcrypto";

-- 3. Update the password for the custom admin user to be absolutely sure
-- Password will be reset to: Mubeen@123
UPDATE auth.users
SET encrypted_password = crypt('Mubeen@123', gen_salt('bf'))
WHERE email = 'mubeenahmed.shaik@aurora.edu.in';

-- 4. If the user doesn't exist, create them again (SAFETY CHECK)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'mubeenahmed.shaik@aurora.edu.in') THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, 
            email_confirmed_at, raw_user_meta_data, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 
            'mubeenahmed.shaik@aurora.edu.in', crypt('Mubeen@123', gen_salt('bf')), 
            now(), '{"full_name":"Mubeen Ahmed"}', now(), now()
        );
    END IF;
END $$;

-- 5. Force update the profile role to 'admin'
INSERT INTO public.profiles (id, email, full_name, role)
SELECT id, email, 'Mubeen Ahmed', 'admin'
FROM auth.users
WHERE email = 'mubeenahmed.shaik@aurora.edu.in'
ON CONFLICT (id) DO UPDATE
SET role = 'admin';
