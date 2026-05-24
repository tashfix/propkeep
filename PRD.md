# PropKeep — Product Requirements Document

**Version:** 1.0  
**Date:** 2026-05-21  
**Status:** MVP Live  

---

## 1. Overview

### 1.1 Product Summary

PropKeep is a property maintenance management dashboard for independent landlords. It centralizes maintenance ticket tracking, recurring task scheduling, expense logging, and tenant communication into a single, lightweight web app — replacing the scattered mix of spreadsheets, email threads, and sticky notes that most small landlords rely on.

**Tagline:** *Never miss a repair. Never lose a receipt.*

### 1.2 Problem Statement

Independent landlords managing 1–10 rental properties face three recurring pain points:

1. **Maintenance blind spots** — repairs get reported verbally or via text, fall through the cracks, and escalate into costly damage.
2. **Expense disorganization** — receipts and invoices are stored inconsistently, making tax time chaotic and deductions easy to miss.
3. **Scheduling amnesia** — seasonal maintenance tasks (HVAC filters, smoke detector tests, gutter cleaning) are missed because there's no proactive reminder system.

Existing property management software (AppFolio, Buildium, Rent Manager) is built for large portfolios and property management companies — overbuilt, expensive, and intimidating for a landlord with two duplexes.

### 1.3 Target User

**Primary:** Independent landlords with 1–10 properties and 1–20 units.  
**Secondary:** Accidental landlords (homeowners renting out one unit or a former primary residence).  
**Not targeted:** Large property management companies, commercial property managers, HOAs.

### 1.4 Core Value Propositions

| Pain Point | PropKeep Solution |
|---|---|
| Repairs fall through the cracks | Maintenance ticket system with priority + status workflow |
| Scattered receipts | Per-property expense logging with category tagging |
| Forgotten seasonal tasks | Recurring task scheduler with overdue alerts |
| Tenant messages missed | Floating inbox with auto-detection of maintenance issues |
| Service provider chaos | Built-in booking links to TaskRabbit, Thumbtack, and Angi |

---

## 2. Goals & Success Metrics

### 2.1 Product Goals

- **G1:** Reduce maintenance response time by giving landlords a single place to log, prioritize, and track repairs.
- **G2:** Increase recoverable tax deductions by making expense logging habitual and organized.
- **G3:** Prevent reactive (expensive) repairs through recurring maintenance reminders.
- **G4:** Convert free users to PropKeep Plus through demonstrable value within the first month.

### 2.2 Success Metrics (MVP)

| Metric | Target |
|---|---|
| Free-to-Plus conversion rate | ≥ 8% within 60 days of signup |
| Weekly active users (WAU) | ≥ 40% of registered users |
| Tickets created per active user/month | ≥ 3 |
| Recurring tasks set per property | ≥ 4 |
| Average session length | ≥ 4 minutes |
| Churn rate (Plus subscribers) | ≤ 5% monthly |

---

## 3. Feature Requirements

### 3.1 Property & Unit Management

**Description:** Landlords can add properties, then add individual units within each property with tenant details.

**User Stories:**
- As a landlord, I want to add a property with a name, address, and type so I can organize everything under it.
- As a landlord, I want to add units within a property and record the tenant name, email, and rent amount so I have everything in one place.
- As a landlord, I want to view all my properties in a grid with open ticket counts so I know at a glance what needs attention.

**Functional Requirements:**

| ID | Requirement |
|---|---|
| PM-01 | User can create a property with: name, address, property type (Single Family / Multi-Unit / Condo) |
| PM-02 | System attempts to fetch a street view photo via Google Maps; falls back to a placeholder on failure |
| PM-03 | User can add unlimited units to a property (Free tier: capped at 1 property total) |
| PM-04 | Each unit stores: unit number, tenant name, tenant email, monthly rent |
| PM-05 | Deleting a property cascades and removes all associated units, appliances, tickets, tasks, and expenses |
| PM-06 | Deleting a unit cascades and removes all associated appliances |
| PM-07 | Dashboard stats row shows live counts: total tenants, open tickets, overdue tasks, monthly expenses |

**Out of Scope (MVP):** Lease document storage, rent collection, move-in/move-out checklists.

---

### 3.2 Appliance Inventory

**Description:** Landlords can log appliances per unit with model/serial details for faster service and warranty lookups.

**User Stories:**
- As a landlord, I want to record the make, model, and serial number of appliances so I can quickly reference them when calling for repairs.

**Functional Requirements:**

| ID | Requirement |
|---|---|
| AP-01 | User can add an appliance to any unit: name, brand, model, model number (serial), notes |
| AP-02 | Preset appliance types offered (Fridge, HVAC, Washer, Dryer, Dishwasher, Stove, Oven, Garbage Disposal, Water Heater, Router) with free-text override |
| AP-03 | Appliances are listed in expandable accordion within each unit card |
| AP-04 | Appliances can be linked to maintenance tickets for traceability |
| AP-05 | User can delete individual appliances |

---

### 3.3 Maintenance Tickets

**Description:** The core feature. Landlords log repair requests, track their status, and optionally link service provider bookings.

**User Stories:**
- As a landlord, I want to create a ticket for a reported issue so I can track it from open to resolved.
- As a landlord, I want to set priority levels so I know which repairs are urgent.
- As a landlord, I want to attach a photo to a ticket so I have visual proof of the issue.
- As a landlord, I want to see all tickets filterable by status so I can focus on what's open.
- As a landlord, I want to book a service provider from within the ticket so I don't have to switch apps.

**Functional Requirements:**

| ID | Requirement |
|---|---|
| TK-01 | User can create a ticket with: title, description, priority (low / medium / high), category, property, unit (optional), appliance (optional) |
| TK-02 | Categories: Plumbing, Electrical, HVAC, Appliance, Structural, Other — each with a distinct icon |
| TK-03 | Ticket status workflow: Open → In Progress → Resolved |
| TK-04 | Resolving a ticket prompts for cost entry and records `resolvedAt` timestamp |
| TK-05 | Tickets support one image attachment; tapping opens a lightbox |
| TK-06 | Ticket list is filterable by: All / Open / In Progress / Resolved |
| TK-07 | "Book a Pro" button suggests a service provider matched to the ticket category |
| TK-08 | Service suggestion shows provider name, platform (TaskRabbit / Thumbtack / Angi), rating, hourly rate, response time |
| TK-09 | Booking confirmation records: provider ID, platform, and confirmed timestamp on the ticket |
| TK-10 | Free tier: maximum 10 total tickets. Attempting to create ticket 11 surfaces upgrade prompt |
| TK-11 | User can delete any ticket |

---

### 3.4 Recurring Tasks

**Description:** Scheduler for preventive maintenance tasks that repeat on set intervals.

**User Stories:**
- As a landlord, I want to schedule recurring tasks like "Replace HVAC filter every 90 days" so I never miss seasonal maintenance.
- As a landlord, I want to see overdue tasks highlighted so I act on them immediately.

**Functional Requirements:**

| ID | Requirement |
|---|---|
| RT-01 | User can create a recurring task with: title, property, frequency (30 / 90 / 180 / 365 days), category |
| RT-02 | System calculates and displays `nextDueAt` date based on `lastCompletedAt + intervalDays` |
| RT-03 | Tasks overdue by 1+ day appear in a red "Overdue" section with an alert banner |
| RT-04 | Upcoming tasks are sorted by `nextDueAt` ascending |
| RT-05 | "Mark Complete" resets `lastCompletedAt` to today and recalculates `nextDueAt` |
| RT-06 | "Book a Pro" flow mirrors the ticket booking flow (category-matched provider suggestion) |
| RT-07 | Free tier: maximum 5 recurring tasks. Upgrade prompt shown at limit |
| RT-08 | User can delete a recurring task |

---

### 3.5 Expense Tracking

**Description:** Lightweight ledger for property-related expenses, organized for tax deduction purposes.

**User Stories:**
- As a landlord, I want to log an expense and tag it to a property and category so I can pull a clean report at tax time.

**Functional Requirements:**

| ID | Requirement |
|---|---|
| EX-01 | User can log an expense with: description, amount, property, category, date |
| EX-02 | Categories: Repair, Maintenance, Improvement, Supply, Other — color-coded |
| EX-03 | Expense list shows entries sorted newest-first with summary cards: Total Spend, This Month, Top Category |
| EX-04 | Expenses can optionally be linked to a maintenance ticket |
| EX-05 | User can delete an expense |
| EX-06 | Free tier: expenses logged but full history access (all-time) is a Plus feature |
| EX-07 | Plus: CSV export of expense history (roadmap — listed on pricing page, not yet implemented) |

---

### 3.6 Tenant Communication Inbox

**Description:** A floating inbox that surfaces maintenance-related tenant messages and allows one-click ticket creation from them.

**User Stories:**
- As a landlord, I want tenant maintenance messages to auto-surface so I never miss a repair request buried in my inbox.
- As a landlord, I want to create a ticket from a tenant message with one click so the issue is tracked immediately.

**Functional Requirements:**

| ID | Requirement |
|---|---|
| TC-01 | Floating notification button (bottom-right) shows unread message count badge |
| TC-02 | Opening the panel shows all maintenance-related messages with tenant name, unit, preview text, and relative timestamp |
| TC-03 | System auto-detects maintenance relevance using keyword matching (leak, heat, electrical, etc.) |
| TC-04 | System auto-suggests ticket title, category, and priority from message body |
| TC-05 | Opening a message shows full text, attached image, and the suggested ticket details |
| TC-06 | "Create Ticket" pre-fills the new ticket form from the message suggestion |
| TC-07 | "Dismiss" marks the message read and removes it from the inbox |
| TC-08 | Messages also drive the "Notifications" panel in the dashboard topbar (shows high-priority tickets, overdue tasks, unread messages) |

---

### 3.7 Service Provider Booking

**Description:** In-context service provider suggestions matched to ticket/task categories, integrating with TaskRabbit, Thumbtack, and Angi.

**Functional Requirements:**

| ID | Requirement |
|---|---|
| SP-01 | Provider matching: system selects the best provider for each maintenance category from a curated list |
| SP-02 | Provider card shows: name, platform logo, specialty, star rating, review count, hourly rate, response time |
| SP-03 | "Confirm Booking" records the booking on the ticket/task and generates a reference ID (#TK-XXXXX) |
| SP-04 | Confirmed bookings show provider name + platform on the ticket card as a status pill |

**Note (MVP):** Provider data is currently mock/static. Production implementation requires API integration with TaskRabbit, Thumbtack, and/or Angi affiliate programs.

---

## 4. Pricing & Monetization

### 4.1 Tier Structure

| | **Free** | **PropKeep Plus** |
|---|---|---|
| **Price** | $0 | $49/year (~$4/month) |
| **Properties** | 1 | Unlimited |
| **Maintenance Tickets** | 10 | Unlimited |
| **Recurring Tasks** | 5 | Unlimited |
| **Expense Tracking** | Basic | Full history + CSV export |
| **Mobile Responsive** | Yes | Yes |
| **Priority Support** | No | Yes |
| **Payment** | — | Stripe (cancel anytime) |

### 4.2 Upgrade Triggers

Upgrade prompts surface at three natural friction points:
1. Attempting to add a second property (Free tier)
2. Creating ticket #11 (Free tier)
3. Creating recurring task #6 (Free tier)

### 4.3 Monetization Roadmap

- **Phase 1 (current):** Direct SaaS subscription via Stripe
- **Phase 2:** Service provider affiliate commissions (TaskRabbit/Thumbtack/Angi referral fees per booked job)
- **Phase 3:** Premium add-ons (tenant screening, lease storage, rent collection)

---

## 5. Technical Architecture

### 5.1 Current Stack (MVP)

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.6 (App Router) |
| UI | React 18, Tailwind CSS 3, Radix UI |
| Icons | Lucide React |
| Type Safety | TypeScript |
| State Management | React Context + useReducer |
| Persistence | localStorage (client-side, versioned at `v4`) |
| Hosting | Vercel |
| Version Control | GitHub (`tashfix/propkeep`) |

### 5.2 Data Models

**Core entities:** Property → Unit → Appliance (hierarchy)  
**Cross-cutting:** Ticket, RecurringTask, Expense, TenantMessage, ServiceProvider

All entities use string UUIDs and ISO date strings. See `lib/mock-data.ts` for full TypeScript type definitions.

### 5.3 Production Migration Path

The app is architected for a clean backend migration:

| Current (MVP) | Target (Production) |
|---|---|
| localStorage | Supabase Postgres (migration SQL ready in `db/`) |
| No auth | Supabase Auth (email + OAuth) |
| Single user | Multi-user with `user_id` scoping on all entities |
| Mock providers | Live affiliate APIs (TaskRabbit, Thumbtack, Angi) |
| No payments | Stripe Checkout + Webhooks |
| No emails | Transactional email via Resend (email templates in `emails/`) |

---

## 6. User Experience

### 6.1 Navigation Structure

```
/ (Landing Page)
├── /pricing
└── /dashboard
    ├── Overview tab (Properties + Units)
    ├── Tickets tab (Maintenance Tickets)
    ├── Recurring tab (Recurring Tasks)
    └── Expenses tab (Expense History)
        + Floating: Tenant Inbox (notification button)
        + Floating: Notifications panel (bell icon)
```

### 6.2 Design Principles

1. **Scannable at a glance** — Stats cards give a status snapshot without drilling into tabs.
2. **Action-first** — Every tab leads with an "Add" action; zero friction to log something new.
3. **No empty state paralysis** — Onboarding is a single step: "Add your first property."
4. **Contextual bookings** — Service provider suggestions appear where the problem is reported, not buried in a settings menu.

### 6.3 Responsive Design

The app is mobile-responsive (Tailwind breakpoints). A dedicated mobile app is out of scope for MVP but is on the roadmap.

---

## 7. Constraints & Assumptions

### 7.1 Constraints

- **No backend (MVP):** All data lives in the user's browser. Data is lost if localStorage is cleared.
- **Single user:** No multi-user or team access in MVP.
- **Mock provider data:** Service provider listings are not live; no real booking API is called.
- **No auth:** Any user can access `/dashboard` — no account required for MVP demo.

### 7.2 Assumptions

- Target users are comfortable with web apps on both desktop and mobile.
- The average user manages 2–5 properties with 1–3 units each.
- Users prefer a low-cost annual subscription over a higher monthly fee.
- The biggest "aha moment" is when a tenant message auto-generates a suggested ticket.

---

## 8. Out of Scope (MVP)

The following features are intentionally excluded from the MVP and may be addressed in future versions:

- Rent collection / online payments
- Lease document storage and e-signing
- Tenant portal (self-service maintenance requests)
- Accounting / P&L reports
- Dark mode
- Native mobile app (iOS/Android)
- Multi-user / team accounts
- Real service provider API integrations
- SMS / push notifications
- Bulk import (CSV upload of properties)

---

## 9. Roadmap

### Now (MVP — Live)
- Property + unit management
- Maintenance tickets with status workflow
- Recurring task scheduler
- Expense tracking
- Tenant message inbox with auto-detection
- Service provider suggestions (mock)
- Freemium pricing page
- Vercel deployment

### Next (v1.1)
- Supabase backend + user authentication
- Stripe payment integration for PropKeep Plus
- Email notifications for overdue tasks (Resend)
- Real provider affiliate links

### Later (v2.0)
- CSV export (expense reports)
- Live service provider API integrations
- Tenant self-service request portal
- Advanced analytics (spend by category, repair frequency by property)
- Native mobile app

---

## 10. Open Questions

| # | Question | Owner | Status |
|---|---|---|---|
| OQ-01 | Which service provider APIs have affiliate programs worth integrating first? | Product | Open |
| OQ-02 | Should "Book a Pro" link directly to a pre-filled request, or just deep-link to the platform? | Product | Open |
| OQ-03 | What's the right onboarding flow once auth is added — walkthrough wizard or blank-state prompts? | Design | Open |
| OQ-04 | Should CSV export be a Plus feature or a free-tier upsell hook? | Product | Open |
| OQ-05 | Is $49/year the right price point, or should we A/B test $79/year with more included features? | Growth | Open |
