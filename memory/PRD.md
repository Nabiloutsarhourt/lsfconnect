# LSFConnect - Product Requirements Document

## Project Overview
**Name:** LSFConnect  
**Description:** French Sign Language (LSF) expert consultation and e-learning SaaS platform  
**Tech Stack:** Next.js 15 + TypeScript + Supabase + Stripe + Tailwind CSS v4  
**Last Updated:** January 2026

---

## Design System (Updated Jan 2026)

### Color Palette
- **Primary:** Deep Indigo (#312E81) - Trust, Authority, Calm
- **Secondary:** Warm Amber (#F59E0B) - Human connection, Attention
- **Background:** Warm Alabaster (#FAFAF9)
- **Success:** Emerald (#059669)

### Typography
- **Headings:** Outfit (Google Fonts)
- **Body:** Plus Jakarta Sans (Google Fonts)

### Icons & Components
- **Icons:** @phosphor-icons/react (Duotone weight)
- **Animations:** Framer Motion (fade-up, stagger)
- **Toasts:** Sonner

### Design Principles
- Accessibility-first (4.5:1 contrast ratio minimum)
- Glassmorphism header with backdrop-blur
- Bento grid layouts for expert cards
- Pill-shaped buttons with shadow effects
- Card hover animations with translateY

---

## User Personas

### 1. Client (Hearing Person)
- Needs LSF interpretation services (medical, legal, social, business)
- Wants to book qualified experts on-demand
- May want to learn LSF basics

### 2. Expert (LSF Interpreter)
- Certified professional offering interpretation services
- Wants to manage availability and bookings
- Receives payments through the platform

### 3. Student (E-Learning User)
- Learning LSF through structured courses
- Tracks progress and earns certificates
- Participates in community forum

### 4. Admin
- Manages platform users, courses, and content
- Reviews expert certifications
- Monitors platform analytics

---

## Core Requirements (Static)

### Authentication & Authorization
- Email/password registration with role selection (Client/Expert)
- Role-based access control (client, expert, admin)
- Supabase Auth integration

### Expert Marketplace
- Expert profiles with bio, specialties, hourly rate, video intro
- Search and filter by specialty/domain
- Verified badge for certified experts
- Review and rating system

### Booking System
- Date/time slot selection
- Video or in-person session types
- Stripe Checkout integration
- Booking confirmation and notifications

### E-Learning (LMS)
- Courses organized by domain (Judicial, Medical, Commercial, Social)
- Modules and lessons with video content
- Quizzes and exercises
- Progress tracking
- Certificate generation

### Communication
- Real-time messaging between clients and experts
- Notifications system
- Community forum

### Subscriptions
- Free tier (basic courses)
- Pro tier (all courses, certificates, priority support)
- Enterprise (custom solutions)

---

## What's Been Implemented

### Completed - January 2026

#### Frontend Pages
- [x] Landing page with hero, features, testimonials, stats
- [x] Expert listing page with search/filter
- [x] Expert detail page with booking widget
- [x] Pricing page with 3 tiers
- [x] How it works page (4-step process)
- [x] Login page with form validation
- [x] Register page with role selection
- [x] Booking success page

#### Dashboards
- [x] Client dashboard (bookings, favorites)
- [x] Expert dashboard (bookings, messages, stats)
- [x] Admin dashboard (analytics, logs, user management)
- [x] User/Student dashboard with sidebar navigation

#### Components
- [x] Header with responsive mobile menu
- [x] LSF Video Player component
- [x] Chat Window with real-time messaging
- [x] UI components (Button, Card, Dialog, Tabs, etc.)

#### Backend/Database
- [x] Full Supabase schema (SQL migrations)
- [x] Row Level Security (RLS) policies
- [x] Stripe integration (checkout, webhooks)
- [x] Real-time subscriptions for messaging

#### Infrastructure
- [x] Production handover documentation
- [x] Vercel deployment configuration
- [x] CI/CD pipeline setup (GitHub Actions)

---

## Prioritized Backlog

### P0 - Critical (Before Launch)
- [ ] Connect real Supabase project credentials
- [ ] Set up Stripe live mode
- [ ] Email verification flow
- [ ] Password reset functionality

### P1 - High Priority
- [ ] Video calling integration (for virtual sessions)
- [ ] Calendar sync (Google Calendar)
- [ ] Email notifications (SendGrid/Resend)
- [ ] Expert onboarding flow (certificate upload, verification)

### P2 - Medium Priority
- [ ] AI-powered LSF recognition
- [ ] Course content management (admin)
- [ ] Advanced search filters
- [ ] Mobile app (React Native)

### P3 - Nice to Have
- [ ] Multi-language support
- [ ] Dark mode toggle
- [ ] Analytics dashboard for experts
- [ ] Referral program

---

## Next Tasks

1. **Supabase Setup:** Create production Supabase project, run migration SQL, update environment variables
2. **Stripe Configuration:** Create products/prices in Stripe dashboard, configure webhooks
3. **Test Full Flow:** Register user, verify email, browse experts, make booking
4. **Expert Verification:** Build admin flow for reviewing expert certifications
5. **Video Integration:** Add video calling for virtual sessions (Daily.co, Whereby, etc.)

---

## Technical Notes

### Environment Variables Needed
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_SITE_URL=
```

### Database Schema
Located at: `/app/supabase/FULL_PRODUCTION_SETUP.sql`

### Deployment
- Platform: Vercel
- Documentation: `/app/PRODUCTION_HANDOVER.md`
