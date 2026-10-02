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

## Backlog
- P0: Replace placeholder founder names/photos + contact details with real ones (awaiting user input)
- P1: Email notifications on new leads (Resend managed integration)
- P1: Remaining calculators (Step-Up SIP, SWP, CAGR, Simple/Compound Interest, Inflation, Retirement, Goal-based)
- P1: Google Maps embed on Contact
- P2: Admin lead status updates + CSV export
- P2: Blog CMS (admin-managed posts instead of static content.ts)
- P2: SEO metadata per page, sitemap, analytics
- P3: Customer portal, application tracking, document upload, CRM integration

## Next Tasks
1. Swap in real founder/contact details when user provides them
2. Resend email alerts for new leads
3. Add remaining 9 calculators
