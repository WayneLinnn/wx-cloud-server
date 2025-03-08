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
  user: "bunblebee", // 你创建的账号
  password: "Linfeng19960110", // 账号密码
  database: "bunblebee", // 数据库名称
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// 测试连接
pool
  .getConnection()
  .then((connection) => {
    console.log("数据库连接成功");
    connection.release();
  })
  .catch((err) => {
    console.error("数据库连接失败:", err);
  });

module.exports = pool;
