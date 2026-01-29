# NeonStay Backend Server

Production-ready backend API for the NeonStay hotel aggregator platform with proper MVC architecture, validation, security, and testing.

## Features

✅ **MVC Architecture** - Clean separation of concerns (Routes → Controllers → Services)  
✅ **Input Validation** - Zod schemas for all endpoints  
✅ **Error Handling** - Centralized error handling with custom error classes  
✅ **Security** - Helmet, CORS, and rate limiting  
✅ **Logging** - Winston logger with file and console outputs  
✅ **API Versioning** - `/api/v1/*` endpoints with backward compatibility  
✅ **Testing** - Vitest for unit and integration tests  
✅ **Type Safety** - TypeScript with strict mode enabled  

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Validation**: Zod
- **Payments**: Stripe
- **Logging**: Winston
- **Testing**: Vitest + Supertest

## Project Structure

```
src/
├── config/           # Configuration and constants
├── controllers/      # Request handlers
├── services/         # Business logic and data access
├── routes/           # API route definitions
├── middleware/       # Express middleware
├── schemas/          # Zod validation schemas
├── utils/            # Utility functions and helpers
├── tests/            # Unit and integration tests
└── index.ts          # Application entry point
```

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Stripe account (for payments)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your actual values
```

3. Run database migrations:
```bash
cd ../..
npm run db:push
```

4. Seed the database (optional):
```bash
npm run dev
# Then POST to http://localhost:3001/api/v1/seed
```

### Development

Start the development server:
```bash
npm run dev
```

The server will start at `http://localhost:3001`

### Testing

Run all tests:
```bash
npm test
```

Run tests with UI:
```bash
npm run test:ui
```

Run tests with coverage:
```bash
npm run test:coverage
```

### Build

Build for production:
```bash
npm run build
```

Run production build:
```bash
npm start
```

## API Endpoints

### Hotels

- `GET /api/v1/hotels` - Search hotels with pagination
  - Query params: `city`, `page`, `limit`
- `GET /api/v1/hotels/:id` - Get hotel details

### Bookings

- `POST /api/v1/bookings` - Create a new booking
- `GET /api/v1/bookings/user/:userId` - Get user's bookings
- `GET /api/v1/bookings/:id` - Get booking details
- `POST /api/v1/bookings/:id/cancel` - Cancel a booking

### Payments

- `POST /api/v1/payment/create-intent` - Create Stripe payment intent
- `GET /api/v1/payment/verify/:paymentIntentId` - Verify payment status

### Admin

- `POST /api/v1/seed` - Seed database with sample data

### Health

- `GET /health` - Health check endpoint

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Environment (development/production/test) | Yes |
| `PORT` | Server port | Yes |
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `STRIPE_SECRET_KEY` | Stripe secret key | Yes |
| `CORS_ORIGIN` | Allowed CORS origin | Yes |

## Error Handling

The API uses standardized error responses:

```json
{
  "error": "Error message",
  "details": [] // Optional validation details
}
```

HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request / Validation Error
- `401` - Unauthorized
- `404` - Not Found
- `422` - Payment Error
- `429` - Too Many Requests
- `500` - Internal Server Error

## Rate Limiting

- General API: 100 requests per 15 minutes
- Payment endpoints: 10 requests per 15 minutes
- Auth endpoints: 5 requests per 15 minutes

## Logging

Logs are written to:
- `logs/combined.log` - All logs
- `logs/error.log` - Error logs only
- Console - Development mode

## Security

- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - Prevent abuse
- **Input Validation** - Zod schemas
- **Error Sanitization** - No stack traces in production

## License

MIT
