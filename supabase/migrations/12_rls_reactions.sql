-- Row Level Security Policies for reactions table
-- Anyone can view reactions
CREATE POLICY "Reactions are viewable by everyone" ON public.reactions FOR
SELECT USING (true);
-- Authenticated users can add reactions
CREATE POLICY "Authenticated users can add reactions" ON public.reactions FOR
INSERT WITH CHECK (auth.uid() = user_id);
-- Users can delete their own reactions
CREATE POLICY "Users can delete their own reactions" ON public.reactions FOR DELETE USING (auth.uid() = user_id);