# 使用 Node.js 官方镜像作为基础镜像
FROM node:16-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制源代码
COPY . .

# 设置默认环境变量（可被云托管环境变量覆盖）
ENV PORT=80
ENV NODE_ENV=production

# 暴露端口
EXPOSE 80

# 启动命令
CMD ["node", "server.js"] 