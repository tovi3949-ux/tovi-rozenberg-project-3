-- ==============================================
-- Todo App - Database Setup Script
-- ==============================================

-- יצירת מסד נתונים
CREATE DATABASE IF NOT EXISTS todo_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_0900_ai_ci;

USE todo_db;

-- ==============================================
-- טבלת משתמשים
-- ==============================================
CREATE TABLE users (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    Username VARCHAR(100) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_username (Username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ==============================================
-- טבלת משימות עם קשר למשתמשים
-- ==============================================
CREATE TABLE items (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    IsComplete BOOLEAN DEFAULT FALSE,
    UserId INT NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_userid (UserId),
    INDEX idx_iscomplete (IsComplete),
    CONSTRAINT fk_items_users 
        FOREIGN KEY (UserId) 
        REFERENCES users(Id) 
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ==============================================
-- נתוני דוגמה (אופציונלי - להסרה בפרודקשן)
-- ==============================================

-- הוספת משתמשי דוגמה
-- שים לב: הסיסמאות יוצפנו על ידי AuthController בזמן רישום אמיתי
INSERT INTO users (Username, Password) VALUES 
('admin', 'admin123'),
('testuser', 'test123');

-- הוספת משימות דוגמה למשתמש admin (UserId = 1)
INSERT INTO items (Name, IsComplete, UserId) VALUES 
('ללמוד ASP.NET Core', TRUE, 1),
('ליצור API מאובטח', FALSE, 1),
('לבנות Todo App', FALSE, 1),
('להוסיף authentication', TRUE, 1);

-- הוספת משימות דוגמה למשתמש testuser (UserId = 2)
INSERT INTO items (Name, IsComplete, UserId) VALUES 
('לקנות חלב', FALSE, 2),
('לעשות ספורט', FALSE, 2),
('לקרוא ספר', TRUE, 2);

-- ==============================================
-- שאילתות בדיקה
-- ==============================================

-- הצגת כל המשתמשים
SELECT * FROM users;

-- הצגת כל המשימות עם שמות המשתמשים
SELECT 
    i.Id,
    i.Name,
    i.IsComplete,
    u.Username,
    i.CreatedAt,
    i.UpdatedAt
FROM items i
JOIN users u ON i.UserId = u.Id
ORDER BY i.CreatedAt DESC;

-- הצגת מספר המשימות לכל משתמש
SELECT 
    u.Username,
    COUNT(i.Id) as TotalTasks,
    SUM(CASE WHEN i.IsComplete = 1 THEN 1 ELSE 0 END) as CompletedTasks,
    SUM(CASE WHEN i.IsComplete = 0 THEN 1 ELSE 0 END) as PendingTasks
FROM users u
LEFT JOIN items i ON u.Id = i.UserId
GROUP BY u.Id, u.Username;
