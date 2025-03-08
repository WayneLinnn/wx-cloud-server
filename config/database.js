const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: "ocmjmuga.express-t27b.ccwxy1gg.8utosasx.com", // 微信云托管内网连接地址
  user: "root",
  password: process.env.DB_PASSWORD || "your_password",
  database: "bunblebee",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
