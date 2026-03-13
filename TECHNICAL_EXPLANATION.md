# 🧪 Granular Technical Guide: File-by-File Breakdown

This document serves as the "Master Manual" for the NeonStay (RoamFast) monorepo. It explains the purpose, logic, and interview-significance of every major file in the system.

---

## 🏛️ Project Root Configuration
- **`package.json`**: Defines the workspace roots (`apps/*`). This is why you can run `npm install` at the root and it installs dependencies for both the frontend and backend.
- **`.env`**: The single source of truth for secrets. **Interview Note:** We configured the backend to look "up" two directories to find this file, ensuring consistent configuration across the monorepo.
- **`docker-compose.yml`**: Orchestrates local development services (like a local MongoDB instance if needed) in a containerized environment.

---

## ⚙️ Backend Deep Dive: `apps/server/src/`

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
- **`seed.service.ts`**: A "DevOps" service. It ensures a `demo@neonstay.com` account exists and creates realistic hotels like "The Taj Mahal Palace" for testing.
- **`booking.service.ts`**: Contains the logic for "Atomic Bookings." It prevents double-booking and handles the relationship between a Guest, a Hotel, and a Payment ID.

---

## 🎨 Frontend Deep Dive: `apps/web/src/`

### 🔹 `app/` (The Next.js Router & Pages)
- **`(home)/page.tsx`**: The landing page. It uses the `searchService` to fetch featured cities and hotels on the server-side for maximum SEO.
- **`hotels/[id]/page.tsx`**: A **Dynamic Route**. Fetching hotel details, rooms, and reviews for a specific ID.
- **`search/page.tsx`**: Manages complex URL state. When you filter by price, it updates the browser URL (e.g., `?minPrice=5000`), which triggers a server-side re-fetch.
- **`checkout/page.tsx`**: Integrates **Stripe Elements**. It wraps the payment form in an `<Elements>` provider so your code never handles raw credit card numbers.

### 🔹 `components/` (The Building Blocks)
- **`ui/`**: Contains **Shadcn UI** components (Buttons, Dialogs). Built on top of **Radix UI** for world-class accessibility.
- **`hotel/HotelCard.tsx`**: A reusable card that displays the image, price, and the **Quality Score Badge**.
- **`booking/BookingForm.tsx`**: Handles the date selection logic and price calculation before sending the user to checkout.
- **`layout/Navbar.tsx`**: Uses the `AuthContext` to toggle between "Login/Signup" and "User Profile" based on the user's session.

### 🔹 `hooks/` (Custom React Logic)
- **`useAuth.ts`**: A shortcut hook. Any component can just call `const { user } = useAuth()` to get the current guest's info.
- **`useMediaQuery.ts`**: Handles responsive logic in JavaScript (e.g., changing layouts for mobile vs. desktop).

### 🔹 `services/` (API Client Layer)
- **`api.ts`**: The base fetch client. It automatically adds the `Authorization: Bearer <token>` header to every request if the user is logged in.
- **`hotelService.ts`**: Frontend functions like `getHotels()` and `getHotelById()`, mapping directly to the backend API.

### 🔹 `context/` (Global State)
- **`AuthContext.tsx`**: The "Traffic Controller" for the user. It listens to Firebase's `onAuthStateChanged` and updates the entire app state.

### 🔹 `lib/` (Utilities)
- **`utils.ts`**: Contains the `cn()` function for conditionally merging **Tailwind CSS** classes smoothly.

---

## 🔄 How the data flows (Interview walkthrough)

**Interviewer: "How does a search query move through your app?"**
1. **Frontend UI**: User types "Mumbai" into the SearchBar.
2. **Frontend Logic**: The SearchBar calls `router.push('/search?query=Mumbai')`.
3. **Frontend Page**: `search/page.tsx` reads the query param and calls `hotelService.search(query)`.
4. **Network**: A fetch request goes to `http://localhost:3001/api/hotels?query=Mumbai`.
5. **Backend Route**: `hotel.routes.ts` sends it to the `HotelController`.
6. **Backend Controller**: Controller calls `HotelService.searchHotels("Mumbai")`.
7. **Database**: Service runs a **MongoDB Regex** query: `Hotel.find({ city: /Mumbai/i })`.
8. **Final Result**: Data travels back up the chain and is rendered on the screen.

---

## 💎 Advanced Features to Highlight
1. **Stripe Idempotency**: Checking for an existing `paymentIntentId` in the `Booking` collection before creating a new one in the webhook.
2. **Weighted Quality Score**: Using a calculated score (cleanliness, service, etc.) rather than a simple 5-star average.
3. **Mongoose Virtuals**: mapping `_id` to `id` at the schema level to keep the frontend code clean.
