import { Injectable, Logger } from '@nestjs/common';
import { QueryRequestDto } from '../../api/dto/query-request.dto';
import { SemanticEngineService } from '../../services/semantic-engine.service';
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

  constructor(private readonly semanticEngine: SemanticEngineService) {}

  async processQuery(request: QueryRequestDto): Promise<any> {
    const cacheKey = this.generateCacheKey(request);
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      this.logger.debug(`Cache hit for query: ${request.query}`);
      return cached.result;
    }

    const queryId = this.generateQueryId();
    const intent = await this.semanticEngine.classifyIntent(request.query);
    const params = await this.semanticEngine.extractParameters(request.query, intent);

    const result = {
      queryId,
      answer: `收到查询: ${request.query}`,
      intent: intent,
      intentType: intent,
      parameters: {
        tab: request.tab || 'production',
        outputFormat: request.outputFormat || 'json',
        ...params,
      },
      timestamp: new Date().toISOString(),
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