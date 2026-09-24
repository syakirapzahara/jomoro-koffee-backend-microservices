# Dokumentasi Proyek Jomoro Koffee

**Matakuliah:** COSC6093 - Software Architecture  
**Semester:** Genap 2025/2026  
**Case:** Jomoro Koffee Backend Microservice

---

## 1. Deskripsi Aplikasi

Jomoro Koffee adalah sistem backend berbasis **microservice** untuk mendukung platform pemesanan online coffee chain. Sistem dibangun menggunakan **NestJS**, **MySQL**, **Prisma ORM**, **JWT Passport**, dan **Swagger**.

Sistem melayani 3 role pengguna:
- **Guest** - melihat katalog produk, kategori, register, dan login
- **Customer** - mengelola profil, keranjang belanja, riwayat order, dan checkout
- **Admin** - melakukan CRUD produk dan pengelolaan stok

---

## 2. Arsitektur Microservice

| Service | Port | Deskripsi |
|---------|------|-----------|
| Auth Service | 3001 | Registrasi, login, JWT, profil user |
| Product Service | 3002 | Katalog produk, kategori, admin CRUD |
| Transaction Service | 3003 | Keranjang belanja, order, checkout |

Komunikasi antar service menggunakan **fetch API** bawaan Node.js.

---

## 3. Teknologi yang Digunakan

- Node.js 22.16.0
- NestJS Framework
- TypeScript
- MySQL (XAMPP 8.2.12)
- Prisma ORM 5.22.0
- JWT + Passport
- Swagger OpenAPI

---

## 4. Struktur Database

Database: `jomoro_koffee`

### Auth Service
- `users` - data pengguna (id, first_name, last_name, email, password, role)

### Product Service
- `categories` - kategori produk
- `products` - data produk

### Transaction Service
- `carts` - keranjang per user (1 user = 1 cart)
- `cart_items` - item dalam keranjang
- `orders` - data order
- `order_details` - detail item per order

File SQL: `database/jomoro_koffee.sql`

---

## 5. Cara Instalasi dan Menjalankan

### Langkah 1: Setup Database
1. Jalankan XAMPP, aktifkan MySQL
2. Buka phpMyAdmin
3. Import file `database/jomoro_koffee.sql`

### Langkah 2: Install Dependencies
```bash
cd auth-service && npm install && npm run prisma:generate
cd ../product-service && npm install && npm run prisma:generate
cd ../transaction-service && npm install && npm run prisma:generate
```

### Langkah 3: Jalankan Service (3 terminal terpisah)
```bash
cd auth-service && npm run start
cd product-service && npm run start
cd transaction-service && npm run start
```

### Langkah 4: Akses Swagger
- Auth: http://localhost:3001/api
- Product: http://localhost:3002/api
- Transaction: http://localhost:3003/api

---

## 6. Akun Testing

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@jomoro.com | admin12345 |
| Customer | john@jomoro.com | pass12345 |

---

## 7. Alur Penggunaan Aplikasi

### Guest
1. `GET /products` - lihat semua produk
2. `GET /categories` - lihat kategori
3. `POST /auth/register` - daftar akun baru
4. `POST /auth/login` - login dan dapatkan JWT token

### Customer
1. Login untuk mendapatkan JWT token
2. `GET /profiles` - lihat profil
3. `POST /cart` - tambah produk ke keranjang
4. `GET /cart` - lihat isi keranjang
5. `POST /orders` - checkout
6. `GET /orders` - lihat riwayat order
7. `POST /orders/:id` - lihat detail order

### Admin
1. Login dengan akun admin
2. `POST /admin/products` - tambah produk
3. `POST /admin/products/:id/update` - update produk
4. `POST /admin/products/:id/reduce` - kurangi stok
5. `POST /admin/products/:id/delete` - hapus produk

---

## 8. Validasi yang Diimplementasikan

### Register
- First name & last name: huruf saja
- Email: harus mengandung @ dan berakhiran .com, .net, .org, atau .id
- Password: tanpa spasi, minimal 8 karakter, minimal 2 angka
- Email harus unik

### Product (Admin)
- Nama produk: minimal 3 kata
- Deskripsi: minimal 20 karakter
- Harga: integer positif (minimal 1)
- Stok: 0 - 999
- Category id harus valid

### Cart
- Produk tidak boleh duplikat di keranjang
- Quantity tidak boleh melebihi stok produk

### Checkout
- Keranjang tidak boleh kosong
- Stok dicek sebelum order dibuat
- Stok dikurangi via Product Service
- Keranjang dikosongkan setelah checkout berhasil

---

## 9. Autentikasi JWT

- Token di-generate hanya di Auth Service
- Payload JWT: `id` dan `role`
- Protected endpoint memerlukan header:
  ```
  Authorization: Bearer <access_token>
  ```

---

## 10. Referensi Aset

Proyek ini tidak menggunakan aset gambar eksternal. Field `image_url` pada produk bersifat nullable dan dapat diisi URL gambar jika diperlukan.

---

## 11. Pembagian Tugas (sesuaikan dengan anggota kelompok)

| Anggota | Tugas |
|---------|-------|
| ... | Auth Service |
| ... | Product Service |
| ... | Transaction Service |
| ... | Database & Dokumentasi |

---

## 12. Kesimpulan

Sistem backend Jomoro Koffee telah diimplementasikan sesuai spesifikasi proyek COSC6093 dengan arsitektur microservice, autentikasi JWT, validasi backend, Prisma ORM, dan dokumentasi Swagger pada setiap service.
