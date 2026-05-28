# NeonStay — Hotel Aggregator Platform

A full-stack hotel aggregator built as a monorepo, featuring hotel search with filters, real-time booking with Stripe payments, role-based dashboards (Guest, Hotel Owner, and Admin), subscription tiers for hotel partners, and a commission-based revenue model.

**Tech Stack:** Next.js 16, Express.js, MongoDB Atlas, Firebase Auth, Stripe Payments

---

## Problem Statement

Travelers lack a single platform that aggregates hotels across cities with transparent pricing, verified reviews, and a secure booking flow. Hotel owners need an affordable way to list and manage properties. This platform solves both sides of the marketplace.

---

## Architecture Overview

```text
neonstay/                      ← npm workspaces monorepo
├── apps/
│   ├── web/                   ← Next.js 16 frontend (React 19, Tailwind CSS 4)
│   └── server/                ← Express.js REST API (TypeScript, Mongoose)
├── packages/                  ← shared packages
├── .env                       ← environment variables (MongoDB URI, Stripe keys)
└── docker-compose.yml         ← containerized deployment
```

### Frontend to Backend Data Flow

```text
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

## Key Features

### For Guests
- **Hotel Search:** Search by city or name with filters (price range, amenities) and sorting (price, rating).
- **Hotel Details:** View photos, rooms, amenities, quality score, and verified guest reviews.
- **Secure Booking:** Stripe-powered checkout with payment intent confirmation.
- **Booking Management:** View booking history and cancel bookings.
- **Reviews:** Submit detailed reviews (cleanliness, service, sleep quality, luxury value).

### For Hotel Owners
- **Property Listing:** Submit hotels for admin approval with descriptions, photos, and amenities.
- **Owner Dashboard:** View revenue analytics, booking statistics, and property performance.
- **Subscription Tiers:** FREE (15% commission), SILVER (12%), GOLD (10%), PLATINUM (8%).

### For Admins
- **Approval Queue:** Review and approve or reject pending hotel listings.
- **Platform Analytics:** Track total users, hotels, bookings, and revenue metrics.
- **Commission Management:** Track payouts and mark commissions as paid.
- **Revenue Dashboard:** View monthly revenue and payout breakdowns by status.

### Platform Features
- **Quality Score Engine:** Weighted 0–100 score per hotel (cleanliness 20%, service 25%, amenities 15%, feedback 30%, responsiveness 10%).
- **Featured Listings:** Promoted hotel placements for premium subscribers.
- **Commission System:** Per-booking commission plus a platform convenience fee.
- **Rate Limiting & Security:** Helmet, CORS, and express-rate-limit.

---

## Technology Stack

| Layer | Technology | Description |
|---|---|---|
| **Frontend** | Next.js 16, React 19, Tailwind CSS 4 | SSR, file-based routing, modern React features |
| **UI Components** | Radix UI, Framer Motion, Lucide Icons | Accessible primitives and smooth animations |
| **Backend** | Express.js, TypeScript | Lightweight, flexible REST API |
| **Database** | MongoDB Atlas, Mongoose ODM | Flexible document schema, cloud-hosted, scalable |
| **Authentication** | Firebase Auth | JWT-based auth with email/password, session handling |
| **Payments** | Stripe (Payment Intents API) | PCI-compliant, webhook-driven payment confirmation |
| **Validation** | Zod | Runtime type validation for API request/response |
| **Logging** | Winston | Structured logging with levels (debug, info, error) |
| **Testing** | Vitest, Supertest | Unit and integration testing |
| **DevOps** | Docker Compose, npm workspaces | Monorepo management, containerized local development |

---

## Backend Structure (Express)

```text
apps/server/src/
├── config/           ← MongoDB connection, app config, constants
├── constants/        ← Enums (BookingStatus, SubscriptionTier, etc.)
├── controllers/      ← Request handling (9 controllers)
├── middleware/       ← Auth (Firebase JWT), rate limiter, error handler, logging
├── models/           ← Mongoose schemas (User, Hotel, Room, Booking, Review, etc.)
├── routes/           ← Express route definitions (10 route files)
├── schemas/          ← Zod validation schemas
├── services/         ← Business logic layer (9 services)
├── utils/            ← Logger, custom error classes
└── index.ts          ← Server entry point
```

### API Endpoints Overview

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/hotels` | Public | Search hotels (query, filters, pagination) |
| `GET` | `/api/hotels/:id` | Public | Get hotel details with rooms & reviews |
| `POST` | `/api/hotels` | Owner | Create a new hotel listing |
| `POST` | `/api/bookings` | User | Create a booking |
| `GET` | `/api/bookings/my` | User | Get user's bookings |
| `POST` | `/api/reviews` | User | Submit a hotel review |
| `GET` | `/api/admin/pending` | Admin | Get pending hotel approvals |
| `PUT` | `/api/admin/approve/:id` | Admin | Approve a hotel |
| `GET` | `/api/admin/stats` | Admin | Platform analytics |
| `POST` | `/api/payments/intent` | User | Create Stripe payment intent |
| `POST` | `/api/webhooks/stripe` | Public | Stripe webhook (raw body) |
| `GET` | `/api/owner/hotels` | Owner | Owner's hotel portfolio |
| `GET` | `/api/owner/analytics` | Owner | Revenue & booking analytics |
| `POST` | `/api/subscriptions` | Owner | Subscribe to a tier |
| `POST` | `/api/seed` | Public | Seed demo data |

---

## Database Schema Diagram

```text
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

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+
- MongoDB Atlas account (or local MongoDB)
- Stripe account (for payments)
- Firebase project (for authentication)

### Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/neonstay.git
   cd neonstay
   ```

2. Install dependencies (npm workspaces handles both applications):
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your MongoDB URI, Stripe keys, and Firebase credentials.

4. Start the backend services:
   ```bash
   npm run dev:server     # Express API runs on http://localhost:3001
   ```

5. Start the frontend application (in a separate terminal):
   ```bash
   npm run dev:web        # Next.js runs on http://localhost:3000
   ```

6. Seed demonstration data (optional):
   ```bash
   curl -X POST http://localhost:3001/api/seed
   curl -X POST http://localhost:3001/api/seed/commissions
   ```

### Environment Variables

Ensure the following variables are set in your `.env` file:
```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/neonstay
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## Architectural Decisions

### Data Storage Strategy
MongoDB was chosen for its flexible document model, adapting well to semi-structured hotel data such as varied amenities and room types without requiring schema migrations. Mongoose enforces document shape consistency at the application level.

### Monorepo Structure
The project utilizes npm workspaces to keep the frontend and backend synchronized, allowing for shared TypeScript types and streamlined dependency management with a single installation step.

### Service Layer Implementation
Controllers handle HTTP-specific concerns (request parsing, response formatting), while services encapsulate pure business logic (commission calculation, quality scoring). This abstraction enables independent testing and reuse across the application.

### Payment Processing
Stripe Payment Intents manage complex flows like 3D Secure and asynchronous payment confirmation. Webhooks guarantee booking creation even during interrupted client sessions, relying on server-to-server confirmation.

### Quality Score Engine
Rather than relying on a simple star rating, the platform uses a weighted quality score incorporating cleanliness, service, amenities, feedback, and responsiveness. This provides nuanced signals for guests and incentivizes partner compliance.

### Tiered Subscription Model
The application uses a commission-based SaaS model. A free tier facilitates rapid onboarding, while premium tiers reduce commission rates to incentivize upgrades. The platform generates revenue through commissions and fixed booking fees.

### Authentication Flow
Firebase Auth manages client-side authentication and JWT generation. Express middleware verifies these tokens via `firebase-admin`, resolving the user identity. Role-based access control (User, Owner, Admin) is enforced using custom claims.

### End-to-End Booking Lifecycle
1. Search initialization via `GET /api/hotels`
2. Hotel selection and detail retrieval via `GET /api/hotels/:id`
3. Payment initiation and Intent creation via `POST /api/payments/intent`
4. Asynchronous confirmation via `POST /api/webhooks/stripe`
5. Automated commission calculation based on active subscription tiers

---

## Scale and Performance Considerations

- **Database Indexing:** Mongoose schemas utilize compound indexes on relevant search fields (city, status, price) to optimize query performance.
- **Rate Limiting:** Implemented `express-rate-limit` to mitigate abuse on public API endpoints.
- **Webhook Idempotency:** Payment webhooks cross-reference `paymentIntentId` against existing records to prevent duplicate booking entries.
- **Pagination:** All collection endpoints enforce maximum page sizes to constrain memory usage and response times.
- **Structured Logging:** Winston provides leveled, structured logs suitable for centralized aggregation systems.

---

## License

This project is intended for educational and portfolio demonstration purposes.
