-- Row Level Security Policies for notifications table
-- Users can only view their own notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications FOR
SELECT USING (auth.uid() = user_id);
-- System can insert notifications (handled by triggers)
-- Users cannot manually insert notifications
CREATE POLICY "System can insert notifications" ON public.notifications FOR
INSERT WITH CHECK (auth.uid() = user_id);
-- Users can update their own notifications (e.g., mark as read)
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR
UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
-- Users can delete their own notifications
CREATE POLICY "Users can delete their own notifications" ON public.notifications FOR DELETE USING (auth.uid() = user_id);