import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';

interface ModuleConfig {
  enabled: boolean;
  [key: string]: any;
}

interface ModulesConfig {
  modules: Record<string, ModuleConfig>;
}

@Injectable()
export class AppConfigService {
  private modulesConfig: ModulesConfig;

  constructor(private configService: ConfigService) {
    this.loadModulesConfig();
  }

  get port(): number {
    return this.configService.get<number>('PORT') || 3000;
  }

  get databasePath(): string {
    return this.configService.get<string>('DATABASE_PATH') || 'database.sqlite';
  }

  get llmApiKey(): string {
    return this.configService.get<string>('LLM_API_KEY') || '';
  }

  get llmModel(): string {
    return this.configService.get<string>('LLM_MODEL') || 'gpt-3.5-turbo';
  }

  get llmTemperature(): number {
    return this.configService.get<number>('LLM_TEMPERATURE') || 0.7;
  }

  get llmMaxTokens(): number {
    return this.configService.get<number>('LLM_MAX_TOKENS') || 2000;
  }

  get logLevel(): string {
    return this.configService.get<string>('LOG_LEVEL') || 'info';
  }

  get isDebug(): boolean {
    return this.configService.get<boolean>('DEBUG') || false;
  }

  private loadModulesConfig(): void {
    try {
      const configPath = path.join(process.cwd(), 'config', 'modules.yaml');
      const fileContents = fs.readFileSync(configPath, 'utf8');
      this.modulesConfig = yaml.load(fileContents) as ModulesConfig;
    } catch (error) {
      console.warn('Failed to load modules config, using defaults');
      this.modulesConfig = {
        modules: {
          semantic_engine: { enabled: true, model: 'qwen', timeout: 5 },
          data_service: { enabled: true, use_mock_data: true, cache_enabled: true },
          output_formatter: { enabled: true, default_format: 'json' },
          advanced_query: { enabled: false },
          user_auth: { enabled: false },
          history_service: { enabled: false },
        },
      };
    }
  }

  isModuleEnabled(moduleName: string): boolean {
    return this.modulesConfig?.modules?.[moduleName]?.enabled ?? false;
  }

  getModuleConfig(moduleName: string): ModuleConfig | undefined {
    return this.modulesConfig?.modules?.[moduleName];
  }

  validateConfig(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.modulesConfig || !this.modulesConfig.modules) {
      errors.push('modules config is missing or invalid');
      return { valid: false, errors };
    }

    const requiredModules = ['semantic_engine', 'data_service', 'output_formatter'];
    for (const moduleName of requiredModules) {
      if (!this.modulesConfig.modules[moduleName]) {
        errors.push(`Required module '${moduleName}' is missing from config`);
      }
    }

    return { valid: errors.length === 0, errors };
  }
}