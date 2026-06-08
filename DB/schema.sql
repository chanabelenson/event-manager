
CREATE DATABASE event_manager_db;
use event_manager_db;
-- 1. טבלת משתמשים (ללא סיסמה - לפי הערה 1)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- טבלת סיסמאות מקושרת (הערה 1: שומרת סיסמה רגילה, קשר 1 ל-1 למשתמש)
CREATE TABLE user_passwords (
    user_id INT PRIMARY KEY,
    password_text VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 2. טבלת אירועים (כולל rsvp_deadline שנוסף ב-ALTER)
CREATE TABLE events (
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
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. טבלת משימות (הערה 4: הוסרו הקטגוריות, נשארו השדות מה-ALTER)
CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    task_name VARCHAR(255) NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    estimated_cost DECIMAL(10, 2) DEFAULT 0.00,
    actual_cost DECIMAL(10,2) DEFAULT 0.00,
    task_date DATE DEFAULT NULL,
    notes TEXT,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- 4. טבלת שולחנות (הוגדרה לפני האורחים כדי שנוכל לקשר ביניהם)
CREATE TABLE tables (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    table_number INT NOT NULL,
    capacity INT DEFAULT 10,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- 5. טבלת סטטוסי הגעה (הערה 2: מחליפה את ה-ENUM)
CREATE TABLE guest_statuses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    status_name VARCHAR(50) NOT NULL UNIQUE
);

-- 6. טבלת קטגוריות אורחים (הערה 3: מנוהלת ע"י מנהל האירוע ומקושרת לאירוע)
CREATE TABLE guest_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    category_name VARCHAR(100) NOT NULL,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- 7. טבלת אורחים המעודכנת (משלבת את הערות 2 ו-3, ואת שדות ה-ALTER)
CREATE TABLE guests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    guest_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    status_id INT NOT NULL, -- קישור לטבלת סטטוסים (הערה 2)
    category_id INT DEFAULT NULL, -- קישור לטבלת קטגוריות (הערה 3)
    table_id INT DEFAULT NULL, -- קישור לטבלת שולחנות
    guests_count INT DEFAULT 1,                               
    confirmed_count INT DEFAULT NULL, -- נוסף ב-ALTER
    invitation_token VARCHAR(64) DEFAULT NULL, -- שונה ב-ALTER ל-DEFAULT NULL
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (status_id) REFERENCES guest_statuses(id),
    FOREIGN KEY (category_id) REFERENCES guest_categories(id) ON DELETE SET NULL,
    FOREIGN KEY (table_id) REFERENCES tables(id) ON DELETE SET NULL
);

-- 8. טבלת מתנות (נוצרה בסוף ה-ALTER המקורי)
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


USE event_manager;

INSERT INTO guest_statuses  (id, status_name) VALUES 
  (1, 'pending'), 
  (2, 'confirmed'), 
  (3, 'declined');