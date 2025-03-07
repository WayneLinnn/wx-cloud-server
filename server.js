const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 80;

// 中间件
app.use(cors());
app.use(express.json());

// 数据库连接配置
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// 连接数据库
db.connect((err) => {
  if (err) {
    console.error("数据库连接失败:", err);
    return;
  }
  console.log("数据库连接成功");
});

// 健康检查路由
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// 测试路由
app.get("/", (req, res) => {
  res.json({ message: "服务器运行正常" });
});

// 新增测试路由 - 用于验证自动部署
app.get("/test-deploy", (req, res) => {
  res.json({
    message: "自动部署测试成功！",
    timestamp: new Date().toISOString(),
    version: "1.0.1",
  });
});

// 启动服务器，监听所有网络接口
app.listen(port, "0.0.0.0", () => {
  console.log(`服务器运行在端口 ${port}`);
});
