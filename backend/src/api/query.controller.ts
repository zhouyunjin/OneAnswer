import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { QueryRequestDto } from './dto/query-request.dto';
import { QueryResponseDto } from './dto/query-response.dto';
import { QueryService } from '../modules/query/query.service';

@ApiTags('query')
@Controller('api/query')
export class QueryController {
  constructor(
    private readonly queryService: QueryService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '处理查询请求' })
  @ApiResponse({ status: 200, description: '查询成功', type: QueryResponseDto })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 500, description: '服务器内部错误' })
  async processQuery(@Body() request: QueryRequestDto): Promise<QueryResponseDto> {
    const queryResult = await this.queryService.processQuery(request);

    return {
      queryId: queryResult.queryId,
      intent: queryResult.intent,
      intentType: queryResult.intentType,
      parameters: queryResult.parameters,
      result: queryResult.result,
      processingTime: queryResult.processingTime,
      fromCache: queryResult.fromCache || false,
      timestamp: queryResult.timestamp,
    };
  }
}