-- Create the user with the email EXACTLY as typed in the screenshot (ending in .edu)
-- Password: Mubeen@123

DO $$
BEGIN
    -- 1. Create user in auth.users if not exists
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'mubeenahmed.shaik@aurora.edu') THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, 
            email_confirmed_at, raw_user_meta_data, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 
            'mubeenahmed.shaik@aurora.edu', crypt('Mubeen@123', gen_salt('bf')), 
            now(), '{"full_name":"Mubeen Ahmed"}', now(), now()
        );
    END IF;

    -- 2. Ensure they have the admin role
    INSERT INTO public.profiles (id, email, full_name, role)
    SELECT id, email, 'Mubeen Ahmed', 'admin'
    FROM auth.users
    WHERE email = 'mubeenahmed.shaik@aurora.edu'
    ON CONFLICT (id) DO UPDATE
    SET role = 'admin';

END $$;
