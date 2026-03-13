# 🧪 Granular Technical Guide: File-by-File Breakdown

This document serves as the "Master Manual" for the NeonStay (RoamFast) monorepo. It explains the purpose, logic, and interview-significance of every major file in the system.

---

## 🏛️ Project Root Configuration
- **`package.json`**: Defines the workspace roots (`apps/*`). This is why you can run `npm install` at the root and it installs dependencies for both the frontend and backend.
- **`.env`**: The single source of truth for secrets. **Interview Note:** We configured the backend to look "up" two directories to find this file, ensuring consistent configuration across the monorepo.
- **`docker-compose.yml`**: Orhcestrates local development services (like a local MongoDB instance if needed) in a containerized environment.

---

## ⚙️ Backend: `apps/server/src/`

### 🔹 `index.ts` (Entry Point)
- **What it does**: Initializes Express, registers middleware (CORS, Helmet, Body Parser), connects to MongoDB via `connectDB()`, and starts the HTTP listener.
- **Why it matters**: It's the "orchestrator." It won't start the server until the database connection is confirmed, preventing "dead" API states on startup.

### 🔸 `config/` (System Settings)
- **`mongodb.ts`**: Uses Mongoose to connect to Atlas. **Deep Detail:** It includes a path-resolution fix using `fileURLToPath` to find the root `.env` even when the server is started from different directories.
- **`firebase.ts`**: The bridge to Firebase. It parses private keys and initializes `firebase-admin` for secure identity verification.

### 🔸 `controllers/` (Request Handlers)
*Controllers translate HTTP requests into service calls.*
- **`hotel.controller.ts`**: Handles `/api/hotels`. It parses query params like `minPrice` or `city` and passes them to the `HotelService`.
- **`webhook.controller.ts`**: The most critical security file. It receives asynchronous event notifications from Stripe (like `payment_intent.succeeded`) and executes "post-payment" logic (creating the booking).

### 🔸 `models/` (Data Schemas)
*These define how data is stored in MongoDB.*
- **`Hotel.ts`**: Uses `Schema.Types.ObjectId` for the `ownerId` reference. Includes a `virtual('id')` getter so the frontend can use `id` instead of `_id`.
- **`Commission.ts`**: A financial ledger. It calculates `hotelPayout` (Price - Commission - Fee) to ensure accounting accuracy.

### 🔸 `services/` (Business Logic)
*This is where the "intellectual property" of the app lives.*
- **`quality-score.service.ts`**: Runs a weighted algorithm. It queries MongoDB for the latest reviews and updates the `Hotel` document's rating and score.
- **`seed.service.ts`**: A "DevOps" service. It uses `User.findOneOrCreate` logic to ensure a `demo@neonstay.com` account exists and creates realistic hotels like "The Taj Mahal Palace" for testing.
- **`booking.service.ts`**: Contains the logic for "Atomic Bookings." It prevents double-booking and handles the relationship between a Guest, a Hotel, and a Payment ID.

### 🔸 `middleware/` (The Gatekeepers)
- **`auth.ts`**: Decodes the `Bearer` token from the Authorization header using `auth.verifyIdToken`. It handles **Role-Based Access Control (RBAC)**—ensuring only Admins can approve hotels and only Owners can see analytics.
- **`errorHandler.ts`**: A centralized catch-all. If any part of the app throws an error, this middleware formats it into a pretty JSON response (`{ error: "message" }`) instead of crashing the server.

---

## 🎨 Frontend: `apps/web/src/`

### 🔹 `app/` (Pages & Layout)
- **`layout.tsx`**: The global wrapper. Contains the `<Navbar />`, `<Footer />`, and the **Lenis Smooth Scroll** provider for a premium feel.
- **`hotels/[id]/page.tsx`**: A **Dynamic Route**. It reads the hotel ID from the URL, fetches data from the API, and renders the hotel details.

### 🔹 `components/` (The Building Blocks)
- **`search/SearchFilters.tsx`**: A stateful component that allows users to filter hotels by price or amenities without a full page reload.
- **`booking/BookingCalendar.tsx`**: Uses `react-day-picker` to let users select check-in/out dates, passing the state up to the Checkout form.

### 🔹 `context/` & `hooks/`
- **`AuthContext.tsx`**: Uses the Firebase Web SDK to track the user's login state (`currentUser`). It provides this state to every component in the app.
- **`useStripe.ts`**: A custom hook that wraps the Stripe SDK, making it easy to trigger a payment UI with one line of code.

---

## 🔄 How the data flows (Interview walkthrough)

**Interviewer: "What happens when a user clicks 'Approve' on a hotel?"**
1. **Frontend**: The Admin Dashboard calls `PUT /api/admin/approve/:id`.
2. **Routes**: `admin.routes.ts` checks the `auth.ts` middleware to ensure the user is an **ADMIN**.
3. **Controller**: `admin.controller.ts` receives the ID and calls `AdminService.approveHotel(id)`.
4. **Service**: The service updates the `Hotel` status in MongoDB to `APPROVED`. It then calls the `emailService` to notify the hotel owner.
5. **Database**: MongoDB saves the change.
6. **Response**: The Controller sends a `200 OK` back to the frontend, which updates the UI.

---

## 💎 Advanced Features to Highlight
1. **Stripe Idempotency**: Mention that you check for an existing `paymentIntentId` in the `Booking` collection before creating a new one in the webhook. This prevents multiple charges/bookings if a webhook is retried.
2. **Scalable Search**: The `HotelService` uses MongoDB regex search (`$regex`) with the `i` (case-insensitive) flag, making the search bar very user-friendly.
3. **Mongoose Virtuals**: By mapping `_id` to `id` in the schema level, you kept the frontend code clean and decoupled from MongoDB's internal naming conventions.
