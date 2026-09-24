# Jomoro Koffee - Software Architecture Project

**COSC6093 - Software Architecture** | Even Semester 2025/2026

Backend microservice system for Jomoro Koffee coffee chain built with **NestJS**, **MySQL**, **Prisma ORM**, **JWT Passport**, and **Swagger**.

## Project Structure

```
SoftwareArch/
├── auth-service/          # Port 3001 - Authentication & Profile
├── product-service/       # Port 3002 - Product Catalog & Admin CRUD
├── transaction-service/   # Port 3003 - Cart, Orders & Checkout
└── database/
    └── jomoro_koffee.sql  # Database schema & seed data
```

## Prerequisites

- Node.js 22.16.0
- XAMPP 8.2.12 (MySQL)
- Visual Studio Code

## Setup Instructions

### 1. Database Setup

1. Start **Apache** and **MySQL** in XAMPP.
2. Open phpMyAdmin (`http://localhost/phpmyadmin`).
3. Import `database/jomoro_koffee.sql`.

### 2. Environment Configuration

Each service has a `.env` file. Default configuration:

```env
DATABASE_URL="mysql://root:@localhost:3306/jomoro_koffee"
JWT_SECRET="jomoro_koffee_jwt_secret"
```

| Service | Port | Extra Config |
|---------|------|--------------|
| auth-service | 3001 | - |
| product-service | 3002 | - |
| transaction-service | 3003 | `PRODUCT_SERVICE_URL=http://localhost:3002` |

### 3. Install Dependencies

```bash
cd auth-service && npm install && npx prisma generate
cd ../product-service && npm install && npx prisma generate
cd ../transaction-service && npm install && npx prisma generate
```

### 4. Run Services

Open **3 separate terminals**:

```bash
# Terminal 1
cd auth-service && npm run start

# Terminal 2
cd product-service && npm run start

# Terminal 3
cd transaction-service && npm run start
```

### 5. Swagger Documentation

| Service | Swagger URL |
|---------|-------------|
| Auth | http://localhost:3001/api |
| Product | http://localhost:3002/api |
| Transaction | http://localhost:3003/api |

## Seed Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@jomoro.com | admin12345 |
| Customer | john@jomoro.com | pass12345 |

## API Endpoints

### Auth Service (3001)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/auth/register` | Guest | Register new customer |
| POST | `/auth/login` | Guest | Login & receive JWT |
| GET | `/profiles` | Authenticated | Get user profile |

### Product Service (3002)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/products` | Guest | List all products |
| GET | `/products/:id` | Guest | Product details |
| GET | `/categories` | Guest | List categories |
| GET | `/categories/:categoryId/products` | Guest | Products by category |
| POST | `/admin/products` | Admin | Create product |
| POST | `/admin/products/:id/update` | Admin | Update product |
| POST | `/admin/products/:id/reduce` | Admin | Reduce stock |
| POST | `/admin/products/:id/delete` | Admin | Delete product |
| POST | `/service/products/:id/reduce` | Inter-service | Stock reduction (checkout) |

### Transaction Service (3003)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/cart` | Authenticated | View cart |
| POST | `/cart` | Authenticated | Add to cart |
| POST | `/cart/clear` | Authenticated | Clear cart |
| POST | `/cart/:product_id/update` | Authenticated | Update quantity |
| POST | `/cart/:product_id/delete` | Authenticated | Remove item |
| GET | `/orders` | Authenticated | List orders |
| POST | `/orders` | Authenticated | Checkout |
| POST | `/orders/:id` | Authenticated | Order details |

## Authentication

All protected endpoints require JWT Bearer token:

```
Authorization: Bearer <access_token>
```

Obtain token via `POST /auth/login` on Auth Service (port 3001).

## Microservice Communication

- Transaction Service calls Product Service using `fetch` to:
  - Get product details (`GET /products/:id`)
  - Reduce stock during checkout (`POST /service/products/:id/reduce`)
- CORS is enabled on all services.

## Submission Checklist

- [x] 3 separate NestJS microservice projects
- [x] MySQL database with SQL import file
- [x] Prisma ORM per service
- [x] JWT Passport authentication
- [x] Swagger on all services
- [x] Role-based access (Guest / Customer / Admin)
- [x] Inter-service communication via fetch
- [x] Backend validation without regex
- [x] Project documentation in `docs/DOKUMENTASI_PROYEK.md`

## Validation Rules

All validations are implemented in the backend without Regular Expression (ReGex):

- **Register**: letters-only names, email domain (.com/.net/.org/.id), password rules
- **Products**: min 3 words name, 20+ char description, price ≥ 1, stock 0-999
- **Cart**: no duplicate products, quantity ≤ stock
