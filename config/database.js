const mysql = require("mysql2");
const path = require("path");
const dotenv = require("dotenv");

// 使用绝对路径加载.env文件
dotenv.config({ path: path.join(__dirname, "../.env") });

// 从环境变量获取数据库配置
const config = {
  host: process.env.MYSQL_ADDRESS || process.env.DB_HOST || "localhost",
  user: process.env.MYSQL_USERNAME || process.env.DB_USER || "root",
  password: process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "bunblebee",
  port: process.env.MYSQL_PORT || 3306,
  charset: "utf8mb4",
  timezone: "+08:00",
  multipleStatements: true,
};

// 创建连接池
const pool = mysql.createPool(config);

// 将连接池转换为 Promise 版本
const promisePool = pool.promise();

// 打印数据库配置（不包含敏感信息）
console.log("Database configuration:", {
  host: config.host,
  user: config.user,
  database: config.database,
  port: config.port,
  charset: config.charset,
  timezone: config.timezone,
});

// 测试连接并创建数据库
async function initializeDatabase() {
  try {
    console.log("尝试连接数据库...");
    const connection = await promisePool.getConnection();
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
    console.error("数据库初始化失败:", err);
    throw err;
  }
}

// 执行初始化
initializeDatabase()
  .then(() => {
    console.log("数据库初始化完成");
  })
  .catch((err) => {
    console.error("初始化过程出错:", err);
  });

module.exports = promisePool;
