#!/bin/bash

# OneAnswer 钢铁智能问答系统 - 停止脚本
# 用于停止和清理容器化服务

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
echo -e "${BLUE}  OneAnswer 钢铁智能问答系统 - 停止脚本${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# 显示帮助信息
show_help() {
    echo "用法: $0 [选项]"
    echo ""
    echo "选项:"
    echo "  -h, --help       显示帮助信息"
    echo "  -v, --volumes    同时删除数据卷（谨慎使用）"
    echo "  -i, --images     同时删除 Docker 镜像"
    echo "  -a, --all        停止服务并删除所有相关资源（容器、镜像、卷、网络）"
    echo ""
}

# 停止服务
stop_services() {
    echo -e "${YELLOW}[1/3] 停止服务...${NC}"

    if docker-compose ps &> /dev/null; then
        docker-compose down
        echo -e "${GREEN}✓ 服务已停止${NC}"
    else
        echo -e "${YELLOW}服务未运行或已停止${NC}"
    fi
    echo ""
}

# 删除数据卷（可选）
remove_volumes() {
    echo -e "${YELLOW}[2/3] 删除数据卷...${NC}"

    # 询问确认
    read -p "确定要删除数据卷吗？这将删除所有 SQLite 数据！(y/N): " confirm
    if [[ $confirm =~ ^[Yy]$ ]]; then
        docker-compose down -v
        echo -e "${GREEN}✓ 数据卷已删除${NC}"
    else
        echo -e "${YELLOW}已取消删除数据卷${NC}"
    fi
    echo ""
}

# 删除镜像（可选）
remove_images() {
    echo -e "${YELLOW}[2/3] 删除 Docker 镜像...${NC}"

    # 询问确认
    read -p "确定要删除 Docker 镜像吗？(y/N): " confirm
    if [[ $confirm =~ ^[Yy]$ ]]; then
        docker-compose down --rmi all
        echo -e "${GREEN}✓ Docker 镜像已删除${NC}"
    else
        echo -e "${YELLOW}已取消删除镜像${NC}"
    fi
    echo ""
}

# 删除所有资源
cleanup_all() {
    echo -e "${YELLOW}[2/3] 清理所有资源...${NC}"

    # 询问确认
    read -p "确定要删除所有资源（容器、镜像、卷、网络）吗？(y/N): " confirm
    if [[ $confirm =~ ^[Yy]$ ]]; then
        docker-compose down -v --rmi all --remove-orphans

        # 删除构建缓存
        docker system prune -f

        echo -e "${GREEN}✓ 所有资源已清理${NC}"
    else
        echo -e "${YELLOW}已取消清理操作${NC}"
    fi
    echo ""
}

# 清理未使用的资源
cleanup_unused() {
    echo -e "${YELLOW}[3/3] 清理未使用的 Docker 资源...${NC}"

    # 删除已停止的容器
    docker container prune -f &> /dev/null || true

    # 删除未使用的网络
    docker network prune -f &> /dev/null || true

    # 删除悬空镜像
    docker image prune -f &> /dev/null || true

    echo -e "${GREEN}✓ 未使用的资源已清理${NC}"
    echo ""
}

# 显示最终状态
show_status() {
    echo -e "${BLUE}当前状态:${NC}"

    # 检查是否有运行的容器
    running_containers=$(docker-compose ps -q 2>/dev/null | wc -l)
    if [ "$running_containers" -gt 0 ]; then
        echo -e "${YELLOW}仍有 $running_containers 个容器在运行${NC}"
        docker-compose ps
    else
        echo -e "${GREEN}所有服务已停止${NC}"
    fi
    echo ""

    echo -e "${BLUE}如需重新启动，请运行: ${GREEN}./start.sh${NC}"
    echo ""
}

# 主函数
main() {
    # 解析命令行参数
    case "${1:-}" in
        -h|--help)
            show_help
            exit 0
            ;;
        -v|--volumes)
            stop_services
            remove_volumes
            cleanup_unused
            show_status
            ;;
        -i|--images)
            stop_services
            remove_images
            cleanup_unused
            show_status
            ;;
        -a|--all)
            stop_services
            cleanup_all
            show_status
            ;;
        "")
            stop_services
            cleanup_unused
            show_status
            ;;
        *)
            echo -e "${RED}错误: 未知选项 $1${NC}"
            show_help
            exit 1
            ;;
    esac
}

# 执行主函数
main "$@"
