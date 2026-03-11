import { useState, useRef, useEffect } from 'react'
import { Layout, Typography, Button, Space, Card, Row, Col, Divider } from 'antd'
import { RightOutlined, ThunderboltOutlined, SafetyOutlined, RocketOutlined, CheckCircleOutlined, ArrowRightOutlined } from '@ant-design/icons'
import './ProductIntroPage.css'

const { Title, Paragraph, Text } = Typography

function ProductIntroPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollTop = containerRef.current.scrollTop
        const slideHeight = window.innerHeight
        const newSlide = Math.round(scrollTop / slideHeight)
        if (newSlide !== currentSlide && newSlide >= 0 && newSlide < 5) {
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
    <div className="product-intro-page" ref={containerRef}>
      <div className="slide-section hero-section">
        <div className="slide-inner">
          <div className="hero-content">
            <div className="hero-left">
              <div className="hero-badge">
                <ThunderboltOutlined className="badge-icon" />
                <span>AI驱动 · 智能问答</span>
              </div>
              <Title level={1} className="hero-title">
                OneAnswer
              </Title>
              <Title level={3} className="hero-subtitle">
                炼钢行业智能问答系统
              </Title>
              <Paragraph className="hero-description">
                基于大语言模型的炼钢行业智能问答平台，用自然语言查询生产数据，让数据触手可及
              </Paragraph>
              <Space size="large" className="hero-actions">
                <Button 
                  type="primary" 
                  size="large" 
                  className="hero-button primary"
                  icon={<RocketOutlined />}
                  onClick={() => scrollToSlide(1)}
                >
                  立即体验
                  <RightOutlined />
                </Button>
                <Button 
                  size="large" 
                  className="hero-button secondary"
                >
                  了解更多
                </Button>
              </Space>
            </div>
            <div className="hero-right">
              <div className="hero-visual">
                <div className="visual-circle circle-1"></div>
                <div className="visual-circle circle-2"></div>
                <div className="visual-circle circle-3"></div>
                <div className="visual-card card-1">
                  <div className="card-icon">
                    <ThunderboltOutlined />
                  </div>
                  <div className="card-text">智能问答</div>
                </div>
                <div className="visual-card card-2">
                  <div className="card-icon">
                    <SafetyOutlined />
                  </div>
                  <div className="card-text">数据安全</div>
                </div>
                <div className="visual-card card-3">
                  <div className="card-icon">
                    <RocketOutlined />
                  </div>
                  <div className="card-text">高效便捷</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="slide-section features-section">
        <div className="slide-inner">
          <div className="section-header">
            <div className="section-badge">核心功能</div>
            <Title level={2} className="section-title">
              强大的功能，满足您的需求
            </Title>
            <Paragraph className="section-subtitle">
              OneAnswer 提供全方位的智能问答服务，助力炼钢行业数字化转型
            </Paragraph>
          </div>
          <Row gutter={[24, 24]} className="features-grid">
            <Col xs={24} sm={12} lg={6}>
              <Card className="feature-card">
                <div className="feature-icon">
                  <ThunderboltOutlined />
                </div>
                <Title level={4}>智能问答</Title>
                <Paragraph>
                  基于大语言模型，理解自然语言查询，快速返回准确答案
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="feature-card">
                <div className="feature-icon">
                  <SafetyOutlined />
                </div>
                <Title level={4}>数据安全</Title>
                <Paragraph>
                  企业级数据安全保障，确保您的生产数据安全可靠
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="feature-card">
                <div className="feature-icon">
                  <RocketOutlined />
                </div>
                <Title level={4}>高效便捷</Title>
                <Paragraph>
                  无需学习复杂查询语言，用日常语言即可获取所需数据
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="feature-card">
                <div className="feature-icon">
                  <CheckCircleOutlined />
                </div>
                <Title level={4}>准确可靠</Title>
                <Paragraph>
                  基于真实生产数据，提供准确可靠的查询结果
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      <div className="slide-section advantages-section">
        <div className="slide-inner">
          <div className="section-header">
            <div className="section-badge">产品优势</div>
            <Title level={2} className="section-title">
              为什么选择 OneAnswer
            </Title>
            <Paragraph className="section-subtitle">
              专为炼钢行业打造，解决传统数据查询痛点
            </Paragraph>
          </div>
          <Row gutter={[32, 32]} className="advantages-grid">
            <Col xs={24} md={12}>
              <Card className="advantage-card">
                <div className="advantage-number">01</div>
                <Title level={3}>自然语言交互</Title>
                <Paragraph>
                  告别复杂的SQL查询和报表工具，用日常语言即可查询数据
                </Paragraph>
                <Divider />
                <ul className="advantage-list">
                  <li>支持口语化表达</li>
                  <li>智能理解查询意图</li>
                  <li>自动提取查询参数</li>
                </ul>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card className="advantage-card">
                <div className="advantage-number">02</div>
                <Title level={3}>多维度数据支持</Title>
                <Paragraph>
                  覆盖生产、质量、设备、能耗等全方位数据查询
                </Paragraph>
                <Divider />
                <ul className="advantage-list">
                  <li>生产数据实时查询</li>
                  <li>质量数据统计分析</li>
                  <li>设备状态监控</li>
                  <li>能耗数据追踪</li>
                </ul>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card className="advantage-card">
                <div className="advantage-number">03</div>
                <Title level={3}>智能结果呈现</Title>
                <Paragraph>
                  根据查询内容，自动选择最优的结果展示方式
                </Paragraph>
                <Divider />
                <ul className="advantage-list">
                  <li>文本总结</li>
                  <li>数据表格</li>
                  <li>图表可视化</li>
                  <li>报表导出</li>
                </ul>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card className="advantage-card">
                <div className="advantage-number">04</div>
                <Title level={3}>持续学习优化</Title>
                <Paragraph>
                  基于用户反馈，持续优化模型，提升查询准确度
                </Paragraph>
                <Divider />
                <ul className="advantage-list">
                  <li>查询历史记录</li>
                  <li>智能推荐优化</li>
                  <li>模型迭代升级</li>
                </ul>
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      <div className="slide-section cta-section">
        <div className="slide-inner">
          <div className="cta-content">
            <Title level={2} className="cta-title">
              准备好体验 OneAnswer 了吗？
            </Title>
            <Paragraph className="cta-description">
              立即开始使用，让数据查询变得简单高效
            </Paragraph>
            <Button 
              type="primary" 
              size="large" 
              className="cta-button"
              icon={<ArrowRightOutlined />}
            >
              立即试用
            </Button>
          </div>
        </div>
      </div>

      <div className="slide-indicators">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className={`indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => scrollToSlide(index)}
          />
        ))}
      </div>
    </div>
  )
}

export default ProductIntroPage