# 使用 Node.js 官方轻量镜像
FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 先拷贝依赖清单
COPY package*.json ./

# 安装生产依赖
RUN npm install --only=production

# 拷贝剩余代码
COPY . .

# 设置环境变量和端口
ENV PORT=8080
EXPOSE 8080

# 启动应用
CMD ["node", "server.js"]
