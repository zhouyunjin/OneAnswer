import { Test, TestingModule } from '@nestjs/testing';
import { OutputFormatterService } from '../src/services/output-formatter.service';
import { QueryIntent } from '../src/core/enums/query-intent.enum';
import { QueryResult } from '../src/core/interfaces/query.interface';

describe('OutputFormatterService', () => {
  let service: OutputFormatterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OutputFormatterService],
    }).compile();

    service = module.get<OutputFormatterService>(OutputFormatterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('format', () => {
    it('should format production status result', () => {
      const result: QueryResult = {
        intentType: QueryIntent.PRODUCTION_STATUS,
        data: {
          hotMetal: [
            {
              id: 1,
              timestamp: '2024-01-15T12:00:00Z',
              temperature: 1350,
              composition: { Si: 0.45, Mn: 0.62, P: 0.018, S: 0.025 },
              weight: 320,
              sourceBlastFurnace: '1号高炉',
            },
          ],
          converters: [
            {
              id: 1,
              furnaceId: '1号转炉',
              status: '冶炼中',
              currentHeat: 'H20240115001',
              steelGrade: 'Q235B',
            },
          ],
          lfFurnaces: [
            {
              id: 1,
              furnaceId: '1号LF炉',
              status: '精炼中',
              steelGrade: 'Q235B',
            },
          ],
          continuousCasters: [
            {
              id: 1,
              casterId: '1号连铸机',
              status: '浇铸中',
              steelGrade: 'Q235B',
              castingProgress: 50,
            },
          ],
        },
      };

      const formatted = service.format(result);

      expect(formatted).toBeDefined();
      expect(formatted.metadata).toBeDefined();
      expect(formatted.metadata.intentType).toBe(QueryIntent.PRODUCTION_STATUS);
      expect(formatted.metadata.dataSource).toBe('production_db');
      expect(formatted.summary).toBeDefined();
      expect(typeof formatted.summary).toBe('string');
      expect(formatted.data).toEqual(result.data);
    });

    it('should format alarm result', () => {
      const result: QueryResult = {
        intentType: QueryIntent.ALARM_EXCEPTION,
        data: {
          alarms: [
            {
              id: 1,
              alarmId: 'ALM-20240115-001',
              type: '设备故障',
              device: '2号转炉',
              severity: '严重',
              message: '氧枪流量异常',
              occurredAt: '2024-01-15T10:23:00Z',
              status: '未处理',
            },
          ],
          count: 1,
        },
      };

      const formatted = service.format(result);

      expect(formatted).toBeDefined();
      expect(formatted.metadata).toBeDefined();
      expect(formatted.metadata.intentType).toBe(QueryIntent.ALARM_EXCEPTION);
      expect(formatted.summary).toBeDefined();
      expect(typeof formatted.summary).toBe('string');
      expect(formatted.data).toEqual(result.data);
    });
  });

  describe('generateSummary', () => {
    it('should generate production status summary', () => {
      const data = {
        hotMetal: [
          { temperature: 1350 },
          { temperature: 1360 },
          { temperature: 1340 },
        ],
        converters: [
          { status: '冶炼中' },
          { status: '冶炼中' },
          { status: '待料' },
        ],
        lfFurnaces: [
          { status: '精炼中' },
          { status: '精炼中' },
        ],
        continuousCasters: [
          { status: '浇铸中' },
          { status: '浇铸中' },
        ],
      };

      const summary = service.generateSummary({
        intentType: QueryIntent.PRODUCTION_STATUS,
        data,
      });

      expect(summary).toContain('共接收铁水3罐');
      expect(summary).toContain('平均温度');
      expect(summary).toContain('2台转炉运行中');
      expect(summary).toContain('2台LF炉精炼中');
      expect(summary).toContain('2台连铸机浇铸中');
    });

    it('should generate alarm summary with alarms', () => {
      const data = {
        alarms: [
          { severity: '严重' },
          { severity: '重要' },
          { severity: '重要' },
          { severity: '次要' },
        ],
        count: 4,
      };

      const summary = service.generateSummary({
        intentType: QueryIntent.ALARM_EXCEPTION,
        data,
      });

      expect(summary).toContain('4条未处理报警');
      expect(summary).toContain('1条严重');
      expect(summary).toContain('2条重要');
    });

    it('should generate alarm summary without alarms', () => {
      const data = {
        alarms: [],
        count: 0,
      };

      const summary = service.generateSummary({
        intentType: QueryIntent.ALARM_EXCEPTION,
        data,
      });

      expect(summary).toBe('当前没有未处理的报警。');
    });

    it('should generate default summary for unknown intent', () => {
      const summary = service.generateSummary({
        intentType: QueryIntent.QUALITY_DATA,
        data: {},
      });

      expect(summary).toBe('查询完成');
    });
  });

  describe('calculateAverageTemperature', () => {
    it('should calculate average temperature', () => {
      const hotMetalData = [
        { temperature: 1350 },
        { temperature: 1360 },
        { temperature: 1340 },
      ];

      const avg = (service as any).calculateAverageTemperature(hotMetalData);

      expect(avg).toBe(1350);
    });

    it('should return 0 for empty array', () => {
      const avg = (service as any).calculateAverageTemperature([]);

      expect(avg).toBe(0);
    });

    it('should return 0 for null array', () => {
      const avg = (service as any).calculateAverageTemperature(null);

      expect(avg).toBe(0);
    });
  });
});
