import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataService } from './data.service';
import { HotMetal } from '../entities/hot-metal.entity';
import { Converter } from '../entities/converter.entity';
import { LFFurnace } from '../entities/lf-furnace.entity';
import { ContinuousCaster } from '../entities/continuous-caster.entity';
import { Alarm } from '../entities/alarm.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      HotMetal,
      Converter,
      LFFurnace,
      ContinuousCaster,
      Alarm,
    ]),
  ],
  providers: [DataService],
  exports: [DataService],
})
export class DataServiceModule {}
