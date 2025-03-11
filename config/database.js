const mysql = require("mysql2/promise");
const path = require("path");
const dotenv = require("dotenv");

// 使用绝对路径加载.env文件
dotenv.config({ path: path.join(__dirname, "../.env") });

// 创建连接池配置
const dbConfig = {
  host: process.env.DB_HOST || "10.41.111.100",
  port: parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "Linfeng19960110",
  charset: "utf8",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// 打印连接配置（不包含密码）
console.log("Database Config:", {
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.user,
  charset: dbConfig.charset,
});

const pool = mysql.createPool(dbConfig);

// 测试连接并创建数据库
async function initializeDatabase() {
  let retries = 3;
  while (retries > 0) {
    try {
      console.log(`尝试连接数据库... (剩余重试次数: ${retries})`);
      const connection = await pool.getConnection();
      console.log("数据库连接成功");

      // 创建数据库（如果不存在）
      console.log("尝试创建数据库...");
      await connection.query(
        "CREATE DATABASE IF NOT EXISTS bunblebee CHARACTER SET utf8 COLLATE utf8_general_ci"
      );
      console.log("数据库 bunblebee 创建成功或已存在");

      // 切换到新创建的数据库
      await connection.query("USE bunblebee");
      console.log("切换到 bunblebee 数据库");

      connection.release();
      return true;
    } catch (err) {
      console.error(`数据库初始化失败 (重试次数: ${retries}):`, err);
      retries--;
      if (retries > 0) {
        console.log("等待 5 秒后重试...");
        await new Promise((resolve) => setTimeout(resolve, 5000));
      } else {
        throw err;
      }
    }
  }
}

// 导出pool和初始化函数
module.exports = {
  pool,
  initializeDatabase,
};
