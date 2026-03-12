import { useState, useEffect, useRef } from 'react'
import { Typography, Button, Progress, Row, Col } from 'antd'
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
  FileExcelOutlined,
  EyeOutlined,
  PrinterOutlined,
  CheckCircleOutlined,
  ApiOutlined,
  RightOutlined
} from '@ant-design/icons'
import './DocsPage.css'

type DocsPageProps = {
  onTryNow?: () => void
}

const { Title, Paragraph } = Typography

interface Slide {
  id: string
  title: string
  subtitle: string
  content: React.ReactNode
}

function DocsPage({ onTryNow }: DocsPageProps) {
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

  const slides: Slide[] = [
    {
      id: '1',
      title: 'OneAnswer',
      subtitle: '炼钢行业智能问答系统',
      content: (
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-label">Intelligent Q&A System</div>
            <Title level={1} className="hero-title">
              OneAnswer
            </Title>
            <div className="hero-subtitle">
              基于大语言模型的炼钢行业智能问答平台
            </div>
            <div className="hero-description">
              用自然语言查询生产数据，让数据触手可及
            </div>
            <div className="hero-actions">
              <Button 
                type="primary" 
                size="large" 
                className="hero-button primary"
                onClick={() => scrollToSlide(1)}
              >
                了解更多
                <RightOutlined />
              </Button>
              <Button 
                size="large" 
                className="hero-button secondary"
                onClick={() => onTryNow && onTryNow()}
              >
                立即体验
              </Button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-device">
              <div className="device-screen">
                <div className="screen-header">
                  <div className="screen-dot"></div>
                  <div className="screen-dot"></div>
                  <div className="screen-dot"></div>
                </div>
                <div className="screen-content">
                  <div className="chat-bubble user">
                    <span>查询今天转炉的冶炼状态</span>
                  </div>
                  <div className="chat-bubble assistant">
                    <div className="typing-indicator">
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
      )
    },
    {
      id: '2',
      title: '核心功能',
      subtitle: '覆盖炼钢生产全流程',
      content: (
        <div className="section-content">
          <div className="section-header">
            <div className="section-label">Core Features</div>
            <Title level={2} className="section-title">
              核心功能
            </Title>
            <div className="section-subtitle">
              覆盖炼钢生产全流程的智能查询能力
            </div>
          </div>
          <Row gutter={[24, 24]} className="features-grid">
            <Col xs={24} sm={12} lg={8}>
              <div className="feature-card">
                <div className="feature-icon">
                  <FireOutlined />
                </div>
                <Title level={4}>生产状态</Title>
                <Paragraph>
                  实时查询转炉、LF炉、连铸机运行状态
                </Paragraph>
              </div>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <div className="feature-card">
                <div className="feature-icon">
                  <ExperimentOutlined />
                </div>
                <Title level={4}>质量分析</Title>
                <Paragraph>
                  查询钢水成分、合格率等质量指标
                </Paragraph>
              </div>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <div className="feature-card">
                <div className="feature-icon">
                  <SettingOutlined />
                </div>
                <Title level={4}>设备监控</Title>
                <Paragraph>
                  查询设备状态、检修记录和故障信息
                </Paragraph>
              </div>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <div className="feature-card">
                <div className="feature-icon">
                  <InboxOutlined />
                </div>
                <Title level={4}>物料管理</Title>
                <Paragraph>
                  查询合金、辅料库存和消耗情况
                </Paragraph>
              </div>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <div className="feature-card">
                <div className="feature-icon">
                  <ThunderboltOutlined />
                </div>
                <Title level={4}>能耗统计</Title>
                <Paragraph>
                  查询电耗、气耗、水耗等能耗数据
                </Paragraph>
              </div>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <div className="feature-card">
                <div className="feature-icon">
                  <AlertOutlined />
                </div>
                <Title level={4}>异常报警</Title>
                <Paragraph>
                  查询设备故障、温度超限等报警
                </Paragraph>
              </div>
            </Col>
          </Row>
        </div>
      )
    },
    {
      id: '3',
      title: '技术架构',
      subtitle: '现代化系统设计',
      content: (
        <div className="section-content">
          <div className="section-header">
            <div className="section-label">Architecture</div>
            <Title level={2} className="section-title">
              技术架构
            </Title>
            <div className="section-subtitle">
              五层架构设计，模块解耦，易于扩展
            </div>
          </div>
          <div className="architecture-diagram">
            <div className="arch-layer">
              <div className="arch-layer-content">
                <div className="arch-icon"><RobotOutlined /></div>
                <div className="arch-info">
                  <div className="arch-title">前端交互层</div>
                  <div className="arch-desc">React + TypeScript + Ant Design</div>
                </div>
              </div>
            </div>
            <div className="arch-connector"></div>
            <div className="arch-layer">
              <div className="arch-layer-content">
                <div className="arch-icon"><ApiOutlined /></div>
                <div className="arch-info">
                  <div className="arch-title">语义理解层</div>
                  <div className="arch-desc">意图识别 + 参数提取 + LLM集成</div>
                </div>
              </div>
            </div>
            <div className="arch-connector"></div>
            <div className="arch-layer">
              <div className="arch-layer-content">
                <div className="arch-icon"><BarChartOutlined /></div>
                <div className="arch-info">
                  <div className="arch-title">业务服务层</div>
                  <div className="arch-desc">查询服务 + 数据服务 + 输出格式化</div>
                </div>
              </div>
            </div>
            <div className="arch-connector"></div>
            <div className="arch-layer">
              <div className="arch-layer-content">
                <div className="arch-icon"><DatabaseOutlined /></div>
                <div className="arch-info">
                  <div className="arch-title">数据访问层</div>
                  <div className="arch-desc">数据库访问 + 缓存管理 + 数据验证</div>
                </div>
              </div>
            </div>
            <div className="arch-connector"></div>
            <div className="arch-layer">
              <div className="arch-layer-content">
                <div className="arch-icon"><CloudOutlined /></div>
                <div className="arch-info">
                  <div className="arch-title">数据源层</div>
                  <div className="arch-desc">生产数据库 + 模拟数据 + 外部接口</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: '4',
      title: '系统特性',
      subtitle: '卓越的用户体验',
      content: (
        <div className="section-content">
          <div className="section-header">
            <div className="section-label">Features</div>
            <Title level={2} className="section-title">
              系统特性
            </Title>
            <div className="section-subtitle">
              丰富的功能和优秀的用户体验
            </div>
          </div>
          <Row gutter={[48, 48]} className="characteristics-grid">
            <Col xs={24} lg={12}>
              <div className="characteristic-card">
                <div className="characteristic-header">
                  <div className="characteristic-icon">
                    <RobotOutlined />
                  </div>
                  <div className="characteristic-stat">
                    <span className="stat-value">95%</span>
                    <span className="stat-label">准确率</span>
                  </div>
                </div>
                <Title level={3}>智能语义识别</Title>
                <Paragraph>
                  支持自然语言查询，理解多种表述方式，准确识别查询意图和参数
                </Paragraph>
                <Progress percent={95} strokeColor="#1d1d1f" showInfo={false} />
              </div>
            </Col>
            <Col xs={24} lg={12}>
              <div className="characteristic-card">
                <div className="characteristic-header">
                  <div className="characteristic-icon">
                    <ThunderboltOutlined />
                  </div>
                  <div className="characteristic-stat">
                    <span className="stat-value">2s</span>
                    <span className="stat-label">响应</span>
                  </div>
                </div>
                <Title level={3}>快速响应</Title>
                <Paragraph>
                  平均响应时间小于2秒，支持并发查询，确保用户体验流畅
                </Paragraph>
                <Progress percent={98} strokeColor="#1d1d1f" showInfo={false} />
              </div>
            </Col>
            <Col xs={24} lg={12}>
              <div className="characteristic-card">
                <div className="characteristic-header">
                  <div className="characteristic-icon">
                    <BarChartOutlined />
                  </div>
                  <div className="characteristic-stat">
                    <span className="stat-value">92%</span>
                    <span className="stat-label">满意度</span>
                  </div>
                </div>
                <Title level={3}>结构化输出</Title>
                <Paragraph>
                  提供表格、图表、文本等多种输出格式，支持数据导出和打印
                </Paragraph>
                <Progress percent={92} strokeColor="#1d1d1f" showInfo={false} />
              </div>
            </Col>
            <Col xs={24} lg={12}>
              <div className="characteristic-card">
                <div className="characteristic-header">
                  <div className="characteristic-icon">
                    <SafetyOutlined />
                  </div>
                  <div className="characteristic-stat">
                    <span className="stat-value">100%</span>
                    <span className="stat-label">安全</span>
                  </div>
                </div>
                <Title level={3}>安全可靠</Title>
                <Paragraph>
                  本地部署，数据不出厂，完善的权限管理和审计日志
                </Paragraph>
                <Progress percent={100} strokeColor="#1d1d1f" showInfo={false} />
              </div>
            </Col>
          </Row>
        </div>
      )
    },
    {
      id: '5',
      title: '报表生成',
      subtitle: '强大的数据导出能力',
      content: (
        <div className="section-content">
          <div className="section-header">
            <div className="section-label">Reports</div>
            <Title level={2} className="section-title">
              报表生成
            </Title>
            <div className="section-subtitle">
              一键生成、预览和导出各类生产报表
            </div>
          </div>
          <div className="report-showcase">
            <div className="report-preview">
              <div className="report-window">
                <div className="window-header">
                  <div className="window-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <div className="window-title">生产日报表.xlsx</div>
                </div>
                <div className="window-content">
                  <div className="report-table">
                    <div className="table-header">
                      <span>炉次</span>
                      <span>钢种</span>
                      <span>温度</span>
                      <span>状态</span>
                    </div>
                    <div className="table-row">
                      <span>230001</span>
                      <span>Q235B</span>
                      <span>1562°C</span>
                      <span className="status-success">合格</span>
                    </div>
                    <div className="table-row">
                      <span>230002</span>
                      <span>Q345B</span>
                      <span>1558°C</span>
                      <span className="status-success">合格</span>
                    </div>
                    <div className="table-row">
                      <span>230003</span>
                      <span>45#</span>
                      <span>1571°C</span>
                      <span className="status-warning">待检</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="report-features">
              <div className="report-feature-item">
                <div className="report-feature-icon">
                  <FileExcelOutlined />
                </div>
                <div className="report-feature-content">
                  <Title level={4}>多格式导出</Title>
                  <Paragraph>支持Excel、PDF等多种格式</Paragraph>
                </div>
              </div>
              <div className="report-feature-item">
                <div className="report-feature-icon">
                  <EyeOutlined />
                </div>
                <div className="report-feature-content">
                  <Title level={4}>实时预览</Title>
                  <Paragraph>生成前可预览数据内容</Paragraph>
                </div>
              </div>
              <div className="report-feature-item">
                <div className="report-feature-icon">
                  <PrinterOutlined />
                </div>
                <div className="report-feature-content">
                  <Title level={4}>一键打印</Title>
                  <Paragraph>支持直接打印输出</Paragraph>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: '6',
      title: '开始使用',
      subtitle: '立即体验智能问答',
      content: (
        <div className="cta-content">
          <div className="cta-inner">
            <div className="section-label">Get Started</div>
            <Title level={1} className="cta-title">
              开始使用 OneAnswer
            </Title>
            <div className="cta-subtitle">
              让炼钢生产数据查询变得简单高效
            </div>
            <div className="cta-features">
              <div className="cta-feature">
                <CheckCircleOutlined className="cta-check" />
                <span>自然语言查询</span>
              </div>
              <div className="cta-feature">
                <CheckCircleOutlined className="cta-check" />
                <span>实时数据响应</span>
              </div>
              <div className="cta-feature">
                <CheckCircleOutlined className="cta-check" />
                <span>多种输出格式</span>
              </div>
              <div className="cta-feature">
                <CheckCircleOutlined className="cta-check" />
                <span>本地安全部署</span>
              </div>
            </div>
            <Button 
              type="primary" 
              size="large" 
              className="cta-button"
              icon={<RocketOutlined />}
            >
              立即体验
            </Button>
          </div>
        </div>
      )
    }
  ]

  return (
    <div className="docs-page-minimal" ref={containerRef}>
      {slides.map((slide) => (
        <div 
          key={slide.id} 
          className="slide-section"
        >
          <div className="slide-inner">
            {slide.content}
          </div>
        </div>
      ))}
      
      <div className="slide-indicators">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => scrollToSlide(index)}
          />
        ))}
      </div>

      <div className="slide-nav">
        <div className="slide-counter">
          <span className="current">{String(currentSlide + 1).padStart(2, '0')}</span>
          <span className="separator">/</span>
          <span className="total">{String(slides.length).padStart(2, '0')}</span>
        </div>
      </div>
    </div>
  )
}

export default DocsPage
