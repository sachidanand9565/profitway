-- Withdrawal Requests Migration
-- Creates table for handling user withdrawal requests

CREATE TABLE IF NOT EXISTS withdrawal_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  method ENUM('UPI', 'Bank') NOT NULL,
  upi_id VARCHAR(255) NULL,
  account_number VARCHAR(255) NULL,
  bank_name VARCHAR(255) NULL,
  ifsc_code VARCHAR(255) NULL,
  status ENUM('pending', 'approved', 'rejected', 'completed') DEFAULT 'pending',
  admin_notes TEXT NULL,
  processed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
);
