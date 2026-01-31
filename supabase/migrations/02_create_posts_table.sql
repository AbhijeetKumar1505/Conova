-- Create posts table
-- This table stores user-generated content posts
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    circle_id UUID,
    -- Will add foreign key after circles table is created
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS posts_author_id_idx ON public.posts(author_id);
CREATE INDEX IF NOT EXISTS posts_circle_id_idx ON public.posts(circle_id);
CREATE INDEX IF NOT EXISTS posts_created_at_idx ON public.posts(created_at DESC);
-- Enable Row Level Security
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
-- Create trigger for updated_at
CREATE TRIGGER set_updated_at BEFORE
UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
-- Add comment
COMMENT ON TABLE public.posts IS 'User-generated content posts';