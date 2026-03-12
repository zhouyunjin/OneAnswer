import { useState, useRef, useEffect } from 'react'
import { Layout, Input, Button, Space, Spin, Avatar, Menu, Collapse } from 'antd'
import { SendOutlined, LoadingOutlined, UserOutlined, RobotOutlined, FireOutlined, ThunderboltOutlined, AlertOutlined, DashboardOutlined, ExperimentOutlined, InboxOutlined, SettingOutlined, PlaySquareOutlined, BookOutlined, BulbOutlined, DownloadOutlined, MenuFoldOutlined, MenuUnfoldOutlined, RocketOutlined, FileTextOutlined, CodeOutlined, GlobalOutlined } from '@ant-design/icons'
import './App.css'
import DemoPage from './DemoPage'
import ProductTechPage from './ProductTechPage'
import MarkdownPage from './MarkdownPage'

const { Header, Content, Sider } = Layout

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  data?: any
}

interface Tab {
  id: string
  name: string
  icon: React.ReactNode
  order: number
}

interface Template {
  id: string
  name: string
  query: string
  tab: string
  icon: React.ReactNode
  hot?: boolean
}

function App() {
  const [activeTab, setActiveTab] = useState('production')
  const [activeMenu, setActiveMenu] = useState('product-intro')
  const [menuCollapsed, setMenuCollapsed] = useState(false)
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const tabs: Tab[] = [
    { id: 'production', name: '生产状态', icon: <DashboardOutlined />, order: 1 },
    { id: 'quality', name: '质量数据', icon: <ExperimentOutlined />, order: 2 },
    { id: 'equipment', name: '设备管理', icon: <SettingOutlined />, order: 3 },
    { id: 'material', name: '物料管理', icon: <InboxOutlined />, order: 4 },
    { id: 'energy', name: '能耗统计', icon: <ThunderboltOutlined />, order: 5 },
    { id: 'alerts', name: '异常报警', icon: <AlertOutlined />, order: 6 },
  ]

  const templates: Template[] = [
    {
      id: '1',
      name: '帮我查询最近 3 天铁水情况',
      query: '帮我查询最近 3 天铁水情况',
      tab: 'production',
      icon: <FireOutlined />,
    },
    {
      id: '2',
      name: '今天上午进厂铁水有多少吨？',
      query: '今天上午进厂铁水有多少吨？',
      tab: 'production',
      icon: <FireOutlined />,
    },
    {
      id: '3',
      name: '昨天铁水的平均温度和脱硫情况',
      query: '昨天铁水的平均温度和脱硫情况',
      tab: 'production',
      icon: <FireOutlined />,
    },
    {
      id: '4',
      name: '目前厂内还有多少可用铁水？',
      query: '目前厂内还有多少可用铁水？',
      tab: 'production',
      icon: <FireOutlined />,
    },
    {
      id: '5',
      name: '今天废钢的消耗量是多少？',
      query: '今天废钢的消耗量是多少？',
      tab: 'production',
      icon: <FireOutlined />,
    },
    {
      id: '6',
      name: '1 号转炉上一炉加了多少石灰？',
      query: '1 号转炉上一炉加了多少石灰？',
      tab: 'production',
      icon: <FireOutlined />,
    },
    {
      id: '7',
      name: '当前合金库存情况',
      query: '当前合金库存情况',
      tab: 'production',
      icon: <FireOutlined />,
    },
    {
      id: '8',
      name: '当前冶炼情况怎么样？',
      query: '当前冶炼情况怎么样？',
      tab: 'production',
      icon: <DashboardOutlined />,
    },
    {
      id: '9',
      name: '所有转炉和连铸机的生产状态',
      query: '所有转炉和连铸机的生产状态',
      tab: 'production',
      icon: <DashboardOutlined />,
    },
    {
      id: '10',
      name: '现在有没有设备异常？',
      query: '现在有没有设备异常？',
      tab: 'production',
      icon: <DashboardOutlined />,
    },
    {
      id: '11',
      name: '各工序的实时温度情况',
      query: '各工序的实时温度情况',
      tab: 'production',
      icon: <DashboardOutlined />,
    },
    {
      id: '12',
      name: '帮我查一下炉号 230415 的详细冶炼记录',
      query: '帮我查一下炉号 230415 的详细冶炼记录',
      tab: 'production',
      icon: <DashboardOutlined />,
    },
    {
      id: '13',
      name: '当前正在吹炼的钢种是什么？',
      query: '当前正在吹炼的钢种是什么？',
      tab: 'production',
      icon: <DashboardOutlined />,
    },
    {
      id: '14',
      name: '2 号 LF 炉现在的精炼时间多长了？',
      query: '2 号 LF 炉现在的精炼时间多长了？',
      tab: 'production',
      icon: <DashboardOutlined />,
    },
    {
      id: '15',
      name: '上一炉的终点碳含量是多少？',
      query: '上一炉的终点碳含量是多少？',
      tab: 'quality',
      icon: <ExperimentOutlined />,
    },
    {
      id: '16',
      name: '帮我调出今天所有 Q235B 钢种的化验单',
      query: '帮我调出今天所有 Q235B 钢种的化验单',
      tab: 'quality',
      icon: <ExperimentOutlined />,
    },
    {
      id: '17',
      name: '3 号连铸机现在的钢水成分合格吗？',
      query: '3 号连铸机现在的钢水成分合格吗？',
      tab: 'quality',
      icon: <ExperimentOutlined />,
    },
    {
      id: '18',
      name: '本周有哪些炉次出现了成分超标？',
      query: '本周有哪些炉次出现了成分超标？',
      tab: 'quality',
      icon: <ExperimentOutlined />,
    },
    {
      id: '19',
      name: '最近有没有发生漏钢事故？',
      query: '最近有没有发生漏钢事故？',
      tab: 'quality',
      icon: <ExperimentOutlined />,
    },
    {
      id: '20',
      name: '统计一下上个月的废品率',
      query: '统计一下上个月的废品率',
      tab: 'quality',
      icon: <ExperimentOutlined />,
    },
    {
      id: '21',
      name: '今天白班的计划完成率是多少？',
      query: '今天白班的计划完成率是多少？',
      tab: 'production',
      icon: <DashboardOutlined />,
    },
    {
      id: '22',
      name: '本月累计产钢量达到多少吨了？',
      query: '本月累计产钢量达到多少吨了？',
      tab: 'production',
      icon: <DashboardOutlined />,
    },
    {
      id: '23',
      name: '对比一下一分厂和二分厂的日产量',
      query: '对比一下一分厂和二分厂的日产量',
      tab: 'production',
      icon: <DashboardOutlined />,
    },
    {
      id: '24',
      name: '接下来的生产计划是什么钢种？',
      query: '接下来的生产计划是什么钢种？',
      tab: 'production',
      icon: <DashboardOutlined />,
    },
    {
      id: '25',
      name: '明天需要准备多少吨废钢？',
      query: '明天需要准备多少吨废钢？',
      tab: 'production',
      icon: <DashboardOutlined />,
    },
    {
      id: '26',
      name: '几点开始检修 2 号转炉？',
      query: '几点开始检修 2 号转炉？',
      tab: 'equipment',
      icon: <SettingOutlined />,
    },
    {
      id: '27',
      name: '帮我生成一份本月的产量统计报表',
      query: '帮我生成一份本月的产量统计报表',
      tab: 'production',
      icon: <DashboardOutlined />,
    },
    {
      id: '28',
      name: '当前有哪些报警？',
      query: '当前有哪些报警？',
      tab: 'alerts',
      icon: <AlertOutlined />,
    },
    {
      id: '29',
      name: '最近的能耗情况如何？',
      query: '最近的能耗情况如何？',
      tab: 'energy',
      icon: <ThunderboltOutlined />,
    },
    {
      id: '30',
      name: '当前的物料库存情况',
      query: '当前的物料库存情况',
      tab: 'material',
      icon: <InboxOutlined />,
    },
    {
      id: '31',
      name: '今天各钢种的合格率是多少？',
      query: '今天各钢种的合格率是多少？',
      tab: 'quality',
      icon: <ExperimentOutlined />,
    },
    {
      id: '32',
      name: '本周连铸坯的质量趋势如何？',
      query: '本周连铸坯的质量趋势如何？',
      tab: 'quality',
      icon: <ExperimentOutlined />,
    },
    {
      id: '33',
      name: '最近 3 天的硫磷含量达标率',
      query: '最近 3 天的硫磷含量达标率',
      tab: 'quality',
      icon: <ExperimentOutlined />,
    },
    {
      id: '34',
      name: '各炉座的温度控制情况',
      query: '各炉座的温度控制情况',
      tab: 'quality',
      icon: <ExperimentOutlined />,
    },
    {
      id: '35',
      name: '1 号转炉的设备运行时长是多少？',
      query: '1 号转炉的设备运行时长是多少？',
      tab: 'equipment',
      icon: <SettingOutlined />,
    },
    {
      id: '36',
      name: 'LF 炉的电极消耗情况',
      query: 'LF 炉的电极消耗情况',
      tab: 'equipment',
      icon: <SettingOutlined />,
    },
    {
      id: '37',
      name: '连铸机的拉速是否正常？',
      query: '连铸机的拉速是否正常？',
      tab: 'equipment',
      icon: <SettingOutlined />,
    },
    {
      id: '38',
      name: '除尘系统的运行状态',
      query: '除尘系统的运行状态',
      tab: 'equipment',
      icon: <SettingOutlined />,
    },
    {
      id: '39',
      name: '氧枪的使用寿命还剩多少？',
      query: '氧枪的使用寿命还剩多少？',
      tab: 'equipment',
      icon: <SettingOutlined />,
    },
    {
      id: '40',
      name: '钢包的周转情况如何？',
      query: '钢包的周转情况如何？',
      tab: 'equipment',
      icon: <SettingOutlined />,
    },
    {
      id: '41',
      name: '天车的作业率是多少？',
      query: '天车的作业率是多少？',
      tab: 'equipment',
      icon: <SettingOutlined />,
    },
    {
      id: '42',
      name: '本月的设备故障率统计',
      query: '本月的设备故障率统计',
      tab: 'equipment',
      icon: <SettingOutlined />,
    },
    {
      id: '43',
      name: '今天氧气消耗量是多少？',
      query: '今天氧气消耗量是多少？',
      tab: 'energy',
      icon: <ThunderboltOutlined />,
    },
    {
      id: '44',
      name: '本月电力消耗趋势',
      query: '本月电力消耗趋势',
      tab: 'energy',
      icon: <ThunderboltOutlined />,
    },
    {
      id: '45',
      name: '各工序的能耗对比',
      query: '各工序的能耗对比',
      tab: 'energy',
      icon: <ThunderboltOutlined />,
    },
    {
      id: '46',
      name: '吨钢能耗是多少？',
      query: '吨钢能耗是多少？',
      tab: 'energy',
      icon: <ThunderboltOutlined />,
    },
    {
      id: '47',
      name: '天然气的使用量统计',
      query: '天然气的使用量统计',
      tab: 'energy',
      icon: <ThunderboltOutlined />,
    },
    {
      id: '48',
      name: '循环水的消耗情况',
      query: '循环水的消耗情况',
      tab: 'energy',
      icon: <ThunderboltOutlined />,
    },
    {
      id: '49',
      name: '本周的节能措施效果',
      query: '本周的节能措施效果',
      tab: 'energy',
      icon: <ThunderboltOutlined />,
    },
    {
      id: '50',
      name: '石灰石的库存还剩多少？',
      query: '石灰石的库存还剩多少？',
      tab: 'material',
      icon: <InboxOutlined />,
    },
    {
      id: '51',
      name: '萤石的供应情况如何？',
      query: '萤石的供应情况如何？',
      tab: 'material',
      icon: <InboxOutlined />,
    },
    {
      id: '52',
      name: '硅铁的消耗速度',
      query: '硅铁的消耗速度',
      tab: 'material',
      icon: <InboxOutlined />,
    },
    {
      id: '53',
      name: '锰铁合金的库存预警',
      query: '锰铁合金的库存预警',
      tab: 'material',
      icon: <InboxOutlined />,
    },
    {
      id: '54',
      name: '铝锭的到货计划',
      query: '铝锭的到货计划',
      tab: 'material',
      icon: <InboxOutlined />,
    },
    {
      id: '55',
      name: '保护渣的使用量',
      query: '保护渣的使用量',
      tab: 'material',
      icon: <InboxOutlined />,
    },
    {
      id: '56',
      name: '耐火材料的消耗情况',
      query: '耐火材料的消耗情况',
      tab: 'material',
      icon: <InboxOutlined />,
    },
    {
      id: '57',
      name: '最近有哪些高温报警？',
      query: '最近有哪些高温报警？',
      tab: 'alerts',
      icon: <AlertOutlined />,
    },
    {
      id: '58',
      name: '设备故障报警列表',
      query: '设备故障报警列表',
      tab: 'alerts',
      icon: <AlertOutlined />,
    },
    {
      id: '59',
      name: '液位异常报警情况',
      query: '液位异常报警情况',
      tab: 'alerts',
      icon: <AlertOutlined />,
    },
    {
      id: '60',
      name: '压力超限报警记录',
      query: '压力超限报警记录',
      tab: 'alerts',
      icon: <AlertOutlined />,
    },
    {
      id: '61',
      name: '气体泄漏报警',
      query: '气体泄漏报警',
      tab: 'alerts',
      icon: <AlertOutlined />,
    },
    {
      id: '62',
      name: '本周报警趋势分析',
      query: '本周报警趋势分析',
      tab: 'alerts',
      icon: <AlertOutlined />,
    },
    {
      id: '63',
      name: '紧急报警处理状态',
      query: '紧急报警处理状态',
      tab: 'alerts',
      icon: <AlertOutlined />,
    },
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleTemplateClick = async (template: Template) => {
    setQuery(template.query)
    setTimeout(() => {
      handleQuerySubmit(template.query)
    }, 0)
  }

  const formatResponse = (data: any) => {
    if (!data) return ''

    const { result } = data
    if (!result) return JSON.stringify(data, null, 2)

    let formatted = ''

    if (result.summary) {
      formatted += `**查询总结：**\n${result.summary}\n\n`
    }

    if (result.data) {
      formatted += `**详细数据：**\n`
      if (result.data.hotMetal && result.data.hotMetal.length > 0) {
        formatted += `\n🔥 **铁水数据** (${result.data.hotMetal.length}条)\n`
        const sample = result.data.hotMetal.slice(0, 2)
        sample.forEach((item: any, index: number) => {
          formatted += `  ${index + 1}. 温度: ${item.temperature.toFixed(1)}°C, 重量: ${item.weight.toFixed(1)}吨\n`
        })
      }

      if (result.data.converters && result.data.converters.length > 0) {
        const running = result.data.converters.filter((c: any) => c.status === '冶炼中').length
        formatted += `\n🏭 **转炉数据** (${result.data.converters.length}条, 运行中: ${running}台)\n`
        const sample = result.data.converters.slice(0, 2)
        sample.forEach((item: any, index: number) => {
          formatted += `  ${index + 1}. ${item.furnaceId}: ${item.status}, 炉次: ${item.currentHeat}\n`
        })
      }

      if (result.data.lfFurnaces && result.data.lfFurnaces.length > 0) {
        const refining = result.data.lfFurnaces.filter((f: any) => f.status === '精炼中').length
        formatted += `\n⚙️ **LF炉数据** (${result.data.lfFurnaces.length}条, 精炼中: ${refining}台)\n`
        const sample = result.data.lfFurnaces.slice(0, 2)
        sample.forEach((item: any, index: number) => {
          formatted += `  ${index + 1}. ${item.furnaceId}: ${item.status}, 钢种: ${item.steelGrade}\n`
        })
      }

      if (result.data.alarms && result.data.alarms.length > 0) {
        formatted += `\n⚠️ **报警数据** (${result.data.alarms.length}条)\n`
        const sample = result.data.alarms.slice(0, 3)
        sample.forEach((item: any, index: number) => {
          formatted += `  ${index + 1}. ${item.device}: ${item.type} (${item.severity})\n`
        })
      }
    }

    if (result.metadata) {
      formatted += `\n**查询信息：**\n`
      formatted += `- 查询时间: ${result.metadata.queryTime}ms\n`
      formatted += `- 记录数量: ${result.metadata.recordCount}条\n`
      formatted += `- 数据来源: ${result.metadata.dataSource}\n`
    }

    return formatted
  }

  const handleQuerySubmit = async (queryText?: string) => {
    const queryValue = queryText || query
    if (!queryValue.trim()) {
      setError('请输入查询内容')
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: queryValue,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setQuery('')
    setError(null)
    setLoading(true)

    try {
      const response = await fetch('http://localhost:3000/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: queryValue,
          tab: activeTab,
          outputFormat: 'json',
        }),
      })

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: formatResponse(data),
        timestamp: new Date().toISOString(),
        data: data,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (err) {
      setError('查询失败，请稍后重试')
      console.error('Query error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = (data: any) => {
    if (!data || !data.result) {
      return
    }

    const { result } = data
    let exportData: any[] = []

    if (result.data) {
      if (result.data.hotMetal) {
        exportData = result.data.hotMetal
      } else if (result.data.converters) {
        exportData = result.data.converters
      } else if (result.data.lfFurnaces) {
        exportData = result.data.lfFurnaces
      } else if (result.data.alarms) {
        exportData = result.data.alarms
      }
    }

    if (exportData.length === 0) {
      return
    }

    const headers = Object.keys(exportData[0]).join(',')
    const rows = exportData.map((row: any) => 
      Object.values(row).map((val: any) => {
        if (typeof val === 'object') {
          return JSON.stringify(val)
        }
        return val
      }).join(',')
    )
    const csvContent = [headers, ...rows].join('\n')
    
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `report_${Date.now()}.csv`
    link.click()
  }

  return (
    <Layout className="chat-layout">
      <Header className="chat-header">
        <div className="header-content">
          <div className="header-left">
            <div className="header-icon-wrapper">
              <GlobalOutlined className="header-icon" />
            </div>
            <div className="header-text">
              <h1 className="header-title">OneAnswer</h1>
              <span className="header-subtitle">炼钢行业智能问答系统</span>
            </div>
          </div>
          <div className="header-right">
            <span className="header-version">v1.0</span>
          </div>
        </div>
      </Header>
      <Layout className="chat-body">
        <Sider width={menuCollapsed ? 80 : 240} className="menu-sider">
          <div className="menu-toggle" onClick={() => setMenuCollapsed(!menuCollapsed)}>
            {menuCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </div>
          {menuCollapsed ? (
            <Menu
              mode="vertical"
              selectedKeys={[activeMenu]}
              onClick={({ key }) => setActiveMenu(key)}
              className="side-menu"
              items={[
                {
                  key: 'product-intro',
                  icon: <FileTextOutlined />,
                  label: '产品介绍',
                },
                {
                  key: 'demo',
                  icon: <PlaySquareOutlined />,
                  label: '产品效果示例',
                },
                {
                  key: 'requirements',
                  icon: <BookOutlined />,
                  label: '需求设计说明',
                },
                {
                  key: 'design',
                  icon: <CodeOutlined />,
                  label: '技术设计说明',
                },
                {
                  type: 'divider',
                },
                {
                  key: 'oneanswer',
                  icon: <RocketOutlined />,
                  label: 'OneAnswer',
                },
              ]}
            />
          ) : (
            <Collapse
              defaultActiveKey={['design', 'try']}
              bordered={false}
              className="menu-collapse"
              expandIcon={() => null}
            >
              <Collapse.Panel 
                header={
                  <div className="collapse-header">
                    <BulbOutlined className="collapse-icon" />
                    <span className="collapse-title">设计</span>
                  </div>
                } 
                key="design"
              >
                <Menu
                  mode="vertical"
                  selectedKeys={[activeMenu]}
                  onClick={({ key }) => setActiveMenu(key)}
                  className="design-menu"
                  items={[
                    {
                      key: 'product-intro',
                      icon: <FileTextOutlined />,
                      label: '产品介绍',
                    },
                    {
                      key: 'demo',
                      icon: <PlaySquareOutlined />,
                      label: '产品效果示例',
                    },
                    {
                      key: 'requirements',
                      icon: <BookOutlined />,
                      label: '需求设计说明',
                    },
                    {
                      key: 'design',
                      icon: <CodeOutlined />,
                      label: '技术设计说明',
                    },
                  ]}
                />
              </Collapse.Panel>
              <Collapse.Panel 
                header={
                  <div className="collapse-header">
                    <RocketOutlined className="collapse-icon" />
                    <span className="collapse-title">立即试用</span>
                  </div>
                } 
                key="try"
              >
                <Menu
                  mode="vertical"
                  selectedKeys={[activeMenu]}
                  onClick={({ key }) => setActiveMenu(key)}
                  className="design-menu"
                  items={[
                    {
                      key: 'oneanswer',
                      icon: <RocketOutlined />,
                      label: 'OneAnswer',
                    },
                  ]}
                />
              </Collapse.Panel>
            </Collapse>
          )}
        </Sider>
        <Content className={`chat-content ${activeMenu === 'oneanswer' ? 'chat-mode' : ''}`}>
          {activeMenu === 'oneanswer' && (
            <>
              <div className="chat-messages">
                {messages.length === 0 && (
                  <div className="welcome-message">
                    <RobotOutlined className="welcome-icon" />
                    <h2>欢迎使用 OneAnswer</h2>
                    <p>我可以帮您查询炼钢生产、质量、设备、能耗等各类数据</p>
                    <div className="quick-start">
                      <h3>快速开始</h3>
                      <Space wrap>
                        {templates.filter(t => t.hot).map((template) => (
                          <Button
                            key={template.id}
                            type="text"
                            icon={template.icon}
                            onClick={() => handleTemplateClick(template)}
                            className="quick-start-btn"
                          >
                            {template.name}
                          </Button>
                        ))}
                      </Space>
                    </div>
                  </div>
                )}

                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}
                  >
                    <div className="message-content">
                      <Avatar
                        icon={message.role === 'user' ? <UserOutlined /> : <RobotOutlined />}
                        className={`message-avatar ${message.role}`}
                      />
                      <div className="message-bubble">
                        <div className="message-text">
                          {message.content.split('\n').map((line, index) => {
                            if (line.startsWith('**') && line.endsWith('**')) {
                              return (
                                <div key={index} className="message-heading">
                                  {line.replace(/\*\*/g, '')}
                                </div>
                              )
                            }
                            if (line.startsWith('- ')) {
                              return (
                                <div key={index} className="message-list-item">
                                  {line.replace('- ', '')}
                                </div>
                              )
                            }
                            if (line.match(/^\d+\.\s/)) {
                              return (
                                <div key={index} className="message-list-item">
                                  {line}
                                </div>
                              )
                            }
                            if (line.trim() === '') {
                              return <br key={index} />
                            }
                            return <div key={index}>{line}</div>
                          })}
                        </div>
                        {message.role === 'assistant' && message.data && (
                          <div className="message-actions">
                            <Button
                              size="small"
                              icon={<DownloadOutlined />}
                              onClick={() => handleExport(message.data)}
                            >
                              导出报表
                            </Button>
                          </div>
                        )}
                        <div className="message-time">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="message assistant-message">
                    <div className="message-content">
                      <Avatar icon={<RobotOutlined />} className="message-avatar assistant" />
                      <div className="message-bubble loading">
                        <Spin size="small" />
                        <span className="loading-text">正在思考...</span>
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="error-message">
                    <AlertOutlined className="error-icon" />
                    <span>{error}</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              <div className="chat-input-container">
                <div className="input-wrapper">
                  <Input.TextArea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onPressEnter={(e) => {
                      if (!e.shiftKey) {
                        e.preventDefault()
                        handleQuerySubmit()
                      }
                    }}
                    placeholder="请输入您的问题，例如：查询今天转炉的生产状态"
                    autoSize={{ minRows: 1, maxRows: 4 }}
                    className="chat-input"
                  />
                  <Button
                    type="primary"
                    icon={loading ? <LoadingOutlined /> : <SendOutlined />}
                    onClick={() => handleQuerySubmit()}
                    loading={loading}
                    disabled={!query.trim()}
                    className="send-button"
                  >
                    发送
                  </Button>
                </div>
              </div>
            </>
          )}
          {activeMenu === 'product-intro' && <ProductTechPage onTryNow={() => setActiveMenu('oneanswer')} />}
          {activeMenu === 'demo' && <DemoPage />}
          {activeMenu === 'requirements' && <MarkdownPage filePath="/requirements.md" title="需求设计说明" />}
          {activeMenu === 'design' && <MarkdownPage filePath="/design.md" title="技术设计说明" />}
        </Content>
        {activeMenu === 'oneanswer' && (
          <Sider width={320} className="recommendation-sider">
            <div className="recommendation-content">
              <div className="categories-header">
                <div className="categories-title">推荐指令</div>
                <div className="categories-subtitle">CATEGORIES</div>
              </div>
              
              <div className="categories-tabs">
                {tabs.map((tab) => (
                  <div
                    key={tab.id}
                    className={`category-tab ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <span className="tab-icon">{tab.icon}</span>
                    <span className="tab-name">{tab.name}</span>
                  </div>
                ))}
              </div>

              <div className="templates-list-vertical">
                {templates.filter(t => t.tab === activeTab).map((template) => (
                  <div
                    key={template.id}
                    className="template-item"
                    onClick={() => handleTemplateClick(template)}
                  >
                    <div className="template-item-content">
                      <span className="template-item-icon">{template.icon}</span>
                      <span className="template-item-text">{template.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Sider>
        )}
      </Layout>
    </Layout>
  )
}

export default App