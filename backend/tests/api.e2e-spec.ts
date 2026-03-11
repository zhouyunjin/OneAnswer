import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { QueryRequestDto } from '../src/api/dto/query-request.dto';

describe('QueryController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
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

  afterEach(async () => {
    await app.close();
  });

  describe('/api/query (POST)', () => {
    it('should process a valid query request', () => {
      const queryRequest: QueryRequestDto = {
        query: '帮我查询最近3天铁水情况',
        tab: 'production',
        outputFormat: 'json',
      };

      return request(app.getHttpServer())
        .post('/api/query')
        .send(queryRequest)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('queryId');
          expect(res.body).toHaveProperty('intent');
          expect(res.body).toHaveProperty('intentType');
          expect(res.body).toHaveProperty('parameters');
          expect(res.body).toHaveProperty('result');
          expect(res.body).toHaveProperty('processingTime');
          expect(res.body).toHaveProperty('timestamp');
          expect(res.body.result).toHaveProperty('metadata');
          expect(res.body.result).toHaveProperty('summary');
          expect(res.body.result).toHaveProperty('data');
        });
    });

    it('should handle query with missing optional fields', () => {
      const queryRequest: QueryRequestDto = {
        query: '当前冶炼情况怎么样',
      };

      return request(app.getHttpServer())
        .post('/api/query')
        .send(queryRequest)
        .expect(200)
        .expect((res) => {
          expect(res.body.parameters.tab).toBe('production');
          expect(res.body.parameters.outputFormat).toBe('json');
        });
    });

    it('should reject request with missing query field', () => {
      const queryRequest = {
        tab: 'production',
      };

      return request(app.getHttpServer())
        .post('/api/query')
        .send(queryRequest)
        .expect(400)
        .expect((res) => {
          expect(res.body).toHaveProperty('statusCode', 400);
          expect(res.body).toHaveProperty('message');
        });
    });

    it('should reject request with invalid tab value', () => {
      const queryRequest: QueryRequestDto = {
        query: 'test query',
        tab: 'invalid_tab' as any,
      };

      return request(app.getHttpServer())
        .post('/api/query')
        .send(queryRequest)
        .expect(400)
        .expect((res) => {
          expect(res.body).toHaveProperty('statusCode', 400);
        });
    });

    it('should handle empty query', () => {
      const queryRequest: QueryRequestDto = {
        query: '',
      };

      return request(app.getHttpServer())
        .post('/api/query')
        .send(queryRequest)
        .expect(200);
    });
  });

  describe('Health Check', () => {
    it('should return health status', () => {
      return request(app.getHttpServer())
        .get('/api/health')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('status');
          expect(res.body.status).toBe('ok');
        });
    });
  });
});
