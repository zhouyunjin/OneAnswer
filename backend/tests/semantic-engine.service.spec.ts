import { Test, TestingModule } from '@nestjs/testing';
import { SemanticEngineService } from '../src/services/semantic-engine.service';
import { AppConfigService } from '../src/core/config/config.service';
import { QueryIntent } from '../src/core/enums/query-intent.enum';

describe('SemanticEngineService', () => {
  let service: SemanticEngineService;
  let configService: AppConfigService;

  const mockConfigService = {
    llmApiKey: '',
    llmModel: 'gpt-3.5-turbo',
    llmTemperature: 0.7,
    llmMaxTokens: 2000,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SemanticEngineService,
        {
          provide: AppConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<SemanticEngineService>(SemanticEngineService);
    configService = module.get<AppConfigService>(AppConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('classifyIntent', () => {
    it('should classify production status queries correctly', async () => {
      const queries = [
        '帮我查询最近3天铁水情况',
        '当前冶炼情况怎么样',
        '今天铁水温度怎么样',
        '转炉1号现在在干什么',
      ];

      for (const query of queries) {
        const intent = await service.classifyIntent(query);
        expect(intent).toBe(QueryIntent.PRODUCTION_STATUS);
      }
    });

    it('should classify alarm queries correctly', async () => {
      const queries = [
        '当前有哪些报警',
        '今天发生了什么异常',
        '设备故障记录',
        '温度超限的情况',
      ];

      for (const query of queries) {
        const intent = await service.classifyIntent(query);
        expect(intent).toBe(QueryIntent.ALARM_EXCEPTION);
      }
    });

    it('should classify material queries correctly', async () => {
      const queries = [
        '合金库存还有多少',
        '硅锰合金消耗情况',
        '辅料库存还有多少',
        '今天用了多少石灰',
      ];

      for (const query of queries) {
        const intent = await service.classifyIntent(query);
        expect(intent).toBe(QueryIntent.MATERIAL_MANAGEMENT);
      }
    });

    it('should classify quality data queries correctly', async () => {
      const queries = [
        '最近一批钢水的成分分析',
        '今天的铁水硅含量是多少',
        'Q235钢种的合格率',
        '最近有没有成分超标的情况',
      ];

      for (const query of queries) {
        const intent = await service.classifyIntent(query);
        expect(intent).toBe(QueryIntent.QUALITY_DATA);
      }
    });

    it('should classify equipment queries correctly', async () => {
      const queries = [
        '转炉2号上次检修是什么时候',
        '哪些设备正在检修',
        'LF炉的炉龄还剩多少',
        '连铸结晶器需要更换吗',
      ];

      for (const query of queries) {
        const intent = await service.classifyIntent(query);
        expect(intent).toBe(QueryIntent.EQUIPMENT_MANAGEMENT);
      }
    });

    it('should classify energy queries correctly', async () => {
      const queries = [
        '今天的电耗是多少',
        '转炉的氧气消耗量',
        '本月能耗对比上月',
        '单位产品能耗',
      ];

      for (const query of queries) {
        const intent = await service.classifyIntent(query);
        expect(intent).toBe(QueryIntent.ENERGY_CONSUMPTION);
      }
    });

    it('should default to production_status for unknown queries', async () => {
      const query = '这是一个未知的查询';
      const intent = await service.classifyIntent(query);
      expect(intent).toBe(QueryIntent.PRODUCTION_STATUS);
    });
  });

  describe('extractParameters', () => {
    it('should extract time range parameters', async () => {
      const queries = [
        { query: '帮我查询最近3天铁水情况', expectedDuration: '最近3天' },
        { query: '近三天铁水情况', expectedDuration: '近三天' },
        { query: '过去三天铁水情况', expectedDuration: '过去三天' },
        { query: '今天铁水温度怎么样', expectedDuration: '今天' },
        { query: '本周的冶炼情况', expectedDuration: '本周' },
        { query: '本月的能耗统计', expectedDuration: '本月' },
      ];

      for (const { query, expectedDuration } of queries) {
        const params = await service.extractParameters(query, QueryIntent.PRODUCTION_STATUS);
        expect(params.timeRange).toBeDefined();
        expect(params.timeRange?.duration).toBe(expectedDuration);
      }
    });

    it('should extract device ID parameters', async () => {
      const queries = [
        { query: '转炉1号现在在干什么', expectedDevice: '1号转炉' },
        { query: '转炉1现在在干什么', expectedDevice: '转炉1' },
        { query: 'LF炉2号的生产进度', expectedDevice: '2号LF炉' },
        { query: '连铸机3号的状态', expectedDevice: '3号连铸' },
      ];

      for (const { query, expectedDevice } of queries) {
        const params = await service.extractParameters(query, QueryIntent.PRODUCTION_STATUS);
        expect(params.deviceIds).toBeDefined();
        expect(params.deviceIds).toContain(expectedDevice);
      }
    });

    it('should extract material type parameters', async () => {
      const queries = [
        { query: '铁水情况怎么样', expectedType: 'hot_metal' },
        { query: '钢水情况怎么样', expectedType: 'liquid_steel' },
        { query: '铁水温度', expectedType: 'hot_metal' },
        { query: '钢水成分', expectedType: 'liquid_steel' },
      ];

      for (const { query, expectedType } of queries) {
        const params = await service.extractParameters(query, QueryIntent.PRODUCTION_STATUS);
        expect(params.materialType).toBe(expectedType);
      }
    });

    it('should extract steel grade parameters', async () => {
      const queries = [
        { query: 'Q235钢种的钢水成分', expectedGrade: 'Q235' },
        { query: 'Q345钢种的合格率', expectedGrade: 'Q345' },
        { query: 'Q235B钢种的生产情况', expectedGrade: 'Q235B' },
      ];

      for (const { query, expectedGrade } of queries) {
        const params = await service.extractParameters(query, QueryIntent.PRODUCTION_STATUS);
        expect(params.steelGrade).toBe(expectedGrade);
      }
    });

    it('should extract multiple parameters from complex query', async () => {
      const query = '转炉1号最近3天铁水情况';
      const params = await service.extractParameters(query, QueryIntent.PRODUCTION_STATUS);

      expect(params.timeRange).toBeDefined();
      expect(params.timeRange?.duration).toBe('最近3天');
      expect(params.deviceIds).toBeDefined();
      expect(params.deviceIds).toContain('1号转炉');
      expect(params.materialType).toBe('hot_metal');
    });

    it('should return empty params for query without parameters', async () => {
      const query = '当前冶炼情况怎么样';
      const params = await service.extractParameters(query, QueryIntent.PRODUCTION_STATUS);

      expect(params).toBeDefined();
      expect(Object.keys(params).length).toBe(0);
    });
  });
});
