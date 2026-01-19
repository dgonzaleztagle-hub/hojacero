-- FIX RLS FOR TEAM ACCESS
-- Purpose: Ensure Daniel and Gaston (authenticated users) can see and edit ALL leads.

-- 1. Enable RLS on leads table (just in case)
ALTER TABLE "public"."leads" ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing restrictive policies (to avoid conflicts)
DROP POLICY IF EXISTS "Enable read access for all users" ON "public"."leads";
DROP POLICY IF EXISTS "Enable insert for all users" ON "public"."leads";
DROP POLICY IF EXISTS "Enable update for all users" ON "public"."leads";
DROP POLICY IF EXISTS "Allow all for authenticated" ON "public"."leads";

-- 3. Create a PERMISSIVE policy for Team Members
-- "authenticated" role means anyone logged in (Daniel, Gaston)
CREATE POLICY "Team Full Access" 
ON "public"."leads" 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- 4. Do the same for lead_activity_log just in case
ALTER TABLE "public"."lead_activity_log" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Team Full Access Log" ON "public"."lead_activity_log";

CREATE POLICY "Team Full Access Log" 
ON "public"."lead_activity_log" 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- 5. And profiles
ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Team Full Access Profiles" 
ON "public"."profiles" 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);
