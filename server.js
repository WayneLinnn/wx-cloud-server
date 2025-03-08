const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./config/database");

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

// 检查数据库状态
app.get("/check-database", async (req, res) => {
  try {
    // 检查当前数据库
    const [rows] = await db.query("SELECT DATABASE() as current_database");
    const currentDB = rows[0].current_database;

    // 获取所有数据库列表
    const [databases] = await db.query("SHOW DATABASES");

    // 检查 bunblebee 数据库是否存在
    const bunblebeeExists = databases.some((db) => db.Database === "bunblebee");

    res.json({
      current_database: currentDB,
      all_databases: databases.map((db) => db.Database),
      bunblebee_exists: bunblebeeExists,
    });
  } catch (error) {
    console.error("数据库检查失败:", error);
    res.status(500).json({ error: "数据库检查失败", details: error.message });
  }
});

// 创建数据库
app.post("/create-database", async (req, res) => {
  try {
    // 创建数据库（如果不存在）
    await db.query("CREATE DATABASE IF NOT EXISTS bunblebee");

    // 切换到新创建的数据库
    await db.query("USE bunblebee");

    res.json({ message: "数据库创建并切换成功" });
  } catch (error) {
    console.error("创建数据库失败:", error);
    res.status(500).json({ error: "创建数据库失败", details: error.message });
  }
});

// 测试数据库连接
app.get("/test-db", async (req, res) => {
  try {
    // 获取当前数据库名
    const [dbResult] = await db.query("SELECT DATABASE() as db_name");
    const currentDB = dbResult[0].db_name;

    // 测试连接
    const [testResult] = await db.query("SELECT 1 + 1 AS result");

    res.json({
      message: "数据库连接测试成功",
      current_database: currentDB,
      test_result: testResult[0].result,
    });
  } catch (error) {
    console.error("数据库测试失败:", error);
    res
      .status(500)
      .json({ error: "数据库连接测试失败", details: error.message });
  }
});

// 初始化所有数据表
app.post("/init-tables", async (req, res) => {
  try {
    // 确保我们在正确的数据库中
    await db.query("USE bunblebee");

    // 创建用户表
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        openid VARCHAR(100) UNIQUE NOT NULL,
        nickname VARCHAR(100),
        avatar_url TEXT,
        gender TINYINT,
        country VARCHAR(50),
        province VARCHAR(50),
        city VARCHAR(50),
        language VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // ... (其他表的创建代码保持不变)

    res.json({ message: "所有数据表初始化成功" });
  } catch (error) {
    console.error("创建数据表失败:", error);
    res.status(500).json({ error: "创建数据表失败", details: error.message });
  }
});

// 示例：获取所有用户
app.get("/users", async (req, res) => {
  try {
    const [users] = await db.query("SELECT * FROM users");
    res.json(users);
  } catch (error) {
    console.error("获取用户列表失败:", error);
    res.status(500).json({ error: "获取用户列表失败" });
  }
});

// 示例：添加新用户
app.post("/users", async (req, res) => {
  const { openid, nickname } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO users (openid, nickname) VALUES (?, ?)",
      [openid, nickname]
    );
    res.json({
      message: "用户创建成功",
      userId: result.insertId,
    });
  } catch (error) {
    console.error("创建用户失败:", error);
    res.status(500).json({ error: "创建用户失败" });
  }
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
  console.log("- GET /check-database");
  console.log("- POST /create-database");
  console.log("- GET /test-db");
  console.log("- POST /init-tables");
  console.log("- GET /users");
  console.log("- POST /users");
});
