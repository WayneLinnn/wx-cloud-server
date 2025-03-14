const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const db = require("./config/database");
const initDatabase = require("./utils/initDatabase");
const authRoutes = require("./routes/auth");

// 使用绝对路径加载.env文件
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const port = process.env.PORT || 80;

// 打印当前工作目录和环境变量
console.log("Current working directory:", process.cwd());
console.log("Environment variables:", {
  DB_HOST: process.env.DB_HOST,
  DB_NAME: process.env.DB_NAME,
  PORT: process.env.PORT,
});

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 添加请求日志中间件
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// 路由
app.use("/api/auth", authRoutes);

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
    console.log("正在检查数据库状态...");
    const connection = await db.getConnection();

    // 获取当前数据库
    const [dbResult] = await connection.query(
      "SELECT DATABASE() as current_db"
    );
    const currentDB = dbResult[0].current_db;

    // 获取所有数据库
    const [databases] = await connection.query("SHOW DATABASES");

    connection.release();

    res.json({
      status: "success",
      message: "数据库连接成功",
      current_database: currentDB,
      available_databases: databases.map((db) => db.Database),
    });
  } catch (error) {
    console.error("数据库检查失败:", error);
    res.status(500).json({
      error: "数据库检查失败",
      details: error.message,
      code: error.code,
      state: error.sqlState,
    });
  }
});

// 创建数据库
app.post("/create-database", async (req, res) => {
  try {
    console.log("尝试创建数据库...");
    const connection = await db.getConnection();

    // 创建数据库
    await connection.query(
      "CREATE DATABASE IF NOT EXISTS bunblebee CHARACTER SET utf8 COLLATE utf8_general_ci"
    );
    console.log("数据库创建命令执行成功");

    // 切换到新创建的数据库
    await connection.query("USE bunblebee");
    console.log("切换到 bunblebee 数据库");

    // 获取所有数据库列表以验证
    const [databases] = await connection.query("SHOW DATABASES");

    connection.release();

    res.json({
      status: "success",
      message: "数据库创建成功",
      database_name: "bunblebee",
      available_databases: databases.map((db) => db.Database),
    });
  } catch (error) {
    console.error("创建数据库失败:", error);
    res.status(500).json({
      error: "创建数据库失败",
      details: error.message,
      code: error.code,
      state: error.sqlState,
    });
  }
});

// 测试数据库连接
app.get("/test-db", async (req, res) => {
  try {
    console.log("正在测试数据库连接...");
    const connection = await db.getConnection();

    // 测试查询
    const [result] = await connection.query("SELECT 1 + 1 as sum");

    connection.release();

    res.json({
      status: "success",
      message: "数据库连接测试成功",
      test_result: result[0].sum,
    });
  } catch (error) {
    console.error("数据库连接测试失败:", error);
    res.status(500).json({
      error: "数据库连接测试失败",
      details: error.message,
      code: error.code,
      state: error.sqlState,
    });
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
  console.error("服务器错误:", {
    message: err.message,
    stack: err.stack,
    code: err.code,
    path: req.path,
    method: req.method,
  });
  res.status(500).json({
    error: "服务器内部错误",
    message: err.message,
    path: req.path,
  });
});

// 404处理
app.use((req, res) => {
  const message = `404 - 未找到路径: ${req.path}`;
  console.log(message);
  res.status(404).json({
    error: "路径不存在",
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
});

// 数据库初始化和服务器启动
async function startServer() {
  try {
    // 打印环境信息
    console.log("Starting server with configuration:", {
      NODE_ENV: process.env.NODE_ENV,
      PORT: port,
      DB_HOST: process.env.MYSQL_ADDRESS || process.env.DB_HOST,
      DB_NAME: process.env.DB_NAME,
    });

    // 初始化数据库
    await initDatabase();
    console.log("Database initialized successfully");

    // 启动服务器
    app.listen(port, "0.0.0.0", () => {
      console.log(
        `Server is running on port ${port} (${process.env.NODE_ENV} mode)`
      );
      console.log("Available routes:");
      console.log("- GET /");
      console.log("- GET /health");
      console.log("- GET /check-database");
      console.log("- POST /create-database");
      console.log("- GET /test-db");
      console.log("- POST /init-tables");
      console.log("- GET /users");
      console.log("- POST /users");
    });
  } catch (error) {
    console.error("Failed to start server:", {
      message: error.message,
      stack: error.stack,
      code: error.code,
    });
    process.exit(1);
  }
}

startServer();
