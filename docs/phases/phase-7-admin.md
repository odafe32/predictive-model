# Phase 7 — Admin Panel

**Goal:** Admin can manage users, view all predictions, and see system logs.

**Status:** Not started

---

## Tasks

### 7.1 Admin auth
- [ ] Add admin check to `lib/auth.ts`:
  - `getAdminSession()` — verifies JWT, checks Administrator table
  - Or add `role` field to User and check it
- [ ] Update `middleware.ts` — `/admin/*` routes require admin session
- [ ] Create admin login page at `app/admin/login/page.tsx` (separate from user login)
  - Posts to `/api/admin/login`
- [ ] `app/api/admin/login/route.ts`
  - Verify against Administrator table
  - Issue admin JWT (with `role: "admin"`)

### 7.2 Users management
- [ ] `app/api/admin/users/route.ts`
  - GET — list all users with pagination (page, limit)
  - Returns: id, fullName, email, gender, createdAt, predictionCount
- [ ] `app/api/admin/users/[id]/route.ts`
  - DELETE — delete user + cascade (lifestyle, predictions, logs)
  - Log to SystemLog
- [ ] `app/admin/users/page.tsx`
  - Table: name, email, gender, joined date, predictions count, actions
  - Search by name/email
  - Delete button with confirmation modal
  - Pagination controls

### 7.3 All predictions view
- [ ] `app/api/admin/predictions/route.ts`
  - GET — list all predictions across all users
  - Include: user name, risk level, probability, date
  - Pagination
- [ ] Add to `app/admin/page.tsx` (admin dashboard)
  - Recent predictions table (last 20)
  - Filter by risk level (Low/Moderate/High)

### 7.4 System logs
- [ ] `app/api/admin/logs/route.ts`
  - GET — list all logs with pagination
  - Filter by status (Success/Failed), activity type
  - Include user name (join)
- [ ] `app/admin/logs/page.tsx`
  - Table: timestamp, user, activity, status
  - Filter dropdown: All / Success / Failed
  - Pagination

### 7.5 Admin dashboard stats
- [ ] `app/api/admin/stats/route.ts`
  - GET — return aggregate counts:
    - totalUsers
    - totalPredictions
    - totalLogs
    - predictionsByRiskLevel: { low, moderate, high }
    - predictionsLast7Days: [{ date, count }]
- [ ] Update `app/admin/page.tsx`
  - Stat cards (total users, predictions, logs)
  - Bar chart: predictions by risk level (recharts)
  - Line chart: predictions over last 7 days (recharts)

---

## File Tree (new files)

```
app/
├── admin/
│   ├── login/page.tsx
│   ├── users/page.tsx
│   └── logs/page.tsx
└── api/admin/
    ├── login/route.ts
    ├── users/
    │   ├── route.ts
    │   └── [id]/route.ts
    ├── predictions/route.ts
    ├── logs/route.ts
    └── stats/route.ts
```

---

## Deliverable

- Admin login (separate from user login)
- Admin dashboard with stats + charts
- User management: list, search, delete
- All predictions view with filtering
- System logs view with filtering
- All admin routes protected by admin middleware

---

## Next Phase

→ [Phase 8 — Polish & Deployment](phase-8-polish.md)
