import { Test, TestingModule } from '@nestjs/testing';
import { QueryService } from '../src/modules/query/query.service';
import { SemanticEngineService } from '../src/services/semantic-engine.service';
import { QueryRequestDto } from '../src/api/dto/query-request.dto';
import { QueryIntent } from '../src/core/enums/query-intent.enum';

describe('QueryService', () => {
  let service: QueryService;
  let semanticEngine: SemanticEngineService;

  const mockSemanticEngine = {
    classifyIntent: jest.fn(),
    extractParameters: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QueryService,
        {
          provide: SemanticEngineService,
          useValue: mockSemanticEngine,
        },
      ],
    }).compile();

    service = module.get<QueryService>(QueryService);
    semanticEngine = module.get<SemanticEngineService>(SemanticEngineService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('processQuery', () => {
    it('should process query and return result', async () => {
      const request: QueryRequestDto = {
        query: '帮我查询最近3天铁水情况',
        tab: 'production',
        outputFormat: 'json',
      };

      mockSemanticEngine.classifyIntent.mockResolvedValue(QueryIntent.PRODUCTION_STATUS);
      mockSemanticEngine.extractParameters.mockResolvedValue({
        timeRange: { duration: '最近3天' },
        materialType: 'hot_metal',
      });

      const result = await service.processQuery(request);

      expect(result).toBeDefined();
      expect(result.queryId).toBeDefined();
      expect(result.intent).toBe(QueryIntent.PRODUCTION_STATUS);
      expect(result.intentType).toBe(QueryIntent.PRODUCTION_STATUS);
      expect(result.parameters.tab).toBe('production');
      expect(result.parameters.outputFormat).toBe('json');
      expect(result.parameters.timeRange).toBeDefined();
      expect(result.parameters.materialType).toBe('hot_metal');
      expect(mockSemanticEngine.classifyIntent).toHaveBeenCalledWith(request.query);
      expect(mockSemanticEngine.extractParameters).toHaveBeenCalledWith(
        request.query,
        QueryIntent.PRODUCTION_STATUS,
      );
    });

    it('should use default values when tab and outputFormat are not provided', async () => {
      const request: QueryRequestDto = {
        query: '当前冶炼情况怎么样',
      };

      mockSemanticEngine.classifyIntent.mockResolvedValue(QueryIntent.PRODUCTION_STATUS);
      mockSemanticEngine.extractParameters.mockResolvedValue({});

      const result = await service.processQuery(request);

      expect(result.parameters.tab).toBe('production');
      expect(result.parameters.outputFormat).toBe('json');
    });

    it('should cache query results', async () => {
      const request: QueryRequestDto = {
        query: '帮我查询最近3天铁水情况',
      };

      mockSemanticEngine.classifyIntent.mockResolvedValue(QueryIntent.PRODUCTION_STATUS);
      mockSemanticEngine.extractParameters.mockResolvedValue({});

      const result1 = await service.processQuery(request);
      const result2 = await service.processQuery(request);

      expect(result1.queryId).toBe(result2.queryId);
      expect(mockSemanticEngine.classifyIntent).toHaveBeenCalledTimes(1);
    });

    it('should generate unique query IDs', async () => {
      const request: QueryRequestDto = {
        query: '查询1',
      };

      mockSemanticEngine.classifyIntent.mockResolvedValue(QueryIntent.PRODUCTION_STATUS);
      mockSemanticEngine.extractParameters.mockResolvedValue({});

      const result1 = await service.processQuery(request);
      const result2 = await service.processQuery({ ...request, query: '查询2' });

      expect(result1.queryId).not.toBe(result2.queryId);
    });
  });

  describe('classifyIntent', () => {
    it('should delegate to semantic engine', async () => {
      const query = '帮我查询最近3天铁水情况';
      const expectedIntent = QueryIntent.PRODUCTION_STATUS;

      mockSemanticEngine.classifyIntent.mockResolvedValue(expectedIntent);

      const result = await service.classifyIntent(query);

      expect(result).toBe(expectedIntent);
      expect(mockSemanticEngine.classifyIntent).toHaveBeenCalledWith(query);
    });
  });

  describe('extractParameters', () => {
    it('should delegate to semantic engine', async () => {
      const query = '转炉1号最近3天铁水情况';
      const intent = QueryIntent.PRODUCTION_STATUS;
      const expectedParams = {
        timeRange: { duration: '最近3天' },
        deviceIds: ['1号转炉'],
        materialType: 'hot_metal',
      };

      mockSemanticEngine.extractParameters.mockResolvedValue(expectedParams);

      const result = await service.extractParameters(query, intent);

      expect(result).toEqual(expectedParams);
      expect(mockSemanticEngine.extractParameters).toHaveBeenCalledWith(query, intent);
    });
  });

  describe('clearCache', () => {
    it('should clear the cache', async () => {
      const request: QueryRequestDto = {
        query: '帮我查询最近3天铁水情况',
      };

      mockSemanticEngine.classifyIntent.mockResolvedValue(QueryIntent.PRODUCTION_STATUS);
      mockSemanticEngine.extractParameters.mockResolvedValue({});

      await service.processQuery(request);
      service.clearCache();

      const result = await service.processQuery(request);

      expect(mockSemanticEngine.classifyIntent).toHaveBeenCalledTimes(2);
    });
  });
});
