# 使用 Node.js 官方镜像作为基础镜像
FROM node:16-alpine

# 安装基础工具
RUN apk add --no-cache curl

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制源代码
COPY . .

# 设置环境变量
ENV PORT=80
ENV DB_HOST=10.41.111.100
ENV DB_PORT=3306
ENV DB_USER=root
ENV DB_PASSWORD=Linfeng19960110
ENV DB_NAME=bunblebee
ENV JWT_SECRET=bumblebee_secret_key_2024
ENV WX_APP_ID=wx5b89b5f779f7991a
ENV WX_APP_SECRET=0093fd72356299b864ca022824b5487f

# 创建健康检查脚本
RUN echo '#!/bin/sh\n\
while ! curl -s http://localhost:80/health > /dev/null; do\n\
  echo "Waiting for application to start..."\n\
  sleep 2\n\
done\n\
echo "Application is ready!"' > /app/healthcheck.sh \
&& chmod +x /app/healthcheck.sh

# 暴露端口
EXPOSE 80

# 启动命令
CMD ["node", "server.js"] 