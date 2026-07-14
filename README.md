# 🎉 Event Manager

A full-stack event management platform that allows users to plan and manage events end-to-end — from guest lists and seating arrangements to budgets, tasks, and producer coordination.

Built as a final project for a two-year intensive Full Stack Development course.

---

## ✨ Features

### For Event Owners
- Create and manage events with date, location, budget, and RSVP deadline
- Manage guests — track RSVPs, assign to tables, categorize by group
- Seating arrangement tool with drag-and-drop table assignment
- Budget tracking — add budget items, log payments, monitor spending
- Task checklist per event
- Gift registry — create a wishlist guests can claim
- Invite producers and manage collaboration requests
- Rate and review producers after the event
- Send digital invitations via email with a personal RSVP link

### For Producers
- View events they are assigned to
- Post updates and communicate with event owners
- Manage their public profile (bio, phone, contact email)

### Authentication & Security
- JWT-based authentication with HTTP-only cookies
- Role-based access control (`owner` / `producer`)
- Password reset via email verification code
- Passwords hashed with bcrypt

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, React Router v7, Vite |
| Backend | Node.js, Express 5 |
| Database | MySQL 2 |
| Auth | JWT, bcrypt, cookie-parser |
| Email | Nodemailer |
| Dev Tools | Nodemon, ESLint |

---

## 📁 Project Structure

```
event-manager/
├── client/          # React frontend (Vite)
│   └── src/
│       ├── components/   # Reusable UI components
│       ├── pages/        # Route-level page components
│       ├── services/     # API service functions (fetch wrappers)
│       ├── context/      # Auth context (global user state)
│       └── utils/        # Seating arrangement logic
├── server/          # Node.js / Express backend
│   ├── controllers/ # Route handler logic
│   ├── routes/      # Express routers
│   ├── models/      # DB query functions
│   ├── services/    # Business logic layer
│   ├── middleware/  # Auth, error handling, logger
│   ├── utils/       # Email, error classes, constants
│   └── config/      # DB connection
└── db/
    └── schema.sql   # Full MySQL schema with seed data
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MySQL server running locally

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/event-manager.git
cd event-manager
```

### 2. Set up the database

Open MySQL and run:

```bash
mysql -u root -p < db/schema.sql
```

### 3. Configure the server

Create a `.env` file inside the `server/` folder:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=event_manager
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

### 4. Install dependencies & run

```bash
# Server
cd server
npm install
npm start

# Client (in a new terminal)
cd client
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 👥 User Roles

| Role | Description |
|---|---|
| `owner` | Creates and manages events, guests, budget, tasks |
| `producer` | Assigned to events, posts updates, manages profile |

---

## 📸 Media Support

- 🖼 Images — event visuals and producer profiles
- 🔊 Audio — sound effects in the UI (WAV)
- 📧 Email — invitation and password reset emails with HTML content

---

## 🗄 Database Schema Highlights

- `users` + `user_passwords` — separated for security
- `events` — owned by a user, full event details
- `guests` + `guest_statuses` — RSVP tracking with invitation tokens
- `tables` + `guest_table_assignments` — many-to-many seating
- `budget_items` + `budget_payments` — itemized budget with payment logs
- `producer_requests` — request/approval flow between owners and producers
- `producer_updates` — communication thread per event
- `gifts` — wishlist with claim tracking
- `tasks` — per-event checklist

---

## 📄 License

This project was built for educational purposes as part of a Full Stack Development course.
