# Phase 3 — UI Layout & Landing Page

**Goal:** Bootstrap integration, navbar, footer, landing page, dashboard shell.

**Status:** Not started

---

## Tasks

### 3.1 Bootstrap integration
- [ ] Import Bootstrap CSS in `app/layout.tsx`:
  ```ts
  import 'bootstrap/dist/css/bootstrap.min.css'
  import 'bootstrap-icons/font/bootstrap-icons.css'
  ```
- [ ] Optional: import Bootstrap JS bundle for components (modals, dropdowns)
- [ ] Write `app/globals.css` — custom styles layered on Bootstrap (colors, spacing)

### 3.2 Layout components
- [ ] `components/layout/Navbar.tsx`
  - Brand logo + name
  - Links: Home, Predict, History, Profile (when logged in)
  - Links: Login, Register (when logged out)
  - User dropdown with logout
  - Responsive collapse on mobile
- [ ] `components/layout/Footer.tsx`
  - Copyright, project name, year
  - Links to GitHub repo
- [ ] `components/layout/Sidebar.tsx`
  - Dashboard navigation: Dashboard, Predict, History, Profile
  - Admin section (if admin): Users, Logs
  - Active link highlighting

### 3.3 Landing page
- [ ] `app/page.tsx`
  - Hero section: title, subtitle, CTA buttons (Get Started → /register, Learn More)
  - Features section: 3 cards (Early Detection, Lifestyle-Based, AI-Powered)
  - How it works: 3 steps (Register → Enter Lifestyle Data → Get Risk Score)
  - Footer

### 3.4 User dashboard shell
- [ ] `app/(dashboard)/layout.tsx`
  - Wraps all `/dashboard/*` routes
  - Sidebar + Navbar + main content area
  - Auth check (redirect to login if not authenticated)

### 3.5 User dashboard page
- [ ] `app/(dashboard)/dashboard/page.tsx`
  - Welcome message with user name
  - Quick stats cards: total predictions, last risk level, member since
  - CTA button: "Take New Assessment" → /dashboard/predict
  - Recent predictions table (last 5)

### 3.6 Admin shell + dashboard
- [ ] `app/admin/layout.tsx`
  - Admin-specific sidebar: Dashboard, Users, Logs
  - Auth check: must be admin
- [ ] `app/admin/page.tsx`
  - Stat cards: total users, total predictions, total logs
  - Recent users table
  - Recent predictions table

---

## File Tree (new files)

```
app/
├── layout.tsx (edit — add Bootstrap import)
├── globals.css (edit)
├── page.tsx (rewrite — landing)
├── (dashboard)/
│   ├── layout.tsx
│   └── dashboard/page.tsx
└── admin/
    ├── layout.tsx
    └── page.tsx
components/layout/
├── Navbar.tsx
├── Footer.tsx
└── Sidebar.tsx
```

---

## Deliverable

- Bootstrap 5 styling across all pages
- Landing page with hero, features, how-it-works
- Authenticated dashboard shell with sidebar
- Admin dashboard shell with admin sidebar
- Responsive on mobile, tablet, desktop

---

## Next Phase

→ [Phase 4 — Python ML Service](phase-4-ml-service.md)
