import { ApiProperty } from '@nestjs/swagger';
import { QueryIntent } from '../../core/enums/query-intent.enum';

export class QueryResponseDto {
  @ApiProperty({ description: '查询ID' })
  queryId: string;

  @ApiProperty({ description: '查询意图', enum: QueryIntent })
  intent: QueryIntent;

  @ApiProperty({ description: '意图类型', enum: QueryIntent })
  intentType: QueryIntent;

  @ApiProperty({ description: '查询参数' })
  parameters: {
    tab?: string;
    outputFormat?: string;
    timeRange?: any;
    deviceIds?: string[];
    materialType?: string;
    [key: string]: any;
  };

  @ApiProperty({ description: '查询结果' })
  result: {
    metadata: {
      queryTime: string;
      intentType: QueryIntent;
      dataSource: string;
    };
    summary: string;
    data: any;
  };

  @ApiProperty({ description: '查询耗时（毫秒）' })
  processingTime: number;

  @ApiProperty({ description: '是否来自缓存' })
  fromCache: boolean;

  @ApiProperty({ description: '响应时间' })
  timestamp: string;
}
