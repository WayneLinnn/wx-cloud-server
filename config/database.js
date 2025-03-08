const mysql = require("mysql2/promise");
const path = require("path");
const dotenv = require("dotenv");

// 使用绝对路径加载.env文件
dotenv.config({ path: path.join(__dirname, "../.env") });

// 打印环境变量进行调试
console.log("Database Config:", {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  port: 3306,
});

const pool = mysql.createPool({
  host: "10.41.111.100", // 内网地址
  port: 3306, // 端口号
  user: "root", // root账号
  password: "Linfeng19960110", // root密码
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// 测试连接并创建数据库
async function initializeDatabase() {
  try {
    console.log("尝试连接数据库...");
    const connection = await pool.getConnection();
    console.log("数据库连接成功");

    // 创建数据库（如果不存在）
    console.log("尝试创建数据库...");
    await connection.query("CREATE DATABASE IF NOT EXISTS bunblebee");
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

module.exports = pool;
