-- Create circles table
-- This table stores community groups/circles
CREATE TABLE IF NOT EXISTS public.circles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    creator_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE NOT NULL,
    is_private BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
-- Create indexes
CREATE INDEX IF NOT EXISTS circles_creator_id_idx ON public.circles(creator_id);
CREATE INDEX IF NOT EXISTS circles_is_private_idx ON public.circles(is_private);
-- Enable Row Level Security
ALTER TABLE public.circles ENABLE ROW LEVEL SECURITY;
-- Now add foreign key constraint to posts table
ALTER TABLE public.posts
ADD CONSTRAINT posts_circle_id_fkey FOREIGN KEY (circle_id) REFERENCES public.circles(id) ON DELETE
SET NULL;
-- Add comment
COMMENT ON TABLE public.circles IS 'Community groups and circles';