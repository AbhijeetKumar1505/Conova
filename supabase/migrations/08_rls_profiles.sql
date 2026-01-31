-- Row Level Security Policies for profiles table
-- Allow anyone to view profiles (public platform)
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR
SELECT USING (true);
-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR
INSERT WITH CHECK (auth.uid() = user_id);
-- Users can update their own profile
CREATE POLICY "Users can update their own profile" ON public.profiles FOR
UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
-- Users can delete their own profile
CREATE POLICY "Users can delete their own profile" ON public.profiles FOR DELETE USING (auth.uid() = user_id);