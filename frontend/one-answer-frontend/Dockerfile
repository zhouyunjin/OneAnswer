# 前端服务 Dockerfile
FROM node:20-alpine as builder

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖（使用 npm ci，如果失败则重试 3 次）
RUN for i in 1 2 3; do npm ci --ignore-scripts 2>/dev/null && break || (sleep 5 && if [ $i -eq 3 ]; then npm install --ignore-scripts; fi); done

# 复制源代码
COPY . .

# 构建生产版本
RUN npm run build

# 生产环境
FROM nginx:alpine

# 复制构建产物到 nginx 目录
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]
