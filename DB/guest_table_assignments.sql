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
