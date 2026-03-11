import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { QueryRequestDto } from '../src/api/dto/query-request.dto';
import { QueryIntent } from '../src/core/enums/query-intent.enum';

describe('System Integration Tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('End-to-End Query Processing', () => {
    it('should process production status query end-to-end', async () => {
      const queryRequest: QueryRequestDto = {
        query: '帮我查询最近3天铁水情况',
        tab: 'production',
      };

      const response = await request(app.getHttpServer())
        .post('/api/query')
        .send(queryRequest)
        .expect(200);

      expect(response.body).toHaveProperty('queryId');
      expect(response.body).toHaveProperty('intent');
      expect(response.body).toHaveProperty('intentType');
      expect(response.body).toHaveProperty('parameters');
      expect(response.body).toHaveProperty('result');
      expect(response.body).toHaveProperty('processingTime');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body.result).toHaveProperty('metadata');
      expect(response.body.result).toHaveProperty('summary');
      expect(response.body.result).toHaveProperty('data');
    });

    it('should process alarm query end-to-end', async () => {
      const queryRequest: QueryRequestDto = {
        query: '查询最近的报警信息',
        tab: 'alerts',
      };

      const response = await request(app.getHttpServer())
        .post('/api/query')
        .send(queryRequest)
        .expect(200);

      expect(response.body.intentType).toBe(QueryIntent.ALARM_EXCEPTION);
      expect(response.body.result).toHaveProperty('data');
      expect(response.body.result.data).toHaveProperty('alarms');
    });

    it('should use cache for repeated queries', async () => {
      const queryRequest: QueryRequestDto = {
        query: '帮我查询最近3天铁水情况',
        tab: 'production',
      };

      const response1 = await request(app.getHttpServer())
        .post('/api/query')
        .send(queryRequest)
        .expect(200);

      const response2 = await request(app.getHttpServer())
        .post('/api/query')
        .send(queryRequest)
        .expect(200);

      expect(response1.body.queryId).toBe(response2.body.queryId);
      expect(response2.body.fromCache).toBe(true);
    });

    it('should handle complex query with multiple parameters', async () => {
      const queryRequest: QueryRequestDto = {
        query: '查询1号转炉和2号转炉最近1天的生产情况',
        tab: 'production',
      };

      const response = await request(app.getHttpServer())
        .post('/api/query')
        .send(queryRequest)
        .expect(200);

      expect(response.body.parameters).toBeDefined();
      expect(response.body.result).toBeDefined();
      expect(response.body.result.summary).toBeDefined();
    });
  });

  describe('Intent Classification', () => {
    it('should correctly classify production status queries', async () => {
      const queries = [
        '当前冶炼情况怎么样',
        '帮我查询铁水情况',
        '转炉状态如何',
        'LF炉精炼进度',
      ];

      for (const query of queries) {
        const response = await request(app.getHttpServer())
          .post('/api/query')
          .send({ query })
          .expect(200);

        expect([QueryIntent.PRODUCTION_STATUS, QueryIntent.QUALITY_DATA]).toContain(
          response.body.intentType,
        );
      }
    });

    it('should correctly classify alarm queries', async () => {
      const queries = [
        '最近的报警信息',
        '有没有异常',
        '设备故障情况',
        '未处理的报警',
      ];

      for (const query of queries) {
        const response = await request(app.getHttpServer())
          .post('/api/query')
          .send({ query })
          .expect(200);

        expect(response.body.intentType).toBe(QueryIntent.ALARM_EXCEPTION);
      }
    });
  });

  describe('Parameter Extraction', () => {
    it('should extract time range parameters', async () => {
      const queryRequest: QueryRequestDto = {
        query: '查询最近3天的数据',
      };

      const response = await request(app.getHttpServer())
        .post('/api/query')
        .send(queryRequest)
        .expect(200);

      expect(response.body.parameters).toBeDefined();
      expect(response.body.parameters.timeRange).toBeDefined();
    });

    it('should extract device IDs', async () => {
      const queryRequest: QueryRequestDto = {
        query: '查询1号转炉和2号转炉的状态',
      };

      const response = await request(app.getHttpServer())
        .post('/api/query')
        .send(queryRequest)
        .expect(200);

      expect(response.body.parameters).toBeDefined();
      expect(response.body.parameters.deviceIds).toBeDefined();
      expect(response.body.parameters.deviceIds.length).toBeGreaterThan(0);
    });
  });

  describe('Structured Output', () => {
    it('should generate proper summary for production data', async () => {
      const queryRequest: QueryRequestDto = {
        query: '查询生产情况',
        tab: 'production',
      };

      const response = await request(app.getHttpServer())
        .post('/api/query')
        .send(queryRequest)
        .expect(200);

      expect(response.body.result.summary).toBeDefined();
      expect(typeof response.body.result.summary).toBe('string');
      expect(response.body.result.summary.length).toBeGreaterThan(0);
    });

    it('should generate proper summary for alarm data', async () => {
      const queryRequest: QueryRequestDto = {
        query: '查询报警信息',
        tab: 'alerts',
      };

      const response = await request(app.getHttpServer())
        .post('/api/query')
        .send(queryRequest)
        .expect(200);

      expect(response.body.result.summary).toBeDefined();
      expect(typeof response.body.result.summary).toBe('string');
    });

    it('should include metadata in response', async () => {
      const queryRequest: QueryRequestDto = {
        query: '测试查询',
      };

      const response = await request(app.getHttpServer())
        .post('/api/query')
        .send(queryRequest)
        .expect(200);

      expect(response.body.result.metadata).toBeDefined();
      expect(response.body.result.metadata.queryTime).toBeDefined();
      expect(response.body.result.metadata.intentType).toBeDefined();
      expect(response.body.result.metadata.dataSource).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid requests gracefully', async () => {
      const invalidRequest = {
        invalidField: 'test',
      };

      await request(app.getHttpServer())
        .post('/api/query')
        .send(invalidRequest)
        .expect(400);
    });

    it('should handle empty queries', async () => {
      const queryRequest: QueryRequestDto = {
        query: '',
      };

      const response = await request(app.getHttpServer())
        .post('/api/query')
        .send(queryRequest)
        .expect(200);

      expect(response.body).toBeDefined();
    });
  });

  describe('Performance', () => {
    it('should respond within reasonable time', async () => {
      const queryRequest: QueryRequestDto = {
        query: '查询生产情况',
      };

      const start = Date.now();
      const response = await request(app.getHttpServer())
        .post('/api/query')
        .send(queryRequest)
        .expect(200);
      const end = Date.now();

      const responseTime = end - start;
      expect(responseTime).toBeLessThan(5000);
      expect(response.body.processingTime).toBeLessThan(5000);
    });

    it('should handle concurrent requests', async () => {
      const requests = Array(10).fill(null).map(() =>
        request(app.getHttpServer())
          .post('/api/query')
          .send({ query: '测试查询' })
          .expect(200),
      );

      const responses = await Promise.all(requests);
      expect(responses).toHaveLength(10);
      responses.forEach((response) => {
        expect(response.body).toHaveProperty('queryId');
        expect(response.body).toHaveProperty('result');
      });
    });
  });
});
