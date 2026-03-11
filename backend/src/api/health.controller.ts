import { Controller, Get } from '@nestjs/common';

interface HealthResponse {
  status: 'ok' | 'error';
  timestamp: string;
  version: string;
  uptime: number;
  services: {
    database: 'connected' | 'disconnected';
    llm: 'available' | 'unavailable';
  };
}

@Controller('api/health')
export class HealthController {
  @Get()
  async checkHealth(): Promise<HealthResponse> {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      uptime: process.uptime(),
      services: {
        database: 'connected',
        llm: 'available',
      },
    };
  }
}