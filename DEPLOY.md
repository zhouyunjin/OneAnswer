# OneAnswer 钢铁智能问答系统 - 部署指南

## 📋 系统概述

OneAnswer 是一个基于大语言模型的钢铁智能问答系统，采用前后端分离架构：
- **前端**: React + TypeScript + Ant Design
- **后端**: NestJS + TypeScript + SQLite
- **部署**: Docker + Docker Compose

## 🚀 快速开始

### 1. 环境要求

- **操作系统**: Linux (Ubuntu 20.04+ 推荐) / macOS / Windows (WSL2)
- **Docker**: 20.10+
- **Docker Compose**: 2.0+
- **内存**: 建议 2GB+
- **磁盘**: 建议 10GB+

### 2. 获取代码

```bash
# 克隆代码仓库
git clone https://github.com/zhouyunjin/OneAnswer.git
cd OneAnswer
```

### 3. 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件，配置您的 API 密钥
nano .env
```

**必填配置项**:
```env
LLM_API_KEY=your-minimax-api-key-here
```

获取 MiniMax API 密钥: https://www.minimaxi.com/platform

### 4. 启动服务

```bash
# 赋予脚本执行权限
chmod +x start.sh stop.sh

# 启动所有服务
./start.sh
```

启动脚本会自动：
1. 检查 Docker 环境
2. 验证环境变量配置
3. 创建数据目录
4. 构建 Docker 镜像
5. 启动服务容器
6. 等待服务就绪

### 5. 访问系统

服务启动后，可以通过以下地址访问：

- **前端界面**: http://localhost:60001 或 http://<服务器IP>:60001
- **后端 API**: http://localhost:3000/api
- **健康检查**: http://localhost:3000/api/health

## 🛠️ 手动部署

如果不想使用脚本，可以手动执行 Docker Compose 命令：

```bash
# 构建并启动服务
docker-compose up -d --build

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

## 📁 目录结构

```
one-answer-steel-qa-system/
├── backend/                  # 后端服务代码
│   ├── Dockerfile           # 后端 Docker 配置
│   ├── src/
│   └── ...
├── frontend/                # 前端服务代码
│   ├── one-answer-frontend/
│   │   ├── Dockerfile      # 前端 Docker 配置
│   │   ├── nginx.conf      # Nginx 配置
│   │   └── ...
├── data/                    # 数据目录（SQLite 数据库）
├── logs/                    # 日志目录
│   ├── backend/            # 后端日志
│   └── frontend/           # 前端日志
├── docker-compose.yml       # Docker Compose 配置
├── .env.example            # 环境变量模板
├── .env                    # 环境变量（需自行创建）
├── start.sh                # 启动脚本
├── stop.sh                 # 停止脚本
└── DEPLOY.md               # 部署文档
```

## ⚙️ 配置说明

### 环境变量

| 变量名 | 必填 | 默认值 | 说明 |
|--------|------|--------|------|
| `LLM_API_KEY` | ✅ | - | MiniMax API 密钥 |
| `LLM_BASE_URL` | ❌ | https://api.minimaxi.chat/v1 | LLM API 地址 |
| `LLM_MODEL` | ❌ | minimax-text-01 | 模型名称 |
| `NODE_ENV` | ❌ | production | 运行环境 |
| `PORT` | ❌ | 3000 | 后端服务端口 |
| `DB_PATH` | ❌ | /app/data/one-answer.db | 数据库路径 |
| `VITE_API_BASE_URL` | ❌ | http://backend:3000 | 前端 API 地址 |

### 端口映射

| 服务 | 容器端口 | 主机端口 | 说明 |
|------|----------|----------|------|
| 前端 | 80 | 60001 | Web 界面 |
| 后端 | 3000 | 3000 | API 服务 |

## 🔧 常用操作

### 查看日志

```bash
# 查看所有服务日志
docker-compose logs -f

# 查看后端日志
docker-compose logs -f backend

# 查看前端日志
docker-compose logs -f frontend

# 查看最近 100 行日志
docker-compose logs --tail=100
```

### 重启服务

```bash
# 使用脚本重启
./stop.sh && ./start.sh

# 或使用 Docker Compose
docker-compose restart

# 重启单个服务
docker-compose restart backend
```

### 更新代码

```bash
# 拉取最新代码
git pull

# 重新构建并启动
./stop.sh
./start.sh
```

### 数据备份

```bash
# 备份 SQLite 数据库
cp data/one-answer.db data/one-answer.db.backup.$(date +%Y%m%d_%H%M%S)

# 备份日志
tar -czf logs-backup-$(date +%Y%m%d).tar.gz logs/
```

### 数据恢复

```bash
# 停止服务
./stop.sh

# 恢复数据库
cp data/one-answer.db.backup.xxx data/one-answer.db

# 启动服务
./start.sh
```

## 🧹 清理资源

```bash
# 停止服务（保留数据和镜像）
./stop.sh

# 停止服务并删除数据卷
./stop.sh -v

# 停止服务并删除镜像
./stop.sh -i

# 停止服务并删除所有资源（容器、镜像、卷、网络）
./stop.sh -a
```

## 🔒 安全配置

### 生产环境建议

1. **修改默认端口**
   ```env
   # .env
   PORT=3000
   ```
   在 `docker-compose.yml` 中修改端口映射

2. **配置防火墙**
   ```bash
   # 仅开放必要端口
   sudo ufw allow 60001/tcp
   sudo ufw allow 3000/tcp
   sudo ufw enable
   ```

3. **使用 HTTPS**
   - 配置 Nginx 反向代理
   - 使用 Let's Encrypt 证书

4. **限制 CORS**
   ```env
   CORS_ORIGIN=https://your-domain.com
   ```

## 🐛 故障排查

### 服务无法启动

```bash
# 检查 Docker 状态
sudo systemctl status docker

# 检查端口占用
sudo netstat -tlnp | grep -E '80|3000'

# 查看详细错误日志
docker-compose logs
```

### 数据库连接失败

```bash
# 检查数据目录权限
ls -la data/

# 修复权限
sudo chown -R $USER:$USER data/
sudo chmod 755 data/
```

### API 请求失败

```bash
# 测试后端健康检查
curl http://localhost:3000/api/health

# 检查环境变量
cat .env | grep LLM

### 端口无法访问

```bash
# 检查端口是否被占用
sudo netstat -tlnp | grep 60001

# 检查防火墙设置
sudo ufw status

# 检查容器端口映射
docker-compose ps
```

### 容器资源不足

```bash
# 查看容器资源使用
docker stats

# 清理未使用的资源
docker system prune -a
```

## 📊 性能优化

### 调整容器资源限制

编辑 `docker-compose.yml`:

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 512M
```

### 启用 Gzip 压缩

已在 `nginx.conf` 中默认启用。

### 配置缓存

系统已内置查询结果缓存，可通过环境变量调整：

```env
CACHE_TTL=3600
MAX_CACHE_SIZE=1000
```

## 📝 更新日志

### v1.0.0 (2025-03-11)
- ✅ 初始版本发布
- ✅ Docker 容器化部署
- ✅ 前后端分离架构
- ✅ SQLite 数据持久化
- ✅ MiniMax LLM 集成
- ✅ 自动化部署脚本

## 🤝 技术支持

如有问题，请通过以下方式联系：

- **GitHub Issues**: https://github.com/zhouyunjin/OneAnswer/issues
- **邮箱**: your-email@example.com

## 📄 许可证

MIT License

---

**注意**: 部署前请确保已正确配置 LLM API 密钥，否则系统无法正常回答用户问题。
