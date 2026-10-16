# Phase 8 — Polish, Testing & Deployment

**Goal:** Production-ready, tested, deployed application.

**Status:** Not started

---

## Tasks

### 8.1 UI polish
- [ ] Add loading skeletons/spinners to all data-fetching pages
- [ ] Add error toast notifications (react-bootstrap Toast or custom)
- [ ] Add empty states ("No data yet" messages)
- [ ] Add success toasts (prediction saved, profile updated, etc.)
- [ ] Consistent spacing, typography, colors across all pages
- [ ] Add page titles + meta descriptions for SEO

### 8.2 Responsive testing
- [ ] Test all pages at breakpoints: mobile (375px), tablet (768px), desktop (1280px)
- [ ] Fix any layout issues (sidebar collapse, table scroll, form stacking)
- [ ] Test navbar collapse on mobile
- [ ] Test admin tables on mobile (horizontal scroll or card view)

### 8.3 Security review
- [ ] All API routes check auth
- [ ] Admin routes check admin role
- [ ] No sensitive data in responses (passwordHash never returned)
- [ ] Input validation on all API routes (zod)
- [ ] Rate limiting on auth routes (optional: upstash/ratelimit)
- [ ] CORS properly configured on ML service
- [ ] `.env` in `.gitignore` (verify)

### 8.4 Testing
- [ ] `ml-service/tests/test_predict.py` — pytest cases:
  - Test health endpoint
  - Test predict with valid input
  - Test predict with missing fields (should 422)
  - Test predict with out-of-range values
- [ ] Manual end-to-end test:
  1. Register new user
  2. Log in
  3. Fill lifestyle form → get prediction
  4. View history
  5. Edit profile
  6. Change password
  7. Log in as admin (`admin` / `admin123`)
  8. View all users
  9. View all predictions
  10. View system logs
  11. Delete a user

### 8.5 Documentation
- [ ] Write `docs/architecture.md` — three-tier architecture diagram + explanation
- [ ] Update `README.md` with any changes made during implementation
- [ ] Add screenshots to `docs/` (optional)
- [ ] Write `ml-service/README.md` — how to run the ML service

### 8.6 Git & deployment
- [ ] Final commit + push to GitHub
- [ ] (Optional) Deploy Next.js to Vercel:
  - Push to GitHub (done)
  - Import project on Vercel
  - Add env vars in Vercel dashboard
  - Deploy
- [ ] (Optional) Deploy ML service to Render/Railway:
  - Create `Dockerfile` or use `render.yaml`
  - Deploy `ml-service/` as a web service
  - Update `ML_SERVICE_URL` env var in Next.js
- [ ] (Optional) Deploy MySQL to PlanetScale/Neon:
  - Create database
  - Run `prisma migrate deploy`
  - Update `DATABASE_URL`

---

## Deliverable

- Polished UI with loading/error/empty states
- Responsive on all screen sizes
- Security reviewed
- Tests passing
- Documentation complete
- (Optional) Deployed to production

---

## Project Complete

All 8 phases done. The hypertension risk prediction system is fully functional and ready for use.
