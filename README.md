# DCG Event Management System

A full-stack event platform with a retro 8-bit UI theme.

- Frontend: React + Vite
- Backend: Node.js + Express + JWT
- Data layer: memory mode (default) and MongoDB Atlas-ready mode

## Table of Contents

- Overview
- Features
- Tech Stack
- Project Structure
- Getting Started
- Environment Variables
- MongoDB Atlas Integration Guide
- API Overview
- Demo Accounts (Local Memory Mode)
- Development Notes

## Overview

This project includes:

- Public event browsing
- User registration/login
- User dashboard with activity, badges, and progress meter
- Admin portal for event management (create/delete) with search and pagination
- Account settings for profile and password updates

The app starts in `memory` mode by default for easy local testing, and can be switched to `mongo` mode to use MongoDB Atlas.

## Features

- 8-bit arcade-inspired frontend styling and transitions
- Role-based access (`admin`, `user`)
- JWT-based authentication
- Event registration flow
- Admin-only event management endpoints
- Seeded local demo users and demo events

## Tech Stack

- React 18
- Vite 5
- Node.js + Express 4
- Mongoose 8
- JSON Web Token
- bcryptjs

## Project Structure

```text
.
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── env.js
│   │   │   └── db.js
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── seed/
│   │   ├── services/
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── styles.css
│   └── package.json
├── AGENT-HANDOFF.md
└── README.md
```

## Getting Started

### 1. Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2. Run backend

```bash
cd ../backend
npm run dev
```

### 3. Run frontend

```bash
cd ../frontend
npm run dev
```

App URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

You can also run from repository root:

```bash
npm --prefix backend run dev
npm --prefix frontend run dev -- --host
```

## Environment Variables

Create `backend/.env` from `backend/.env.example`:

```bash
PORT=5000
JWT_SECRET=change_me_to_a_long_random_secret
STORAGE_MODE=memory
MONGODB_URI=
MONGODB_DB_NAME=dcg_event
```

`STORAGE_MODE` supports:

- `memory` (default local mode)
- `mongo` (MongoDB Atlas mode)

## MongoDB Atlas Integration Guide

This project is already wired for Atlas. To connect your own cluster, follow these steps.

### Step 1: Create your Atlas connection string

In Atlas, copy your URI (example):

```text
mongodb+srv://<username>:<password>@<cluster-url>/
```

Ensure your Atlas IP access list and DB user credentials are configured.

### Step 2: Update backend environment file

Edit `backend/.env`:

```bash
STORAGE_MODE=mongo
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/
MONGODB_DB_NAME=dcg_event
JWT_SECRET=your_strong_secret
```

### Step 3: Restart backend

```bash
cd backend
npm run dev
```

On success, backend logs include `MongoDB connected`.

### Step 4: Verify API health

Test:

- `GET /api/health`

### What to edit if you customize Atlas integration

Most users only need `.env` changes. If you want custom behavior, edit these files:

- `backend/src/config/env.js`
  - Add or rename environment variables.
- `backend/src/config/db.js`
  - Customize Mongoose connection options and logging.
- `backend/src/repositories/index.js`
  - Change data-source selection logic.
- `backend/src/models/*.js`
  - Modify schema fields, indexes, validation rules.
- `backend/src/repositories/*mongo.js`
  - Customize query behavior, pagination, filtering.

### Atlas readiness notes

- `memory` mode seed data is local-only.
- In `mongo` mode, seed logic still runs at startup if collections are empty.
- For production use, rotate secrets and use environment-specific `.env` handling.

## API Overview

### Health

- `GET /api/health`

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PUT /api/auth/me`
- `PUT /api/auth/me/password`
- `GET /api/auth/me/registrations`

### Events

- `GET /api/events`
  - Supports query params: `search`, `page`, `limit`
- `POST /api/events` (admin)
- `GET /api/events/:eventId`
- `PUT /api/events/:eventId` (admin)
- `DELETE /api/events/:eventId` (admin)
- `POST /api/events/:eventId/register`
- `GET /api/events/:eventId/registrations` (admin)

## Demo Accounts (Local Memory Mode)

These are auto-seeded in memory mode for quick testing.

- Admin:
  - Email: `admin@dcg-event.local`
  - Password: `Admin12345!`
- Customer:
  - Email: `customer@dcg-event.local`
  - Password: `Customer12345!`

## Development Notes

- Frontend API base URL is configured in `frontend/.env.example`.
- If backend routes or auth payloads change, update `frontend/src/services/api.js`.
- For continuity across sessions, see `AGENT-HANDOFF.md`.
