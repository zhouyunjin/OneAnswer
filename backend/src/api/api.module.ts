import { Module } from '@nestjs/common';
import { TemplateController } from './template.controller';
import { HealthController } from './health.controller';
import { MockController } from './mock.controller';
import { QueryModule } from '../modules/query/query.module';

@Module({
  imports: [QueryModule],
  controllers: [
    TemplateController,
    HealthController,
    MockController,
  ],
})
export class ApiModule {}