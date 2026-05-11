# Real-Time Auction Platform Report

## 1. Problem Statement

Online auctions require fast feedback because every bid can change the result. A refresh-based auction site can show outdated prices and create confusion for buyers and sellers. The Real-Time Auction Platform provides secure user accounts, auction creation, live bidding, countdown timers, automatic closing, and winner display.

## 2. Technology Stack

| Layer | Technology |
| --- | --- |
| Frontend | React.js, React Router, Tailwind CSS, PWA manifest, service worker |
| Backend | Node.js, Express.js, Socket.io |
| Database | MongoDB, Mongoose ODM |
| Security | JWT authentication, bcrypt password hashing |
| Deployment | Docker, docker-compose |

## 3. System Architecture

```text
User Browser
  |
  | React UI, protected routes, Socket.io client
  v
Client Application
  |
  | REST API requests with JWT
  | WebSocket events for live bidding
  v
Express + Socket.io Server
  |
  | Mongoose models and validation
  v
MongoDB Database
```

The React frontend handles navigation, forms, auction cards, countdown timers, and dashboard views. The Express backend exposes RESTful endpoints for authentication, auctions, bids, and dashboards. Socket.io broadcasts bid and auction-end events to connected clients. MongoDB stores users, auctions, and bids.

## 4. API Endpoints

| Method | Endpoint | Protected | Description |
| --- | --- | --- | --- |
| GET | `/api/health` | No | Checks server status |
| POST | `/api/auth/register` | No | Registers a new user |
| POST | `/api/auth/login` | No | Logs in user and returns JWT |
| GET | `/api/auth/me` | Yes | Returns logged-in user profile |
| GET | `/api/auctions` | No | Lists active and recent auctions |
| POST | `/api/auctions` | Yes | Creates a new auction |
| GET | `/api/auctions/:id` | No | Shows one auction with recent bids |
| PUT | `/api/auctions/:id/close` | Yes | Closes an auction if owner or expired |
| POST | `/api/bids/:auctionId` | Yes | Places a bid on an auction |
| GET | `/api/dashboard/my-auctions` | Yes | Lists auctions created by logged-in user |
| GET | `/api/dashboard/my-bids` | Yes | Lists bids placed by logged-in user |

## 5. Database Schema

### Users Collection

| Field | Type | Validation |
| --- | --- | --- |
| name | String | Required, trimmed, max 80 chars |
| email | String | Required, unique, lowercase |
| password | String | Required, hashed with bcrypt |
| createdAt, updatedAt | Date | Auto-generated |

### Auctions Collection

| Field | Type | Validation |
| --- | --- | --- |
| title | String | Required, max 120 chars |
| description | String | Required, max 1000 chars |
| imageUrl | String | Required URL string |
| startingPrice | Number | Required, minimum 1 |
| currentHighestBid | Number | Defaults to starting price |
| currentHighestBidder | ObjectId | References User |
| seller | ObjectId | Required, references User |
| winner | ObjectId | References User |
| endTime | Date | Required, future date on creation |
| status | String | active or closed |
| createdAt, updatedAt | Date | Auto-generated |

### Bids Collection

| Field | Type | Validation |
| --- | --- | --- |
| auction | ObjectId | Required, references Auction |
| bidder | ObjectId | Required, references User |
| amount | Number | Required, minimum 1 |
| createdAt, updatedAt | Date | Auto-generated |

## 6. Frontend Pages

| Page | Purpose |
| --- | --- |
| Home | Shows active auctions and recent closed auctions |
| Login | Authenticates existing users |
| Register | Creates new users |
| Create Auction | Protected form for sellers |
| Auction Detail | Shows auction data, timer, bid form, bid history, and winner |
| Dashboard | Shows My Auctions and My Bids |

## 7. Real-Time Flow

1. User opens an auction detail page.
2. Client joins a Socket.io auction room.
3. Authenticated user places a bid using `POST /api/bids/:auctionId`.
4. Server validates the bid amount and auction status.
5. Server updates MongoDB and emits `bidPlaced`.
6. All clients in the auction room update the highest bid without refreshing.
7. When the timer expires, the server closes the auction and emits `auctionEnded`.

## 8. Security

Passwords are hashed with bcrypt before storage. JWT tokens are issued after login and required for protected routes. The backend validates user input, checks auction ownership, prevents bidding on closed auctions, and uses centralized error handling.

## 9. Screenshots

Add screenshots after running the application:

| Screen | Screenshot |
| --- | --- |
| Home Page | Paste screenshot here |
| Login Page | Paste screenshot here |
| Auction Detail With Live Bid | Paste screenshot here |
| Dashboard | Paste screenshot here |
| Docker Running Containers | Paste screenshot here |

## 10. Conclusion

The Real-Time Auction Platform demonstrates a complete modern application with a React frontend, Express backend, MongoDB database, secure JWT authentication, real-time Socket.io bidding, and Docker-based deployment. It satisfies the course requirements across problem definition, frontend, backend, database, security, and deployment.
