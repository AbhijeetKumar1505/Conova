-- Create notifications table
-- This table stores user notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL CHECK (
        type IN ('like', 'comment', 'circle_join', 'mention')
    ),
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false NOT NULL,
    related_id UUID,
    -- ID of the related entity (post, comment, circle, etc.)
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
-- Create indexes
CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS notifications_is_read_idx ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS notifications_created_at_idx ON public.notifications(created_at DESC);
-- Enable Row Level Security
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
-- Add comment
COMMENT ON TABLE public.notifications IS 'User notifications for activity alerts';