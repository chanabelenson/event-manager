-- ========================================
-- מערכת ניהול אירועים - Event Manager
-- ========================================

CREATE DATABASE IF NOT EXISTS event_manager CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE event_manager;

-- ========================================
-- 1. טבלת משתמשים (בעלי אירועים)
-- ========================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ========================================
-- 2. טבלת אירועים
-- ========================================
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    event_name VARCHAR(150) NOT NULL,
    event_date DATETIME NOT NULL,
    location_name VARCHAR(255) NOT NULL,
    location_address VARCHAR(255),
    
    invitation_text TEXT,
    image_url VARCHAR(255),
    audio_url VARCHAR(255),
    
    total_budget DECIMAL(10, 2) DEFAULT 0.00,
    rsvp_deadline DATE DEFAULT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_date (user_id, event_date)
) ENGINE=InnoDB;

-- ========================================
-- 3. טבלת אורחים
-- ========================================
CREATE TABLE IF NOT EXISTS guests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    guest_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    status ENUM('pending', 'confirmed', 'declined') DEFAULT 'pending',
    guests_count INT DEFAULT 1,
    confirmed_count INT DEFAULT NULL,
    invitation_token VARCHAR(64) UNIQUE NOT NULL,
    table_id INT DEFAULT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (table_id) REFERENCES tables(id) ON DELETE SET NULL,
    INDEX idx_event (event_id),
    INDEX idx_token (invitation_token)
) ENGINE=InnoDB;

-- ========================================
-- 4. טבלת שולחנות
-- ========================================
CREATE TABLE IF NOT EXISTS tables (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    table_number INT NOT NULL,
    capacity INT DEFAULT 10,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    UNIQUE KEY unique_table (event_id, table_number),
    INDEX idx_event (event_id)
) ENGINE=InnoDB;

-- ========================================
-- 5. טבלת משימות/תקציב
-- ========================================
CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    task_name VARCHAR(255) NOT NULL,
    task_date DATE DEFAULT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    estimated_cost DECIMAL(10, 2) DEFAULT 0.00,
    actual_cost DECIMAL(10, 2) DEFAULT 0.00,
    category VARCHAR(50) DEFAULT NULL,
    notes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    INDEX idx_event_date (event_id, task_date)
) ENGINE=InnoDB;

-- ========================================
-- הוספת נתוני דוגמה (אופציונלי)
-- ========================================

-- משתמש לבדיקה (סיסמה: 123456)
-- INSERT INTO users (full_name, email, password_hash) 
-- VALUES ('משה כהן', 'moshe@example.com', '$2b$10$wGZvXj1xGqR4LqW5LqW5LeuXzT9KY9Z8Q9Z8Q9Z8Q9Z8Q9Z8Q9Z8Q');

-- אירוע לדוגמה
-- INSERT INTO events (user_id, event_name, event_date, location_name, location_address, total_budget)
-- VALUES (1, 'חתונת משה ושרה', '2024-06-15 18:00:00', 'אולם ורד הגליל', 'רחוב הפרחים 10, תל אביב', 150000.00);

-- אורחים לדוגמה
-- INSERT INTO guests (event_id, guest_name, phone_number, guests_count, invitation_token)
-- VALUES 
-- (1, 'דוד לוי', '0501234567', 2, 'abc123xyz'),
-- (1, 'רחל מזרחי', '0507654321', 4, 'def456uvw');

-- משימות לדוגמה
-- INSERT INTO tasks (event_id, task_name, estimated_cost, actual_cost, category)
-- VALUES
-- (1, 'הזמנת צלם', 5000.00, 4500.00, 'צילום'),
-- (1, 'הזמנת DJ', 3000.00, 0.00, 'מוזיקה'),
-- (1, 'הזמנת קייטרינג', 80000.00, 0.00, 'אוכל');

-- שולחנות לדוגמה
-- INSERT INTO tables (event_id, table_number, capacity)
-- VALUES
-- (1, 1, 10),
-- (1, 2, 10),
-- (1, 3, 8);
