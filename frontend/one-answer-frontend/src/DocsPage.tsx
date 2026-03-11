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
  ApiOutlined
} from '@ant-design/icons'
import './DocsPage.css'

const { Title, Paragraph, Text } = Typography

interface Slide {
  id: string
  title: string
  subtitle: string
  content: React.ReactNode
  bgGradient: string
}

function DocsPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [scrollY, setScrollY] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollTop = containerRef.current.scrollTop
        const slideHeight = window.innerHeight
        const newSlide = Math.floor(scrollTop / slideHeight)
        if (newSlide !== currentSlide && newSlide >= 0 && newSlide < slides.length) {
          setCurrentSlide(newSlide)
        }
        setScrollY(scrollTop)
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
      bgGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      content: (
        <div className="hero-content">
          <div className="hero-text">
            <Title level={1} className="hero-title">
              OneAnswer
            </Title>
            <div className="hero-subtitle">
              基于大语言模型的智能问答平台
            </div>
            <div className="hero-description">
              为炼钢行业提供自然语言数据查询服务
            </div>
            <Button 
              type="primary" 
              size="large" 
              className="hero-button"
              onClick={() => scrollToSlide(1)}
            >
              了解更多
            </Button>
          </div>
          <div className="hero-visual">
            <div className="floating-card card-1">
              <RobotOutlined className="card-icon" />
              <div className="card-text">智能问答</div>
            </div>
            <div className="floating-card card-2">
              <DatabaseOutlined className="card-icon" />
              <div className="card-text">数据查询</div>
            </div>
            <div className="floating-card card-3">
              <BarChartOutlined className="card-icon" />
              <div className="card-text">数据分析</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: '2',
      title: '核心功能',
      subtitle: '强大的查询能力',
      bgGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      content: (
        <div className="features-content">
          <div className="features-header">
            <Title level={2} className="section-title">
              核心功能
            </Title>
            <div className="section-subtitle">
              覆盖炼钢生产全流程的智能查询
            </div>
          </div>
          <Row gutter={[32, 32]} className="features-grid">
            <Col span={8}>
              <div className="feature-item">
                <div className="feature-icon-wrapper">
                  <FireOutlined className="feature-icon" />
                </div>
                <Title level={4}>生产状态查询</Title>
                <Paragraph>
                  实时查询转炉、LF炉、连铸机等设备的运行状态和生产进度
                </Paragraph>
              </div>
            </Col>
            <Col span={8}>
              <div className="feature-item">
                <div className="feature-icon-wrapper">
                  <ExperimentOutlined className="feature-icon" />
                </div>
                <Title level={4}>质量数据分析</Title>
                <Paragraph>
                  查询铁水、钢水的成分分析数据，监控产品质量指标
                </Paragraph>
              </div>
            </Col>
            <Col span={8}>
              <div className="feature-item">
                <div className="feature-icon-wrapper">
                  <SettingOutlined className="feature-icon" />
                </div>
                <Title level={4}>设备状态监控</Title>
                <Paragraph>
                  查询设备运行状态、检修记录，及时发现设备故障
                </Paragraph>
              </div>
            </Col>
            <Col span={8}>
              <div className="feature-item">
                <div className="feature-icon-wrapper">
                  <InboxOutlined className="feature-icon" />
                </div>
                <Title level={4}>物料库存管理</Title>
                <Paragraph>
                  查询合金、辅料等物料的库存量和消耗情况
                </Paragraph>
              </div>
            </Col>
            <Col span={8}>
              <div className="feature-item">
                <div className="feature-icon-wrapper">
                  <ThunderboltOutlined className="feature-icon" />
                </div>
                <Title level={4}>能耗统计分析</Title>
                <Paragraph>
                  查询各工序的电耗、气耗、水耗等能耗数据
                </Paragraph>
              </div>
            </Col>
            <Col span={8}>
              <div className="feature-item">
                <div className="feature-icon-wrapper">
                  <AlertOutlined className="feature-icon" />
                </div>
                <Title level={4}>异常报警查询</Title>
                <Paragraph>
                  查询设备故障、温度超限、成分异常等报警信息
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
      subtitle: '现代化的系统设计',
      bgGradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      content: (
        <div className="architecture-content">
          <div className="architecture-header">
            <Title level={2} className="section-title">
              技术架构
            </Title>
            <div className="section-subtitle">
              五层架构设计，模块解耦，易于扩展
            </div>
          </div>
          <div className="architecture-layers">
            <div className="layer layer-1">
              <div className="layer-icon"><RobotOutlined /></div>
              <div className="layer-content">
                <div className="layer-title">前端交互层</div>
                <div className="layer-desc">React + TypeScript + Ant Design</div>
              </div>
            </div>
            <div className="layer layer-2">
              <div className="layer-icon"><RobotOutlined /></div>
              <div className="layer-content">
                <div className="layer-title">语义理解层</div>
                <div className="layer-desc">意图识别 + 参数提取 + LLM集成</div>
              </div>
            </div>
            <div className="layer layer-3">
              <div className="layer-icon"><ApiOutlined /></div>
              <div className="layer-content">
                <div className="layer-title">业务服务层</div>
                <div className="layer-desc">查询服务 + 数据服务 + 输出格式化</div>
              </div>
            </div>
            <div className="layer layer-4">
              <div className="layer-icon"><DatabaseOutlined /></div>
              <div className="layer-content">
                <div className="layer-title">数据访问层</div>
                <div className="layer-desc">数据库访问 + 缓存管理 + 数据验证</div>
              </div>
            </div>
            <div className="layer layer-5">
              <div className="layer-icon"><CloudOutlined /></div>
              <div className="layer-content">
                <div className="layer-title">数据源层</div>
                <div className="layer-desc">生产数据库 + 模拟数据 + 外部接口</div>
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
      bgGradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      content: (
        <div className="characteristics-content">
          <div className="characteristics-header">
            <Title level={2} className="section-title">
              系统特性
            </Title>
            <div className="section-subtitle">
              丰富的功能和优秀的用户体验
            </div>
          </div>
          <Row gutter={[48, 48]} className="characteristics-grid">
            <Col span={12}>
              <div className="characteristic-item">
                <div className="characteristic-icon">
                  <RobotOutlined />
                </div>
                <Title level={3}>智能语义识别</Title>
                <Paragraph>
                  支持自然语言查询，理解多种表述方式，准确识别查询意图和参数
                </Paragraph>
                <Progress percent={95} strokeColor="#52c41a" showInfo={false} />
                <div className="characteristic-stat">准确率 95%</div>
              </div>
            </Col>
            <Col span={12}>
              <div className="characteristic-item">
                <div className="characteristic-icon">
                  <ThunderboltOutlined />
                </div>
                <Title level={3}>快速响应</Title>
                <Paragraph>
                  平均响应时间小于2秒，支持并发查询，确保用户体验流畅
                </Paragraph>
                <Progress percent={98} strokeColor="#1890ff" showInfo={false} />
                <div className="characteristic-stat">响应速度 98%</div>
              </div>
            </Col>
            <Col span={12}>
              <div className="characteristic-item">
                <div className="characteristic-icon">
                  <BarChartOutlined />
                </div>
                <Title level={3}>结构化输出</Title>
                <Paragraph>
                  提供表格、图表、文本等多种输出格式，支持数据导出和打印
                </Paragraph>
                <Progress percent={92} strokeColor="#722ed1" showInfo={false} />
                <div className="characteristic-stat">用户满意度 92%</div>
              </div>
            </Col>
            <Col span={12}>
              <div className="characteristic-item">
                <div className="characteristic-icon">
                  <SafetyOutlined />
                </div>
                <Title level={3}>安全可靠</Title>
                <Paragraph>
                  本地部署，数据不出厂，完善的权限管理和审计日志
                </Paragraph>
                <Progress percent={100} strokeColor="#fa8c16" showInfo={false} />
                <div className="characteristic-stat">安全性 100%</div>
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
      bgGradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      content: (
        <div className="report-content">
          <div className="report-header">
            <Title level={2} className="section-title">
              报表生成功能
            </Title>
            <div className="section-subtitle">
              一键生成、预览和导出各类生产报表
            </div>
          </div>
          <div className="report-features">
            <div className="report-feature">
              <div className="report-feature-icon">
                <FileExcelOutlined />
              </div>
              <Title level={4}>多种报表类型</Title>
              <Space wrap>
                <Tag color="blue">生产状态</Tag>
                <Tag color="green">质量数据</Tag>
                <Tag color="orange">设备状态</Tag>
                <Tag color="purple">物料库存</Tag>
                <Tag color="cyan">能耗统计</Tag>
                <Tag color="red">报警记录</Tag>
              </Space>
            </div>
            <div className="report-feature">
              <div className="report-feature-icon">
                <DownloadOutlined />
              </div>
              <Title level={4}>灵活的导出格式</Title>
              <Space>
                <Button icon={<FileExcelOutlined />} type="default">
                  Excel格式
                </Button>
                <Button icon={<PrinterOutlined />} type="default">
                  PDF格式
                </Button>
              </Space>
            </div>
            <div className="report-feature">
              <div className="report-feature-icon">
                <EyeOutlined />
              </div>
              <Title level={4}>实时预览</Title>
              <Paragraph>
                在生成报表前可实时预览数据，确保报表内容准确无误
              </Paragraph>
            </div>
          </div>
        </div>
      )
    },
    {
      id: '6',
      title: '开始使用',
      subtitle: '立即体验智能问答',
      bgGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      content: (
        <div className="cta-content">
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
      )
    }
  ]

  return (
    <div className="docs-page-apple" ref={containerRef}>
      {slides.map((slide, index) => (
        <div 
          key={slide.id} 
          className="slide-section"
          style={{ background: slide.bgGradient }}
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
          <span className="current">{currentSlide + 1}</span>
          <span className="separator">/</span>
          <span className="total">{slides.length}</span>
        </div>
      </div>
    </div>
  )
}

export default DocsPage
