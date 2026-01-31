-- Notification Triggers
-- Auto-create notifications for various events
-- Function to create notification for new reaction
CREATE OR REPLACE FUNCTION public.handle_new_reaction() RETURNS TRIGGER AS $$
DECLARE post_author_id UUID;
reactor_name TEXT;
BEGIN -- Get the post author
SELECT author_id INTO post_author_id
FROM public.posts
WHERE id = NEW.post_id;
-- Don't notify if user reacted to their own post
IF post_author_id = NEW.user_id THEN RETURN NEW;
END IF;
-- Get reactor's display name
SELECT display_name INTO reactor_name
FROM public.profiles
WHERE user_id = NEW.user_id;
-- Create notification
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
-- Trigger for new reactions
CREATE TRIGGER on_reaction_created
AFTER
INSERT ON public.reactions FOR EACH ROW EXECUTE FUNCTION public.handle_new_reaction();
-- Function to create notification for new comment
CREATE OR REPLACE FUNCTION public.handle_new_comment() RETURNS TRIGGER AS $$
DECLARE post_author_id UUID;
commenter_name TEXT;
BEGIN -- Get the post author
SELECT author_id INTO post_author_id
FROM public.posts
WHERE id = NEW.post_id;
-- Don't notify if user commented on their own post
IF post_author_id = NEW.user_id THEN RETURN NEW;
END IF;
-- Get commenter's display name
SELECT display_name INTO commenter_name
FROM public.profiles
WHERE user_id = NEW.user_id;
-- Create notification
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
-- Trigger for new comments
CREATE TRIGGER on_comment_created
AFTER
INSERT ON public.comments FOR EACH ROW EXECUTE FUNCTION public.handle_new_comment();
-- Function to create notification for new circle member
CREATE OR REPLACE FUNCTION public.handle_new_circle_member() RETURNS TRIGGER AS $$
DECLARE circle_creator_id UUID;
member_name TEXT;
circle_name TEXT;
BEGIN -- Get the circle creator
SELECT creator_id,
    name INTO circle_creator_id,
    circle_name
FROM public.circles
WHERE id = NEW.circle_id;
-- Don't notify if creator joined their own circle
IF circle_creator_id = NEW.user_id THEN RETURN NEW;
END IF;
-- Get member's display name
SELECT display_name INTO member_name
FROM public.profiles
WHERE user_id = NEW.user_id;
-- Create notification
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
-- Trigger for new circle members
CREATE TRIGGER on_circle_member_added
AFTER
INSERT ON public.circle_members FOR EACH ROW EXECUTE FUNCTION public.handle_new_circle_member();