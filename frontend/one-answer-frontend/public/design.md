# 设计文档

## 1. 系统架构

### 1.1 整体架构

OneAnswer系统采用分层架构设计，主要包括以下组件：

- **前端交互层**：提供用户界面，包括查询输入框、Tab分类导航、结果展示区域
- **语义理解层**：负责解析用户输入，识别查询意图
- **数据处理层**：连接数据源，执行查询，处理数据
- **输出格式化层**：将查询结果转换为结构化格式

### 1.2 模块解耦设计原则

根据需求16，系统采用严格的模块解耦设计：

#### 1.2.1 分层架构

```
┌─────────────────────────────────────┐
│         前端交互层 (Frontend)        │
│   React + TypeScript + Ant Design   │
└──────────────┬──────────────────────┘
               │ REST API
┌──────────────▼──────────────────────┐
│         API网关层 (API Gateway)      │
│        认证授权 + 请求路由           │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         语义理解层 (NLP Layer)       │
│    意图分类 + 参数提取 + 语义匹配    │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         业务服务层 (Service Layer)   │
│   查询服务 + 数据服务 + 输出服务     │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         数据访问层 (Data Layer)      │
│    数据库访问 + 缓存管理 + 数据验证  │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│           数据源 (Data Sources)      │
│    生产数据库 + 模拟数据 + 外部接口  │
└─────────────────────────────────────┘
```

#### 1.2.2 模块间接口契约

每个模块定义清晰的接口契约，包括：

```typescript
// src/core/interfaces/semantic-engine.interface.ts
export interface ISemanticEngine {
  classifyIntent(query: string): Promise<QueryIntent>;
  extractParameters(query: string, intent: QueryIntent): Promise<QueryParams>;
}

// src/core/interfaces/data-service.interface.ts
export interface IDataService {
  query(intent: QueryIntent, params: QueryParams): Promise<QueryResult>;
  validateParams(params: QueryParams): boolean;
}

// src/core/interfaces/output-formatter.interface.ts
export interface IOutputFormatter {
  format(data: QueryResult, intent: QueryIntent): StructuredOutput;
}
```

#### 1.2.3 模块配置管理

```python
# config/modules.yaml
modules:
  semantic_engine:
    enabled: true
    model: "qwen"
    timeout: 5
  
  data_service:
    enabled: true
    use_mock_data: true  # MVP阶段使用模拟数据
    cache_enabled: true
  
  output_formatter:
    enabled: true
    default_format: "json"
  
  # 扩展功能模块（可按需启用）
  advanced_query:
    enabled: false
  
  user_auth:
    enabled: false
  
  history_service:
    enabled: false
```

### 1.3 技术选型

- **前端**：React + TypeScript + Ant Design
- **后端**：Node.js + TypeScript + NestJS
- **大模型**：LangChain.js（集成开源模型如Qwen、ChatGLM）
- **数据库**：SQLite（MVP）→ PostgreSQL（生产环境）
- **部署**：Docker容器化部署

## 2. 核心组件设计

### 2.1 语义识别引擎

#### 2.1.1 意图分类模型

使用大模型进行用户查询意图分类，输出标准化的意图类型：

```typescript
// src/core/enums/query-intent.enum.ts
export enum QueryIntent {
  PRODUCTION_STATUS = 'production_status',      // 生产状态查询
  QUALITY_DATA = 'quality_data',                // 质量数据查询
  EQUIPMENT_MANAGEMENT = 'equipment',           // 设备管理查询
  MATERIAL_MANAGEMENT = 'material',             // 物料管理查询
  ENERGY_CONSUMPTION = 'energy',                // 能耗统计查询
  ALARM_EXCEPTION = 'alarm',                    // 异常报警查询
  COMPARISON_ANALYSIS = 'comparison',           // 对比分析查询
  TREND_ANALYSIS = 'trend',                     // 趋势分析查询
}
```

#### 2.1.2 语义相似度匹配

使用向量相似度匹配，将用户输入映射到预定义的查询模板：

```typescript
// src/services/semantic-matcher.service.ts
import { Injectable } from '@nestjs/common';
import { QueryIntent } from '../core/enums/query-intent.enum';

interface QueryTemplate {
  id: string;
  query: string;
  intentType: QueryIntent;
}

@Injectable()
export class SemanticMatcher {
  private templates: QueryTemplate[];
  private embeddings: EmbeddingModel;

  async match(userQuery: string): Promise<Array<{ intentType: QueryIntent; score: number }>> {
    const queryEmbedding = await this.embeddings.encode(userQuery);
    const similarities: Array<{ intentType: QueryIntent; score: number }> = [];

    for (const template of this.templates) {
      const templateEmbedding = await this.embeddings.encode(template.query);
      const score = this.cosineSimilarity(queryEmbedding, templateEmbedding);
      similarities.push({ intentType: template.intentType, score });
    }

    return similarities.sort((a, b) => b.score - a.score);
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    // Implementation of cosine similarity
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  }
}
```

### 2.2 Tab分类展示设计

#### 2.2.1 Tab结构定义

```typescript
interface TabCategory {
  id: string;
  name: string;
  icon: string;
  templates: QueryTemplate[];
}

interface QueryTemplate {
  id: string;
  displayText: string;
  queryText: string;
  intentType: QueryIntent;
  parameters: TemplateParameter[];
}

interface TemplateParameter {
  name: string;
  type: 'time' | 'device' | 'material' | 'steel_grade';
  defaultValue?: string;
  placeholder?: string;
}
```

#### 2.2.2 Tab分类配置

```json
{
  "tabs": [
    {
      "id": "production_status",
      "name": "生产状态",
      "icon": "factory",
      "templates": [
        {
          "id": "current_status",
          "displayText": "当前冶炼情况",
          "queryText": "当前冶炼情况怎么样",
          "intentType": "production_status",
          "parameters": []
        },
        {
          "id": "recent_hot_metal",
          "displayText": "最近铁水情况",
          "queryText": "帮我查询最近{time}铁水情况",
          "intentType": "production_status",
          "parameters": [
            {"name": "time", "type": "time", "defaultValue": "3天"}
          ]
        }
      ]
    },
    {
      "id": "quality_data",
      "name": "质量数据",
      "icon": "chart",
      "templates": [...]
    },
    {
      "id": "equipment",
      "name": "设备管理",
      "icon": "tool",
      "templates": [...]
    },
    {
      "id": "material",
      "name": "物料管理",
      "icon": "box",
      "templates": [...]
    },
    {
      "id": "energy",
      "name": "能耗统计",
      "icon": "thunderbolt",
      "templates": [...]
    },
    {
      "id": "alarm",
      "name": "异常报警",
      "icon": "warning",
      "templates": [...]
    }
  ]
}
```

### 2.3 结构化输出设计

#### 2.3.1 输出格式定义

每种查询意图对应固定的输出结构：

```typescript
// src/core/classes/structured-output.class.ts
import { QueryIntent } from '../enums/query-intent.enum';

export class StructuredOutput {
  intentType: QueryIntent;
  metadata: OutputMetadata;
  data: Record<string, unknown>;

  constructor(intentType: QueryIntent) {
    this.intentType = intentType;
    this.metadata = new OutputMetadata();
    this.data = this.getDataStructure();
  }

  toJSON(): Record<string, unknown> {
    return {
      metadata: {
        queryTime: this.metadata.queryTime,
        intentType: this.metadata.intentType,
        dataSource: this.metadata.dataSource,
      },
      summary: this.generateSummary(),
      data: this.data,
    };
  }

  private getDataStructure(): Record<string, unknown> {
    // Implementation based on intent type
    return {};
  }

  private generateSummary(): string {
    // Generate human-readable summary
    return '';
  }
}
```

#### 2.3.2 各意图类型的输出结构

**生产状态查询输出：**

```json
{
  "metadata": {
    "query_time": "2024-01-15 14:30:00",
    "intent_type": "production_status",
    "data_source": "production_db"
  },
  "summary": "当前共有3台转炉运行中，2台LF炉精炼中，2台连铸机浇铸中。",
  "data": {
    "converters": [
      {
        "id": "1号转炉",
        "status": "冶炼中",
        "heat": "H20240115001",
        "steel_grade": "Q235B",
        "start_time": "2024-01-15 13:45:00",
        "estimated_completion": "2024-01-15 14:45:00"
      }
    ],
    "lf_furnaces": [...],
    "continuous_casters": [...]
  }
}
```

**铁水情况查询输出：**

```json
{
  "metadata": {
    "query_time": "2024-01-15 14:30:00",
    "intent_type": "production_status",
    "data_source": "production_db"
  },
  "summary": "最近3天共接收铁水42罐，平均温度1350°C。",
  "data": {
    "material_type": "hot_metal",
    "time_range": {
      "start": "2024-01-12 00:00:00",
      "end": "2024-01-15 14:30:00"
    },
    "total_heats": 42,
    "average_temperature": 1350,
    "hot_metal_list": [
      {
        "timestamp": "2024-01-15 12:30:00",
        "temperature": 1365,
        "composition": {
          "Si": 0.45,
          "Mn": 0.62,
          "P": 0.018,
          "S": 0.025
        },
        "weight": 320,
        "source_blast_furnace": "1号高炉"
      }
    ]
  }
}
```

**钢水情况查询输出：**

```json
{
  "metadata": {
    "query_time": "2024-01-15 14:30:00",
    "intent_type": "production_status",
    "data_source": "production_db"
  },
  "summary": "当前有8炉钢水在冶炼中，5炉在LF精炼，3炉准备连铸。",
  "data": {
    "material_type": "liquid_steel",
    "total_heats": 16,
    "by_process": {
      "converter": 8,
      "lf_furnace": 5,
      "continuous_casting": 3
    },
    "steel_list": [
      {
        "heat_id": "H20240115001",
        "steel_grade": "Q235B",
        "temperature": 1650,
        "composition": {
          "C": 0.18,
          "Si": 0.35,
          "Mn": 0.55,
          "P": 0.020,
          "S": 0.015
        },
        "current_process": "转炉",
        "weight": 320,
        "estimated_completion": "2024-01-15 15:30:00"
      }
    ]
  }
}
```

**合金情况查询输出：**

```json
{
  "metadata": {
    "query_time": "2024-01-15 14:30:00",
    "intent_type": "material",
    "data_source": "material_db"
  },
  "summary": "合金库存整体正常，硅锰合金库存偏低需补货。",
  "data": {
    "material_type": "alloy",
    "alloys": [
      {
        "name": "硅锰合金",
        "grade": "FeMn65Si17",
        "current_stock": 150,
        "unit": "吨",
        "daily_consumption": 25,
        "days_remaining": 6,
        "warning_threshold": 100,
        "status": "warning"
      },
      {
        "name": "铬铁",
        "grade": "FeCr55C1000",
        "current_stock": 80,
        "unit": "吨",
        "daily_consumption": 8,
        "days_remaining": 10,
        "warning_threshold": 50,
        "status": "normal"
      }
    ],
    "consumption_trend": "stable"
  }
}
```

**辅料情况查询输出：**

```json
{
  "metadata": {
    "query_time": "2024-01-15 14:30:00",
    "intent_type": "material",
    "data_source": "material_db"
  },
  "summary": "辅料库存整体正常，石灰库存需关注。",
  "data": {
    "material_type": "auxiliary_material",
    "materials": [
      {
        "name": "石灰",
        "current_stock": 200,
        "unit": "吨",
        "daily_consumption": 50,
        "days_remaining": 4,
        "warning_threshold": 150,
        "status": "warning"
      },
      {
        "name": "萤石",
        "current_stock": 30,
        "unit": "吨",
        "daily_consumption": 3,
        "days_remaining": 10,
        "warning_threshold": 20,
        "status": "normal"
      },
      {
        "name": "耐火材料",
        "current_stock": 500,
        "unit": "套",
        "daily_consumption": 2,
        "days_remaining": 250,
        "warning_threshold": 100,
        "status": "normal"
      }
    ],
    "restock_suggestion": {
      "material": "石灰",
      "suggested_quantity": 100,
      "reason": "库存可用天数低于安全阈值"
    }
  }
}
```

**异常报警查询输出：**

```json
{
  "metadata": {
    "query_time": "2024-01-15 14:30:00",
    "intent_type": "alarm",
    "data_source": "alarm_db"
  },
  "summary": "当前有2条未处理报警，均为设备故障。",
  "data": {
    "unresolved_count": 2,
    "alarms": [
      {
        "id": "ALM-20240115-001",
        "type": "设备故障",
        "device": "2号转炉",
        "severity": "严重",
        "message": "氧枪流量异常",
        "occurred_at": "2024-01-15 10:23:00",
        "status": "未处理"
      }
    ],
    "statistics": {
      "total_alarms_today": 5,
      "resolved": 3,
      "unresolved": 2
    }
  }
}
```

## 3. 数据流设计

### 3.1 查询处理流程

```
用户输入 → 语义识别 → 意图分类 → 参数提取 → 数据查询 → 结果格式化 → 返回输出
```

### 3.2 关键流程说明

1. **语义识别阶段**：使用大模型理解用户输入，提取关键信息
2. **意图分类阶段**：将用户查询归类到预定义的意图类型
3. **参数提取阶段**：从用户输入中提取时间、设备、钢种等参数
4. **数据查询阶段**：根据意图类型和参数执行数据库查询
5. **结果格式化阶段**：将查询结果转换为结构化输出

## 4. 接口设计

### 4.1 查询接口

```typescript
// src/api/query.dto.ts
export class QueryRequest {
  userId: string;
  queryText: string;
  outputFormat: string = 'json';
}

export class QueryResponse {
  queryId: string;
  intentType: string;
  structuredOutput: Record<string, unknown>;
  rawData?: Record<string, unknown>;
}

// src/api/query.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { QueryService } from './query.service';

@Controller('api')
export class QueryController {
  constructor(private readonly queryService: QueryService) {}

  @Post('query')
  async processQuery(@Body() request: QueryRequest): Promise<QueryResponse> {
    // 1. 语义识别和意图分类
    const intent = await this.queryService.classifyIntent(request.queryText);
    
    // 2. 提取查询参数
    const params = await this.queryService.extractParams(request.queryText, intent);
    
    // 3. 执行数据查询
    const data = await this.queryService.query(intent, params);
    
    // 4. 格式化输出
    const output = await this.queryService.format(data, intent);
    
    return {
      queryId: this.generateQueryId(),
      intentType: intent,
      structuredOutput: output
    };
  }

  private generateQueryId(): string {
    return `Q${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
  }
}
```

### 4.2 Tab模板接口

```typescript
// src/api/template.controller.ts
import { Controller, Get } from '@nestjs/common';
import { TemplateService } from './template.service';

@Controller('api')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Get('templates')
  async getTemplates(): Promise<{ tabs: TabCategory[]; templates: QueryTemplate[] }> {
    return {
      tabs: this.templateService.getAllTabs(),
      templates: this.templateService.getAllTemplates()
    };
  }
}
```

## 5. 部署架构

### 5.1 容器化部署

```yaml
# docker-compose.yml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://backend:8000

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@production_db:5432/steel
      - LLM_MODEL_PATH=/models/qwen
    volumes:
      - ./models:/models

  llm:
    image: vllm/vllm-openai:latest
    ports:
      - "8001:8000"
    volumes:
      - ./models:/models
    command: --model /models/qwen --host 0.0.0.0
```

### 5.2 网络架构

- 前端通过HTTPS访问
- 后端与数据库在同一内网
- 大模型服务通过内部API调用
- 所有服务部署在炼钢厂内网环境

## 6. 模拟数据设计

根据需求18，系统提供完整的模拟数据支持。

### 6.1 模拟数据类型

#### 6.1.1 铁水数据

#### 6.1.1 铁水数据

```typescript
// src/services/mock-data/hot-metal.mock-data.ts
import { Injectable } from '@nestjs/common';

interface HotMetalRecord {
  id: string;
  timestamp: string;
  temperature: number;
  composition: {
    Si: number;
    Mn: number;
    P: number;
    S: number;
  };
  weight: number;
  sourceBlastFurnace: string;
}

@Injectable()
export class HotMetalMockData {
  private readonly blastFurnaces = ['1号高炉', '2号高炉', '3号高炉'];
  private readonly temperatureRange = [1300, 1450];
  private readonly compositionRange = {
    Si: [0.3, 0.8],
    Mn: [0.4, 0.8],
    P: [0.01, 0.05],
    S: [0.01, 0.05]
  };
  private readonly weightRange = [280, 350];

  generate(count: number = 100, days: number = 7): HotMetalRecord[] {
    const data: HotMetalRecord[] = [];
    const endTime = new Date();
    const startTime = new Date(endTime.getTime() - days * 24 * 60 * 60 * 1000);

    for (let i = 0; i < count; i++) {
      const timestamp = new Date(
        startTime.getTime() + Math.random() * (endTime.getTime() - startTime.getTime())
      );
      
      data.push({
        id: `HM${startTime.toISOString().slice(0, 10).replace(/-/g, '')}${i.toString().padStart(4, '0')}`,
        timestamp: timestamp.toISOString(),
        temperature: this.randomInt(this.temperatureRange[0], this.temperatureRange[1]),
        composition: {
          Si: this.round(this.random(this.compositionRange.Si[0], this.compositionRange.Si[1]), 3),
          Mn: this.round(this.random(this.compositionRange.Mn[0], this.compositionRange.Mn[1]), 3),
          P: this.round(this.random(this.compositionRange.P[0], this.compositionRange.P[1]), 4),
          S: this.round(this.random(this.compositionRange.S[0], this.compositionRange.S[1]), 4)
        },
        weight: this.round(this.random(this.weightRange[0], this.weightRange[1]), 1),
        sourceBlastFurnace: this.blastFurnaces[Math.floor(Math.random() * this.blastFurnaces.length)]
      });
    }

    return data.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  private random(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  private randomInt(min: number, max: number): number {
    return Math.floor(this.random(min, max + 1));
  }

  private round(value: number, decimals: number): number {
    return Number(value.toFixed(decimals));
  }
}
```

#### 6.1.2 冶炼状态数据

```typescript
// src/services/mock-data/smelting-status.mock-data.ts
import { Injectable } from '@nestjs/common';

interface ConverterStatus {
  id: string;
  status: string;
  heat: string;
  steelGrade: string;
  startTime: string;
  estimatedCompletion: string;
}

interface LFFurnaceStatus {
  id: string;
  status: string;
  steelGrade: string;
  startTime: string;
  estimatedCompletion: string;
}

interface CasterStatus {
  id: string;
  status: string;
  steelGrade: string;
  progress: number;
  heat: string;
}

@Injectable()
export class SmeltingStatusMockData {
  private readonly converterCount = 3;
  private readonly lfCount = 2;
  private readonly casterCount = 2;
  private readonly steelGrades = ['Q235B', 'Q345B', 'HRB400', '20MnSi'];
  private readonly statusList = ['冶炼中', '待料', '检修'];

  generateConverters(): ConverterStatus[] {
    const converters: ConverterStatus[] = [];
    const now = new Date();

    for (let i = 1; i <= this.converterCount; i++) {
      const status = this.statusList[Math.floor(Math.random() * this.statusList.length)];
      converters.push({
        id: `${i}号转炉`,
        status,
        heat: `H${now.toISOString().slice(0, 10).replace(/-/g, '')}${Math.floor(Math.random() * 50).toString().padStart(3, '0')}`,
        steelGrade: this.steelGrades[Math.floor(Math.random() * this.steelGrades.length)],
        startTime: new Date(now.getTime() - (10 + Math.random() * 30) * 60 * 1000).toISOString(),
        estimatedCompletion: new Date(now.getTime() + (10 + Math.random() * 20) * 60 * 1000).toISOString()
      });
    }
    return converters;
  }

  generateLFFurnaces(): LFFurnaceStatus[] {
    const lfFurnaces: LFFurnaceStatus[] = [];
    const now = new Date();

    for (let i = 1; i <= this.lfCount; i++) {
      const status = this.statusList[Math.floor(Math.random() * this.statusList.length)];
      lfFurnaces.push({
        id: `LF${i}号`,
        status,
        steelGrade: this.steelGrades[Math.floor(Math.random() * this.steelGrades.length)],
        startTime: new Date(now.getTime() - (20 + Math.random() * 40) * 60 * 1000).toISOString(),
        estimatedCompletion: new Date(now.getTime() + (15 + Math.random() * 30) * 60 * 1000).toISOString()
      });
    }
    return lfFurnaces;
  }

  generateCasters(): CasterStatus[] {
    const casters: CasterStatus[] = [];
    const now = new Date();
    const casterStatuses = ['浇铸中', '待料', '停机'];

    for (let i = 1; i <= this.casterCount; i++) {
      const status = casterStatuses[Math.floor(Math.random() * casterStatuses.length)];
      const progress = status === '浇铸中' ? Math.floor(Math.random() * 80) + 10 : 0;
      casters.push({
        id: `连铸机${i}号`,
        status,
        steelGrade: this.steelGrades[Math.floor(Math.random() * this.steelGrades.length)],
        progress,
        heat: `C${now.toISOString().slice(0, 10).replace(/-/g, '')}${Math.floor(Math.random() * 20).toString().padStart(3, '0')}`
      });
    }
    return casters;
  }
}
```

#### 6.1.3 异常报警数据

```typescript
// src/services/mock-data/alarm.mock-data.ts
import { Injectable } from '@nestjs/common';

interface AlarmRecord {
  id: string;
  type: string;
  device: string;
  severity: string;
  message: string;
  occurredAt: string;
  status: string;
}

@Injectable()
export class AlarmMockData {
  private readonly alarmTypes = [
    { type: '设备故障', severity: '严重' },
    { type: '温度异常', severity: '警告' },
    { type: '成分超标', severity: '严重' },
    { type: '生产延迟', severity: '警告' },
    { type: '压力异常', severity: '警告' }
  ];
  private readonly devices = ['1号转炉', '2号转炉', 'LF1号', '连铸机1号'];
  private readonly statusList = ['未处理', '处理中', '已处理'];

  generate(count: number = 20, days: number = 7): AlarmRecord[] {
    const alarms: AlarmRecord[] = [];
    const endTime = new Date();
    const startTime = new Date(endTime.getTime() - days * 24 * 60 * 60 * 1000);

    for (let i = 0; i < count; i++) {
      const alarmType = this.alarmTypes[Math.floor(Math.random() * this.alarmTypes.length)];
      const device = this.devices[Math.floor(Math.random() * this.devices.length)];
      const status = this.statusList[Math.floor(Math.random() * this.statusList.length)];

      alarms.push({
        id: `ALM${endTime.toISOString().slice(0, 10).replace(/-/g, '')}${i.toString().padStart(4, '0')}`,
        type: alarmType.type,
        device,
        severity: alarmType.severity,
        message: this.generateMessage(alarmType.type, device),
        occurredAt: new Date(
          startTime.getTime() + Math.random() * (endTime.getTime() - startTime.getTime())
        ).toISOString(),
        status
      });
    }

    return alarms.sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());
  }

  private generateMessage(alarmType: string, device: string): string {
    const messages: Record<string, string> = {
      '设备故障': `${device}设备发生故障，需要检修`,
      '温度异常': `${device}温度超出正常范围`,
      '成分超标': `${device}钢水成分检测超标`,
      '生产延迟': `${device}生产进度延迟`,
      '压力异常': `${device}压力异常波动`
    };
    return messages[alarmType] || '发生异常情况';
  }
}
```

### 6.2 模拟数据配置

```yaml
# config/mock_data.yaml
mock_data:
  enabled: true  # MVP阶段启用
  
  hot_metal:
    enabled: true
    record_count: 100
    days_range: 7
    generate_abnormal: true  # 生成异常数据用于测试
    
  smelting_status:
    enabled: true
    converter_count: 3
    lf_count: 2
    caster_count: 2
    
  alarm:
    enabled: true
    record_count: 20
    days_range: 7
    abnormal_ratio: 0.3  # 30%为异常数据
  
  # 扩展数据（MVP后启用）
  steel_water:
    enabled: false
    
  alloy:
    enabled: false
    
  auxiliary_material:
    enabled: false
```

### 6.3 模拟数据API

```python
from fastapi import APIRouter

router = APIRouter()

@router.get("/api/mock/reset")
async def reset_mock_data():
    """重置模拟数据到初始状态"""
    mock_data_generator.reset()
    return {"message": "模拟数据已重置"}

@router.get("/api/mock/generate")
async def generate_mock_data(data_type: str = "all"):
    """生成指定类型的模拟数据"""
    if data_type == "all":
        mock_data_generator.generate_all()
    else:
        mock_data_generator.generate(data_type)
    return {"message": f"{data_type}数据已生成"}

@router.get("/api/mock/status")
async def get_mock_data_status():
    """获取模拟数据状态"""
    return mock_data_generator.get_status()
```

## 7. 性能要求

- 查询响应时间：< 2秒
- 并发用户数：支持50+用户同时查询
- 大模型推理时间：< 1秒
- 数据库查询时间：< 500毫秒