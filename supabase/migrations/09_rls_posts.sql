-- Row Level Security Policies for posts table
-- Users can view posts in circles they're members of, or posts without a circle
CREATE POLICY "Users can view accessible posts" ON public.posts FOR
SELECT USING (
        circle_id IS NULL -- Public posts (not in a circle)
        OR EXISTS (
            SELECT 1
            FROM public.circle_members
            WHERE circle_members.circle_id = posts.circle_id
                AND circle_members.user_id = auth.uid()
        )
    );
-- Authenticated users can create posts
CREATE POLICY "Authenticated users can create posts" ON public.posts FOR
INSERT WITH CHECK (
        auth.uid() = author_id
        AND (
            circle_id IS NULL -- Public post
            OR EXISTS (
                SELECT 1
                FROM public.circle_members
                WHERE circle_members.circle_id = posts.circle_id
                    AND circle_members.user_id = auth.uid()
            )
        )
    );
-- Users can update their own posts
CREATE POLICY "Users can update their own posts" ON public.posts FOR
UPDATE USING (auth.uid() = author_id) WITH CHECK (auth.uid() = author_id);
-- Users can delete their own posts
CREATE POLICY "Users can delete their own posts" ON public.posts FOR DELETE USING (auth.uid() = author_id);