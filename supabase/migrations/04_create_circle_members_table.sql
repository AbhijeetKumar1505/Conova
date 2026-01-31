-- Create circle_members table
-- This table tracks circle membership
CREATE TABLE IF NOT EXISTS public.circle_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    circle_id UUID REFERENCES public.circles(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('creator', 'member')),
    joined_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(circle_id, user_id)
);
-- Create indexes
CREATE INDEX IF NOT EXISTS circle_members_circle_id_idx ON public.circle_members(circle_id);
CREATE INDEX IF NOT EXISTS circle_members_user_id_idx ON public.circle_members(user_id);
-- Enable Row Level Security
ALTER TABLE public.circle_members ENABLE ROW LEVEL SECURITY;
-- Create function to auto-add creator as member
CREATE OR REPLACE FUNCTION public.handle_new_circle() RETURNS TRIGGER AS $$ BEGIN
INSERT INTO public.circle_members (circle_id, user_id, role)
VALUES (NEW.id, NEW.creator_id, 'creator');
RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- Create trigger to auto-add creator
CREATE TRIGGER on_circle_created
AFTER
INSERT ON public.circles FOR EACH ROW EXECUTE FUNCTION public.handle_new_circle();
-- Add comment
COMMENT ON TABLE public.circle_members IS 'Circle membership tracking';