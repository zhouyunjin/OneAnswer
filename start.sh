#!/bin/bash

# OneAnswer 钢铁智能问答系统 - 启动脚本
# 用于在云服务器上快速部署和启动服务

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 脚本目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  OneAnswer 钢铁智能问答系统 - 启动脚本${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# 检查 Docker 和 Docker Compose 是否安装
check_docker() {
    echo -e "${YELLOW}[1/6] 检查 Docker 环境...${NC}"

    if ! command -v docker &> /dev/null; then
        echo -e "${RED}错误: Docker 未安装${NC}"
        echo "请先安装 Docker: https://docs.docker.com/get-docker/"
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null; then
        echo -e "${RED}错误: Docker Compose 未安装${NC}"
        echo "请先安装 Docker Compose: https://docs.docker.com/compose/install/"
        exit 1
    fi

    # 检查 Docker 服务是否运行
    if ! docker info &> /dev/null; then
        echo -e "${RED}错误: Docker 服务未运行${NC}"
        echo "请启动 Docker 服务: sudo systemctl start docker"
        exit 1
    fi

    echo -e "${GREEN}✓ Docker 环境检查通过${NC}"
    echo ""
}

# 检查环境变量文件
check_env() {
    echo -e "${YELLOW}[2/6] 检查环境变量配置...${NC}"

    if [ ! -f ".env" ]; then
        if [ -f ".env.example" ]; then
            echo -e "${YELLOW}警告: 未找到 .env 文件，正在从 .env.example 创建...${NC}"
            cp .env.example .env
            echo -e "${YELLOW}请编辑 .env 文件，配置您的 LLM API 密钥和其他设置${NC}"
            echo -e "${YELLOW}配置文件路径: $SCRIPT_DIR/.env${NC}"
            exit 1
        else
            echo -e "${RED}错误: 未找到 .env 或 .env.example 文件${NC}"
            exit 1
        fi
    fi

    # 检查关键环境变量
    if ! grep -q "LLM_API_KEY=" .env || grep -q "LLM_API_KEY=$" .env || grep -q "LLM_API_KEY=your-" .env; then
        echo -e "${RED}错误: LLM_API_KEY 未配置${NC}"
        echo -e "${YELLOW}请编辑 .env 文件，设置您的 MiniMax API 密钥${NC}"
        exit 1
    fi

    echo -e "${GREEN}✓ 环境变量配置检查通过${NC}"
    echo ""
}

# 创建必要的目录
setup_directories() {
    echo -e "${YELLOW}[3/6] 创建数据目录...${NC}"

    mkdir -p data
    mkdir -p logs/backend
    mkdir -p logs/frontend

    # 设置目录权限
    chmod 755 data
    chmod 755 logs
    chmod 755 logs/backend
    chmod 755 logs/frontend

    echo -e "${GREEN}✓ 数据目录创建完成${NC}"
    echo ""
}

# 构建和启动服务
start_services() {
    echo -e "${YELLOW}[4/6] 构建 Docker 镜像...${NC}"

    # 拉取最新镜像
    docker-compose pull

    # 构建镜像
    docker-compose build --no-cache

    echo -e "${GREEN}✓ Docker 镜像构建完成${NC}"
    echo ""

    echo -e "${YELLOW}[5/6] 启动服务...${NC}"

    # 停止现有服务（如果存在）
    docker-compose down --remove-orphans 2>/dev/null || true

    # 启动服务
    docker-compose up -d

    echo -e "${GREEN}✓ 服务启动命令已执行${NC}"
    echo ""
}

# 等待服务就绪
wait_for_services() {
    echo -e "${YELLOW}[6/6] 等待服务就绪...${NC}"

    echo "正在检查后端服务健康状态..."
    for i in {1..30}; do
        if curl -sf http://localhost:3000/api/health &> /dev/null; then
            echo -e "${GREEN}✓ 后端服务已就绪${NC}"
            break
        fi
        echo -n "."
        sleep 2
    done

    echo ""
    echo "正在检查前端服务健康状态..."
    for i in {1..30}; do
        if curl -sf http://localhost:60001 &> /dev/null; then
            echo -e "${GREEN}✓ 前端服务已就绪${NC}"
            break
        fi
        echo -n "."
        sleep 2
    done

    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}  所有服务已成功启动！${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
}

# 显示服务状态
show_status() {
    echo -e "${BLUE}服务状态:${NC}"
    docker-compose ps
    echo ""

    echo -e "${BLUE}访问地址:${NC}"
    echo -e "  前端界面: ${GREEN}http://localhost${NC} 或 ${GREEN}http://<服务器IP>${NC}"
    echo -e "  后端 API: ${GREEN}http://localhost:3000/api${NC}"
    echo -e "  健康检查: ${GREEN}http://localhost:3000/api/health${NC}"
    echo ""

    echo -e "${BLUE}常用命令:${NC}"
    echo -e "  查看日志: ${YELLOW}docker-compose logs -f${NC}"
    echo -e "  查看后端日志: ${YELLOW}docker-compose logs -f backend${NC}"
    echo -e "  查看前端日志: ${YELLOW}docker-compose logs -f frontend${NC}"
    echo -e "  停止服务: ${YELLOW}./stop.sh${NC}"
    echo -e "  重启服务: ${YELLOW}./stop.sh && ./start.sh${NC}"
    echo ""

    echo -e "${BLUE}数据存储:${NC}"
    echo -e "  SQLite 数据库: ${YELLOW}$SCRIPT_DIR/data/one-answer.db${NC}"
    echo -e "  后端日志: ${YELLOW}$SCRIPT_DIR/logs/backend/${NC}"
    echo -e "  前端日志: ${YELLOW}$SCRIPT_DIR/logs/frontend/${NC}"
    echo ""
}

# 主函数
main() {
    check_docker
    check_env
    setup_directories
    start_services
    wait_for_services
    show_status
}

# 执行主函数
main
