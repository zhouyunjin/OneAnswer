import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { QueryRequestDto } from './dto/query-request.dto';
import { QueryResponseDto } from './dto/query-response.dto';
import { QueryService } from '../modules/query/query.service';
import { OutputFormatterService } from '../services/output-formatter.service';

@ApiTags('query')
@Controller('api/query')
export class QueryController {
  constructor(
    private readonly queryService: QueryService,
    private readonly outputFormatterService: OutputFormatterService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '处理查询请求' })
  @ApiResponse({ status: 200, description: '查询成功', type: QueryResponseDto })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 500, description: '服务器内部错误' })
  async processQuery(@Body() request: QueryRequestDto): Promise<QueryResponseDto> {
    const startTime = Date.now();
    const queryResult = await this.queryService.processQuery(request);
    const formattedResult = this.outputFormatterService.format(queryResult);
    const processingTime = Date.now() - startTime;

    return {
      queryId: queryResult.queryId,
      intent: queryResult.intent,
      intentType: queryResult.intentType,
      parameters: queryResult.parameters,
      result: formattedResult,
      processingTime,
      fromCache: queryResult.fromCache || false,
      timestamp: new Date().toISOString(),
    };
  }
}