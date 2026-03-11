import { Module } from '@nestjs/common';
import { TemplateController } from './template.controller';
import { HealthController } from './health.controller';
import { MockController } from './mock.controller';
import { QueryModule } from '../modules/query/query.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HotMetal } from '../entities/hot-metal.entity';
import { Converter } from '../entities/converter.entity';
import { LFFurnace } from '../entities/lf-furnace.entity';
import { ContinuousCaster } from '../entities/continuous-caster.entity';
import { Alarm } from '../entities/alarm.entity';
import { Quality } from '../entities/quality.entity';
import { Equipment } from '../entities/equipment.entity';
import { Energy } from '../entities/energy.entity';
import { Material } from '../entities/material.entity';

@Module({
  imports: [
    QueryModule,
    TypeOrmModule.forFeature([
      HotMetal,
      Converter,
      LFFurnace,
      ContinuousCaster,
      Alarm,
      Quality,
      Equipment,
      Energy,
      Material,
    ]),
  ],
  controllers: [
    TemplateController,
    HealthController,
    MockController,
  ],
})
export class ApiModule {}