# Poonji Finance — PRD

## Original Problem Statement
Build a modern, premium, trustworthy multi-page website for Poonji Finance, an Indian financial services facilitation and brokerage platform. Must introduce the company and founders, showcase all product verticals (loans, insurance, FDs, mutual funds, investments), generate leads via enquiry/callback forms, offer interactive financial calculators, educate via guides/blog/FAQs, provide contact + legal/compliance pages, and be architected for future expansion (new products, customer portal, CRM integration). Positioning: "One Platform. Multiple Financial Solutions." Hero: "Your Financial Goals. Our Guidance."

## User Choices (gathered)
- Scope: all 10 nav pages + 8 core calculators + enquiry forms saving leads (no customer login in v1)
- Leads: saved to MongoDB + simple admin leads view (no email notifications yet)
- Design: deep blue + white, premium minimal → implemented as obsidian-dark + royal blue/cyan (per design guidelines)
- Blog/Resources: seeded with 6 sample articles + 8 guides + 10-term glossary
- Founders & contact details: user said they'd provide real ones — NOT yet provided → professional placeholders in use (Aarav Sharma / Meera Sharma, +91 98765 43210, hello@poonjifinance.in, MG Road Bengaluru)

## Architecture
- Backend: FastAPI + motor (MongoDB) — `POST /api/enquiries`, `POST /api/callbacks`, JWT cookie auth (`/api/auth/login|logout|me`), `GET /api/leads` (admin-only). Admin seeded from env (ADMIN_EMAIL/ADMIN_PASSWORD) at startup, idempotent. Collections: enquiries, callbacks, users.
- Frontend: Vite + React 19 + TS, Tailwind v4 dark-by-default, motion/react (kinetic masked hero, scroll reveals), Lenis smooth scroll, recharts donut breakdowns, sonner toasts. Content data-driven from `src/data/content.ts` (services, founders, blog, FAQs, guides).
- Fonts: Space Grotesk (headings), Plus Jakarta Sans (body), JetBrains Mono (figures).

## User Personas
- Salaried individual comparing home/personal loans
- MSME owner seeking working capital / business finance
- Family planning insurance + SIP investments
- Poonji admin reviewing incoming leads

## Implemented (2026-10-02)
- 14 routes: Home, About, Founders, Services (8 verticals), Calculators (8 tools: EMI, Home Loan, Personal Loan, Eligibility, SIP, Lumpsum, FD, RD — live sliders + recharts), How It Works (5-step pipeline), Resources (guides + glossary), Blog + BlogPost (6 seeded articles, search + category filters), FAQs (13, categorized, searchable), Contact (form, WhatsApp, click-to-call, callback dialog), Legal x4 (Disclaimer, Privacy, Terms, Grievance), Admin leads dashboard, 404.
- Lead capture: enquiry form (with reference ID toast) + global callback dialog → MongoDB → admin dashboard (tabs, counts).
- Motion: masked line-by-line hero reveal, parallax EMI sandbox in hero, scroll reveals, partner marquee, hover micro-interactions.
- Custom SVG logo + favicon.

## Verified
- curl through public URL: enquiry 201, callback 201, malformed enquiry 422, admin login/me/leads, unauth leads 401.
- `yarn typecheck` clean.
- Browser pass: hero, SIP calc (₹1,26,14,400 @ ₹25k/15y/12%), enquiry submit → toast + appears in admin table, admin login.

## Implemented (2026-10-02, round 2)
- Real founders: Balbir Singh Gogia (Founder & Managing Partner), Harshual Singh Gogia (Partner & CEO), Harshita Singh Gogia (COO) — monogram cards (no photos provided yet).
- Brand: company logo (logo.png) in navbar/footer/favicon; theme re-tuned to logo palette — royal blue + gold accents, red kept minimal (marquee separators only).
- Lead email alerts: HTML template + guardrail gate; SMTP-configurable and non-blocking on every enquiry/callback. Configure SMTP_HOST and LEAD_NOTIFY_EMAIL for deployment.
- Calculators: 8 more added (Step-Up SIP, SWP, CAGR, Simple Interest, Compound Interest, Inflation, Retirement, Goal-Based) → 16 total.
- Admin: per-lead status pills (New/Contacted/Closed) via POST /api/leads/{kind}/{id}/status + one-click CSV export per tab.

## Verified (round 2)
- curl: enquiry returns status=new; status PATCH→contacted persists; invalid status 422; unauth status change 401; email proxy 202 with send ID (delivered@resend.dev test).
- Browser: founders grid shows all 3 Gogias; Retirement (₹8.61 Cr corpus), Goal (₹1.57 Cr), SWP (₹96 L withdrawn) compute live; admin status select flips to Closed.
- yarn typecheck clean.

## Implemented (2026-10-02, round 3)
- Real contact details live sitewide: info@poonjifinance.com, +91 93118 28382 / +91 99107 97973, 703 Golden Wood Tower, Madhuban Bapudham, Ghaziabad UP. LEAD_NOTIFY_EMAIL + EMAIL_REPLY_TO now point to info@poonjifinance.com.
- New Careers page (/careers): 3 openings, perks, apply-via-email CTAs. Nav reordered per user: Home, About Us, Services, How It Works, Calculators, Careers, Resources, Blog, FAQs, Contact.
- SEO: useSeo hook sets per-page title + meta description on all 15 routes; sitemap.xml + robots.txt served (200 verified).
- Contact page: real Google Maps embed of the Ghaziabad office area.

## Verified (round 3)
- sitemap.xml / robots.txt / /careers return 200 on public URL; yarn typecheck clean.
- Backend restarted with new email env; lead alert recipient now the real inbox.

## Implemented (2026-10-02, round 5 — three-portal platform + light retheme)
- Full white/light redesign: white background, dark navy (#0E1B33) typography, dark blue (#1E40AF) primary, gold accents; logo palette retained.
- 3-role auth (admin/customer/partner) — JWT cookie, role-based access (403 across roles verified). /login with role selector, /signup with customer + partner forms.
- Customer portal (/portal): profile editor (KYC fields), Document Vault (category → type → upload, object storage, 10MB PDF/JPG/PNG, statuses), Applications (create + 8-stage status stepper), Notifications.
- Partner portal (/partner-portal): profile editor, approval status banner. Partner signup → pending until admin approves.
- Public: /partners directory (approved only, search/filter, approved-partner badge + disclaimer), /rates (6 loan categories, admin-managed, last-updated dates, 16 seeded sample rates), /updates (finance news feed, 3 seeded), /search (services, rates, calculators, blogs, guides, FAQs, partners, updates).
- Admin dashboard v2 (/admin): Overview cards, Leads (enquiries/callbacks/job applications), Customers (file view: profile/KYC, documents verify/reject with note → customer notified, application status pipeline, internal notes, matched enquiries), Partners (approve/reject/suspend), Rates CRUD, Updates CRUD.
- Notifications: in-dashboard, fired on signup, document status change, application status change, partner status change.

## Verified (round 5)
- curl chain: customer register → doc upload (object storage) → portal application → partner register (hidden publicly) → admin approve (visible publicly) → doc verify + app status + internal note → customer notifications (3) → admin doc download 200, stranger 401, customer-on-admin 403.
- Browser: light home renders, signup → /portal redirect, rates table with last-updated, partner directory shows approved partner, updates feed.
- yarn typecheck clean.

## Deferred from the big brief (not built yet)
- OTP/email verification at signup (needs SMS provider choice)
- Blog CMS in admin (blog still seeded static content), page-content CMS, homepage banner management
- SMS/WhatsApp notifications, password reset flow, admin activity logs
- EMI-per-lakh column on rates, partner profile photo upload

## Backlog
- P1: Founder photos + final bios from user
- P1: Password reset + email verification
- P1: Blog CMS + page content management in admin
- P2: CV upload on job applications, EMI/lakh on rates table
- P3: CRM integration, e-sign, digital KYC providers

## Next Tasks
1. Founder photos
2. Password reset flow
3. Blog/page CMS in admin
