# Phase 6 — History & Profile

**Goal:** User can view past predictions and manage their profile.

**Status:** Not started

---

## Tasks

### 6.1 History API
- [ ] `app/api/history/route.ts`
  - GET handler
  - Auth required
  - Fetch logged-in user's predictions via Prisma:
    ```ts
    prisma.predictionResult.findMany({
      where: { userId },
      include: { lifestyleData: true },
      orderBy: { predictionDate: 'desc' },
    })
    ```
  - Return array of predictions with lifestyle data

### 6.2 History page
- [ ] `app/(dashboard)/history/page.tsx`
  - Fetch `/api/history` with SWR
  - Table columns:
    - Date
    - Age at time
    - BMI
    - Risk Level (badge: green/yellow/red)
    - Probability (%)
    - View button (expandable row showing full lifestyle data)
  - Empty state: "No predictions yet. Take your first assessment."
  - Loading skeleton

### 6.3 Profile page
- [ ] `app/(dashboard)/profile/page.tsx`
  - Display: fullName, email, gender, member since
  - Edit form (react-hook-form):
    - fullName (editable)
    - email (editable)
    - gender (editable)
  - Change password section:
    - Current password
    - New password
    - Confirm new password
  - Save → PUT `/api/profile`

### 6.4 Profile API
- [ ] `app/api/profile/route.ts`
  - GET — return current user's profile (excluding passwordHash)
  - PUT — update fullName, email, gender
  - PATCH `/api/profile/password` — change password:
    - Verify current password
    - Hash new password
    - Update via Prisma
    - Log to SystemLog

---

## File Tree (new files)

```
app/
├── api/
│   ├── history/route.ts
│   └── profile/
│       └── route.ts
└── (dashboard)/
    ├── history/page.tsx
    └── profile/page.tsx
```

---

## Deliverable

- User sees table of all past predictions (newest first)
- User can expand a row to see the lifestyle data that was submitted
- User can edit name, email, gender
- User can change password (with current password verification)
- Profile updates logged to SystemLog

---

## Next Phase

→ [Phase 7 — Admin Panel](phase-7-admin.md)
