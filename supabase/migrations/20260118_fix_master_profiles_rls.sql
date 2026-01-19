-- MASTER FIX: PROFILES & TEAM ACCESS
-- Run this entire script to fix the 'profiles does not exist' error and open access to the team.

-- 1. Create PROFILES table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'member', -- 'admin', 'member'
  signature_html TEXT, -- Custom email signature
  updated_at TIMESTAMPTZ
);

-- 2. Create Trigger for new users (Handle New User)
-- (Safe to run multiple times due to OR REPLACE)
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', 'admin') -- Default to admin for now
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger definition (Drop first to ensure clean state)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- 3. FIX RLS FOR LEADS (TEAM ACCESS)
ALTER TABLE "public"."leads" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for all users" ON "public"."leads";
DROP POLICY IF EXISTS "Enable insert for all users" ON "public"."leads";
DROP POLICY IF EXISTS "Enable update for all users" ON "public"."leads";
DROP POLICY IF EXISTS "Allow all for authenticated" ON "public"."leads";
DROP POLICY IF EXISTS "Team Full Access" ON "public"."leads";

CREATE POLICY "Team Full Access" 
ON "public"."leads" 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);


-- 4. FIX RLS FOR ACTIVITY LOG
ALTER TABLE "public"."lead_activity_log" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Team Full Access Log" ON "public"."lead_activity_log";

CREATE POLICY "Team Full Access Log" 
ON "public"."lead_activity_log" 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);


-- 5. FIX RLS FOR PROFILES
ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Team Full Access Profiles" ON "public"."profiles";

CREATE POLICY "Team Full Access Profiles" 
ON "public"."profiles" 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);
