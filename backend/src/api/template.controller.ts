import { Controller, Get, Param } from '@nestjs/common';

export interface Template {
  id: string;
  name: string;
  query: string;
  tab: string;
  parameters: string[];
}

export interface Tab {
  id: string;
  name: string;
  icon: string;
  order: number;
}

@Controller('api/templates')
export class TemplateController {
  @Get()
  async getTemplates(): Promise<{ success: boolean; data: Template[] }> {
    // TODO: Load templates from database or config
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
    ];

    return { success: true, data: templates };
  }

  @Get('tab/:tabId')
  async getTemplatesByTab(
    @Param('tabId') tabId: string,
  ): Promise<{ success: boolean; data: Template[]; tabId: string }> {
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
    ];

    const filteredTemplates = templates.filter((t) => t.tab === tabId);
    return { success: true, data: filteredTemplates, tabId };
  }
}

@Controller('api/tabs')
export class TabController {
  @Get()
  async getTabs(): Promise<{ success: boolean; data: Tab[] }> {
    const tabs: Tab[] = [
      { id: 'production', name: '生产状态', icon: 'dashboard', order: 1 },
      { id: 'quality', name: '质量数据', icon: 'chart', order: 2 },
      { id: 'equipment', name: '设备管理', icon: 'setting', order: 3 },
      { id: 'material', name: '物料管理', icon: 'inbox', order: 4 },
      { id: 'energy', name: '能耗统计', icon: 'thunderbolt', order: 5 },
      { id: 'alerts', name: '异常报警', icon: 'alert', order: 6 },
    ];

    return { success: true, data: tabs };
  }
}