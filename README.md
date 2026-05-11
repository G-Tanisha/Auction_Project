# Real-Time Auction Platform

A full stack mini project for Modern Application Development (CSD303A). The platform lets users register, create auctions, bid in real time, track countdown timers, and view winners when auctions close.

## Problem Statement

Traditional online auction workflows often require manual refreshes and provide poor feedback about the current highest bid. This project solves that by combining a REST API with WebSocket updates so all connected users see bid changes and winner updates immediately.

## Tech Stack

- Frontend: React.js with hooks, React Router, Tailwind CSS, PWA manifest and service worker
- Backend: Node.js, Express.js, REST API, Socket.io
- Database: MongoDB with Mongoose ODM
- Authentication: JWT and bcrypt password hashing
- Deployment: Docker and docker-compose, deployable to Render, Railway, Vercel, or any container host

## Architecture

```text
Browser / PWA Client
  | React Router + Tailwind UI
  | REST calls with JWT
  | Socket.io client
  v
Express API + Socket.io Server
  | Auth middleware
  | Controllers and routes
  | Real-time bid events
  v
MongoDB
  | users
  | auctions
  | bids
```

## Course Outcome Coverage

- CO1: Full stack architecture with clear separation of frontend, backend, database, and deployment.
- CO2: Responsive React frontend with routing, protected pages, reusable components, and hooks.
- CO3: RESTful backend using Express routes, controllers, middleware, and Socket.io.
- CO4: MongoDB database design using Mongoose schemas for Users, Auctions, and Bids.
- CO5: Secure authentication using JWT-protected routes and bcrypt password hashing.

## Run Locally With Docker

1. Copy `.env.example` to `.env`.
2. Change `JWT_SECRET` to a strong random value.
3. Run:

```bash
docker-compose up --build
```

4. Open:

- Frontend: `http://localhost:5173`
- Backend health: `http://localhost:5000/api/health`

## Run Without Docker

Start MongoDB locally, then:

```bash
cd server
npm install
npm run dev
```

In another terminal:

```bash
cd client
npm install
npm run dev
```

## Main Features

- Register and login with JWT authentication
- Create auctions with image URL, starting price, and end time
- View active auctions and auction details
- Place bids with server-side validation
- Receive live bid updates via Socket.io
- Countdown timer with automatic auction closure
- Dashboard for My Auctions and My Bids
- Winner shown on auction detail after closing

## API Summary

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| GET | `/api/health` | No | Health check |
| POST | `/api/auth/register` | No | Create account |
| POST | `/api/auth/login` | No | Login |
| GET | `/api/auth/me` | Yes | Current user |
| GET | `/api/auctions` | No | List auctions |
| POST | `/api/auctions` | Yes | Create auction |
| GET | `/api/auctions/:id` | No | Auction detail |
| PUT | `/api/auctions/:id/close` | Yes | Close auction |
| POST | `/api/bids/:auctionId` | Yes | Place bid |
| GET | `/api/dashboard/my-auctions` | Yes | Auctions created by user |
| GET | `/api/dashboard/my-bids` | Yes | Bids placed by user |

## Deployment Notes

- Render/Railway: deploy `server` as a Node service and set `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`.
- Vercel/Netlify: deploy `client` and set `VITE_API_URL`, `VITE_SOCKET_URL`.
- Docker host: use the included `docker-compose.yml`.

