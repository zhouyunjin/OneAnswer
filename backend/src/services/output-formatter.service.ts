import { Injectable, Logger } from '@nestjs/common';
import { QueryIntent } from '../core/enums/query-intent.enum';
import { QueryResult, StructuredOutput } from '../core/interfaces/query.interface';
import { IOutputFormatter } from '../core/interfaces/output-formatter.interface';

@Injectable()
export class OutputFormatterService implements IOutputFormatter {
  private readonly logger = new Logger(OutputFormatterService.name);

  format(result: QueryResult): StructuredOutput {
    const structuredOutput: StructuredOutput = {
      metadata: {
        queryTime: new Date().toISOString(),
        intentType: result.intentType,
        dataSource: 'production_db',
      },
      summary: this.generateSummary(result),
      data: result.data,
    };

    return structuredOutput;
  }

  generateSummary(result: QueryResult): string {
    const { intentType, data } = result;

    switch (intentType) {
      case QueryIntent.PRODUCTION_STATUS:
        return this.generateProductionStatusSummary(data);
      case QueryIntent.ALARM_EXCEPTION:
        return this.generateAlarmSummary(data);
      case QueryIntent.QUALITY_DATA:
        return this.generateQualitySummary(data);
      case QueryIntent.EQUIPMENT_MANAGEMENT:
        return this.generateEquipmentSummary(data);
      case QueryIntent.ENERGY_CONSUMPTION:
        return this.generateEnergySummary(data);
      case QueryIntent.MATERIAL_MANAGEMENT:
        return this.generateMaterialSummary(data);
      default:
        return '查询完成';
    }
  }

  private generateProductionStatusSummary(data: any): string {
    const summaries: string[] = [];

    if (data.hotMetal && data.hotMetal.length > 0) {
      const count = data.hotMetal.length;
      const avgTemp = this.calculateAverageTemperature(data.hotMetal);
      summaries.push(`最近共接收铁水${count}罐，平均温度${avgTemp}°C。`);
    }

    if (data.converters) {
      const running = data.converters.filter((c: any) => c.status === '冶炼中').length;
      summaries.push(`当前有${running}台转炉运行中。`);
    }

    if (data.lfFurnaces) {
      const refining = data.lfFurnaces.filter((f: any) => f.status === '精炼中').length;
      summaries.push(`当前有${refining}台LF炉精炼中。`);
    }

    if (data.continuousCasters) {
      const casting = data.continuousCasters.filter((c: any) => c.status === '浇铸中').length;
      summaries.push(`当前有${casting}台连铸机浇铸中。`);
    }

    return summaries.join(' ') || '未找到相关生产数据。';
  }

  private generateAlarmSummary(data: any): string {
    if (!data.alarms || data.alarms.length === 0) {
      return '当前没有未处理的报警。';
    }

    const count = data.alarms.length;
    const critical = data.alarms.filter((a: any) => a.severity === '严重').length;
    const major = data.alarms.filter((a: any) => a.severity === '重要').length;

    let summary = `当前有${count}条未处理报警`;
    if (critical > 0) {
      summary += `，其中${critical}条严重`;
    }
    if (major > 0) {
      summary += `，${major}条重要`;
    }
    summary += '。';

    return summary;
  }

  private calculateAverageTemperature(hotMetalData: any[]): number {
    if (!hotMetalData || hotMetalData.length === 0) {
      return 0;
    }

    const total = hotMetalData.reduce((sum: number, item: any) => sum + item.temperature, 0);
    return Math.round(total / hotMetalData.length);
  }

  private generateQualitySummary(data: any): string {
    if (!data.quality || data.quality.length === 0) {
      return '未找到相关质量数据。';
    }

    const stats = data.statistics;
    if (stats) {
      return `共查询到${stats.total}条质量数据，合格${stats.qualified}条，不合格${stats.unqualified}条，合格率${stats.qualifiedRate}%。`;
    }

    return `共查询到${data.quality.length}条质量数据。`;
  }

  private generateEquipmentSummary(data: any): string {
    if (!data.equipment || data.equipment.length === 0) {
      return '未找到相关设备数据。';
    }

    const stats = data.statistics;
    if (stats) {
      return `共${stats.total}台设备，运行中${stats.running}台，待机${stats.standby}台，检修${stats.maintenance}台，故障${stats.fault}台，运行率${stats.runningRate}%。`;
    }

    return `共查询到${data.equipment.length}台设备数据。`;
  }

  private generateEnergySummary(data: any): string {
    if (!data.energy || data.energy.length === 0) {
      return '未找到相关能耗数据。';
    }

    const stats = data.statistics;
    if (stats) {
      return `总能耗${stats.totalConsumption.toFixed(2)}，总成本${stats.totalCost.toFixed(2)}元，平均吨钢能耗${stats.averageConsumptionPerTon}。`;
    }

    return `共查询到${data.energy.length}条能耗数据。`;
  }

  private generateMaterialSummary(data: any): string {
    if (!data.materials || data.materials.length === 0) {
      return '未找到相关物料数据。';
    }

    const stats = data.statistics;
    if (stats) {
      let summary = `共${stats.totalTypes}种物料，总价值${stats.totalValue.toFixed(2)}元`;
      if (stats.lowStockCount > 0) {
        summary += `，其中${stats.lowStockCount}种物料库存不足`;
      }
      summary += '。';
      return summary;
    }

    return `共查询到${data.materials.length}种物料数据。`;
  }
}
