import { Controller, Get, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HotMetal } from '../entities/hot-metal.entity';
import { Converter } from '../entities/converter.entity';
import { LFFurnace } from '../entities/lf-furnace.entity';
import { ContinuousCaster } from '../entities/continuous-caster.entity';
import { Alarm } from '../entities/alarm.entity';
import { Quality } from '../entities/quality.entity';
import { Equipment } from '../entities/equipment.entity';
import { Energy } from '../entities/energy.entity';
import { Material } from '../entities/material.entity';

interface MockDataStatus {
  enabled: boolean;
  hotMetal: { count: number; generated: boolean };
  smeltingStatus: { count: number; generated: boolean };
  alarms: { count: number; generated: boolean };
  quality: { count: number; generated: boolean };
  equipment: { count: number; generated: boolean };
  energy: { count: number; generated: boolean };
  material: { count: number; generated: boolean };
  lastReset: string;
  lastGenerate: string;
}

interface MockStatusResponse {
  success: boolean;
  data: MockDataStatus;
}

interface MockResetResponse {
  success: boolean;
  message: string;
  timestamp: string;
}

interface MockGenerateResponse {
  success: boolean;
  message: string;
  data: {
    hotMetal: number;
    smeltingStatus: number;
    alarms: number;
    quality: number;
    equipment: number;
    energy: number;
    material: number;
  };
  timestamp: string;
}

@Controller('api/mock')
export class MockController {
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

  private mockDataStatus: MockDataStatus = {
    enabled: true,
    hotMetal: { count: 0, generated: false },
    smeltingStatus: { count: 0, generated: false },
    alarms: { count: 0, generated: false },
    quality: { count: 0, generated: false },
    equipment: { count: 0, generated: false },
    energy: { count: 0, generated: false },
    material: { count: 0, generated: false },
    lastReset: new Date().toISOString(),
    lastGenerate: new Date().toISOString(),
  };

  @Get('status')
  async getMockDataStatus(): Promise<MockStatusResponse> {
    const hotMetalCount = await this.hotMetalRepository.count();
    const converterCount = await this.converterRepository.count();
    const lfFurnaceCount = await this.lfFurnaceRepository.count();
    const alarmCount = await this.alarmRepository.count();
    const qualityCount = await this.qualityRepository.count();
    const equipmentCount = await this.equipmentRepository.count();
    const energyCount = await this.energyRepository.count();
    const materialCount = await this.materialRepository.count();

    this.mockDataStatus.hotMetal.count = hotMetalCount;
    this.mockDataStatus.smeltingStatus.count = converterCount + lfFurnaceCount;
    this.mockDataStatus.alarms.count = alarmCount;
    this.mockDataStatus.quality.count = qualityCount;
    this.mockDataStatus.equipment.count = equipmentCount;
    this.mockDataStatus.energy.count = energyCount;
    this.mockDataStatus.material.count = materialCount;

    return {
      success: true,
      data: this.mockDataStatus,
    };
  }

  @Post('reset')
  @HttpCode(HttpStatus.OK)
  async resetMockData(): Promise<MockResetResponse> {
    await this.hotMetalRepository.clear();
    await this.converterRepository.clear();
    await this.lfFurnaceRepository.clear();
    await this.continuousCasterRepository.clear();
    await this.alarmRepository.clear();
    await this.qualityRepository.clear();
    await this.equipmentRepository.clear();
    await this.energyRepository.clear();
    await this.materialRepository.clear();

    this.mockDataStatus.hotMetal = { count: 0, generated: false };
    this.mockDataStatus.smeltingStatus = { count: 0, generated: false };
    this.mockDataStatus.alarms = { count: 0, generated: false };
    this.mockDataStatus.quality = { count: 0, generated: false };
    this.mockDataStatus.equipment = { count: 0, generated: false };
    this.mockDataStatus.energy = { count: 0, generated: false };
    this.mockDataStatus.material = { count: 0, generated: false };
    this.mockDataStatus.lastReset = new Date().toISOString();

    return {
      success: true,
      message: '模拟数据已重置到初始状态',
      timestamp: new Date().toISOString(),
    };
  }

  @Post('generate')
  @HttpCode(HttpStatus.OK)
  async generateMockData(): Promise<MockGenerateResponse> {
    await this.hotMetalRepository.clear();
    await this.converterRepository.clear();
    await this.lfFurnaceRepository.clear();
    await this.continuousCasterRepository.clear();
    await this.alarmRepository.clear();
    await this.qualityRepository.clear();
    await this.equipmentRepository.clear();
    await this.energyRepository.clear();
    await this.materialRepository.clear();

    const hotMetalRecords: Partial<HotMetal>[] = [];
    const converterRecords: Partial<Converter>[] = [];
    const lfFurnaceRecords: Partial<LFFurnace>[] = [];
    const alarmRecords: Partial<Alarm>[] = [];
    const qualityRecords: Partial<Quality>[] = [];
    const equipmentRecords: Partial<Equipment>[] = [];
    const energyRecords: Partial<Energy>[] = [];
    const materialRecords: Partial<Material>[] = [];

    for (let i = 0; i < 100; i++) {
      const hotMetal = {
        id: i + 1,
        timestamp: new Date(Date.now() - i * 3600000).toISOString(),
        temperature: 1450 + Math.random() * 100,
        weight: 80 + Math.random() * 20,
        composition: {
          Si: 0.3 + Math.random() * 0.1,
          Mn: 0.6 + Math.random() * 0.2,
          P: 0.08 + Math.random() * 0.02,
          S: 0.02 + Math.random() * 0.01,
        },
        sourceBlastFurnace: `高炉${(i % 3) + 1}`,
      };
      hotMetalRecords.push(hotMetal);
    }

    for (let i = 0; i < 50; i++) {
      const converter = {
        id: i + 1,
        timestamp: new Date(Date.now() - i * 7200000).toISOString(),
        furnaceId: `转炉${(i % 3) + 1}`,
        status: ['冶炼中', '待料', '出钢'][Math.floor(Math.random() * 3)],
        currentHeat: `炉次${i + 1}`,
        steelGrade: ['Q235', 'Q345', '45#', '20#'][Math.floor(Math.random() * 4)],
        startTime: new Date(Date.now() - i * 7200000 - 3600000).toISOString(),
        estimatedCompletion: new Date(Date.now() - i * 7200000 + 3600000).toISOString(),
      };
      converterRecords.push(converter);
    }

    for (let i = 0; i < 20; i++) {
      const lfFurnace = {
        id: i + 1,
        timestamp: new Date(Date.now() - i * 5400000).toISOString(),
        furnaceId: `LF炉${(i % 2) + 1}`,
        status: ['精炼中', '待料', '出钢'][Math.floor(Math.random() * 3)],
        currentHeat: `炉次${i + 1}`,
        steelGrade: ['Q235', 'Q345', '45#', '20#'][Math.floor(Math.random() * 4)],
        startTime: new Date(Date.now() - i * 5400000 - 2700000).toISOString(),
        estimatedCompletion: new Date(Date.now() - i * 5400000 + 2700000).toISOString(),
      };
      lfFurnaceRecords.push(lfFurnace);
    }

    for (let i = 0; i < 20; i++) {
      const alarm = {
        id: i + 1,
        alarmId: `alarm-${i}`,
        type: ['温度异常', '压力异常', '流量异常', '设备故障', '高温报警', '液位异常', '气体泄漏'][Math.floor(Math.random() * 7)],
        device: ['转炉1', '转炉2', '转炉3', 'LF炉1', 'LF炉2', '连铸机1', '连铸机2', '除尘系统'][Math.floor(Math.random() * 8)],
        severity: ['高', '中', '低'][Math.floor(Math.random() * 3)],
        message: `设备${['转炉1', '转炉2', '转炉3', 'LF炉1', 'LF炉2', '连铸机'][Math.floor(Math.random() * 6)]}发生${['温度异常', '压力异常', '流量异常', '设备故障'][Math.floor(Math.random() * 4)]}`,
        occurredAt: new Date(Date.now() - i * 3600000).toISOString(),
        status: Math.random() > 0.3 ? '未处理' : '已处理',
      };
      alarmRecords.push(alarm);
    }

    for (let i = 0; i < 80; i++) {
      const steelGrades = ['Q235B', 'Q345B', '45#', '20#', 'Q390B', 'Q420B', 'HRB400', 'HRB500'];
      const steelGrade = steelGrades[Math.floor(Math.random() * steelGrades.length)];
      const qualified = Math.random() > 0.15;
      
      const quality = {
        id: i + 1,
        timestamp: new Date(Date.now() - i * 7200000).toISOString(),
        heatNumber: `炉次${230000 + i}`,
        steelGrade,
        composition: {
          C: 0.15 + Math.random() * 0.25,
          Si: 0.15 + Math.random() * 0.35,
          Mn: 0.4 + Math.random() * 0.8,
          P: 0.01 + Math.random() * 0.03,
          S: 0.01 + Math.random() * 0.03,
          Cr: Math.random() * 0.3,
          Ni: Math.random() * 0.2,
          Cu: Math.random() * 0.2,
        },
        temperature: 1550 + Math.random() * 80,
        qualified,
        inspector: `检验员${(i % 5) + 1}`,
        remark: qualified ? '' : '成分超标',
      };
      qualityRecords.push(quality);
    }

    const equipmentTypes = [
      { id: '转炉1', name: '1号转炉', type: '转炉' },
      { id: '转炉2', name: '2号转炉', type: '转炉' },
      { id: '转炉3', name: '3号转炉', type: '转炉' },
      { id: 'LF炉1', name: '1号LF炉', type: 'LF炉' },
      { id: 'LF炉2', name: '2号LF炉', type: 'LF炉' },
      { id: '连铸机1', name: '1号连铸机', type: '连铸机' },
      { id: '连铸机2', name: '2号连铸机', type: '连铸机' },
      { id: '连铸机3', name: '3号连铸机', type: '连铸机' },
      { id: '除尘系统', name: '除尘系统', type: '环保设备' },
      { id: '氧枪1', name: '1号氧枪', type: '氧枪' },
      { id: '氧枪2', name: '2号氧枪', type: '氧枪' },
      { id: '天车1', name: '1号天车', type: '天车' },
      { id: '天车2', name: '2号天车', type: '天车' },
    ];

    for (let i = 0; i < equipmentTypes.length; i++) {
      const eq = equipmentTypes[i];
      const equipment = {
        id: i + 1,
        equipmentId: eq.id,
        equipmentName: eq.name,
        equipmentType: eq.type,
        status: ['运行中', '待机', '检修', '故障'][Math.floor(Math.random() * 4)],
        runningHours: Math.floor(1000 + Math.random() * 5000),
        maintenanceDate: new Date(Date.now() - Math.random() * 30 * 24 * 3600000).toISOString().split('T')[0],
        nextMaintenanceDate: new Date(Date.now() + Math.random() * 30 * 24 * 3600000).toISOString().split('T')[0],
        efficiency: 85 + Math.random() * 15,
        faultCount: Math.floor(Math.random() * 10),
        lastFaultTime: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 7 * 24 * 3600000).toISOString() : '',
        parameters: {
          temperature: eq.type === '转炉' || eq.type === 'LF炉' ? 1500 + Math.random() * 200 : undefined,
          pressure: eq.type === '转炉' ? 0.8 + Math.random() * 0.4 : undefined,
          speed: eq.type === '连铸机' ? 0.8 + Math.random() * 0.6 : undefined,
          flow: eq.type === '除尘系统' ? 1000 + Math.random() * 500 : undefined,
        },
      };
      equipmentRecords.push(equipment);
    }

    const energyTypes = ['氧气', '电力', '天然气', '循环水', '压缩空气', '蒸汽'];
    const departments = ['转炉车间', '精炼车间', '连铸车间', '公辅系统'];
    
    for (let i = 0; i < 200; i++) {
      const energyType = energyTypes[i % energyTypes.length];
      const units: Record<string, string> = {
        '氧气': 'm³',
        '电力': 'kWh',
        '天然气': 'm³',
        '循环水': 'm³',
        '压缩空气': 'm³',
        '蒸汽': 't',
      };
      
      const energy = {
        id: i + 1,
        timestamp: new Date(Date.now() - i * 3600000).toISOString(),
        energyType,
        consumption: 1000 + Math.random() * 5000,
        unit: units[energyType],
        department: departments[Math.floor(Math.random() * departments.length)],
        cost: 1000 + Math.random() * 10000,
        steelOutput: 80 + Math.random() * 40,
        consumptionPerTon: 10 + Math.random() * 30,
      };
      energyRecords.push(energy);
    }

    const materialTypes = [
      { id: 'LM001', name: '石灰石', type: '造渣剂', unit: '吨', price: 200 },
      { id: 'YS002', name: '萤石', type: '造渣剂', unit: '吨', price: 800 },
      { id: 'GT003', name: '硅铁', type: '合金', unit: '吨', price: 5000 },
      { id: 'MT004', name: '锰铁合金', type: '合金', unit: '吨', price: 6000 },
      { id: 'LD005', name: '铝锭', type: '脱氧剂', unit: '吨', price: 15000 },
      { id: 'BHZ006', name: '保护渣', type: '辅料', unit: '吨', price: 3000 },
      { id: 'NHCL007', name: '耐火材料', type: '耐火材料', unit: '吨', price: 2500 },
      { id: 'FG008', name: '废钢', type: '原料', unit: '吨', price: 2500 },
      { id: 'HJ009', name: '合金', type: '合金', unit: '吨', price: 4000 },
      { id: 'DT010', name: '电极', type: '消耗品', unit: '根', price: 50000 },
    ];

    for (let i = 0; i < materialTypes.length; i++) {
      const mat = materialTypes[i];
      const stock = 50 + Math.random() * 200;
      const material = {
        id: i + 1,
        materialId: mat.id,
        materialName: mat.name,
        materialType: mat.type,
        stock,
        unit: mat.unit,
        minStock: 30,
        maxStock: 300,
        supplier: `供应商${(i % 3) + 1}`,
        lastPurchaseDate: new Date(Date.now() - Math.random() * 7 * 24 * 3600000).toISOString().split('T')[0],
        nextPurchaseDate: new Date(Date.now() + Math.random() * 14 * 24 * 3600000).toISOString().split('T')[0],
        unitPrice: mat.price,
        location: `仓库${(i % 2) + 1}`,
      };
      materialRecords.push(material);
    }

    await this.hotMetalRepository.save(hotMetalRecords);
    await this.converterRepository.save(converterRecords);
    await this.lfFurnaceRepository.save(lfFurnaceRecords);
    await this.continuousCasterRepository.save([]);
    await this.alarmRepository.save(alarmRecords);
    await this.qualityRepository.save(qualityRecords);
    await this.equipmentRepository.save(equipmentRecords);
    await this.energyRepository.save(energyRecords);
    await this.materialRepository.save(materialRecords);

    this.mockDataStatus.hotMetal = { count: 100, generated: true };
    this.mockDataStatus.smeltingStatus = { count: 70, generated: true };
    this.mockDataStatus.alarms = { count: 20, generated: true };
    this.mockDataStatus.quality = { count: 80, generated: true };
    this.mockDataStatus.equipment = { count: 13, generated: true };
    this.mockDataStatus.energy = { count: 200, generated: true };
    this.mockDataStatus.material = { count: 10, generated: true };
    this.mockDataStatus.lastGenerate = new Date().toISOString();

    return {
      success: true,
      message: '模拟数据已生成',
      data: {
        hotMetal: 100,
        smeltingStatus: 70,
        alarms: 20,
        quality: 80,
        equipment: 13,
        energy: 200,
        material: 10,
      },
      timestamp: new Date().toISOString(),
    };
  }
}