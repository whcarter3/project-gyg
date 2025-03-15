-- Drop existing policies
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create updated policy that handles both update and upsert
CREATE POLICY "Users can update their own profile"
    ON public.profiles
    FOR ALL
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);