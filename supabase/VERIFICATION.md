# Supabase Setup Verification

Run these checks in your Supabase dashboard to verify everything is working correctly.

## 1. Verify Tables

Go to **Database** → **Tables** in Supabase dashboard, or run this in SQL Editor:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

**Expected tables:**
- ✅ `circle_members`
- ✅ `circles`
- ✅ `comments`
- ✅ `notifications`
- ✅ `posts`
- ✅ `profiles`
- ✅ `reactions`

---

## 2. Verify Row Level Security

Run this query:

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;
```

**All tables should show `rowsecurity = true`**

---

## 3. Verify Storage Buckets

Go to **Storage** in Supabase dashboard.

**Expected buckets:**
- ✅ `avatars` (public)
- ✅ `post-images` (public)

---

## 4. Test Authentication

### Option A: Using Supabase Dashboard
1. Go to **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Enter email and password
4. Click **Create user**
5. Go to **Database** → **Table Editor** → **profiles**
6. You should see a profile automatically created for the new user! ✅

### Option B: Using the App (Recommended)
We'll test this in Phase 3 when we build the UI.

---

## 5. Verify Triggers

Run this query to check triggers:

```sql
SELECT 
  trigger_name,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;
```

**Expected triggers:**
- `on_auth_user_created` on `auth.users`
- `on_circle_created` on `circles`
- `on_circle_member_added` on `circle_members`
- `on_comment_created` on `comments`
- `on_reaction_created` on `reactions`
- `set_updated_at` on `profiles`, `posts`, `comments`

---

## 6. Test Database Operations (Optional)

You can manually test CRUD operations:

### Create a test post:
```sql
-- First, get a user_id from the profiles table
SELECT user_id FROM profiles LIMIT 1;

-- Then create a post (replace YOUR_USER_ID)
INSERT INTO posts (author_id, content)
VALUES ('YOUR_USER_ID', 'Hello, Conova! This is my first post.');

-- View the post
SELECT * FROM posts;
```

### Create a test circle:
```sql
INSERT INTO circles (name, description, creator_id, is_private)
VALUES ('Tech Enthusiasts', 'A circle for tech lovers', 'YOUR_USER_ID', false);

-- View circles
SELECT * FROM circles;
```

---

## 7. Check Realtime (Optional)

Go to **Database** → **Replication** in Supabase dashboard.

Enable replication for these tables (for realtime features):
- ✅ `posts`
- ✅ `comments`
- ✅ `reactions`
- ✅ `notifications`
- ✅ `circle_members`

---

## Common Issues & Solutions

### Issue: No profiles table visible
**Solution**: Make sure you ran the migration successfully. Check the SQL Editor for errors.

### Issue: Can't create users
**Solution**: Go to **Authentication** → **Providers** and ensure **Email** is enabled.

### Issue: Storage buckets missing
**Solution**: The storage setup might have failed. Re-run just the storage section (Part 3) of the migration.

### Issue: Triggers not working
**Solution**: Check that functions were created successfully:
```sql
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public';
```

---

## ✅ Verification Complete!

If all checks pass, your Supabase backend is fully configured and ready to use!

**Next Step**: Move to **Phase 3: Frontend Architecture** to start building the UI.
