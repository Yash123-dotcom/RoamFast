# 🧠 Technical Deep Dive: NeonStay Internal Workings

This guide provides a detailed explanation of the project structure, the purpose of each file, and how data flows through the system. Use this to master the technical details for your interview.

---

## 📂 Core Folder Structure

### 1. `apps/server` (The Backend)
The backend is a Node.js Express application written in TypeScript. It follows a **Layered Architecture** (Controller -> Service -> Model).

#### `src/config/`
- `mongodb.ts`: Initializes the connection to MongoDB Atlas using Mongoose. It ensures the DB is connected before the server starts accepting requests.
- `firebase.ts`: Initializes the Firebase Admin SDK. Even though we moved the database to MongoDB, this is still used for **Authentication** (checking if the user's JWT is valid).
- `index.ts`: Centralizes environment variable loading (using `dotenv`) and exports global configuration objects to avoid hardcoding strings.

#### `src/models/` (The Data Layer)
These files define the **Mongoose Schemas**. Each file represents a collection in MongoDB:
- `Hotel.ts`: Stores hotel metadata, images, and the calculated `qualityScore`.
- `Booking.ts`: Tracks check-in/out dates, status (Confirmed/Cancelled), and links a User to a Hotel.
- `Commission.ts`: Records the platform's cut from every booking. This is crucial for the revenue analytics dashboard.

#### `src/services/` (The Business Logic)
This is where the "heavy lifting" happens.
- `hotel.service.ts`: Contains logic for searching hotels with filters and regex.
- `quality-score.service.ts`: Implements the proprietary algorithm that weighs cleanliness, feedback, and amenities to produce a 0-100 score.
- `commission.service.ts`: Calculates how much the platform earns vs. how much the hotel owner gets paid, based on subscription tiers.

#### `src/controllers/` (The Request Handlers)
Controllers are responsible for:
1. Extracting data from the request (`req.body`, `req.query`).
2. Calling the appropriate Service method.
3. Sending the HTTP response (`res.status(200).json(...)`).
- `webhook.controller.ts`: Listens for signals from Stripe (e.g., "Payment Succeeded") and triggers the booking creation logic.

#### `src/middleware/`
- `auth.ts`: A gatekeeper. It intercepts requests, verifies the Firebase JWT token in the `Authorization` header, and attaches the `user` object to the request so controllers know who is calling.

---

### 2. `apps/web` (The Frontend)
A Next.js 16 application using the **App Router** and **React Server Components**.

#### `src/app/`
- `(auth)/`: Contains the Login and Signup flows.
- `hotels/[id]/`: The dynamic route for the Hotel Detail page. It fetches hotel data from the API and renders it.
- `checkout/`: Integrates the **Stripe Elements** SDK to securely collect credit card information without the sensitive data ever touching our server.

#### `src/components/`
Small, reusable UI pieces like `HotelCard.tsx`, `BookingForm.tsx`, and `Navbar.tsx`.

#### `src/services/`
Frontend API client files (using `fetch` or `axios`) that communicate with the backend.

---

## 🔄 The "Big Picture" Flows

### 1. The Booking Flow (End-to-End)
1. **Frontend**: User clicks "Book Now". The `checkout` page calls the Backend to create a **Stripe Payment Intent**.
2. **Backend**: `payment.controller` talks to Stripe. Stripe returns a `client_secret`.
3. **Frontend**: The user enters card details. Stripe handles the payment and redirects the user to a Success page.
4. **Stripe Webhook**: Stripe sends a POST request to our `/api/webhooks/stripe`.
5. **Backend**: `webhook.controller` verifies the signature, sees the payment succeeded, calls `booking.service` to create the record in MongoDB, and `commission.service` to record the earnings.

### 2. The Quality Score Flow
1. **Trigger**: A guest submits a review via `review.controller`.
2. **Persistence**: The review is saved to the `reviews` collection.
3. **Recalculation**: `review.service` calls `qualityScoreService.calculateQualityScore(hotelId)`.
4. **Algorithm**: It queries the last 50 reviews, calculates averages for metrics like cleanliness, staff, and value, applies the weights, and updates the `Hotel` document in MongoDB.

---

## 🛠️ Key Design Patterns Used

1. **Singleton Pattern**: Services (like `HotelService`) are exported as `new HotelService()`. This ensures only one instance exists throughout the app's lifecycle, saving memory and providing a single source of truth.
2. **Data Transfer Object (DTO) / Zod**: We use **Zod** schemas in `src/schemas/` to "clean" incoming data. If a user sends a string where we expect a number, Zod catches it before it ever hits the database.
3. **Dependency Injection (Manual)**: Controllers receive services as injected dependencies (or imports), making it easy to swap a Firestore service for a Mongoose service (which we just did!).
4. **Monorepo**: Using `npm workspaces` allows us to run the whole project with one command and share types/configs between the frontend and backend.

---

## 👨‍💻 Interviewer: "Tell me about a technical challenge..."
*Answer:* "We recently migrated the entire database layer from Firebase Firestore to MongoDB Atlas. I had to redefine the schemas using Mongoose, rewrite all 9 business logic services to use the Mongoose ODM instead of Firestore's document API, and ensure the Stripe webhook flow remained idempotent (creating a booking only once even if Stripe sends multiple notifications)."
