# 使用 Node.js 官方镜像作为基础镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制源代码和环境变量文件
COPY . .

# 设置环境变量
ENV NODE_ENV=production
ENV DB_HOST=10.41.111.100
ENV DB_USER=root
ENV DB_PASSWORD=Linfeng19960110
ENV DB_NAME=bunblebee
ENV PORT=80

# WeChat Configuration
ENV WECHAT_APPID=wx5b89b5f779f7991a
ENV WECHAT_SECRET=0093fd72356299b864ca022824b5487f

# JWT Configuration
ENV JWT_SECRET=your-jwt-secret-key
ENV JWT_EXPIRES_IN=7d

# Run database migrations
RUN npm install -g sequelize-cli
RUN sequelize db:migrate

# 暴露端口
EXPOSE 80

# 启动命令
CMD ["npm", "start"] 