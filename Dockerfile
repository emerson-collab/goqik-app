FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
# 没有依赖也没关系，这句会很快完成；若有依赖，也能正确安装
RUN npm install --omit=dev
COPY . .
ENV PORT=8080
EXPOSE 8080
CMD ["node","server.js"]
