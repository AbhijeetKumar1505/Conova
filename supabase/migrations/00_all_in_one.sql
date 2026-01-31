-- ============================================
-- CONOVA DATABASE SETUP - CLEAN INSTALL
-- ============================================
-- This script will DROP existing tables and recreate everything
-- WARNING: This will delete all existing data!
-- Only run this if you want to start fresh
-- ============================================
-- ============================================
-- CLEANUP: Drop existing objects
-- ============================================
-- Drop triggers first
DROP TRIGGER IF EXISTS on_circle_member_added ON public.circle_members;
DROP TRIGGER IF EXISTS on_comment_created ON public.comments;
DROP TRIGGER IF EXISTS on_reaction_created ON public.reactions;
DROP TRIGGER IF EXISTS on_circle_created ON public.circles;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS set_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS set_updated_at ON public.posts;
DROP TRIGGER IF EXISTS set_updated_at ON public.comments;
-- Drop functions
DROP FUNCTION IF EXISTS public.handle_new_circle_member CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_comment CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_reaction CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_circle CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user CASCADE;
DROP FUNCTION IF EXISTS public.handle_updated_at CASCADE;
-- Drop tables (in reverse order of dependencies)
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.comments CASCADE;
DROP TABLE IF EXISTS public.reactions CASCADE;
DROP TABLE IF EXISTS public.circle_members CASCADE;
DROP TABLE IF EXISTS public.posts CASCADE;
DROP TABLE IF EXISTS public.circles CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
-- ============================================
-- PART 1: CREATE TABLES (01-07)
-- ============================================
-- 01: Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
CREATE INDEX profiles_user_id_idx ON public.profiles(user_id);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
-- Create function to handle updated_at timestamp
CREATE FUNCTION public.handle_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER set_updated_at BEFORE
UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
-- Create function to auto-create profile on user signup
CREATE FUNCTION public.handle_new_user() RETURNS TRIGGER AS $$ BEGIN
INSERT INTO public.profiles (user_id, display_name)
VALUES (
        NEW.id,
        COALESCE(
            NEW.raw_user_meta_data->>'display_name',
            split_part(NEW.email, '@', 1)
        )
    );
RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
CREATE TRIGGER on_auth_user_created
AFTER
INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
COMMENT ON TABLE public.profiles IS 'User profile information';
-- 02: Create posts table
CREATE TABLE public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    circle_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
CREATE INDEX posts_author_id_idx ON public.posts(author_id);
CREATE INDEX posts_circle_id_idx ON public.posts(circle_id);
CREATE INDEX posts_created_at_idx ON public.posts(created_at DESC);
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER set_updated_at BEFORE
UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
COMMENT ON TABLE public.posts IS 'User-generated content posts';
-- 03: Create circles table
CREATE TABLE public.circles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    creator_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE NOT NULL,
    is_private BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
CREATE INDEX circles_creator_id_idx ON public.circles(creator_id);
CREATE INDEX circles_is_private_idx ON public.circles(is_private);
ALTER TABLE public.circles ENABLE ROW LEVEL SECURITY;
-- Add foreign key constraint to posts table
ALTER TABLE public.posts
ADD CONSTRAINT posts_circle_id_fkey FOREIGN KEY (circle_id) REFERENCES public.circles(id) ON DELETE
SET NULL;
COMMENT ON TABLE public.circles IS 'Community groups and circles';
-- 04: Create circle_members table
CREATE TABLE public.circle_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    circle_id UUID REFERENCES public.circles(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('creator', 'member')),
    joined_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(circle_id, user_id)
);
CREATE INDEX circle_members_circle_id_idx ON public.circle_members(circle_id);
CREATE INDEX circle_members_user_id_idx ON public.circle_members(user_id);
ALTER TABLE public.circle_members ENABLE ROW LEVEL SECURITY;
-- Create function to auto-add creator as member
CREATE FUNCTION public.handle_new_circle() RETURNS TRIGGER AS $$ BEGIN
INSERT INTO public.circle_members (circle_id, user_id, role)
VALUES (NEW.id, NEW.creator_id, 'creator');
RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
CREATE TRIGGER on_circle_created
AFTER
INSERT ON public.circles FOR EACH ROW EXECUTE FUNCTION public.handle_new_circle();
COMMENT ON TABLE public.circle_members IS 'Circle membership tracking';
-- 05: Create reactions table
CREATE TABLE public.reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE NOT NULL,
    reaction_type TEXT NOT NULL CHECK (reaction_type IN ('like', 'love', 'celebrate')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(post_id, user_id)
);
CREATE INDEX reactions_post_id_idx ON public.reactions(post_id);
CREATE INDEX reactions_user_id_idx ON public.reactions(user_id);
ALTER TABLE public.reactions ENABLE ROW LEVEL SECURITY;
COMMENT ON TABLE public.reactions IS 'Post reactions (likes, loves, celebrates)';
-- 06: Create comments table
CREATE TABLE public.comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
CREATE INDEX comments_post_id_idx ON public.comments(post_id);
CREATE INDEX comments_user_id_idx ON public.comments(user_id);
CREATE INDEX comments_created_at_idx ON public.comments(created_at);
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER set_updated_at BEFORE
UPDATE ON public.comments FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
COMMENT ON TABLE public.comments IS 'Post comments';
-- 07: Create notifications table
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL CHECK (
        type IN ('like', 'comment', 'circle_join', 'mention')
    ),
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false NOT NULL,
    related_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
CREATE INDEX notifications_user_id_idx ON public.notifications(user_id);
CREATE INDEX notifications_is_read_idx ON public.notifications(is_read);
CREATE INDEX notifications_created_at_idx ON public.notifications(created_at DESC);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
COMMENT ON TABLE public.notifications IS 'User notifications for activity alerts';
-- ============================================
-- PART 2: ROW LEVEL SECURITY POLICIES (08-14)
-- ============================================
-- 08: RLS Policies for profiles
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR
SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR
INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR
UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own profile" ON public.profiles FOR DELETE USING (auth.uid() = user_id);
-- 09: RLS Policies for posts
CREATE POLICY "Users can view accessible posts" ON public.posts FOR
SELECT USING (
        circle_id IS NULL
        OR EXISTS (
            SELECT 1
            FROM public.circle_members
            WHERE circle_members.circle_id = posts.circle_id
                AND circle_members.user_id = auth.uid()
        )
    );
CREATE POLICY "Authenticated users can create posts" ON public.posts FOR
INSERT WITH CHECK (
        auth.uid() = author_id
        AND (
            circle_id IS NULL
            OR EXISTS (
                SELECT 1
                FROM public.circle_members
                WHERE circle_members.circle_id = posts.circle_id
                    AND circle_members.user_id = auth.uid()
            )
        )
    );
CREATE POLICY "Users can update their own posts" ON public.posts FOR
UPDATE USING (auth.uid() = author_id) WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can delete their own posts" ON public.posts FOR DELETE USING (auth.uid() = author_id);
-- 10: RLS Policies for circles
CREATE POLICY "Users can view accessible circles" ON public.circles FOR
SELECT USING (
        is_private = false
        OR EXISTS (
            SELECT 1
            FROM public.circle_members
            WHERE circle_members.circle_id = circles.id
                AND circle_members.user_id = auth.uid()
        )
    );
CREATE POLICY "Authenticated users can create circles" ON public.circles FOR
INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Creators can update their circles" ON public.circles FOR
UPDATE USING (auth.uid() = creator_id) WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Creators can delete their circles" ON public.circles FOR DELETE USING (auth.uid() = creator_id);
-- 11: RLS Policies for circle_members
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
CREATE POLICY "Users can join circles or be added" ON public.circle_members FOR
INSERT WITH CHECK (
        auth.uid() = user_id
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
CREATE POLICY "Users can leave or be removed from circles" ON public.circle_members FOR DELETE USING (
    auth.uid() = user_id
    OR EXISTS (
        SELECT 1
        FROM public.circle_members cm
        WHERE cm.circle_id = circle_members.circle_id
            AND cm.user_id = auth.uid()
            AND cm.role = 'creator'
    )
);
-- 12: RLS Policies for reactions
CREATE POLICY "Reactions are viewable by everyone" ON public.reactions FOR
SELECT USING (true);
CREATE POLICY "Authenticated users can add reactions" ON public.reactions FOR
INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reactions" ON public.reactions FOR DELETE USING (auth.uid() = user_id);
-- 13: RLS Policies for comments
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
CREATE POLICY "Users can update their own comments" ON public.comments FOR
UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own comments" ON public.comments FOR DELETE USING (auth.uid() = user_id);
-- 14: RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications FOR
SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert notifications" ON public.notifications FOR
INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR
UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own notifications" ON public.notifications FOR DELETE USING (auth.uid() = user_id);
-- ============================================
-- PART 3: STORAGE SETUP (15)
-- ============================================
-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public)
VALUES ('post-images', 'post-images', true) ON CONFLICT (id) DO NOTHING;
-- Storage policies for avatars
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects FOR
SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Authenticated users can upload avatars" ON storage.objects FOR
INSERT WITH CHECK (
        bucket_id = 'avatars'
        AND auth.role() = 'authenticated'
    );
CREATE POLICY "Users can update their own avatars" ON storage.objects FOR
UPDATE USING (
        bucket_id = 'avatars'
        AND auth.uid()::text = (storage.foldername(name)) [1]
    ) WITH CHECK (
        bucket_id = 'avatars'
        AND auth.uid()::text = (storage.foldername(name)) [1]
    );
CREATE POLICY "Users can delete their own avatars" ON storage.objects FOR DELETE USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name)) [1]
);
-- Storage policies for post-images
CREATE POLICY "Post images are publicly accessible" ON storage.objects FOR
SELECT USING (bucket_id = 'post-images');
CREATE POLICY "Authenticated users can upload post images" ON storage.objects FOR
INSERT WITH CHECK (
        bucket_id = 'post-images'
        AND auth.role() = 'authenticated'
    );
CREATE POLICY "Users can update their own post images" ON storage.objects FOR
UPDATE USING (
        bucket_id = 'post-images'
        AND auth.uid()::text = (storage.foldername(name)) [1]
    ) WITH CHECK (
        bucket_id = 'post-images'
        AND auth.uid()::text = (storage.foldername(name)) [1]
    );
CREATE POLICY "Users can delete their own post images" ON storage.objects FOR DELETE USING (
    bucket_id = 'post-images'
    AND auth.uid()::text = (storage.foldername(name)) [1]
);
-- ============================================
-- PART 4: NOTIFICATION TRIGGERS (16)
-- ============================================
-- Function to create notification for new reaction
CREATE FUNCTION public.handle_new_reaction() RETURNS TRIGGER AS $$
DECLARE post_author_id UUID;
reactor_name TEXT;
BEGIN
SELECT author_id INTO post_author_id
FROM public.posts
WHERE id = NEW.post_id;
IF post_author_id = NEW.user_id THEN RETURN NEW;
END IF;
SELECT display_name INTO reactor_name
FROM public.profiles
WHERE user_id = NEW.user_id;
INSERT INTO public.notifications (user_id, type, content, related_id)
VALUES (
        post_author_id,
        'like',
        reactor_name || ' reacted to your post',
        NEW.post_id
    );
RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
CREATE TRIGGER on_reaction_created
AFTER
INSERT ON public.reactions FOR EACH ROW EXECUTE FUNCTION public.handle_new_reaction();
-- Function to create notification for new comment
CREATE FUNCTION public.handle_new_comment() RETURNS TRIGGER AS $$
DECLARE post_author_id UUID;
commenter_name TEXT;
BEGIN
SELECT author_id INTO post_author_id
FROM public.posts
WHERE id = NEW.post_id;
IF post_author_id = NEW.user_id THEN RETURN NEW;
END IF;
SELECT display_name INTO commenter_name
FROM public.profiles
WHERE user_id = NEW.user_id;
INSERT INTO public.notifications (user_id, type, content, related_id)
VALUES (
        post_author_id,
        'comment',
        commenter_name || ' commented on your post',
        NEW.post_id
    );
RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
CREATE TRIGGER on_comment_created
AFTER
INSERT ON public.comments FOR EACH ROW EXECUTE FUNCTION public.handle_new_comment();
-- Function to create notification for new circle member
CREATE FUNCTION public.handle_new_circle_member() RETURNS TRIGGER AS $$
DECLARE circle_creator_id UUID;
member_name TEXT;
circle_name TEXT;
BEGIN
SELECT creator_id,
    name INTO circle_creator_id,
    circle_name
FROM public.circles
WHERE id = NEW.circle_id;
IF circle_creator_id = NEW.user_id THEN RETURN NEW;
END IF;
SELECT display_name INTO member_name
FROM public.profiles
WHERE user_id = NEW.user_id;
INSERT INTO public.notifications (user_id, type, content, related_id)
VALUES (
        circle_creator_id,
        'circle_join',
        member_name || ' joined your circle "' || circle_name || '"',
        NEW.circle_id
    );
RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
CREATE TRIGGER on_circle_member_added
AFTER
INSERT ON public.circle_members FOR EACH ROW EXECUTE FUNCTION public.handle_new_circle_member();
-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- All tables, policies, storage, and triggers are now configured.
-- You can now use the Conova app with full backend functionality.
-- ============================================