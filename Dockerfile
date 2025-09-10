# syntax=docker/dockerfile:1
FROM node:20-alpine
WORKDIR /app

# 只拷贝必要文件以利用缓存
COPY package.json ./package.json
RUN npm install --only=production

# 拷贝源代码并构建静态资源
COPY tools ./tools
COPY public ./public
COPY server.js ./server.js
RUN npm run build

ENV PORT=8080
EXPOSE 8080
CMD ["node","server.js"]
