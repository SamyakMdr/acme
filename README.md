# MERN Starter

## Setup

- Backend
```
cd backend
cp .env.example .env
# edit .env if needed
npm run dev
```

- Frontend
```
cd frontend
cp .env.example .env
npm run dev
```

- Admin secret path: `/${VITE_ADMIN_SECRET}` (default: `/admin-portal-9b2f7c`)
- Seed an admin (one-time): POST `/api/auth/seed-admin` with JSON `{ name, email, password }`

## Features
- JWT auth + role-based routes (admin, teacher, student)
- Admin dashboard to create teachers and students