# Phase 2 — Authentication System

**Goal:** User registration, login, logout, session management with JWT.

**Status:** Not started

---

## Tasks

### 2.1 Prisma client singleton
- [ ] Create `lib/prisma.ts`
  ```ts
  import { PrismaClient } from '@prisma/client'
  const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
  export const prisma = globalForPrisma.prisma ?? new PrismaClient()
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
  ```

### 2.2 Password helpers
- [ ] Create `lib/password.ts`
  - `hashPassword(plain: string): Promise<string>` — bcrypt.hash, saltRounds 10
  - `verifyPassword(plain: string, hash: string): Promise<boolean>` — bcrypt.compare

### 2.3 JWT helpers
- [ ] Create `lib/auth.ts`
  - `signToken(payload: { userId: number }): Promise<string>` — jose.SignJWT, 7d expiry
  - `verifyToken(token: string): Promise<{ userId: number } | null>`
  - `getSession(): Promise<User | null>` — reads cookie, verifies token, fetches user
  - `setAuthCookie(res, token)` — httpOnly, secure in production
  - `clearAuthCookie(res)`

### 2.4 Validators
- [ ] Create `lib/validators.ts`
  - `registerSchema` — zod: fullName (min 3), email (valid), password (min 6), gender (Male/Female)
  - `loginSchema` — zod: email, password

### 2.5 API routes
- [ ] `app/api/auth/register/route.ts`
  - Validate body with `registerSchema`
  - Check email not already in use
  - Hash password, create User via Prisma
  - Sign JWT, set httpOnly cookie
  - Log to SystemLog (activity: "register", status: "Success")
  - Return `{ user: { id, fullName, email } }`
- [ ] `app/api/auth/login/route.ts`
  - Validate body with `loginSchema`
  - Find user by email
  - Verify password
  - Sign JWT, set httpOnly cookie
  - Log to SystemLog (activity: "login", status: "Success")
  - Return `{ user: { id, fullName, email } }`
- [ ] `app/api/auth/logout/route.ts`
  - Clear auth cookie
  - Return `{ success: true }`

### 2.6 Client state
- [ ] Create `stores/authStore.ts` — Zustand store: `user`, `setUser`, `clearUser`
- [ ] Create `hooks/useAuth.ts` — fetches `/api/auth/me` (or reads from store), returns `{ user, isLoading }`

### 2.7 Auth pages
- [ ] Create `components/forms/AuthForm.tsx` — reusable form (fields vary by mode)
- [ ] Create `app/(auth)/login/page.tsx` — uses AuthForm, posts to `/api/auth/login`
- [ ] Create `app/(auth)/register/page.tsx` — uses AuthForm, posts to `/api/auth/register`
- [ ] On success → redirect to `/dashboard`
- [ ] Show error toast on failure

### 2.8 Route protection
- [ ] Create `middleware.ts` at project root
  - Protect `/dashboard/*`, `/admin/*`, `/api/predict`, `/api/history`, `/api/admin/*`
  - If no auth cookie → redirect to `/login`
  - For `/admin/*` → check user is admin (separate check)
  - Allow `/`, `/login`, `/register`, `/api/auth/*` publicly

---

## File Tree (new files)

```
lib/
├── prisma.ts
├── password.ts
├── auth.ts
└── validators.ts
stores/
└── authStore.ts
hooks/
└── useAuth.ts
components/forms/
└── AuthForm.tsx
app/
├── (auth)/login/page.tsx
├── (auth)/register/page.tsx
└── api/auth/
    ├── register/route.ts
    ├── login/route.ts
    └── logout/route.ts
middleware.ts
```

---

## Deliverable

- User can register with email + password
- User can log in, receives JWT in httpOnly cookie
- User can log out (cookie cleared)
- Protected routes redirect to `/login` if not authenticated
- All auth events logged to `SystemLog`

---

## Next Phase

→ [Phase 3 — UI Layout & Landing](phase-3-ui-layout.md)
