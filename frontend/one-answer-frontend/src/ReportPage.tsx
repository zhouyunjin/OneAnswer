import { useState } from 'react'
import { Card, Button, Table, DatePicker, Select, Space, Modal, Radio, Divider, Tag, Progress, Row, Col, Statistic, Typography, Alert } from 'antd'
import { 
  FileTextOutlined, 
  DownloadOutlined, 
  EyeOutlined, 
  PrinterOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  CheckCircleOutlined,
  ThunderboltOutlined,
  AlertOutlined
} from '@ant-design/icons'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import './ReportPage.css'

const { RangePicker } = DatePicker
const { Title, Text } = Typography
const { Option } = Select

interface ReportTemplate {
  id: string
  name: string
  description: string
  type: 'production' | 'quality' | 'equipment' | 'material' | 'energy' | 'alarm'
  icon: React.ReactNode
}

interface ReportData {
  key: string
  [key: string]: any
}

function ReportPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null)
  const [exportFormat, setExportFormat] = useState<'excel' | 'pdf'>('excel')
  const [previewVisible, setPreviewVisible] = useState(false)
  const [reportData, setReportData] = useState<ReportData[]>([])
  const [generating, setGenerating] = useState(false)

  const reportTemplates: ReportTemplate[] = [
    {
      id: 'production-status',
      name: '生产状态报表',
      description: '包含转炉、LF炉、连铸机等设备的实时状态和生产进度',
      type: 'production',
      icon: <BarChartOutlined />,
    },
    {
      id: 'quality-data',
      name: '质量数据报表',
      description: '包含铁水、钢水的成分分析数据和质量指标统计',
      type: 'quality',
      icon: <LineChartOutlined />,
    },
    {
      id: 'equipment-status',
      name: '设备状态报表',
      description: '包含各设备的运行状态、检修记录和故障统计',
      type: 'equipment',
      icon: <PieChartOutlined />,
    },
    {
      id: 'material-inventory',
      name: '物料库存报表',
      description: '包含合金、辅料等物料的库存量、消耗量和预警信息',
      type: 'material',
      icon: <FileTextOutlined />,
    },
    {
      id: 'energy-consumption',
      name: '能耗统计报表',
      description: '包含各工序的电耗、气耗、水耗等能耗数据',
      type: 'energy',
      icon: <ThunderboltOutlined />,
    },
    {
      id: 'alarm-record',
      name: '报警记录报表',
      description: '包含设备故障、温度超限、成分异常等报警记录',
      type: 'alarm',
      icon: <AlertOutlined />,
    },
  ]

  const handleGenerate = async () => {
    if (!selectedTemplate) {
      return
    }

    setGenerating(true)
    
    setTimeout(() => {
      const mockData = generateMockData(selectedTemplate)
      setReportData(mockData)
      setGenerating(false)
      setPreviewVisible(true)
    }, 1000)
  }

  const generateMockData = (templateId: string): ReportData[] => {
    switch (templateId) {
      case 'production-status':
        return [
          {
            key: '1',
            设备名称: '1号转炉',
            当前状态: '冶炼中',
            当前炉次: 'H20240115001',
            钢种: 'Q235B',
            开始时间: '2024-01-15 13:45:00',
            预计完成: '2024-01-15 14:45:00',
            进度: 75,
          },
          {
            key: '2',
            设备名称: '2号转炉',
            当前状态: '冶炼中',
            当前炉次: 'H20240115002',
            钢种: 'Q345B',
            开始时间: '2024-01-15 14:00:00',
            预计完成: '2024-01-15 15:00:00',
            进度: 60,
          },
          {
            key: '3',
            设备名称: '1号LF炉',
            当前状态: '精炼中',
            当前炉次: 'L20240115001',
            钢种: 'Q235B',
            开始时间: '2024-01-15 14:30:00',
            预计完成: '2024-01-15 15:30:00',
            进度: 45,
          },
        ]
      case 'quality-data':
        return [
          {
            key: '1',
            炉次号: 'H20240115001',
            钢种: 'Q235B',
            碳含量: '0.18%',
            硅含量: '0.35%',
            锰含量: '0.55%',
            磷含量: '0.020%',
            硫含量: '0.015%',
            合格状态: '合格',
          },
          {
            key: '2',
            炉次号: 'H20240115002',
            钢种: 'Q345B',
            碳含量: '0.22%',
            硅含量: '0.42%',
            锰含量: '0.65%',
            磷含量: '0.018%',
            硫含量: '0.012%',
            合格状态: '合格',
          },
        ]
      case 'material-inventory':
        return [
          {
            key: '1',
            物料名称: '硅锰合金',
            牌号: 'FeMn65Si17',
            当前库存: 150,
            单位: '吨',
            日消耗量: 25,
            可用天数: 6,
            预警状态: '预警',
          },
          {
            key: '2',
            物料名称: '铬铁',
            牌号: 'FeCr55C1000',
            当前库存: 80,
            单位: '吨',
            日消耗量: 8,
            可用天数: 10,
            预警状态: '正常',
          },
          {
            key: '3',
            物料名称: '石灰',
            牌号: 'CaO-95',
            当前库存: 200,
            单位: '吨',
            日消耗量: 50,
            可用天数: 4,
            预警状态: '预警',
          },
        ]
      default:
        return []
    }
  }

  const handleExport = () => {
    if (!reportData || reportData.length === 0) {
      return
    }

    const filename = `${selectedTemplate}_${dayjs().format('YYYY-MM-DD')}.${exportFormat}`
    
    if (exportFormat === 'excel') {
      exportToExcel(reportData, filename)
    } else {
      exportToPdf(reportData, filename)
    }
  }

  const exportToExcel = (data: ReportData[], filename: string) => {
    const headers = Object.keys(data[0]).join(',')
    const rows = data.map(row => Object.values(row).join(','))
    const csvContent = [headers, ...rows].join('\n')
    
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename
    link.click()
  }

  const exportToPdf = (data: ReportData[], filename: string) => {
    const printContent = document.createElement('div')
    printContent.innerHTML = `
      <style>
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background: #f5f5f5; font-weight: bold; }
      </style>
      <h2>${reportTemplates.find(t => t.id === selectedTemplate)?.name}</h2>
      <table>
        <thead>
          <tr>
            ${Object.keys(data[0]).map(key => `<th>${key}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${data.map(row => `
            <tr>
              ${Object.values(row).map(val => `<td>${val}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    `
    
    const printWindow = window.open('', '', 'width=800,height=600')
    if (printWindow) {
      printWindow.document.write(printContent.innerHTML)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const getColumns = () => {
    if (reportData.length === 0) return []
    
    return Object.keys(reportData[0]).map(key => ({
      title: key,
      dataIndex: key,
      key: key,
      render: (value: any, record: any) => {
        if (key === '进度') {
          return <Progress percent={value} size="small" />
        }
        if (key === '预警状态' || key === '合格状态') {
          const color = value === '合格' || value === '正常' ? 'success' : value === '预警' ? 'warning' : 'error'
          return <Tag color={color}>{value}</Tag>
        }
        return value
      },
    }))
  }

  return (
    <div className="report-page">
      <div className="report-header">
        <Title level={2}>📊 报表生成中心</Title>
        <Text type="secondary">选择报表模板，生成、预览和导出各类生产报表</Text>
      </div>

      <Row gutter={[24, 24]}>
        <Col span={8}>
          <Card className="report-config-card" title="报表配置">
            <Space direction="vertical" style={{ width: '100%' }} size={16}>
              <div>
                <Text strong>报表类型</Text>
                <Select
                  style={{ width: '100%', marginTop: 8 }}
                  placeholder="请选择报表类型"
                  value={selectedTemplate}
                  onChange={setSelectedTemplate}
                >
                  {reportTemplates.map(template => (
                    <Option key={template.id} value={template.id}>
                      <Space>
                        {template.icon}
                        <span>{template.name}</span>
                      </Space>
                    </Option>
                  ))}
                </Select>
              </div>

              {selectedTemplate && (
                <Alert
                  message={reportTemplates.find(t => t.id === selectedTemplate)?.description}
                  type="info"
                  showIcon
                />
              )}

              <div>
                <Text strong>时间范围</Text>
                <RangePicker
                  style={{ width: '100%', marginTop: 8 }}
                  placeholder={['开始日期', '结束日期']}
                  value={dateRange}
                  onChange={(dates) => setDateRange(dates as [Dayjs, Dayjs])}
                />
              </div>

              <div>
                <Text strong>导出格式</Text>
                <Radio.Group
                  style={{ width: '100%', marginTop: 8 }}
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value)}
                >
                  <Radio.Button value="excel">
                    <FileExcelOutlined style={{ marginRight: 4 }} />
                    Excel
                  </Radio.Button>
                  <Radio.Button value="pdf">
                    <FilePdfOutlined style={{ marginRight: 4 }} />
                    PDF
                  </Radio.Button>
                </Radio.Group>
              </div>

              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Button
                  icon={<EyeOutlined />}
                  onClick={() => setPreviewVisible(true)}
                  disabled={!selectedTemplate || reportData.length === 0}
                >
                  预览
                </Button>
                <Button
                  type="primary"
                  icon={<FileTextOutlined />}
                  onClick={handleGenerate}
                  loading={generating}
                  disabled={!selectedTemplate}
                >
                  生成报表
                </Button>
              </Space>

              <Button
                icon={<DownloadOutlined />}
                onClick={handleExport}
                disabled={reportData.length === 0}
                block
              >
                导出报表
              </Button>
            </Space>
          </Card>
        </Col>

        <Col span={16}>
          <Card className="report-preview-card" title="报表预览">
            {reportData.length === 0 ? (
              <div className="empty-preview">
                <FileTextOutlined className="empty-icon" />
                <Text type="secondary">请先选择报表类型并生成报表</Text>
              </div>
            ) : (
              <>
                <div className="preview-stats">
                  <Row gutter={16}>
                    <Col span={6}>
                      <Statistic
                        title="数据行数"
                        value={reportData.length}
                        prefix={<FileTextOutlined />}
                      />
                    </Col>
                    <Col span={6}>
                      <Statistic
                        title="生成时间"
                        value={dayjs().format('HH:mm:ss')}
                        prefix={<CheckCircleOutlined />}
                      />
                    </Col>
                    <Col span={6}>
                      <Statistic
                        title="报表类型"
                        value={reportTemplates.find(t => t.id === selectedTemplate)?.name?.split(' ')[0]}
                        prefix={<BarChartOutlined />}
                      />
                    </Col>
                    <Col span={6}>
                      <Statistic
                        title="导出格式"
                        value={exportFormat.toUpperCase()}
                        prefix={exportFormat === 'excel' ? <FileExcelOutlined /> : <FilePdfOutlined />}
                      />
                    </Col>
                  </Row>
                </div>

                <Divider />

                <Table
                  columns={getColumns()}
                  dataSource={reportData}
                  pagination={false}
                  bordered
                  size="small"
                  scroll={{ y: 400 }}
                />
              </>
            )}
          </Card>
        </Col>
      </Row>

      <Modal
        title="报表预览"
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        width={1000}
        footer={[
          <Button key="close" onClick={() => setPreviewVisible(false)}>
            关闭
          </Button>,
          <Button key="print" icon={<PrinterOutlined />} onClick={() => window.print()}>
            打印
          </Button>,
          <Button
            key="export"
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleExport}
          >
            导出
          </Button>,
        ]}
      >
        {reportData.length > 0 && (
          <Table
            columns={getColumns()}
            dataSource={reportData}
            pagination={false}
            bordered
            size="middle"
          />
        )}
      </Modal>
    </div>
  )
}

export default ReportPage
