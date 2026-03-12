# 后端服务 Dockerfile
FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 安装系统依赖（用于 better-sqlite3）
RUN apk add --no-cache python3 make g++

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装所有依赖（包括 devDependencies 用于构建）
RUN npm install --legacy-peer-deps

# 复制源代码
COPY . .

# 构建 TypeScript
RUN npm run build

# 安装生产依赖（清理 devDependencies）
RUN npm prune --production

# 创建数据目录
RUN mkdir -p /app/data

# 暴露端口
EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# 启动命令
CMD ["npm", "start"]
