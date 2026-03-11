import { Module } from '@nestjs/common';
import { ConfigModule } from './core/config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiModule } from './api/api.module';
import { QueryModule } from './modules/query/query.module';
import { LoggerServiceImpl } from './core/logging/logger.service';
import { HotMetal } from './entities/hot-metal.entity';
import { Converter } from './entities/converter.entity';
import { LFFurnace } from './entities/lf-furnace.entity';
import { ContinuousCaster } from './entities/continuous-caster.entity';
import { Alarm } from './entities/alarm.entity';
import { Quality } from './entities/quality.entity';
import { Equipment } from './entities/equipment.entity';
import { Energy } from './entities/energy.entity';
import { Material } from './entities/material.entity';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: process.cwd() + '/database.sqlite',
      entities: [
        HotMetal,
        Converter,
        LFFurnace,
        ContinuousCaster,
        Alarm,
        Quality,
        Equipment,
        Energy,
        Material,
      ],
      synchronize: true,
    }),
    ApiModule,
    QueryModule,
  ],
  providers: [LoggerServiceImpl],
})
export class AppModule {}