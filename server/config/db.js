import mysql from 'mysql2/promise'; // שימוש ב-Promise מאפשר עבודה נוחה עם async/await
import dotenv from 'dotenv';

dotenv.config();

// יצירת בריכת חיבורים לבסיס הנתונים
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// בדיקת חיבור ראשונית כדי לוודא שהכל תקין
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Connected to MySQL database successfully!');
        connection.release(); // שחרור החיבור חזרה לבריכה
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
    }
})();

export default pool;