# SportX

SportX is a full-stack e-commerce platform for sports products, featuring user authentication, product management, order processing, and an admin dashboard.

---

## Table of Contents

- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Environment Variables](#environment-variables)
  - [Installation](#installation)
  - [Running Locally](#running-locally)
- [Scripts](#scripts)
- [Folder Overview](#folder-overview)
- [Contributing](#contributing)
- [Contact](#contact)

---

## Project Structure

```
SportX/
├── backend/
│   ├── package.json
│   ├── server.js
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middlewares/
│       ├── models/
│       ├── routes/
│       └── utils/
├── frontend/
│   ├── package.json
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── validation/
└── .gitignore
```

---

## Tech Stack

**Frontend:**
- React
- Ant Design
- Tailwind CSS
- Framer Motion
- Axios
- Clerk (authentication)

**Backend:**
- Node.js
- Express
- Sequelize (PostgreSQL)
- Multer (file uploads)
- Cloudinary (image hosting)
- Clerk (authentication)
- Razorpay (payment gateway)

---

## Features

- User authentication and role-based access (Clerk)
- Product catalog with filtering and search
- Shopping cart and checkout with Razorpay integration
- Order management for users and admins
- Admin dashboard for managing products, orders, stock, and team
- Contact form and admin contact submissions
- Invoice generation and download (PDF)
- Responsive UI

---

## Getting Started

### Environment Variables

Create `.env` files in both `backend/` and `frontend/` directories.

**Backend `.env`:**
```
PORT=5000
DATABASE_URL=postgres://user:password@localhost:5432/sportx
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLERK_SECRET_KEY=your_clerk_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

**Frontend `.env`:**
```
VITE_API_URL=http://localhost:5000/api
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

### Installation

**Backend:**
```sh
cd backend
npm install
```

**Frontend:**
```sh
cd frontend
npm install
```

### Running Locally

**Start PostgreSQL** and ensure your database is running.

**Backend:**
```sh
cd backend
npm run dev
```

**Frontend:**
```sh
cd frontend
npm run dev
```

Frontend: [http://localhost:5173](http://localhost:5173)  
Backend API: [http://localhost:5000](http://localhost:5000)

---

## Scripts

**Backend:**

- `npm run dev` — Start backend with nodemon
- `npm start` — Start backend in production mode

**Frontend:**

- `npm run dev` — Start frontend dev server
- `npm run build` — Build frontend for production
- `npm run preview` — Preview production build

---

## Folder Overview

- [`backend/src/controllers`](backend/src/controllers): API controllers for products, orders, users, etc.
- [`backend/src/models`](backend/src/models): Sequelize models (User, Product, Order, Contact, Admin)
- [`backend/src/routes`](backend/src/routes): Express route definitions
- [`frontend/src/pages`](frontend/src/pages): React pages (Store, Cart, Checkout, Admin, etc.)
- [`frontend/src/components`](frontend/src/components): Shared React components (Navbar, Footer, etc.)
- [`frontend/src/context`](frontend/src/context): React context providers (e.g., CartContext)
- [`frontend/src/api`](frontend/src/api): API utility functions

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

---
