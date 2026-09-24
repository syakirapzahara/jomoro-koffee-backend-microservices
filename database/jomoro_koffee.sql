-- Jomoro Koffee Database Schema
-- Import this file into MySQL (XAMPP) before running the services.

CREATE DATABASE IF NOT EXISTS jomoro_koffee;
USE jomoro_koffee;

-- Auth Service tables
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(25) NOT NULL DEFAULT 'CUSTOMER'
);

-- Product Service tables
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    price DOUBLE NOT NULL,
    stock INT NOT NULL,
    image_url VARCHAR(255) NULL,
    category_id INT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Transaction Service tables
CREATE TABLE IF NOT EXISTS carts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cart_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    price DOUBLE NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Seed data (safe to re-run after tables are created)
INSERT IGNORE INTO users (id, first_name, last_name, email, password, role) VALUES
(1, 'Admin', 'User', 'admin@jomoro.com', 'admin12345', 'ADMIN'),
(2, 'John', 'Doe', 'john@jomoro.com', 'pass12345', 'CUSTOMER');

INSERT IGNORE INTO categories (id, name) VALUES
(1, 'Espresso Series'),
(2, 'Latte Blends'),
(3, 'Non Coffee Drinks'),
(4, 'Pastries');

INSERT IGNORE INTO products (id, name, description, price, stock, image_url, category_id) VALUES
(1, 'Classic Espresso Shot Dark Roast', 'Rich and bold single shot espresso made from premium arabica beans.', 25000, 100, NULL, 1),
(2, 'Caramel Latte Blend Special', 'Smooth steamed milk blended with sweet caramel and espresso.', 35000, 50, NULL, 2),
(3, 'Iced Chocolate Frappe Drink', 'Refreshing chocolate frappe topped with whipped cream.', 30000, 75, NULL, 3),
(4, 'Butter Croissant Pastry Fresh', 'Flaky buttery croissant baked fresh every morning.', 20000, 40, NULL, 4);
