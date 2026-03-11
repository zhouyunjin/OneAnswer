import { Card, Table, Tag, Progress, Alert, Descriptions, Statistic, Row, Col, Divider, Typography, Space, Button } from 'antd'
import { 
  FireOutlined, 
  ThunderboltOutlined, 
  AlertOutlined, 
  DashboardOutlined,
  ExperimentOutlined,
  InboxOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  RiseOutlined,
  FallOutlined,
  FileExcelOutlined,
  DownloadOutlined,
  EyeOutlined,
  PrinterOutlined
} from '@ant-design/icons'
import './DemoPage.css'

const { Title, Paragraph, Text } = Typography

interface DemoExample {
  id: string
  title: string
  description: string
  component: React.ReactNode
}

function DemoPage() {
  const hotMetalColumns = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 180,
    },
    {
      title: '温度 (°C)',
      dataIndex: 'temperature',
      key: 'temperature',
      render: (temp: number) => (
        <span style={{ color: temp > 1400 ? '#f5222d' : '#52c41a' }}>{temp.toFixed(1)}</span>
      ),
    },
    {
      title: '重量 (吨)',
      dataIndex: 'weight',
      key: 'weight',
      render: (weight: number) => weight.toFixed(1),
    },
    {
      title: '来源高炉',
      dataIndex: 'sourceBlastFurnace',
      key: 'sourceBlastFurnace',
    },
    {
      title: '成分',
      key: 'composition',
      render: (_: any, record: any) => (
        <Space size={4}>
          <Tag color="blue">Si:{record.composition.Si.toFixed(2)}</Tag>
          <Tag color="green">Mn:{record.composition.Mn.toFixed(2)}</Tag>
          <Tag color="orange">P:{record.composition.P.toFixed(3)}</Tag>
          <Tag color="red">S:{record.composition.S.toFixed(3)}</Tag>
        </Space>
      ),
    },
  ]

  const hotMetalData = [
    {
      key: '1',
      timestamp: '2024-01-15 14:30:00',
      temperature: 1365.5,
      weight: 320.8,
      sourceBlastFurnace: '1号高炉',
      composition: { Si: 0.45, Mn: 0.62, P: 0.018, S: 0.025 },
    },
    {
      key: '2',
      timestamp: '2024-01-15 13:45:00',
      temperature: 1348.2,
      weight: 315.5,
      sourceBlastFurnace: '2号高炉',
      composition: { Si: 0.38, Mn: 0.58, P: 0.015, S: 0.022 },
    },
    {
      key: '3',
      timestamp: '2024-01-15 12:30:00',
      temperature: 1352.8,
      weight: 328.3,
      sourceBlastFurnace: '3号高炉',
      composition: { Si: 0.42, Mn: 0.65, P: 0.020, S: 0.028 },
    },
  ]

  const converterColumns = [
    {
      title: '炉号',
      dataIndex: 'furnaceId',
      key: 'furnaceId',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const config: Record<string, { color: string; icon: React.ReactNode }> = {
          '冶炼中': { color: 'processing', icon: <FireOutlined /> },
          '待料': { color: 'default', icon: <DashboardOutlined /> },
          '检修': { color: 'warning', icon: <WarningOutlined /> },
        }
        const { color, icon } = config[status] || { color: 'default', icon: null }
        return (
          <Tag icon={icon} color={color}>
            {status}
          </Tag>
        )
      },
    },
    {
      title: '当前炉次',
      dataIndex: 'currentHeat',
      key: 'currentHeat',
    },
    {
      title: '钢种',
      dataIndex: 'steelGrade',
      key: 'steelGrade',
    },
    {
      title: '预计完成',
      dataIndex: 'estimatedCompletion',
      key: 'estimatedCompletion',
    },
  ]

  const converterData = [
    {
      key: '1',
      furnaceId: '1号转炉',
      status: '冶炼中',
      currentHeat: 'H20240115001',
      steelGrade: 'Q235B',
      estimatedCompletion: '14:45',
    },
    {
      key: '2',
      furnaceId: '2号转炉',
      status: '冶炼中',
      currentHeat: 'H20240115002',
      steelGrade: 'Q345B',
      estimatedCompletion: '15:00',
    },
    {
      key: '3',
      furnaceId: '3号转炉',
      status: '待料',
      currentHeat: '-',
      steelGrade: '-',
      estimatedCompletion: '-',
    },
  ]

  const alarmColumns = [
    {
      title: '报警ID',
      dataIndex: 'alarmId',
      key: 'alarmId',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '设备',
      dataIndex: 'device',
      key: 'device',
    },
    {
      title: '严重程度',
      dataIndex: 'severity',
      key: 'severity',
      render: (severity: string) => {
        const colorMap: Record<string, string> = {
          '严重': 'error',
          '警告': 'warning',
          '提示': 'info',
        }
        return <Tag color={colorMap[severity]}>{severity}</Tag>
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const icon = status === '未处理' ? <CloseCircleOutlined /> : <CheckCircleOutlined />
        const color = status === '未处理' ? 'error' : 'success'
        return <Tag icon={icon} color={color}>{status}</Tag>
      },
    },
  ]

  const alarmData = [
    {
      key: '1',
      alarmId: 'ALM-20240115-001',
      type: '设备故障',
      device: '2号转炉',
      severity: '严重',
      status: '未处理',
    },
    {
      key: '2',
      alarmId: 'ALM-20240115-002',
      type: '温度超限',
      device: '1号LF炉',
      severity: '警告',
      status: '未处理',
    },
    {
      key: '3',
      alarmId: 'ALM-20240115-003',
      type: '成分异常',
      device: '3号转炉',
      severity: '提示',
      status: '已处理',
    },
  ]

  const alloyColumns = [
    {
      title: '合金名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '牌号',
      dataIndex: 'grade',
      key: 'grade',
    },
    {
      title: '当前库存',
      dataIndex: 'currentStock',
      key: 'currentStock',
      render: (stock: number) => `${stock} 吨`,
    },
    {
      title: '日消耗',
      dataIndex: 'dailyConsumption',
      key: 'dailyConsumption',
      render: (consumption: number) => `${consumption} 吨/天`,
    },
    {
      title: '可用天数',
      dataIndex: 'daysRemaining',
      key: 'daysRemaining',
      render: (days: number) => (
        <span style={{ color: days < 7 ? '#f5222d' : '#52c41a' }}>{days} 天</span>
      ),
    },
    {
      title: '库存状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const config: Record<string, { color: string; icon: React.ReactNode }> = {
          '正常': { color: 'success', icon: <CheckCircleOutlined /> },
          '预警': { color: 'warning', icon: <WarningOutlined /> },
          '紧急': { color: 'error', icon: <CloseCircleOutlined /> },
        }
        const { color, icon } = config[status] || { color: 'default', icon: null }
        return <Tag icon={icon} color={color}>{status}</Tag>
      },
    },
  ]

  const alloyData = [
    {
      key: '1',
      name: '硅锰合金',
      grade: 'FeMn65Si17',
      currentStock: 150,
      dailyConsumption: 25,
      daysRemaining: 6,
      status: '预警',
    },
    {
      key: '2',
      name: '铬铁',
      grade: 'FeCr55C1000',
      currentStock: 80,
      dailyConsumption: 8,
      daysRemaining: 10,
      status: '正常',
    },
    {
      key: '3',
      name: '镍铁',
      grade: 'FeNi20',
      currentStock: 45,
      dailyConsumption: 5,
      daysRemaining: 9,
      status: '正常',
    },
  ]

  const demoExamples: DemoExample[] = [
    {
      id: '1',
      title: '文本输出样式',
      description: '展示纯文本信息的输出格式，适用于简单的查询结果和总结性信息。',
      component: (
        <Card className="demo-card">
          <Title level={4}>📊 查询总结</Title>
          <Paragraph>
            当前共有3台转炉运行中，2台LF炉精炼中，2台连铸机浇铸中。
            最近3天共接收铁水42罐，平均温度1350°C。
            当前有2条未处理报警，均为设备故障。
          </Paragraph>
          <Alert
            message="系统提示"
            description="2号转炉氧枪流量异常，建议尽快处理"
            type="warning"
            showIcon
            icon={<WarningOutlined />}
          />
        </Card>
      ),
    },
    {
      id: '2',
      title: '表格输出样式 - 铁水数据',
      description: '展示铁水数据的表格输出，包含温度、重量、成分等详细信息。',
      component: (
        <Card className="demo-card" title="🔥 铁水数据">
          <Table
            columns={hotMetalColumns}
            dataSource={hotMetalData}
            pagination={false}
            size="small"
            bordered
          />
        </Card>
      ),
    },
    {
      id: '3',
      title: '表格输出样式 - 冶炼状态',
      description: '展示冶炼状态的表格输出，包含状态标签和图标。',
      component: (
        <Card className="demo-card" title="🏭 冶炼状态">
          <Table
            columns={converterColumns}
            dataSource={converterData}
            pagination={false}
            size="small"
            bordered
          />
        </Card>
      ),
    },
    {
      id: '4',
      title: '表格输出样式 - 报警信息',
      description: '展示报警信息的表格输出，包含严重程度和状态标签。',
      component: (
        <Card className="demo-card" title="⚠️ 报警信息">
          <Table
            columns={alarmColumns}
            dataSource={alarmData}
            pagination={false}
            size="small"
            bordered
          />
        </Card>
      ),
    },
    {
      id: '5',
      title: '表格输出样式 - 合金库存',
      description: '展示合金库存的表格输出，包含库存状态和可用天数。',
      component: (
        <Card className="demo-card" title="📦 合金库存">
          <Table
            columns={alloyColumns}
            dataSource={alloyData}
            pagination={false}
            size="small"
            bordered
          />
        </Card>
      ),
    },
    {
      id: '6',
      title: '统计卡片样式',
      description: '展示关键指标的统计卡片，适用于仪表板和概览页面。',
      component: (
        <Card className="demo-card" title="📈 生产统计">
          <Row gutter={16}>
            <Col span={6}>
              <Statistic
                title="今日产量"
                value={1250}
                suffix="吨"
                prefix={<RiseOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="运行设备"
                value={7}
                suffix="台"
                prefix={<DashboardOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="未处理报警"
                value={2}
                suffix="条"
                prefix={<AlertOutlined />}
                valueStyle={{ color: '#cf1322' }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="能耗指数"
                value={92.5}
                suffix="%"
                prefix={<ThunderboltOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Col>
          </Row>
        </Card>
      ),
    },
    {
      id: '7',
      title: '进度条样式',
      description: '展示任务进度和完成度的进度条样式。',
      component: (
        <Card className="demo-card" title="⏱️ 生产进度">
          <Space direction="vertical" style={{ width: '100%' }} size={16}>
            <div>
              <Text strong>1号转炉 - H20240115001</Text>
              <Progress percent={75} status="active" strokeColor="#52c41a" />
            </div>
            <div>
              <Text strong>2号转炉 - H20240115002</Text>
              <Progress percent={60} status="active" strokeColor="#1890ff" />
            </div>
            <div>
              <Text strong>1号LF炉 - L20240115001</Text>
              <Progress percent={90} status="active" strokeColor="#faad14" />
            </div>
            <div>
              <Text strong>2号LF炉 - L20240115002</Text>
              <Progress percent={45} status="active" strokeColor="#722ed1" />
            </div>
          </Space>
        </Card>
      ),
    },
    {
      id: '8',
      title: '描述列表样式',
      description: '展示详细信息的描述列表样式，适用于单条记录的详细信息展示。',
      component: (
        <Card className="demo-card" title="📋 炉次详情">
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="炉次号">H20240115001</Descriptions.Item>
            <Descriptions.Item label="钢种">Q235B</Descriptions.Item>
            <Descriptions.Item label="当前工序">转炉</Descriptions.Item>
            <Descriptions.Item label="钢水温度">1650°C</Descriptions.Item>
            <Descriptions.Item label="钢水量">320 吨</Descriptions.Item>
            <Descriptions.Item label="预计完成">15:30</Descriptions.Item>
            <Descriptions.Item label="碳含量" span={2}>0.18%</Descriptions.Item>
            <Descriptions.Item label="硅含量" span={2}>0.35%</Descriptions.Item>
            <Descriptions.Item label="锰含量" span={2}>0.55%</Descriptions.Item>
          </Descriptions>
        </Card>
      ),
    },
    {
      id: '9',
      title: '标签样式',
      description: '展示各种标签样式，用于标识状态、类型、优先级等。',
      component: (
        <Card className="demo-card" title="🏷️ 标签样式示例">
          <Space direction="vertical" style={{ width: '100%' }} size={12}>
            <div>
              <Text strong>状态标签：</Text>
              <Space wrap>
                <Tag icon={<CheckCircleOutlined />} color="success">正常</Tag>
                <Tag icon={<WarningOutlined />} color="warning">预警</Tag>
                <Tag icon={<CloseCircleOutlined />} color="error">异常</Tag>
                <Tag color="default">未知</Tag>
              </Space>
            </div>
            <div>
              <Text strong>工序标签：</Text>
              <Space wrap>
                <Tag icon={<FireOutlined />} color="processing">冶炼中</Tag>
                <Tag icon={<ExperimentOutlined />} color="cyan">精炼中</Tag>
                <Tag icon={<DashboardOutlined />} color="geekblue">浇铸中</Tag>
                <Tag color="default">待料</Tag>
              </Space>
            </div>
            <div>
              <Text strong>严重程度：</Text>
              <Space wrap>
                <Tag color="error">严重</Tag>
                <Tag color="warning">警告</Tag>
                <Tag color="info">提示</Tag>
              </Space>
            </div>
            <div>
              <Text strong>优先级：</Text>
              <Space wrap>
                <Tag color="red">高</Tag>
                <Tag color="orange">中</Tag>
                <Tag color="blue">低</Tag>
              </Space>
            </div>
          </Space>
        </Card>
      ),
    },
    {
      id: '10',
      title: '图标样式',
      description: '展示各种图标样式，用于增强视觉效果和用户体验。',
      component: (
        <Card className="demo-card" title="🎨 图标样式示例">
          <Space direction="vertical" style={{ width: '100%' }} size={16}>
            <div>
              <Text strong>功能图标：</Text>
              <Space size={16} style={{ marginLeft: 16 }}>
                <Space direction="vertical" align="center">
                  <FireOutlined style={{ fontSize: 24, color: '#ff4d4f' }} />
                  <Text type="secondary">冶炼</Text>
                </Space>
                <Space direction="vertical" align="center">
                  <ExperimentOutlined style={{ fontSize: 24, color: '#52c41a' }} />
                  <Text type="secondary">质量</Text>
                </Space>
                <Space direction="vertical" align="center">
                  <DashboardOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                  <Text type="secondary">设备</Text>
                </Space>
                <Space direction="vertical" align="center">
                  <InboxOutlined style={{ fontSize: 24, color: '#faad14' }} />
                  <Text type="secondary">物料</Text>
                </Space>
                <Space direction="vertical" align="center">
                  <ThunderboltOutlined style={{ fontSize: 24, color: '#722ed1' }} />
                  <Text type="secondary">能耗</Text>
                </Space>
                <Space direction="vertical" align="center">
                  <AlertOutlined style={{ fontSize: 24, color: '#cf1322' }} />
                  <Text type="secondary">报警</Text>
                </Space>
              </Space>
            </div>
            <div>
              <Text strong>状态图标：</Text>
              <Space size={16} style={{ marginLeft: 16 }}>
                <CheckCircleOutlined style={{ fontSize: 24, color: '#52c41a' }} />
                <Text>正常</Text>
                <WarningOutlined style={{ fontSize: 24, color: '#faad14' }} />
                <Text>警告</Text>
                <CloseCircleOutlined style={{ fontSize: 24, color: '#ff4d4f' }} />
                <Text>异常</Text>
                <RiseOutlined style={{ fontSize: 24, color: '#52c41a' }} />
                <Text>上升</Text>
                <FallOutlined style={{ fontSize: 24, color: '#ff4d4f' }} />
                <Text>下降</Text>
              </Space>
            </div>
          </Space>
        </Card>
      ),
    },
    {
      id: '11',
      title: '报表生成功能',
      description: '展示报表生成、预览和导出功能，支持多种报表类型和导出格式。',
      component: (
        <Card className="demo-card" title="📊 报表生成功能">
          <Space direction="vertical" style={{ width: '100%' }} size={16}>
            <div>
              <Text strong>功能特性：</Text>
              <ul style={{ marginLeft: 24, marginTop: 8 }}>
                <li>支持多种报表类型（生产状态、质量数据、设备状态、物料库存、能耗统计、报警记录）</li>
                <li>灵活的时间范围选择</li>
                <li>支持Excel和PDF导出格式</li>
                <li>实时预览和打印功能</li>
              </ul>
            </div>
            
            <Divider />

            <div>
              <Text strong>操作流程：</Text>
              <Row gutter={16} style={{ marginTop: 12 }}>
                <Col span={8}>
                  <Card size="small" hoverable>
                    <FileExcelOutlined style={{ fontSize: 32, color: '#52c41a', marginBottom: 8 }} />
                    <div>1. 选择报表类型</div>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card size="small" hoverable>
                    <EyeOutlined style={{ fontSize: 32, color: '#1890ff', marginBottom: 8 }} />
                    <div>2. 配置参数</div>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card size="small" hoverable>
                    <DownloadOutlined style={{ fontSize: 32, color: '#722ed1', marginBottom: 8 }} />
                    <div>3. 生成预览</div>
                  </Card>
                </Col>
              </Row>
            </div>

            <Divider />

            <div>
              <Text strong>导出选项：</Text>
              <Space wrap style={{ marginTop: 12 }}>
                <Button icon={<FileExcelOutlined />} type="default">
                  导出Excel
                </Button>
                <Button icon={<PrinterOutlined />} type="default">
                  打印报表
                </Button>
                <Button icon={<DownloadOutlined />} type="primary">
                  导出PDF
                </Button>
              </Space>
            </div>
          </Space>
        </Card>
      ),
    },
  ]

  return (
    <div className="demo-page-container">
      <div className="demo-header">
        <Title level={2}>🎭 Demo演示页面</Title>
        <Paragraph>
          本页面展示了OneAnswer系统支持的所有前端输出样式，包括文本、表格、图标、统计卡片、进度条、描述列表和标签等。
        </Paragraph>
      </div>

      <div className="demo-content">
        {demoExamples.map((example) => (
          <div key={example.id} className="demo-section">
            <div className="demo-section-header">
              <Title level={3}>{example.title}</Title>
              <Paragraph type="secondary">{example.description}</Paragraph>
            </div>
            <div className="demo-section-body">{example.component}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DemoPage
