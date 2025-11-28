-- Commission System Migration
-- Creates tables for user wallets and commission tracking

-- Create user_wallets table
CREATE TABLE IF NOT EXISTS user_wallets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  balance DECIMAL(10,2) DEFAULT 0.00,
  total_earned DECIMAL(10,2) DEFAULT 0.00,
  total_withdrawn DECIMAL(10,2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_wallet (user_id),
  INDEX idx_user_id (user_id)
);

-- Create commissions table
CREATE TABLE IF NOT EXISTS commissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  purchase_id INT NOT NULL,
  earner_user_id INT NOT NULL,
  referrer_user_id INT NOT NULL,
  package_name VARCHAR(255) NOT NULL,
  package_price DECIMAL(10,2) NOT NULL,
  commission_type ENUM('active', 'passive') NOT NULL,
  commission_percentage DECIMAL(5,2) NOT NULL,
  commission_amount DECIMAL(10,2) NOT NULL,
  status ENUM('pending', 'credited') DEFAULT 'pending',
  credited_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (earner_user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (referrer_user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_earner_user_id (earner_user_id),
  INDEX idx_referrer_user_id (referrer_user_id),
  INDEX idx_purchase_id (purchase_id),
  INDEX idx_status (status)
);

-- Insert wallet records for existing users
INSERT INTO user_wallets (user_id, balance, total_earned, total_withdrawn)
SELECT id, 0.00, 0.00, 0.00 FROM users
ON DUPLICATE KEY UPDATE balance = balance;
