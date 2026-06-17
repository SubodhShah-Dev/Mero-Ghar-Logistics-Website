CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'vendor', 'admin') DEFAULT 'user',
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vendors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  business_name VARCHAR(255),
  owner_name VARCHAR(255),
  phone VARCHAR(20),
  email VARCHAR(255),
  service_region TEXT,
  address TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_jobs INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS shipments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  booking_id VARCHAR(50),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  mobile_number VARCHAR(20),
  pickup_province VARCHAR(100),
  pickup_district VARCHAR(100),
  pickup_city VARCHAR(100),
  pickup_ward VARCHAR(50),
  pickup_address TEXT,
  drop_province VARCHAR(100),
  drop_district VARCHAR(100),
  drop_city VARCHAR(100),
  drop_ward VARCHAR(50),
  drop_address TEXT,
  move_date DATE,
  selected_items TEXT,
  vehicle_type VARCHAR(100),
  road_access VARCHAR(50),
  special_notes TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  final_quote DECIMAL(12,2),
  assigned_vendor_id INT,
  approval_status VARCHAR(50) DEFAULT 'pending',
  approved_by INT,
  approved_at DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (assigned_vendor_id) REFERENCES vendors(id)
);
