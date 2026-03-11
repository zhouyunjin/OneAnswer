import { Injectable, Logger } from '@nestjs/common';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { AppConfigService } from '../core/config/config.service';
import { QueryIntent } from '../core/enums/query-intent.enum';
import { ISemanticEngine } from '../core/interfaces/semantic-engine.interface';
import { QueryParams } from '../core/interfaces/query.interface';

@Injectable()
export class SemanticEngineService implements ISemanticEngine {
  private readonly logger = new Logger(SemanticEngineService.name);
  private chatModel: ChatOpenAI | null = null;

  constructor(private readonly configService: AppConfigService) {
    this.initializeModel();
  }

  private initializeModel(): void {
    try {
      const apiKey = this.configService.llmApiKey;
      const model = this.configService.llmModel;
      const temperature = this.configService.llmTemperature;
      const maxTokens = this.configService.llmMaxTokens;
      const apiBase = this.configService.llmApiBase;

      const modelConfig: any = {
        modelName: model,
        temperature: Number(temperature),
        maxTokens: Number(maxTokens),
      };

      if (apiBase) {
        modelConfig.configuration = {
          baseURL: apiBase,
        };
      }

      if (apiKey) {
        modelConfig.openAIApiKey = apiKey;
        this.chatModel = new ChatOpenAI(modelConfig);
        this.logger.log('LLM model initialized successfully');
      } else if (apiBase) {
        this.chatModel = new ChatOpenAI(modelConfig);
        this.logger.log('LLM model initialized with custom API base');
      } else {
        this.logger.warn('LLM API key not configured, using fallback logic');
      }
    } catch (error) {
      this.logger.error('Failed to initialize LLM model', error.stack);
    }
  }

  async classifyIntent(query: string): Promise<QueryIntent> {
    if (!this.chatModel) {
      return this.fallbackClassifyIntent(query);
    }

    try {
      const systemPrompt = `你是一个炼钢行业智能问答系统的意图分类器。你的任务是识别用户查询的意图类型。

支持的意图类型：
- production_status: 生产状态查询（铁水情况、冶炼状态、钢水情况、生产进度等）
- quality_data: 质量数据查询（成分分析、质量指标、合格率、检验结果、钢种质量等）
- equipment: 设备管理查询（设备状态、维护记录、设备效率、检修计划等）
- material: 物料管理查询（合金库存、辅料库存、造渣剂、脱氧剂等）
- energy: 能耗统计查询（电耗、氧气消耗、天然气消耗、蒸汽消耗等）
- alarm: 异常报警查询（设备故障、温度超限、压力异常等）

重要规则：
1. 当查询包含"质量"、"成分"、"合格率"、"检验"、"钢种"等关键词时，必须返回 quality_data
2. 当查询包含"设备"、"检修"、"维护"、"运行状态"等关键词时，必须返回 equipment
3. 当查询包含"库存"、"合金"、"辅料"、"物料"等关键词时，必须返回 material
4. 当查询包含"能耗"、"电耗"、"氧气"、"天然气"等关键词时，必须返回 energy
5. 当查询包含"报警"、"异常"、"故障"、"超限"等关键词时，必须返回 alarm

请只返回意图类型的英文代码，不要返回其他内容。`;

      const response = await this.chatModel.invoke([
        new SystemMessage(systemPrompt),
        new HumanMessage(query),
      ]);

      const intentText = response.content.toString().trim().toLowerCase();
      const intent = this.mapTextToIntent(intentText);
      
      this.logger.debug(`Classified intent: ${intent} for query: ${query}`);
      return intent;
    } catch (error) {
      this.logger.error('Failed to classify intent using LLM, using fallback', error.stack);
      return this.fallbackClassifyIntent(query);
    }
  }

  async extractParameters(query: string, intent: QueryIntent): Promise<QueryParams> {
    if (!this.chatModel) {
      return this.fallbackExtractParameters(query, intent);
    }

    try {
      const systemPrompt = `你是一个参数提取器。从用户查询中提取以下参数：
- timeRange: 时间范围（如"最近3天"、"今天"、"本周"）
- deviceIds: 设备编号（如"1号转炉"、"转炉1"）
- materialType: 物料类型（如"铁水"、"钢水"、"合金"）
- steelGrade: 钢种（如"Q235"、"Q345"）
- processType: 工序类型（如"转炉"、"LF炉"、"连铸"）

请以JSON格式返回提取的参数，如果某个参数不存在则不包含该字段。`;

      const response = await this.chatModel.invoke([
        new SystemMessage(systemPrompt),
        new HumanMessage(query),
      ]);

      const paramsText = response.content.toString().trim();
      const params = this.parseParamsFromText(paramsText);
      
      this.logger.debug(`Extracted parameters: ${JSON.stringify(params)} for query: ${query}`);
      return params;
    } catch (error) {
      this.logger.error('Failed to extract parameters using LLM, using fallback', error.stack);
      return this.fallbackExtractParameters(query, intent);
    }
  }

  private fallbackClassifyIntent(query: string): QueryIntent {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('报警') || lowerQuery.includes('异常') || lowerQuery.includes('故障') || lowerQuery.includes('超限')) {
      return QueryIntent.ALARM_EXCEPTION;
    }
    if (lowerQuery.includes('合金') || lowerQuery.includes('辅料') || lowerQuery.includes('库存') || lowerQuery.includes('物料') || lowerQuery.includes('造渣剂') || lowerQuery.includes('脱氧剂')) {
      return QueryIntent.MATERIAL_MANAGEMENT;
    }
    if (lowerQuery.includes('质量') || lowerQuery.includes('成分') || lowerQuery.includes('合格率') || lowerQuery.includes('检验') || lowerQuery.includes('钢种')) {
      return QueryIntent.QUALITY_DATA;
    }
    if (lowerQuery.includes('设备') || lowerQuery.includes('检修') || lowerQuery.includes('维护') || lowerQuery.includes('运行状态') || lowerQuery.includes('效率')) {
      return QueryIntent.EQUIPMENT_MANAGEMENT;
    }
    if (lowerQuery.includes('能耗') || lowerQuery.includes('电耗') || lowerQuery.includes('氧气') || lowerQuery.includes('天然气') || lowerQuery.includes('蒸汽') || lowerQuery.includes('水耗')) {
      return QueryIntent.ENERGY_CONSUMPTION;
    }
    if (lowerQuery.includes('铁水') || lowerQuery.includes('冶炼') || lowerQuery.includes('转炉') || lowerQuery.includes('lf炉') || lowerQuery.includes('连铸') || lowerQuery.includes('生产')) {
      return QueryIntent.PRODUCTION_STATUS;
    }

    return QueryIntent.PRODUCTION_STATUS;
  }

  private fallbackExtractParameters(query: string, intent: QueryIntent): QueryParams {
    const params: QueryParams = {};
    const lowerQuery = query.toLowerCase();

    const timePatterns = [
      /最近(\d+)天/,
      /近(\d+)天/,
      /过去(\d+)天/,
      /今天|今日|当天/,
      /本周|这周/,
      /本月|这个月/,
    ];

    for (const pattern of timePatterns) {
      const match = query.match(pattern);
      if (match) {
        params.timeRange = { duration: match[0] };
        break;
      }
    }

    const devicePatterns = [
      /(\d+)号转炉|转炉(\d+)/,
      /(\d+)号LF炉|LF炉(\d+)/,
      /(\d+)号连铸|连铸(\d+)/,
      /(\d+)号高炉|高炉(\d+)/,
    ];

    for (const pattern of devicePatterns) {
      const match = query.match(pattern);
      if (match) {
        params.deviceIds = [match[0]];
        break;
      }
    }

    if (lowerQuery.includes('铁水')) {
      params.materialType = 'hot_metal';
    } else if (lowerQuery.includes('钢水')) {
      params.materialType = 'liquid_steel';
    }

    const steelGradePattern = /Q\d+[A-Z]?/;
    const gradeMatch = query.match(steelGradePattern);
    if (gradeMatch) {
      params.steelGrade = gradeMatch[0];
    }

    if (lowerQuery.includes('转炉')) {
      params.equipmentType = '转炉';
    } else if (lowerQuery.includes('lf炉') || lowerQuery.includes('lf')) {
      params.equipmentType = 'LF炉';
    } else if (lowerQuery.includes('连铸机') || lowerQuery.includes('连铸')) {
      params.equipmentType = '连铸机';
    }

    if (lowerQuery.includes('氧气')) {
      params.energyType = '氧气';
    } else if (lowerQuery.includes('电力') || lowerQuery.includes('电耗')) {
      params.energyType = '电力';
    } else if (lowerQuery.includes('天然气')) {
      params.energyType = '天然气';
    } else if (lowerQuery.includes('循环水') || lowerQuery.includes('水耗')) {
      params.energyType = '循环水';
    } else if (lowerQuery.includes('压缩空气')) {
      params.energyType = '压缩空气';
    } else if (lowerQuery.includes('蒸汽')) {
      params.energyType = '蒸汽';
    }

    if (lowerQuery.includes('转炉车间')) {
      params.department = '转炉车间';
    } else if (lowerQuery.includes('精炼车间')) {
      params.department = '精炼车间';
    } else if (lowerQuery.includes('连铸车间')) {
      params.department = '连铸车间';
    } else if (lowerQuery.includes('公辅系统') || lowerQuery.includes('公辅')) {
      params.department = '公辅系统';
    }

    return params;
  }

  private mapTextToIntent(text: string): QueryIntent {
    const intentMap: Record<string, QueryIntent> = {
      'production_status': QueryIntent.PRODUCTION_STATUS,
      'quality_data': QueryIntent.QUALITY_DATA,
      'equipment': QueryIntent.EQUIPMENT_MANAGEMENT,
      'material': QueryIntent.MATERIAL_MANAGEMENT,
      'energy': QueryIntent.ENERGY_CONSUMPTION,
      'alarm': QueryIntent.ALARM_EXCEPTION,
    };

    for (const [key, value] of Object.entries(intentMap)) {
      if (text.includes(key)) {
        return value;
      }
    }

    return QueryIntent.PRODUCTION_STATUS;
  }

  private parseParamsFromText(text: string): QueryParams {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      this.logger.warn('Failed to parse parameters from LLM response');
    }
    return {};
  }
}
