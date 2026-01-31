# Supabase Migrations

This directory contains SQL migration files for setting up the Conova database.

## Quick Setup (Recommended)

**Easiest method**: Run the all-in-one migration file:

1. Open Supabase SQL Editor
2. Copy and paste the entire contents of `00_all_in_one.sql`
3. Click **Run**
4. Done! ✅

This file combines all migrations in the correct order.

---

## Manual Setup (Alternative)

Run these files in the Supabase SQL Editor **in this exact order**:

### 1. Database Tables (01-07)
1. `01_create_profiles_table.sql` - User profiles
2. `02_create_posts_table.sql` - Posts/content
3. `03_create_circles_table.sql` - Communities
4. `04_create_circle_members_table.sql` - Circle membership
5. `05_create_reactions_table.sql` - Post reactions
6. `06_create_comments_table.sql` - Post comments
7. `07_create_notifications_table.sql` - User notifications

### 2. Row Level Security (08-14)
8. `08_rls_profiles.sql` - Profiles RLS policies
9. `09_rls_posts.sql` - Posts RLS policies
10. `10_rls_circles.sql` - Circles RLS policies
11. `11_rls_circle_members.sql` - Circle members RLS policies
12. `12_rls_reactions.sql` - Reactions RLS policies
13. `13_rls_comments.sql` - Comments RLS policies
14. `14_rls_notifications.sql` - Notifications RLS policies

### 3. Storage & Triggers (15-16)
15. `15_storage_setup.sql` - Storage buckets and policies
16. `16_notification_triggers.sql` - Auto-notification triggers

## Quick Setup

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed instructions.

## Verification

After running all migrations, verify:

```sql
-- Check all tables exist
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Check RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
```

## Rollback

To start fresh, run:

```sql
-- Drop all tables (be careful!)
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.comments CASCADE;
DROP TABLE IF EXISTS public.reactions CASCADE;
DROP TABLE IF EXISTS public.circle_members CASCADE;
DROP TABLE IF EXISTS public.posts CASCADE;
DROP TABLE IF EXISTS public.circles CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS public.handle_new_user CASCADE;
DROP FUNCTION IF EXISTS public.handle_updated_at CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_circle CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_reaction CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_comment CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_circle_member CASCADE;
```

Then re-run all migrations from the beginning.
