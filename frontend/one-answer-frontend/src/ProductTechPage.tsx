import { useState, useEffect, useRef } from 'react'
import { Typography, Button, Space, Tag, Progress, Row, Col } from 'antd'
import { 
  RocketOutlined, 
  SafetyOutlined, 
  ThunderboltOutlined, 
  RobotOutlined,
  DatabaseOutlined,
  CloudOutlined,
  BarChartOutlined,
  SettingOutlined,
  ExperimentOutlined,
  InboxOutlined,
  FireOutlined,
  AlertOutlined,
  DashboardOutlined,
  FileExcelOutlined,
  DownloadOutlined,
  EyeOutlined,
  PrinterOutlined,
  CheckCircleOutlined,
  ApiOutlined,
  RightOutlined
} from '@ant-design/icons'
import './ProductTechPage.css'

const { Title, Paragraph, Text } = Typography

interface ProductTechPageProps {
  onTryNow?: () => void
}

function ProductTechPage({ onTryNow }: ProductTechPageProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollTop = containerRef.current.scrollTop
        const slideHeight = window.innerHeight
        const newSlide = Math.round(scrollTop / slideHeight)
        if (newSlide !== currentSlide && newSlide >= 0 && newSlide < 6) {
          setCurrentSlide(newSlide)
        }
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [currentSlide])

  const scrollToSlide = (index: number) => {
    if (containerRef.current) {
      const slideHeight = window.innerHeight
      containerRef.current.scrollTo({
        top: slideHeight * index,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="tech-page" ref={containerRef}>
      {/* Hero Section */}
      <div className="tech-slide">
        <div className="tech-slide-inner">
          <div className="tech-hero">
            <div className="tech-hero-content">
              <div className="tech-hero-text">
                <div className="tech-hero-label">INTELLIGENT Q&A SYSTEM</div>
                <Title level={1} className="tech-hero-title">
                  OneAnswer
                </Title>
                <div className="tech-hero-subtitle">
                  基于大语言模型的炼钢行业智能问答平台
                </div>
                <div className="tech-hero-description">
                  用自然语言查询生产数据，让数据触手可及
                </div>
                <div className="tech-hero-actions">
                  <Button 
                    type="primary" 
                    size="large" 
                    className="tech-hero-button primary"
                    onClick={() => scrollToSlide(1)}
                  >
                    了解更多
                    <RightOutlined />
                  </Button>
                  <Button 
                    size="large" 
                    className="tech-hero-button secondary"
                    onClick={() => onTryNow && onTryNow()}
                  >
                    立即体验
                  </Button>
                </div>
              </div>
              <div className="tech-hero-visual">
                <div className="tech-hero-device">
                  <div className="tech-device-screen">
                    <div className="tech-screen-header">
                      <div className="tech-screen-dot"></div>
                      <div className="tech-screen-dot"></div>
                      <div className="tech-screen-dot"></div>
                    </div>
                    <div className="tech-screen-content">
                      <div className="tech-chat-bubble user">
                        <span>查询今天转炉的冶炼状态</span>
                      </div>
                      <div className="tech-chat-bubble assistant">
                        <div className="tech-typing-indicator">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="tech-slide">
        <div className="tech-slide-inner">
          <div className="tech-section-header">
            <div className="tech-section-label">CORE FEATURES</div>
            <Title level={2} className="tech-section-title">
              强大功能，一应俱全
            </Title>
            <div className="tech-section-subtitle">
              满足炼钢行业各类数据查询需求
            </div>
          </div>
          <Row gutter={[24, 24]} className="tech-features-grid">
            <Col xs={24} sm={12} lg={8}>
              <div className="tech-feature-card">
                <div className="tech-feature-icon">
                  <DashboardOutlined />
                </div>
                <Title level={4}>生产状态</Title>
                <Paragraph>实时查询转炉、连铸等设备的生产状态</Paragraph>
              </div>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <div className="tech-feature-card">
                <div className="tech-feature-icon">
                  <BarChartOutlined />
                </div>
                <Title level={4}>质量分析</Title>
                <Paragraph>分析钢水成分、温度等质量数据</Paragraph>
              </div>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <div className="tech-feature-card">
                <div className="tech-feature-icon">
                  <SettingOutlined />
                </div>
                <Title level={4}>设备监控</Title>
                <Paragraph>监控设备运行状态、故障预警</Paragraph>
              </div>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <div className="tech-feature-card">
                <div className="tech-feature-icon">
                  <InboxOutlined />
                </div>
                <Title level={4}>物料管理</Title>
                <Paragraph>查询物料库存、消耗情况</Paragraph>
              </div>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <div className="tech-feature-card">
                <div className="tech-feature-icon">
                  <FireOutlined />
                </div>
                <Title level={4}>能耗统计</Title>
                <Paragraph>统计氧气、电力等能源消耗</Paragraph>
              </div>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <div className="tech-feature-card">
                <div className="tech-feature-icon">
                  <AlertOutlined />
                </div>
                <Title level={4}>异常报警</Title>
                <Paragraph>实时接收设备异常报警信息</Paragraph>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {/* Architecture Section */}
      <div className="tech-slide">
        <div className="tech-slide-inner">
          <div className="tech-section-header">
            <div className="tech-section-label">ARCHITECTURE</div>
            <Title level={2} className="tech-section-title">
              先进架构，稳定可靠
            </Title>
            <div className="tech-section-subtitle">
              基于现代技术栈构建的智能问答系统
            </div>
          </div>
          <div className="tech-architecture-diagram">
            <div className="tech-arch-layer">
              <div className="tech-arch-layer-content">
                <div className="tech-arch-icon"><RobotOutlined /></div>
                <div className="tech-arch-info">
                  <div className="tech-arch-title">前端交互层</div>
                  <div className="tech-arch-desc">React + TypeScript + Ant Design</div>
                </div>
              </div>
            </div>
            <div className="tech-arch-connector"></div>
            <div className="tech-arch-layer">
              <div className="tech-arch-layer-content">
                <div className="tech-arch-icon"><ApiOutlined /></div>
                <div className="tech-arch-info">
                  <div className="tech-arch-title">语义理解层</div>
                  <div className="tech-arch-desc">意图识别 + 参数提取 + LLM集成</div>
                </div>
              </div>
            </div>
            <div className="tech-arch-connector"></div>
            <div className="tech-arch-layer">
              <div className="tech-arch-layer-content">
                <div className="tech-arch-icon"><BarChartOutlined /></div>
                <div className="tech-arch-info">
                  <div className="tech-arch-title">业务服务层</div>
                  <div className="tech-arch-desc">查询服务 + 数据服务 + 输出格式化</div>
                </div>
              </div>
            </div>
            <div className="tech-arch-connector"></div>
            <div className="tech-arch-layer">
              <div className="tech-arch-layer-content">
                <div className="tech-arch-icon"><DatabaseOutlined /></div>
                <div className="tech-arch-info">
                  <div className="tech-arch-title">数据访问层</div>
                  <div className="tech-arch-desc">数据库访问 + 缓存管理 + 数据验证</div>
                </div>
              </div>
            </div>
            <div className="tech-arch-connector"></div>
            <div className="tech-arch-layer">
              <div className="tech-arch-layer-content">
                <div className="tech-arch-icon"><CloudOutlined /></div>
                <div className="tech-arch-info">
                  <div className="tech-arch-title">数据源层</div>
                  <div className="tech-arch-desc">生产数据库 + 模拟数据 + 外部接口</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Characteristics Section */}
      <div className="tech-slide">
        <div className="tech-slide-inner">
          <div className="tech-section-header">
            <div className="tech-section-label">FEATURES</div>
            <Title level={2} className="tech-section-title">
              智能高效，安全可靠
            </Title>
            <div className="tech-section-subtitle">
              为炼钢行业量身打造的智能问答系统
            </div>
          </div>
          <Row gutter={[48, 48]} className="tech-characteristics-grid">
            <Col xs={24} sm={12}>
              <div className="tech-characteristic-card">
                <div className="tech-characteristic-header">
                  <div className="tech-characteristic-icon">
                    <RobotOutlined />
                  </div>
                  <div className="tech-characteristic-stat">
                    <span className="tech-stat-value">95%</span>
                    <span className="tech-stat-label">准确率</span>
                  </div>
                </div>
                <Title level={3}>智能语义识别</Title>
                <Paragraph>
                  基于大语言模型的语义理解，准确识别用户意图，支持复杂查询
                </Paragraph>
              </div>
            </Col>
            <Col xs={24} sm={12}>
              <div className="tech-characteristic-card">
                <div className="tech-characteristic-header">
                  <div className="tech-characteristic-icon">
                    <ThunderboltOutlined />
                  </div>
                  <div className="tech-characteristic-stat">
                    <span className="tech-stat-value">2s</span>
                    <span className="tech-stat-label">响应</span>
                  </div>
                </div>
                <Title level={3}>快速响应</Title>
                <Paragraph>
                  优化的查询引擎和缓存机制，确保快速响应用户查询
                </Paragraph>
              </div>
            </Col>
            <Col xs={24} sm={12}>
              <div className="tech-characteristic-card">
                <div className="tech-characteristic-header">
                  <div className="tech-characteristic-icon">
                    <BarChartOutlined />
                  </div>
                  <div className="tech-characteristic-stat">
                    <span className="tech-stat-value">多格式</span>
                    <span className="tech-stat-label">输出</span>
                  </div>
                </div>
                <Title level={3}>结构化输出</Title>
                <Paragraph>
                  支持文本、表格、图表等多种输出格式，直观展示查询结果
                </Paragraph>
              </div>
            </Col>
            <Col xs={24} sm={12}>
              <div className="tech-characteristic-card">
                <div className="tech-characteristic-header">
                  <div className="tech-characteristic-icon">
                    <SafetyOutlined />
                  </div>
                  <div className="tech-characteristic-stat">
                    <span className="tech-stat-value">99.9%</span>
                    <span className="tech-stat-label">可用</span>
                  </div>
                </div>
                <Title level={3}>安全可靠</Title>
                <Paragraph>
                  完善的权限管理和数据加密机制，确保数据安全
                </Paragraph>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {/* CTA Section */}
      <div className="tech-slide">
        <div className="tech-slide-inner">
          <div className="tech-cta-section">
            <Title level={1} className="tech-cta-title">
              立即体验 OneAnswer
            </Title>
            <div className="tech-cta-subtitle">
              开启炼钢行业智能问答新时代
            </div>
            <Button 
              type="primary" 
              size="large" 
              className="tech-cta-button"
              onClick={() => onTryNow && onTryNow()}
            >
              立即体验
              <RightOutlined />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductTechPage
