import { useState, useEffect } from 'react'
import { Layout, Typography, Spin, Alert } from 'antd'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { FileTextOutlined } from '@ant-design/icons'
import './MarkdownPage.css'

const { Content } = Layout

interface MarkdownPageProps {
  filePath: string
  title: string
}

function MarkdownPage({ filePath, title }: MarkdownPageProps) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadMarkdown = async () => {
      try {
        setLoading(true)
        const response = await fetch(filePath)
        if (!response.ok) {
          throw new Error('Failed to load markdown file')
        }
        const text = await response.text()
        setContent(text)
        setError(null)
      } catch (err) {
        setError('加载文档失败，请稍后重试')
        console.error('Error loading markdown:', err)
      } finally {
        setLoading(false)
      }
    }

    loadMarkdown()
  }, [filePath])

  if (loading) {
    return (
      <Content className="markdown-page">
        <div className="markdown-loading">
          <Spin size="large" />
          <p>正在加载文档...</p>
        </div>
      </Content>
    )
  }

  if (error) {
    return (
      <Content className="markdown-page">
        <Alert
          message="加载失败"
          description={error}
          type="error"
          showIcon
          className="markdown-error"
        />
      </Content>
    )
  }

  return (
    <Content className="markdown-page">
      <div className="markdown-container">
        <div className="markdown-header">
          <FileTextOutlined className="header-icon" />
          <Typography.Title level={2} className="header-title">
            {title}
          </Typography.Title>
        </div>
        <div className="markdown-content">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => <h1 className="markdown-h1">{children}</h1>,
              h2: ({ children }) => <h2 className="markdown-h2">{children}</h2>,
              h3: ({ children }) => <h3 className="markdown-h3">{children}</h3>,
              h4: ({ children }) => <h4 className="markdown-h4">{children}</h4>,
              p: ({ children }) => <p className="markdown-p">{children}</p>,
              ul: ({ children }) => <ul className="markdown-ul">{children}</ul>,
              ol: ({ children }) => <ol className="markdown-ol">{children}</ol>,
              li: ({ children }) => <li className="markdown-li">{children}</li>,
              code: ({ node, inline, className, children, ...props }: any) => {
                const match = /language-(\w+)/.exec(className || '')
                return !inline && match ? (
                  <code className={className} {...props}>
                    {children}
                  </code>
                ) : (
                  <code className="markdown-inline-code" {...props}>
                    {children}
                  </code>
                )
              },
              pre: ({ children }) => <pre className="markdown-pre">{children}</pre>,
              blockquote: ({ children }) => <blockquote className="markdown-blockquote">{children}</blockquote>,
              table: ({ children }) => <table className="markdown-table">{children}</table>,
              thead: ({ children }) => <thead className="markdown-thead">{children}</thead>,
              tbody: ({ children }) => <tbody className="markdown-tbody">{children}</tbody>,
              tr: ({ children }) => <tr className="markdown-tr">{children}</tr>,
              th: ({ children }) => <th className="markdown-th">{children}</th>,
              td: ({ children }) => <td className="markdown-td">{children}</td>,
              hr: () => <hr className="markdown-hr" />,
              a: ({ href, children }) => <a href={href} className="markdown-a" target="_blank" rel="noopener noreferrer">{children}</a>,
              strong: ({ children }) => <strong className="markdown-strong">{children}</strong>,
              em: ({ children }) => <em className="markdown-em">{children}</em>,
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </Content>
  )
}

export default MarkdownPage