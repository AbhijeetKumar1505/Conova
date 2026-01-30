# Workflow Design

This document explains how users move through the system and how major features operate step‑by‑step.

---

## 1. User Onboarding Workflow

1. User installs or opens the app
2. User signs up or logs in
3. Authentication is handled by Supabase
4. On first login, user creates profile:
   - Upload avatar
   - Add bio
5. User enters the home feed

---

## 2. Profile Management Workflow

1. User navigates to Profile
2. Clicks Edit Profile
3. Updates name, bio, or photo
4. Data saved to Supabase database
5. Storage updated if new image uploaded

---

## 3. Creating a Post Workflow

1. User taps “Create Post”
2. Enters text and optionally uploads image
3. Frontend uploads image to Supabase Storage
4. Post record saved in database
5. Realtime event triggers feed updates
6. Followers or circle members see new post instantly

---

## 4. Feed Interaction Workflow

1. User scrolls feed
2. Feed loads posts from database
3. User likes or comments on a post
4. Reaction/comment saved in database
5. Post author receives notification

---

## 5. Circles (Community) Workflow

1. User creates a circle or joins one
2. Circle members share posts inside the circle
3. Posts are visible only to circle members
4. Realtime updates notify members of activity

---

## 6. Notifications Workflow

Triggers include:
- Someone liked your post
- Someone commented
- Someone joined your circle

Flow:
1. Action occurs
2. Notification record created in database
3. User sees alert in Notifications screen

---

## 7. Real-Time Update Workflow

1. Database change occurs (new post/comment)
2. Supabase Realtime broadcasts event
3. Subscribed clients receive update
4. UI updates automatically

---

## Summary
Workflows ensure the app feels:
- Instant
- Interactive
- Community‑driven
- Smooth and intuitive for users

