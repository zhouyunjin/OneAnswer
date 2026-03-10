import { ConfigProvider } from 'antd'
import './App.css'

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
        },
      }}
    >
      <div className="app-container">
        <h1>OneAnswer 炼钢行业智能问答系统</h1>
      </div>
    </ConfigProvider>
  )
}

export default App