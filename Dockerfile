# syntax=docker/dockerfile:1
FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY . .

ENV PORT=8080
EXPOSE 8080
CMD ["npm", "start"]
