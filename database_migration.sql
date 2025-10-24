-- Database migration script for admin panel package purchase management
-- Run this script to set up the required database schema changes

-- Add status column to checkout table
ALTER TABLE checkout
ADD COLUMN status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending';

-- Create users table for approved user accounts
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  approved_packages JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_username (username),
  INDEX idx_email (email)
);

-- Optional: Add some sample data for testing
-- INSERT INTO users (username, password, email, approved_packages) VALUES
-- ('testuser', 'testpass', 'test@example.com', '["basic-package"]');
