const mysql = require("mysql2/promise");
const config = require("../config/database");

async function initDatabase() {
  const connection = await mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    multipleStatements: true,
  });

  try {
    // 创建数据库
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${config.database}`);
    await connection.query(`USE ${config.database}`);

    // 创建用户表
    await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                openid VARCHAR(100) UNIQUE,
                phone VARCHAR(20) UNIQUE,
                nickname VARCHAR(100),
                avatar_url TEXT,
                session_key VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);

    // 创建验证码表
    await connection.query(`
            CREATE TABLE IF NOT EXISTS verification_codes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                phone VARCHAR(20) NOT NULL,
                code VARCHAR(6) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                expires_at TIMESTAMP NOT NULL,
                is_used BOOLEAN DEFAULT FALSE,
                INDEX idx_phone (phone),
                INDEX idx_expires (expires_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);

    console.log("Database and tables initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  } finally {
    await connection.end();
  }
}

module.exports = initDatabase;
