import { Injectable, Logger } from '@nestjs/common';
import { QueryRequestDto } from '../../api/dto/query-request.dto';
import { SemanticEngineService } from '../../services/semantic-engine.service';
import { OutputFormatterService } from '../../services/output-formatter.service';
import { QueryIntent } from '../../core/enums/query-intent.enum';
import { QueryParams } from '../../core/interfaces/query.interface';

interface CacheEntry {
  result: any;
  timestamp: number;
}

@Injectable()
export class QueryService {
  private readonly logger = new Logger(QueryService.name);
  private cache = new Map<string, CacheEntry>();
  private readonly CACHE_TTL = 5 * 60 * 1000;

  constructor(
    private readonly semanticEngine: SemanticEngineService,
    private readonly outputFormatter: OutputFormatterService,
  ) {}

  async processQuery(request: QueryRequestDto): Promise<any> {
    const cacheKey = this.generateCacheKey(request);
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      this.logger.debug(`Cache hit for query: ${request.query}`);
      const result = { ...cached.result, fromCache: true };
      return result;
    }

    const queryId = this.generateQueryId();
    const startTime = Date.now();
    const intent = await this.semanticEngine.classifyIntent(request.query);
    const params = await this.semanticEngine.extractParameters(request.query, intent);

    const formattedResult = this.outputFormatter.format({
      intentType: intent,
      data: [],
    });

    let data: any = formattedResult.data || [];
    
    if (intent === QueryIntent.ALARM_EXCEPTION) {
      data = { alarms: [] };
    }

    const result = {
      queryId,
      intent: intent,
      intentType: intent,
      parameters: {
        tab: request.tab || 'production',
        outputFormat: request.outputFormat || 'json',
        ...params,
      },
      result: {
        data: data,
        summary: formattedResult.summary || `查询结果：${request.query}`,
        metadata: {
          queryTime: Date.now() - startTime,
          recordCount: 0,
          timestamp: new Date().toISOString(),
          intentType: intent,
          dataSource: 'production_db',
        },
      },
      processingTime: Date.now() - startTime,
      timestamp: new Date().toISOString(),
      fromCache: false,
    };

    this.cache.set(cacheKey, {
      result,
      timestamp: Date.now(),
    });

    this.logger.debug(`Cached result for query: ${request.query}`);
    return result;
  }

  async classifyIntent(query: string): Promise<QueryIntent> {
    return this.semanticEngine.classifyIntent(query);
  }

  async extractParameters(query: string, intent: QueryIntent): Promise<QueryParams> {
    return this.semanticEngine.extractParameters(query, intent);
  }

  clearCache(): void {
    this.cache.clear();
    this.logger.log('Query cache cleared');
  }

  private generateCacheKey(request: QueryRequestDto): string {
    return `${request.query}|${request.tab}|${request.outputFormat}`;
  }

  private generateQueryId(): string {
    return `Q${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
  }
}