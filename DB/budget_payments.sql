-- Run this migration to add the budget_payments table
-- Tracks individual payment installments per budget item

CREATE TABLE IF NOT EXISTS budget_payments (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    budget_item_id INT NOT NULL,
    amount        DECIMAL(10, 2) NOT NULL,
    paid_at       DATE NOT NULL,
    note          VARCHAR(255) DEFAULT NULL,
    FOREIGN KEY (budget_item_id) REFERENCES budget_items(id) ON DELETE CASCADE
);
