CREATE TABLE producer_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,
  producer_id INT NOT NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (producer_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_request (event_id, producer_id)
);

CREATE TABLE producer_updates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,
  author_role ENUM('owner', 'producer') NOT NULL,
  content TEXT NOT NULL,
  status ENUM('pending', 'done') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);
