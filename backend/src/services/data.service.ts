import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import { HotMetal } from '../entities/hot-metal.entity';
import { Converter } from '../entities/converter.entity';
import { LFFurnace } from '../entities/lf-furnace.entity';
import { ContinuousCaster } from '../entities/continuous-caster.entity';
import { Alarm } from '../entities/alarm.entity';
import { QueryIntent } from '../core/enums/query-intent.enum';
import { QueryParams, QueryResult } from '../core/interfaces/query.interface';
import { IDataService } from '../core/interfaces/data-service.interface';

@Injectable()
export class DataService implements IDataService {
  private readonly logger = new Logger(DataService.name);

  constructor(
    @InjectRepository(HotMetal)
    private readonly hotMetalRepository: Repository<HotMetal>,
    @InjectRepository(Converter)
    private readonly converterRepository: Repository<Converter>,
    @InjectRepository(LFFurnace)
    private readonly lfFurnaceRepository: Repository<LFFurnace>,
    @InjectRepository(ContinuousCaster)
    private readonly continuousCasterRepository: Repository<ContinuousCaster>,
    @InjectRepository(Alarm)
    private readonly alarmRepository: Repository<Alarm>,
  ) {}

  async query(intent: QueryIntent, params: QueryParams): Promise<QueryResult> {
    switch (intent) {
      case QueryIntent.PRODUCTION_STATUS:
        return this.queryProductionStatus(params);
      case QueryIntent.ALARM_EXCEPTION:
        return this.queryAlarms(params);
      default:
        return this.queryProductionStatus(params);
    }
  }

  validateParams(params: QueryParams): boolean {
    return params !== null && typeof params === 'object';
  }

  private async queryProductionStatus(params: QueryParams): Promise<QueryResult> {
    const data: any = {};

    if (params.materialType === 'hot_metal' || !params.materialType) {
      data.hotMetal = await this.queryHotMetal(params);
    }

    if (!params.materialType || params.materialType === 'production') {
      data.converters = await this.queryConverters(params);
      data.lfFurnaces = await this.queryLFFurnaces(params);
      data.continuousCasters = await this.queryContinuousCasters(params);
    }

    return {
      intentType: QueryIntent.PRODUCTION_STATUS,
      data,
    };
  }

  private async queryAlarms(params: QueryParams): Promise<QueryResult> {
    const queryBuilder = this.alarmRepository.createQueryBuilder('alarm');

    if (params.timeRange?.duration) {
      const timeRange = this.parseTimeRange(params.timeRange.duration);
      if (timeRange) {
        queryBuilder.andWhere('alarm.occurredAt BETWEEN :start AND :end', {
          start: timeRange.start,
          end: timeRange.end,
        });
      }
    }

    if (params.deviceIds && params.deviceIds.length > 0) {
      queryBuilder.andWhere('alarm.device IN (:...devices)', {
        devices: params.deviceIds,
      });
    }

    const alarms = await queryBuilder.orderBy('alarm.occurredAt', 'DESC').getMany();

    return {
      intentType: QueryIntent.ALARM_EXCEPTION,
      data: {
        alarms,
        count: alarms.length,
      },
    };
  }

  private async queryHotMetal(params: QueryParams): Promise<HotMetal[]> {
    const queryBuilder = this.hotMetalRepository.createQueryBuilder('hotMetal');

    if (params.timeRange?.duration) {
      const timeRange = this.parseTimeRange(params.timeRange.duration);
      if (timeRange) {
        queryBuilder.andWhere('hotMetal.timestamp BETWEEN :start AND :end', {
          start: timeRange.start,
          end: timeRange.end,
        });
      }
    }

    if (params.deviceIds && params.deviceIds.length > 0) {
      queryBuilder.andWhere('hotMetal.sourceBlastFurnace IN (:...furnaces)', {
        furnaces: params.deviceIds,
      });
    }

    return queryBuilder.orderBy('hotMetal.timestamp', 'DESC').getMany();
  }

  private async queryConverters(params: QueryParams): Promise<Converter[]> {
    const queryBuilder = this.converterRepository.createQueryBuilder('converter');

    if (params.deviceIds && params.deviceIds.length > 0) {
      queryBuilder.andWhere('converter.furnaceId IN (:...ids)', {
        ids: params.deviceIds,
      });
    }

    return queryBuilder.getMany();
  }

  private async queryLFFurnaces(params: QueryParams): Promise<LFFurnace[]> {
    const queryBuilder = this.lfFurnaceRepository.createQueryBuilder('lfFurnace');

    if (params.deviceIds && params.deviceIds.length > 0) {
      queryBuilder.andWhere('lfFurnace.furnaceId IN (:...ids)', {
        ids: params.deviceIds,
      });
    }

    return queryBuilder.getMany();
  }

  private async queryContinuousCasters(params: QueryParams): Promise<ContinuousCaster[]> {
    const queryBuilder = this.continuousCasterRepository.createQueryBuilder('caster');

    if (params.deviceIds && params.deviceIds.length > 0) {
      queryBuilder.andWhere('caster.casterId IN (:...ids)', {
        ids: params.deviceIds,
      });
    }

    return queryBuilder.getMany();
  }

  private parseTimeRange(duration: string): { start: string; end: string } | null {
    const now = new Date();
    let start: Date;
    let end: Date = now;

    if (duration.includes('今天') || duration.includes('今日')) {
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (duration.includes('本周') || duration.includes('这周')) {
      const dayOfWeek = now.getDay();
      const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      start = new Date(now.getFullYear(), now.getMonth(), diff);
    } else if (duration.includes('本月') || duration.includes('这个月')) {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
    } else {
      const match = duration.match(/(\d+)[天日]/);
      if (match) {
        const days = parseInt(match[1]);
        start = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      } else {
        return null;
      }
    }

    return {
      start: start.toISOString(),
      end: end.toISOString(),
    };
  }
}
