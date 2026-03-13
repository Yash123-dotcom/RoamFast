# 🏨 NeonStay — Hotel Aggregator Platform

A **full-stack hotel aggregator** built as a monorepo, featuring hotel search with filters, real-time booking with Stripe payments, role-based dashboards (Guest / Hotel Owner / Admin), subscription tiers for hotel partners, and a commission-based revenue model.

> **Live Stack:** Next.js 16 • Express.js • MongoDB Atlas • Firebase Auth • Stripe Payments

---

## 📌 Problem Statement

Travelers lack a single platform that aggregates hotels across cities with transparent pricing, verified reviews, and a secure booking flow. Hotel owners need an affordable way to list and manage properties. This platform solves both sides of the marketplace.

---

## 🏗️ Architecture Overview

```
neonstay/                      ← npm workspaces monorepo
├── apps/
│   ├── web/                   ← Next.js 16 frontend (React 19, Tailwind CSS 4)
│   └── server/                ← Express.js REST API (TypeScript, Mongoose)
├── packages/                  ← shared packages
├── .env                       ← environment variables (MongoDB URI, Stripe keys)
└── docker-compose.yml         ← containerized deployment
```

### Frontend → Backend → Database Flow

```
┌────────────┐     REST API      ┌──────────────┐     Mongoose     ┌────────────────┐
│  Next.js   │  ──────────────▶  │  Express.js  │  ─────────────▶  │  MongoDB Atlas │
│  Frontend  │     /api/v1/*     │   Backend    │    ODM Queries   │   (Cloud DB)   │
└────────────┘                   └──────────────┘                  └────────────────┘
      │                                │
      │  Firebase Auth (JWT)           │  Stripe SDK
      ▼                                ▼
┌────────────┐                  ┌──────────────┐
│  Firebase  │                  │    Stripe    │
│   Auth     │                  │   Payments   │
└────────────┘                  └──────────────┘
```

---

## ✨ Key Features

### For Guests
- **Hotel Search** — Search by city/name with filters (price range, amenities) and sorting (price, rating)
- **Hotel Details** — View photos, rooms, amenities, quality score, and verified guest reviews
- **Secure Booking** — Stripe-powered checkout with payment intent confirmation
- **Booking Management** — View booking history, cancel bookings
- **Reviews** — Submit detailed reviews (cleanliness, service, sleep quality, luxury value)

### For Hotel Owners
- **Property Listing** — Submit hotels for admin approval with description, photos, amenities
- **Owner Dashboard** — View revenue analytics, booking stats, and property performance
- **Subscription Tiers** — FREE (15% commission) → SILVER (12%) → GOLD (10%) → PLATINUM (8%)

### For Admins
- **Approval Queue** — Review and approve/reject pending hotel listings
- **Platform Analytics** — Total users, hotels, bookings, and revenue stats
- **Commission Management** — Track payouts, mark commissions as paid
- **Revenue Dashboard** — Monthly revenue, payout breakdowns by status

### Platform
- **Quality Score Engine** — Weighted 0–100 score per hotel (cleanliness 20%, service 25%, amenities 15%, feedback 30%, responsiveness 10%)
- **Featured Listings** — Promoted hotel placements for premium subscribers
- **Commission System** — Per-booking commission + platform convenience fee (₹299)
- **Rate Limiting & Security** — Helmet, CORS, express-rate-limit

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **Frontend** | Next.js 16, React 19, Tailwind CSS 4 | SSR, file-based routing, modern React features |
| **UI Components** | Radix UI, Framer Motion, Lucide Icons | Accessible primitives + smooth animations |
| **Backend** | Express.js, TypeScript | Lightweight, flexible REST API |
| **Database** | MongoDB Atlas + Mongoose ODM | Flexible document schema, cloud-hosted, easy scaling |
| **Authentication** | Firebase Auth | JWT-based auth with email/password, session handling |
| **Payments** | Stripe (Payment Intents API) | PCI-compliant, webhook-driven payment confirmation |
| **Validation** | Zod | Runtime type validation for API request/response |
| **Logging** | Winston | Structured logging with levels (debug, info, error) |
| **Testing** | Vitest, Supertest | Fast unit/integration tests |
| **DevOps** | Docker Compose, npm workspaces | Monorepo management, containerized local dev |

---

## 📂 Backend Structure (Express)

```
apps/server/src/
├── config/           ← MongoDB connection, app config, constants
├── constants/        ← Enums (BookingStatus, SubscriptionTier, etc.)
├── controllers/      ← Request handling (9 controllers)
├── middleware/        ← Auth (Firebase JWT), rate limiter, error handler, logging
├── models/           ← Mongoose schemas (User, Hotel, Room, Booking, Review, etc.)
├── routes/           ← Express route definitions (10 route files)
├── schemas/          ← Zod validation schemas
├── services/         ← Business logic layer (9 services)
├── utils/            ← Logger, custom error classes
└── index.ts          ← Server entry point
```

### API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/hotels` | ❌ | Search hotels (query, filters, pagination) |
| `GET` | `/api/hotels/:id` | ❌ | Get hotel details with rooms & reviews |
| `POST` | `/api/hotels` | ✅ Owner | Create a new hotel listing |
| `POST` | `/api/bookings` | ✅ User | Create a booking |
| `GET` | `/api/bookings/my` | ✅ User | Get user's bookings |
| `POST` | `/api/reviews` | ✅ User | Submit a hotel review |
| `GET` | `/api/admin/pending` | ✅ Admin | Get pending hotel approvals |
| `PUT` | `/api/admin/approve/:id` | ✅ Admin | Approve a hotel |
| `GET` | `/api/admin/stats` | ✅ Admin | Platform analytics |
| `POST` | `/api/payments/intent` | ✅ User | Create Stripe payment intent |
| `POST` | `/api/webhooks/stripe` | ❌ | Stripe webhook (raw body) |
| `GET` | `/api/owner/hotels` | ✅ Owner | Owner's hotel portfolio |
| `GET` | `/api/owner/analytics` | ✅ Owner | Revenue & booking analytics |
| `POST` | `/api/subscriptions` | ✅ Owner | Subscribe to a tier |
| `POST` | `/api/seed` | ❌ | Seed demo data |

---

## 🗄️ Database Schema (MongoDB)

```
Users          Hotels            Rooms
┌──────────┐   ┌──────────────┐   ┌───────────┐
│ _id      │   │ _id          │   │ _id       │
│ email    │◄──│ ownerId      │   │ hotelId   │──▶ Hotels
│ name     │   │ name, city   │   │ type      │
│ role     │   │ price, rating│   │ price     │
│ image    │   │ amenities[]  │   │ capacity  │
└──────────┘   │ status       │   └───────────┘
               │ qualityScore │
               └──────────────┘

Bookings           Reviews            Commissions
┌──────────────┐   ┌──────────────┐   ┌───────────────┐
│ _id          │   │ _id          │   │ _id           │
│ userId       │   │ userId       │   │ bookingId     │
│ hotelId      │   │ hotelId      │   │ commissionRate│
│ checkIn/Out  │   │ overallRating│   │ commissionAmt │
│ totalPrice   │   │ cleanliness  │   │ platformFee   │
│ status       │   │ comment      │   │ hotelPayout   │
│ paymentId    │   │ verified     │   │ status        │
└──────────────┘   └──────────────┘   └───────────────┘

Subscriptions          FeaturedListings
┌──────────────┐       ┌──────────────────┐
│ _id          │       │ _id              │
│ hotelId      │       │ hotelId          │
│ tier         │       │ city             │
│ startDate    │       │ position         │
│ endDate      │       │ startDate/endDate│
│ price        │       │ active           │
│ active       │       └──────────────────┘
└──────────────┘
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+
- MongoDB Atlas account (or local MongoDB)
- Stripe account (for payments)
- Firebase project (for authentication)

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-username/neonstay.git
cd neonstay

# 2. Install dependencies (npm workspaces handles both apps)
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env with your MongoDB URI, Stripe keys, Firebase credentials

# 4. Start the backend
npm run dev:server     # Express API on http://localhost:3001

# 5. Start the frontend (in a separate terminal)
npm run dev:web        # Next.js on http://localhost:3000

# 6. Seed demo data
curl -X POST http://localhost:3001/api/seed
curl -X POST http://localhost:3001/api/seed/commissions
```

### Environment Variables

```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/neonstay
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 💡 Design Decisions (Interview Talking Points)

### 1. Why MongoDB over SQL?
> Hotel data is semi-structured — amenities vary per hotel, room types differ, review categories can evolve. MongoDB's flexible document model handles this naturally without migration overhead. Mongoose schemas enforce shape at the application level.

### 2. Why a Monorepo?
> npm workspaces keep frontend and backend in sync, share TypeScript types, and allow a single `npm install`. This mirrors how teams at companies like Vercel and Google organize code.

### 3. Why the Service Layer Pattern?
> Controllers handle HTTP concerns (request parsing, response formatting). Services contain pure business logic (commission calculation, quality scoring). This separation makes services testable without Express and allows reuse across controllers.

### 4. Why Stripe Payment Intents + Webhooks?
> Payment Intents handle the complexity of 3D Secure, card declines, and async payment confirmation. Webhooks ensure bookings are created even if the user closes the browser mid-payment — the server receives `payment_intent.succeeded` directly from Stripe.

### 5. Why a Quality Score Engine?
> A weighted score (cleanliness, service, amenities, feedback, responsiveness) gives guests more signal than a single star rating. It also creates a competitive incentive for hotel owners to maintain high standards.

### 6. Why Tiered Subscriptions with Commission?
> This is a real-world SaaS revenue model. FREE tier gets hotels onboarded (network effect), paid tiers reduce commission rates, creating a clear upgrade path. Platform earns via commission + a flat ₹299 convenience fee per booking.

### 7. How is Authentication Handled?
> Firebase Auth issues JWTs on the frontend. The Express middleware (`auth.ts`) verifies these tokens server-side using `firebase-admin`, extracts `uid`, and attaches user context to requests. Role-based access (USER/OWNER/ADMIN) is enforced via custom claims.

### 8. How Does the Booking Flow Work End-to-End?
> 1. Guest searches hotels → `GET /api/hotels?city=Mumbai`
> 2. Selects hotel → `GET /api/hotels/:id` (rooms, reviews, quality score)
> 3. Initiates payment → `POST /api/payments/intent` (creates Stripe PaymentIntent)
> 4. Stripe confirms payment → `POST /api/webhooks/stripe` (webhook creates booking)
> 5. Commission is calculated & recorded → commission rate based on hotel's subscription tier

---

## 📊 Scale Considerations

- **Database Indexing** — Mongoose schemas support compound indexes on `city + status + price` for fast search queries
- **Rate Limiting** — `express-rate-limit` prevents abuse of public endpoints
- **Webhook Idempotency** — Payment webhook checks for existing bookings by `paymentIntentId` to prevent duplicates
- **Pagination** — All list endpoints support `page` and `limit` with a max page size cap
- **Structured Logging** — Winston logger with levels enables filtering in production (ELK/CloudWatch)

---

## 📝 License

This project is for educational and portfolio purposes.
