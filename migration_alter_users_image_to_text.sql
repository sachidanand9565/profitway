-- Migration to change image column in users table to TEXT for storing base64 images
ALTER TABLE users MODIFY COLUMN image TEXT;