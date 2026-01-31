-- Row Level Security Policies for circles table
-- Users can view public circles or circles they're members of
CREATE POLICY "Users can view accessible circles" ON public.circles FOR
SELECT USING (
        is_private = false -- Public circles
        OR EXISTS (
            SELECT 1
            FROM public.circle_members
            WHERE circle_members.circle_id = circles.id
                AND circle_members.user_id = auth.uid()
        )
    );
-- Authenticated users can create circles
CREATE POLICY "Authenticated users can create circles" ON public.circles FOR
INSERT WITH CHECK (auth.uid() = creator_id);
-- Only circle creators can update circles
CREATE POLICY "Creators can update their circles" ON public.circles FOR
UPDATE USING (auth.uid() = creator_id) WITH CHECK (auth.uid() = creator_id);
-- Only circle creators can delete circles
CREATE POLICY "Creators can delete their circles" ON public.circles FOR DELETE USING (auth.uid() = creator_id);