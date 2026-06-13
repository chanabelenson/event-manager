DROP DATABASE IF EXISTS event_manager;
CREATE DATABASE event_manager;
USE event_manager;

-- ==========================================
-- טבלאות מילון (מחליפות את ה-ENUM-ים)
-- ==========================================

-- טבלת תפקידי משתמשים (מחליפה את ה-ENUM של התפקידים)
CREATE TABLE user_roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE
);

-- טבלת סטטוסי בקשות (מחליפה את ה-ENUM של בקשות המפיקים)
CREATE TABLE request_statuses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    status_name VARCHAR(50) NOT NULL UNIQUE
);

-- טבלת סטטוסי הגעה של אורחים
CREATE TABLE guest_statuses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    status_name VARCHAR(50) NOT NULL UNIQUE
);


-- ==========================================
-- 1. טבלאות משתמשים, סיסמאות והרשאות
-- ==========================================

-- טבלת משתמשים (ה-ENUM הוחלף ב-role_id המקושר לטבלת התפקידים)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    role_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES user_roles(id)
);

-- טבלת סיסמאות מקושרת 1 ל-1
CREATE TABLE user_passwords (
    user_id INT PRIMARY KEY,
    password_hash VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- טבלת קודי איפוס סיסמה
CREATE TABLE password_reset_codes (
    user_id INT PRIMARY KEY,
    code VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- פרופילי מפיקים
CREATE TABLE producer_profiles (
    user_id INT PRIMARY KEY,
    phone VARCHAR(20),
    contact_email VARCHAR(150),
    bio TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


-- ==========================================
-- 2. טבלת אירועים וניהול מפיקים באירוע
-- ==========================================

-- טבלת אירועים
CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    event_name VARCHAR(150) NOT NULL,
    event_date DATETIME NOT NULL,
    location_name VARCHAR(255) NOT NULL,
    location_address VARCHAR(255),
    invitation_text TEXT,                                    
    total_budget DECIMAL(10, 2) DEFAULT 0.00,
    rsvp_deadline DATE DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- קישור מפיק לאירוע + דירוג
CREATE TABLE event_producers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    producer_id INT NOT NULL,
    rating TINYINT DEFAULT NULL CHECK (rating BETWEEN 1 AND 5),
    review TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_event_producer (event_id, producer_id),
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (producer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- בקשות מפיקים (ה-ENUM הוחלף ב-status_id המקושר לטבלת הסטטוסים)
CREATE TABLE producer_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    producer_id INT NOT NULL,
    status_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (producer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (status_id) REFERENCES request_statuses(id),
    UNIQUE KEY unique_request (event_id, producer_id)
);

-- עדכוני מפיקים ובעלים (ה-ENUM הוחלף ב-author_role_id המקושר לטבלת התפקידים)
CREATE TABLE producer_updates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    author_role_id INT NOT NULL,
    content TEXT NOT NULL,
    status ENUM('pending', 'done') DEFAULT 'pending', -- השארתי כאן זמנית, אם תרצי לפתוח גם את זה לטבלה בעתיד
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (author_role_id) REFERENCES user_roles(id)
);


-- ==========================================
-- 3. טבלאות משימות, תקציב ותשלומים
-- ==========================================

-- טבלת משימות
CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    task_name VARCHAR(255) NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    task_date DATE DEFAULT NULL,
    notes TEXT,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- טבלת סעיפי תקציב
CREATE TABLE budget_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) DEFAULT NULL,
    cost DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    notes TEXT,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- טבלת תשלומי תקציב
CREATE TABLE budget_payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    budget_item_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    paid_at DATE NOT NULL,
    note VARCHAR(255) DEFAULT NULL,
    FOREIGN KEY (budget_item_id) REFERENCES budget_items(id) ON DELETE CASCADE
);


-- ==========================================
-- 4. טבלאות שולחנות, אורחים ומתנות
-- ==========================================

-- טבלת שולחנות 
CREATE TABLE tables (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    table_number INT NOT NULL,
    capacity INT DEFAULT 10,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- טבלת קטגוריות אורחים 
CREATE TABLE guest_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    category_name VARCHAR(100) NOT NULL,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- טבלת אורחים
CREATE TABLE guests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    guest_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) DEFAULT NULL,
    status_id INT NOT NULL, 
    category_id INT DEFAULT NULL, 
    table_id INT DEFAULT NULL, 
    guests_count INT DEFAULT 1,                                
    confirmed_count INT DEFAULT NULL, 
    invitation_token VARCHAR(64) DEFAULT NULL, 
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (status_id) REFERENCES guest_statuses(id),
    FOREIGN KEY (category_id) REFERENCES guest_categories(id) ON DELETE SET NULL,
    FOREIGN KEY (table_id) REFERENCES tables(id) ON DELETE SET NULL
);

-- טבלת מתנות 
CREATE TABLE gifts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    description VARCHAR(255) DEFAULT NULL,
    link VARCHAR(500) DEFAULT NULL,
    claimed_by INT DEFAULT NULL,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (claimed_by) REFERENCES guests(id) ON DELETE SET NULL
);

-- הוספת טבלת שיבוץ אורחים לשולחנות (many-to-many)
CREATE TABLE IF NOT EXISTS guest_table_assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    guest_id INT NOT NULL,
    table_id INT NOT NULL,
    count INT NOT NULL DEFAULT 1,
    UNIQUE KEY unique_guest_table (guest_id, table_id),
    FOREIGN KEY (guest_id) REFERENCES guests(id) ON DELETE CASCADE,
    FOREIGN KEY (table_id) REFERENCES tables(id) ON DELETE CASCADE
);



-- ==========================================
-- 5. הזנת נתונים ראשוניים (Seed Data)
-- ==========================================

-- הזנת תפקידי מערכת
INSERT INTO user_roles (id, role_name) VALUES
  (1, 'owner'),
  (2, 'producer');

-- הזנת סטטוסים לבקשות מפיקים
INSERT INTO request_statuses (id, status_name) VALUES
  (1, 'pending'),
  (2, 'approved'),
  (3, 'rejected');

-- הזנת סטטוסי הגעה לאורחים
INSERT INTO guest_statuses (id, status_name) VALUES  
  (1, 'pending'),  
  (2, 'confirmed'),  
  (3, 'declined');