import { useState } from 'react'
import { Layout, Tabs, Input, Button, Card, Space, Spin, Alert } from 'antd'
import { SendOutlined, LoadingOutlined } from '@ant-design/icons'
import './App.css'

const { Header, Content, Sider } = Layout
const { TextArea } = Input

interface Tab {
  id: string
  name: string
  icon: string
  order: number
}

interface Template {
  id: string
  name: string
  query: string
  tab: string
  parameters: string[]
}

function App() {
  const [activeTab, setActiveTab] = useState('production')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const tabs: Tab[] = [
    { id: 'production', name: '生产状态', icon: 'dashboard', order: 1 },
    { id: 'quality', name: '质量数据', icon: 'chart', order: 2 },
    { id: 'equipment', name: '设备管理', icon: 'setting', order: 3 },
    { id: 'material', name: '物料管理', icon: 'inbox', order: 4 },
    { id: 'energy', name: '能耗统计', icon: 'thunderbolt', order: 5 },
    { id: 'alerts', name: '异常报警', icon: 'alert', order: 6 },
  ]

  const templates: Template[] = [
    {
      id: '1',
      name: '查询铁水情况',
      query: '帮我查询最近3天铁水情况',
      tab: 'production',
      parameters: ['timeRange'],
    },
    {
      id: '2',
      name: '查询转炉状态',
      query: '转炉1号现在在干什么',
      tab: 'production',
      parameters: ['furnaceId'],
    },
    {
      id: '3',
      name: '查询LF炉进度',
      query: 'LF炉的生产进度如何',
      tab: 'production',
      parameters: [],
    },
    {
      id: '4',
      name: '查询连铸状态',
      query: '连铸机有几台在运行',
      tab: 'production',
      parameters: [],
    },
    {
      id: '5',
      name: '查询异常报警',
      query: '当前有哪些报警',
      tab: 'alerts',
      parameters: [],
    },
  ]

  const handleTemplateClick = (template: Template) => {
    setQuery(template.query)
  }

  const handleQuerySubmit = async () => {
    if (!query.trim()) {
      setError('请输入查询内容')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('http://localhost:3000/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          tab: activeTab,
          outputFormat: 'json',
        }),
      })

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError('查询失败，请稍后重试')
      console.error('Query error:', err)
    } finally {
      setLoading(false)
    }
  }

  const currentTemplates = templates.filter((t) => t.tab === activeTab)

  return (
    <Layout className="app-layout">
      <Header className="app-header">
        <h1 className="app-title">OneAnswer 炼钢行业智能问答系统</h1>
      </Header>
      <Layout>
        <Sider width={250} className="app-sider">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            tabPosition="left"
            className="side-tabs"
            items={tabs.map((tab) => ({
              key: tab.id,
              label: tab.name,
            }))}
          />
        </Sider>
        <Content className="app-content">
          <div className="content-wrapper">
            <Card className="query-card" title="查询输入">
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <TextArea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="请输入您的问题..."
                  autoSize={{ minRows: 3, maxRows: 6 }}
                />
                <Button
                  type="primary"
                  icon={loading ? <LoadingOutlined /> : <SendOutlined />}
                  onClick={handleQuerySubmit}
                  loading={loading}
                  block
                >
                  提交查询
                </Button>
              </Space>
            </Card>

            {currentTemplates.length > 0 && (
              <Card className="templates-card" title="常用查询模板">
                <Space wrap>
                  {currentTemplates.map((template) => (
                    <Button
                      key={template.id}
                      onClick={() => handleTemplateClick(template)}
                    >
                      {template.name}
                    </Button>
                  ))}
                </Space>
              </Card>
            )}

            {error && (
              <Alert
                message="错误"
                description={error}
                type="error"
                showIcon
                className="error-alert"
              />
            )}

            {result && (
              <Card className="result-card" title="查询结果">
                <pre className="result-json">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </Card>
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default App
