-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Helper to safely insert user if not exists
DO $$
DECLARE
    u_daniel_id uuid := gen_random_uuid();
    u_gaston_id uuid := gen_random_uuid();
BEGIN
    -- 1. DANIEL
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'dgonzalez.tagle@gmail.com') THEN
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
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
            u_daniel_id,
            'authenticated',
            'authenticated',
            'dgonzalez.tagle@gmail.com',
            crypt('narutokun2013', gen_salt('bf')), -- Password Hash
            now(), -- Confirmed
            '{"provider": "email", "providers": ["email"]}',
            '{"full_name": "Daniel González", "avatar_url": ""}',
            now(),
            now(),
            '',
            '',
            '',
            ''
        );
        RAISE NOTICE 'Daniel created';
    ELSE
        RAISE NOTICE 'Daniel already exists';
    END IF;

    -- 2. GASTON
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'Gaston.jofre1995@gmail.com') THEN
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
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
            u_gaston_id,
            'authenticated',
            'authenticated',
            'Gaston.jofre1995@gmail.com',
            crypt('Colocolo1995', gen_salt('bf')), -- Password Hash
            now(), -- Confirmed
            '{"provider": "email", "providers": ["email"]}',
            '{"full_name": "Gastón Jofré", "avatar_url": ""}',
            now(),
            now(),
            '',
            '',
            '',
            ''
        );
        RAISE NOTICE 'Gaston created';
    ELSE
        RAISE NOTICE 'Gaston already exists';
    END IF;

    -- Trigger should handle public.profiles creation automatically.
END $$;
