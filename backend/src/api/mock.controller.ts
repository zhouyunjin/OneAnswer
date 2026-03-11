import { Controller, Get, Post, HttpCode, HttpStatus } from '@nestjs/common';

interface MockDataStatus {
  enabled: boolean;
  hotMetal: { count: number; generated: boolean };
  smeltingStatus: { count: number; generated: boolean };
  alarms: { count: number; generated: boolean };
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
  };
  timestamp: string;
}

// Mock data storage (in-memory for MVP)
const mockDataStatus: MockDataStatus = {
  enabled: true,
  hotMetal: { count: 100, generated: true },
  smeltingStatus: { count: 50, generated: true },
  alarms: { count: 20, generated: true },
  lastReset: new Date().toISOString(),
  lastGenerate: new Date().toISOString(),
};

@Controller('api/mock')
export class MockController {
  @Get('status')
  async getMockDataStatus(): Promise<MockStatusResponse> {
    return {
      success: true,
      data: mockDataStatus,
    };
  }

  @Post('reset')
  @HttpCode(HttpStatus.OK)
  async resetMockData(): Promise<MockResetResponse> {
    // Reset mock data to initial state
    mockDataStatus.hotMetal = { count: 0, generated: false };
    mockDataStatus.smeltingStatus = { count: 0, generated: false };
    mockDataStatus.alarms = { count: 0, generated: false };
    mockDataStatus.lastReset = new Date().toISOString();

    return {
      success: true,
      message: '模拟数据已重置到初始状态',
      timestamp: new Date().toISOString(),
    };
  }

  @Post('generate')
  @HttpCode(HttpStatus.OK)
  async generateMockData(): Promise<MockGenerateResponse> {
    // Generate mock data for all types
    mockDataStatus.hotMetal = { count: 100, generated: true };
    mockDataStatus.smeltingStatus = { count: 50, generated: true };
    mockDataStatus.alarms = { count: 20, generated: true };
    mockDataStatus.lastGenerate = new Date().toISOString();

    return {
      success: true,
      message: '模拟数据已生成',
      data: {
        hotMetal: 100,
        smeltingStatus: 50,
        alarms: 20,
      },
      timestamp: new Date().toISOString(),
    };
  }
}