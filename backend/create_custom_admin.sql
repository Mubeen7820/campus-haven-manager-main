-- 1. Reload the schema cache to fix "Database error querying schema"
NOTIFY pgrst, 'reload config';

-- 2. Create the custom admin user safely
DO $$
BEGIN
    -- Create user in auth.users if not exists
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

    -- Ensure the user has the 'admin' role in public.profiles
    -- We use an INSERT ... ON CONFLICT to handle cases where the profile might already exist
    INSERT INTO public.profiles (id, email, full_name, role)
    SELECT id, email, 'Mubeen Ahmed', 'admin'
    FROM auth.users
    WHERE email = 'mubeenahmed.shaik@aurora.edu.in'
    ON CONFLICT (id) DO UPDATE
    SET role = 'admin', full_name = 'Mubeen Ahmed';

END $$;
