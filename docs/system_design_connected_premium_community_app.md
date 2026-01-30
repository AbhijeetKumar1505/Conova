# System Design

## Architecture Overview
The platform follows a **modern full‑stack architecture** designed for scalability, performance, and real‑time interactivity.

**Frontend:** Cross‑platform client (Mobile + Web)  
**Backend Services:** Supabase (Database, Auth, Realtime, Storage)  
**Optional Extensions:** Edge functions for custom logic

---

## High-Level Architecture Diagram (Conceptual)

User Device (Mobile/Web)
        ↓
Frontend App (React Native / Web)
        ↓
Supabase Services Layer
   • Authentication
   • PostgreSQL Database
   • Realtime Engine
   • Storage
        ↓
Optional Edge Functions (Custom Logic)

---

## Frontend Layer

### Responsibilities
- UI rendering
- Navigation
- State management
- Calling Supabase APIs
- Handling real‑time subscriptions

### Key Modules
- Auth Module
- Profile Module
- Feed Module
- Circles (Communities) Module
- Notifications Module

The frontend should be modular and component‑based for easy scaling.

---

## Backend (Supabase) Design

### 1. Authentication
Handles:
- User registration & login
- Session management
- Password recovery
- OAuth (future ready)

### 2. Database (PostgreSQL)
Core tables include:
- users (managed by Supabase Auth)
- profiles
- posts
- circles
- circle_members
- reactions
- comments
- notifications

All tables use **Row Level Security (RLS)** so users can only access data they are permitted to see.

### 3. Realtime Engine
Used for:
- Live feed updates
- New comments appearing instantly
- Circle activity updates

### 4. Storage
Used for:
- Profile avatars
- Post images
- Media uploads

---

## Data Flow Example (Creating a Post)
1. User writes a post in the app
2. Frontend sends data to Supabase
3. Supabase stores the post in the database
4. Realtime service broadcasts update
5. Other users’ feeds update instantly

---

## Security Design
- Authentication tokens secure all requests
- Row Level Security enforces data ownership
- Storage buckets use access policies
- Sensitive logic can move to Edge Functions

---

## Scalability Considerations
- Supabase handles horizontal DB scaling
- Realtime subscriptions are event‑based
- Storage is cloud‑backed and scalable
- Edge functions allow server‑side expansion without changing frontend

---

## Summary
The system design ensures the app is:
- Secure
- Real‑time capable
- Scalable
- Modular for future features

