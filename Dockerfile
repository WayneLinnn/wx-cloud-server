# 使用 Node.js 官方镜像作为基础镜像
FROM node:16-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制源代码和环境变量文件
COPY . .

# 设置环境变量
ENV PORT=80
ENV DB_HOST=10.41.111.100
ENV DB_USER=bunblebee
ENV DB_PASSWORD=Linfeng19960110
ENV DB_NAME=mysql

# 暴露端口
EXPOSE 80

# 启动命令
CMD ["node", "server.js"] 