# OneAnswer 炼钢行业智能问答系统 - 部署文档

## 系统概述

OneAnswer 是一个基于 NestJS 和 React 的炼钢行业智能问答系统，集成了大模型语义识别、数据查询和结构化输出功能。

## 系统要求

- Docker 20.10+
- Docker Compose 1.29+
- 至少 2GB 可用内存
- 至少 5GB 可用磁盘空间

## 快速开始

### 1. 克隆项目

```bash
git clone <repository-url>
cd one-answer-steel-qa-system
```

### 2. 使用 Docker Compose 部署

```bash
docker-compose up -d
```

这将启动以下服务：
- **后端服务**：运行在 http://localhost:3000
- **前端服务**：运行在 http://localhost

### 3. 访问系统

打开浏览器访问 http://localhost 即可使用系统。

## 手动部署

### 后端部署

#### 1. 安装依赖

```bash
cd backend
npm install
```

#### 2. 配置环境变量

创建 `.env` 文件：

```env
NODE_ENV=production
PORT=3000
```

#### 3. 构建项目

```bash
npm run build
```

#### 4. 启动服务

```bash
npm start
```

### 前端部署

#### 1. 安装依赖

```bash
cd frontend/one-answer-frontend
npm install
```

#### 2. 构建项目

```bash
npm run build
```

#### 3. 部署到 Web 服务器

将 `dist` 目录中的文件部署到 Nginx、Apache 或其他 Web 服务器。

## 配置说明

### 后端配置

后端配置文件位于 `backend/src/core/config/config.service.ts`，支持 YAML 格式的配置文件。

主要配置项：
- **服务器端口**：默认 3000
- **数据库**：SQLite，文件路径为 `database.sqlite`
- **日志级别**：info、debug、error
- **CORS**：允许所有来源（生产环境建议限制）

### 前端配置

前端 API 地址配置位于 `frontend/one-answer-frontend/src/utils/api.ts`。

默认配置：
- **API 基础 URL**：http://localhost:3000

## 数据库

系统使用 SQLite 作为数据库，数据文件位于 `backend/database.sqlite`。

### 数据库初始化

首次启动时，TypeORM 会自动创建数据库表结构。

### 数据备份

定期备份 `database.sqlite` 文件：

```bash
cp backend/database.sqlite backup/database-$(date +%Y%m%d).sqlite
```

## 监控和日志

### 日志位置

- **后端日志**：控制台输出（可配置输出到文件）
- **前端日志**：浏览器控制台

### 健康检查

后端提供健康检查接口：

```bash
curl http://localhost:3000/api/health
```

## 故障排除

### 后端无法启动

1. 检查端口 3000 是否被占用
2. 检查数据库文件权限
3. 查看日志输出

### 前端无法访问

1. 检查后端服务是否正常运行
2. 检查 API 地址配置
3. 检查浏览器控制台错误

### Docker 部署失败

1. 检查 Docker 和 Docker Compose 版本
2. 检查磁盘空间
3. 查看容器日志：

```bash
docker-compose logs backend
docker-compose logs frontend
```

## 性能优化

### 后端优化

1. **启用缓存**：查询结果已实现 5 分钟缓存
2. **数据库索引**：根据查询需求添加索引
3. **连接池**：配置数据库连接池大小

### 前端优化

1. **代码分割**：使用 React.lazy 和 Suspense
2. **资源压缩**：启用 gzip 压缩
3. **CDN 加速**：静态资源使用 CDN

## 安全建议

1. **API 认证**：生产环境添加 JWT 或 OAuth 认证
2. **HTTPS**：使用 SSL 证书加密通信
3. **输入验证**：所有用户输入都经过验证
4. **SQL 注入防护**：使用参数化查询
5. **CORS 限制**：限制允许的来源

## 更新和维护

### 更新代码

```bash
git pull origin main
docker-compose down
docker-compose up -d --build
```

### 清理旧镜像

```bash
docker image prune -a
```

## 联系支持

如有问题，请联系技术支持团队。
