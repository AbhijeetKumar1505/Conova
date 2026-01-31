-- Row Level Security Policies for circle_members table
-- Users can view members of circles they belong to
CREATE POLICY "Users can view circle members" ON public.circle_members FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM public.circle_members cm
            WHERE cm.circle_id = circle_members.circle_id
                AND cm.user_id = auth.uid()
        )
        OR EXISTS (
            SELECT 1
            FROM public.circles
            WHERE circles.id = circle_members.circle_id
                AND circles.is_private = false
        )
    );
-- Users can join public circles, or creators can add members
CREATE POLICY "Users can join circles or be added" ON public.circle_members FOR
INSERT WITH CHECK (
        auth.uid() = user_id -- User joining themselves
        AND (
            EXISTS (
                SELECT 1
                FROM public.circles
                WHERE circles.id = circle_members.circle_id
                    AND circles.is_private = false
            )
            OR EXISTS (
                SELECT 1
                FROM public.circle_members cm
                WHERE cm.circle_id = circle_members.circle_id
                    AND cm.user_id = auth.uid()
                    AND cm.role = 'creator'
            )
        )
    );
-- Users can remove themselves, or creators can remove members
CREATE POLICY "Users can leave or be removed from circles" ON public.circle_members FOR DELETE USING (
    auth.uid() = user_id -- User removing themselves
    OR EXISTS (
        SELECT 1
        FROM public.circle_members cm
        WHERE cm.circle_id = circle_members.circle_id
            AND cm.user_id = auth.uid()
            AND cm.role = 'creator'
    )
);