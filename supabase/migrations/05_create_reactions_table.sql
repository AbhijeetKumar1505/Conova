-- Create reactions table
-- This table stores post reactions (likes, loves, etc.)
CREATE TABLE IF NOT EXISTS public.reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE NOT NULL,
    reaction_type TEXT NOT NULL CHECK (reaction_type IN ('like', 'love', 'celebrate')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(post_id, user_id)
);
-- Create indexes
CREATE INDEX IF NOT EXISTS reactions_post_id_idx ON public.reactions(post_id);
CREATE INDEX IF NOT EXISTS reactions_user_id_idx ON public.reactions(user_id);
-- Enable Row Level Security
ALTER TABLE public.reactions ENABLE ROW LEVEL SECURITY;
-- Add comment
COMMENT ON TABLE public.reactions IS 'Post reactions (likes, loves, celebrates)';