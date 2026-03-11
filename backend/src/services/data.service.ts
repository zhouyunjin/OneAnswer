import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import { HotMetal } from '../entities/hot-metal.entity';
import { Converter } from '../entities/converter.entity';
import { LFFurnace } from '../entities/lf-furnace.entity';
import { ContinuousCaster } from '../entities/continuous-caster.entity';
import { Alarm } from '../entities/alarm.entity';
import { Quality } from '../entities/quality.entity';
import { Equipment } from '../entities/equipment.entity';
import { Energy } from '../entities/energy.entity';
import { Material } from '../entities/material.entity';
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
    @InjectRepository(Quality)
    private readonly qualityRepository: Repository<Quality>,
    @InjectRepository(Equipment)
    private readonly equipmentRepository: Repository<Equipment>,
    @InjectRepository(Energy)
    private readonly energyRepository: Repository<Energy>,
    @InjectRepository(Material)
    private readonly materialRepository: Repository<Material>,
  ) {}

  async query(intent: QueryIntent, params: QueryParams): Promise<QueryResult> {
    switch (intent) {
      case QueryIntent.PRODUCTION_STATUS:
        return this.queryProductionStatus(params);
      case QueryIntent.ALARM_EXCEPTION:
        return this.queryAlarms(params);
      case QueryIntent.QUALITY_DATA:
        return this.queryQuality(params);
      case QueryIntent.EQUIPMENT_MANAGEMENT:
        return this.queryEquipment(params);
      case QueryIntent.ENERGY_CONSUMPTION:
        return this.queryEnergy(params);
      case QueryIntent.MATERIAL_MANAGEMENT:
        return this.queryMaterial(params);
      default:
        return this.queryProductionStatus(params);
    }
  }

  validateParams(params: QueryParams): boolean {
    return params !== null && typeof params === 'object';
  }

  private async queryProductionStatus(params: QueryParams): Promise<QueryResult> {
    const data: any = {};

    if (!params.materialType || params.materialType === 'hot_metal' || params.materialType === '铁水') {
      data.hotMetal = await this.queryHotMetal(params);
    }

    if (!params.materialType || params.materialType === 'production' || params.materialType === '生产') {
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

  private async queryQuality(params: QueryParams): Promise<QueryResult> {
    const queryBuilder = this.qualityRepository.createQueryBuilder('quality');

    if (params.timeRange?.duration) {
      const timeRange = this.parseTimeRange(params.timeRange.duration);
      if (timeRange) {
        queryBuilder.andWhere('quality.timestamp BETWEEN :start AND :end', {
          start: timeRange.start,
          end: timeRange.end,
        });
      }
    }

    if (params.steelGrade) {
      queryBuilder.andWhere('quality.steelGrade = :steelGrade', {
        steelGrade: params.steelGrade,
      });
    }

    const quality = await queryBuilder.orderBy('quality.timestamp', 'DESC').getMany();

    const qualified = quality.filter(q => q.qualified).length;
    const total = quality.length;

    return {
      intentType: QueryIntent.QUALITY_DATA,
      data: {
        quality,
        statistics: {
          total,
          qualified,
          unqualified: total - qualified,
          qualifiedRate: total > 0 ? ((qualified / total) * 100).toFixed(2) : '0',
        },
      },
    };
  }

  private async queryEquipment(params: QueryParams): Promise<QueryResult> {
    const queryBuilder = this.equipmentRepository.createQueryBuilder('equipment');

    if (params.deviceIds && params.deviceIds.length > 0) {
      queryBuilder.andWhere('equipment.equipmentId IN (:...ids)', {
        ids: params.deviceIds,
      });
    }

    if (params.equipmentType) {
      queryBuilder.andWhere('equipment.equipmentType = :type', {
        type: params.equipmentType,
      });
    }

    const equipment = await queryBuilder.getMany();

    const running = equipment.filter(e => e.status === '运行中').length;
    const standby = equipment.filter(e => e.status === '待机').length;
    const maintenance = equipment.filter(e => e.status === '检修').length;
    const fault = equipment.filter(e => e.status === '故障').length;

    return {
      intentType: QueryIntent.EQUIPMENT_MANAGEMENT,
      data: {
        equipment,
        statistics: {
          total: equipment.length,
          running,
          standby,
          maintenance,
          fault,
          runningRate: equipment.length > 0 ? ((running / equipment.length) * 100).toFixed(2) : '0',
        },
      },
    };
  }

  private async queryEnergy(params: QueryParams): Promise<QueryResult> {
    const queryBuilder = this.energyRepository.createQueryBuilder('energy');

    if (params.timeRange?.duration) {
      const timeRange = this.parseTimeRange(params.timeRange.duration);
      if (timeRange) {
        queryBuilder.andWhere('energy.timestamp BETWEEN :start AND :end', {
          start: timeRange.start,
          end: timeRange.end,
        });
      }
    }

    if (params.energyType) {
      queryBuilder.andWhere('energy.energyType = :type', {
        type: params.energyType,
      });
    }

    if (params.department) {
      queryBuilder.andWhere('energy.department = :dept', {
        dept: params.department,
      });
    }

    const energy = await queryBuilder.orderBy('energy.timestamp', 'DESC').getMany();

    const totalConsumption = energy.reduce((sum, e) => sum + e.consumption, 0);
    const totalCost = energy.reduce((sum, e) => sum + e.cost, 0);

    const byType: Record<string, number> = {};
    energy.forEach(e => {
      byType[e.energyType] = (byType[e.energyType] || 0) + e.consumption;
    });

    return {
      intentType: QueryIntent.ENERGY_CONSUMPTION,
      data: {
        energy,
        statistics: {
          totalConsumption,
          totalCost,
          averageConsumptionPerTon: energy.length > 0 
            ? (energy.reduce((sum, e) => sum + (e.consumptionPerTon || 0), 0) / energy.length).toFixed(2)
            : '0',
          byType,
        },
      },
    };
  }

  private async queryMaterial(params: QueryParams): Promise<QueryResult> {
    const queryBuilder = this.materialRepository.createQueryBuilder('material');

    if (params.materialType) {
      queryBuilder.andWhere('material.materialType = :type', {
        type: params.materialType,
      });
    }

    const materials = await queryBuilder.getMany();

    const lowStock = materials.filter(m => m.stock < m.minStock);
    const totalValue = materials.reduce((sum, m) => sum + m.stock * m.unitPrice, 0);

    return {
      intentType: QueryIntent.MATERIAL_MANAGEMENT,
      data: {
        materials,
        statistics: {
          totalTypes: materials.length,
          lowStockCount: lowStock.length,
          totalValue,
          lowStockItems: lowStock,
        },
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
