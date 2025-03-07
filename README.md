# 微信小程序后端服务器

这是一个基于 Node.js 和 Express 的微信小程序后端服务器，使用 MySQL 数据库。

## 项目结构

```
.
├── server.js          # 主服务器文件
├── package.json       # 项目依赖配置
├── .env              # 环境变量配置
└── .github/workflows # GitHub Actions 配置
```

## 环境要求

- Node.js >= 16
- MySQL 数据库
- 微信云托管账号

## 本地开发

1. 安装依赖：

```bash
npm install
```

2. 配置环境变量：
   创建 `.env` 文件并配置以下变量：

```
DB_HOST=你的数据库主机
DB_USER=数据库用户名
DB_PASSWORD=数据库密码
DB_NAME=数据库名称
PORT=3000
```

3. 启动开发服务器：

```bash
npm run dev
```

## 部署

本项目使用 GitHub Actions 自动部署到微信云托管。每次推送到 main 分支时，将自动触发部署流程。

### 手动部署

1. 安装微信云托管 CLI：

```bash
npm install -g @wxcloud/cli
```

2. 登录微信云托管：

```bash
wxcloud login
```

3. 部署项目：

```bash
wxcloud deploy
```

## 注意事项

- 请确保 `.env` 文件不要提交到 Git 仓库
- 数据库配置信息请妥善保管
- 部署前请确保微信云托管账号已开通相关服务
