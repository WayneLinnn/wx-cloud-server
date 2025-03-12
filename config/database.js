const mysql = require("mysql2");
const path = require("path");
const dotenv = require("dotenv");

// 使用绝对路径加载.env文件
dotenv.config({ path: path.join(__dirname, "../.env") });

// 处理数据库地址和端口
function parseDbAddress(address) {
  if (!address) return { host: "localhost", port: 3306 };
  const parts = address.split(":");
  return {
    host: parts[0],
    port: parts[1] ? parseInt(parts[1]) : 3306,
  };
}

const dbAddress = parseDbAddress(process.env.MYSQL_ADDRESS);

// 从环境变量获取数据库配置
const config = {
  host: dbAddress.host,
  port: dbAddress.port,
  user: process.env.MYSQL_USERNAME || "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.DB_NAME || "bunblebee",
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
  port: config.port,
  user: config.user,
  database: config.database,
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
      `CREATE DATABASE IF NOT EXISTS ${config.database} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    console.log(`数据库 ${config.database} 创建成功或已存在`);

    // 切换到新创建的数据库
    await connection.query(`USE ${config.database}`);
    console.log(`切换到 ${config.database} 数据库`);

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
    process.exit(1);
  });

module.exports = promisePool;
