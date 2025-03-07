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

// 添加请求日志中间件
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

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
  console.log("健康检查请求");
  res.status(200).json({ status: "ok" });
});

// 测试路由
app.get("/", (req, res) => {
  console.log("根路径请求");
  res.json({ message: "服务器运行正常" });
});

// 新增测试路由 - 用于验证自动部署
app.get("/test-deploy", (req, res) => {
  console.log("测试部署路由被访问");
  res.json({
    message: "自动部署测试成功！",
    timestamp: new Date().toISOString(),
    version: "1.0.2", // 更新版本号以验证新部署
    deployTime: new Date().toISOString(),
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error("服务器错误:", err);
  res.status(500).json({ error: "服务器内部错误" });
});

// 404处理
app.use((req, res) => {
  console.log(`404 - 未找到路径: ${req.path}`);
  res.status(404).json({ error: "路径不存在" });
});

// 启动服务器，监听所有网络接口
app.listen(port, "0.0.0.0", () => {
  console.log(`服务器运行在端口 ${port}`);
  console.log("可用路由:");
  console.log("- GET /");
  console.log("- GET /health");
  console.log("- GET /test-deploy");
});
