-- Row Level Security Policies for comments table
-- Users can view comments on posts they can see
CREATE POLICY "Users can view comments on accessible posts" ON public.comments FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM public.posts
            WHERE posts.id = comments.post_id
                AND (
                    posts.circle_id IS NULL
                    OR EXISTS (
                        SELECT 1
                        FROM public.circle_members
                        WHERE circle_members.circle_id = posts.circle_id
                            AND circle_members.user_id = auth.uid()
                    )
                )
        )
    );
-- Authenticated users can create comments on posts they can see
CREATE POLICY "Authenticated users can create comments" ON public.comments FOR
INSERT WITH CHECK (
        auth.uid() = user_id
        AND EXISTS (
            SELECT 1
            FROM public.posts
            WHERE posts.id = comments.post_id
                AND (
                    posts.circle_id IS NULL
                    OR EXISTS (
                        SELECT 1
                        FROM public.circle_members
                        WHERE circle_members.circle_id = posts.circle_id
                            AND circle_members.user_id = auth.uid()
                    )
                )
        )
    );
-- Users can update their own comments
CREATE POLICY "Users can update their own comments" ON public.comments FOR
UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
-- Users can delete their own comments
CREATE POLICY "Users can delete their own comments" ON public.comments FOR DELETE USING (auth.uid() = user_id);