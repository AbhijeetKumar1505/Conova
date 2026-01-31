# Supabase Setup Guide

This guide will walk you through setting up the Supabase backend for the Conova app.

## Prerequisites

- Supabase account ([sign up here](https://supabase.com))
- Access to Supabase SQL Editor
- Your project's Supabase URL and anon key

---

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in project details:
   - **Name**: Conova
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose closest to your users
4. Click "Create new project" and wait for setup to complete

---

## Step 2: Configure Environment Variables

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy your **Project URL** and **anon public** key
3. Create a `.env` file in the root of your Conova project:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

4. Replace the placeholder values with your actual credentials

---

## Step 3: Run Database Migrations

Run the SQL migration files in order using the Supabase SQL Editor:

### Navigate to SQL Editor
1. In your Supabase dashboard, click **SQL Editor** in the left sidebar
2. Click **New Query**

### Execute Migrations in Order

Copy and paste each file's contents into the SQL Editor and click **Run**:

#### 1. Create Tables (Run in order)
- ✅ `01_create_profiles_table.sql` - Creates profiles table with auto-creation trigger
- ✅ `02_create_posts_table.sql` - Creates posts table
- ✅ `03_create_circles_table.sql` - Creates circles table
- ✅ `04_create_circle_members_table.sql` - Creates circle membership table
- ✅ `05_create_reactions_table.sql` - Creates reactions table
- ✅ `06_create_comments_table.sql` - Creates comments table
- ✅ `07_create_notifications_table.sql` - Creates notifications table

#### 2. Row Level Security Policies
- ✅ `08_rls_profiles.sql` - RLS for profiles
- ✅ `09_rls_posts.sql` - RLS for posts
- ✅ `10_rls_circles.sql` - RLS for circles
- ✅ `11_rls_circle_members.sql` - RLS for circle members
- ✅ `12_rls_reactions.sql` - RLS for reactions
- ✅ `13_rls_comments.sql` - RLS for comments
- ✅ `14_rls_notifications.sql` - RLS for notifications

#### 3. Storage and Triggers
- ✅ `15_storage_setup.sql` - Creates storage buckets and policies
- ✅ `16_notification_triggers.sql` - Creates notification triggers

> **Note**: If you get any errors, make sure you're running the migrations in the correct order. Some migrations depend on previous ones.

---

## Step 4: Verify Database Setup

### Check Tables
Run this query in the SQL Editor to verify all tables were created:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

You should see:
- `circle_members`
- `circles`
- `comments`
- `notifications`
- `posts`
- `profiles`
- `reactions`

### Check RLS Policies
Run this query to verify RLS is enabled:

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

All tables should have `rowsecurity = true`.

### Check Storage Buckets
1. Go to **Storage** in the Supabase dashboard
2. Verify you see two buckets:
   - `avatars`
   - `post-images`

---

## Step 5: Test Authentication

### Enable Email Auth
1. Go to **Authentication** → **Providers** in Supabase dashboard
2. Ensure **Email** is enabled
3. (Optional) Configure email templates under **Email Templates**

### Test Signup
You can test the setup by running your app:

```bash
npm start
```

Then try signing up a test user. The profile should be automatically created!

---

## Step 6: Configure Realtime (Optional but Recommended)

1. Go to **Database** → **Replication** in Supabase dashboard
2. Enable replication for these tables:
   - `posts`
   - `comments`
   - `reactions`
   - `notifications`
   - `circle_members`

This enables realtime subscriptions for live updates.

---

## Troubleshooting

### Migration Errors

**Error: relation already exists**
- This means the table was already created. You can skip that migration or drop the table first.

**Error: permission denied**
- Make sure you're using the SQL Editor in your Supabase dashboard, not a client connection.

**Error: foreign key constraint**
- Make sure you're running migrations in the correct order. Tables must exist before foreign keys can reference them.

### Storage Issues

**Error: bucket already exists**
- This is fine! The migration uses `ON CONFLICT DO NOTHING` to handle this.

**Can't upload files**
- Check that storage policies were created correctly
- Verify the bucket is set to `public = true`

### RLS Issues

**Can't read/write data**
- Verify RLS policies were created successfully
- Check that you're authenticated when testing
- Use the Supabase dashboard to view data directly (bypasses RLS)

---

## Next Steps

Once your Supabase backend is configured:

1. ✅ Test authentication (signup/login)
2. ✅ Test creating a post
3. ✅ Test uploading an image
4. ✅ Move to Phase 3: Frontend Architecture

---

## Useful Supabase Dashboard Links

- **SQL Editor**: Write and run SQL queries
- **Table Editor**: View and edit data directly
- **Authentication**: Manage users
- **Storage**: View uploaded files
- **Database → Replication**: Enable realtime
- **Settings → API**: Get your credentials

---

## Migration Files Location

All migration files are located in:
```
e:\Conova\supabase\migrations\
```

You can also run all migrations at once by copying all files' contents into a single SQL Editor query (in order).

---

**Status**: Ready for Phase 3 once all migrations are complete! 🚀
