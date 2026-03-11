import { apiClient } from '../utils/api'

export interface QueryRequest {
  query: string
  tab?: string
  outputFormat?: string
}

export interface QueryResponse {
  queryId: string
  intent: string
  intentType: string
  parameters: Record<string, any>
  result: {
    data: any[]
    summary: string
    metadata: {
      queryTime: number
      recordCount: number
      timestamp: string
      intentType: string
      dataSource: string
    }
  }
  processingTime: number
  fromCache: boolean
  timestamp: string
}

export interface Tab {
  id: string
  name: string
  icon: string
  order: number
}

export interface Template {
  id: string
  name: string
  query: string
  tab: string
  parameters: string[]
}

export interface TemplatesResponse {
  success: boolean
  data: Template[]
}

export interface TabsResponse {
  success: boolean
  data: Tab[]
}

export const queryApi = {
  async submitQuery(request: QueryRequest): Promise<QueryResponse> {
    return apiClient.post<QueryResponse>('/api/query', request)
  },
}

export const templateApi = {
  async getTemplates(): Promise<TemplatesResponse> {
    return apiClient.get<TemplatesResponse>('/api/templates')
  },

  async getTemplatesByTab(tabId: string): Promise<TemplatesResponse> {
    return apiClient.get<TemplatesResponse>(`/api/templates/tab/${tabId}`)
  },
}

export const tabApi = {
  async getTabs(): Promise<TabsResponse> {
    return apiClient.get<TabsResponse>('/api/tabs')
  },
}
