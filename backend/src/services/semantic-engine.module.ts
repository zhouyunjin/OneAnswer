import { Module } from '@nestjs/common';
import { SemanticEngineService } from './semantic-engine.service';
import { ConfigModule } from '../core/config/config.module';

@Module({
  imports: [ConfigModule],
  providers: [SemanticEngineService],
  exports: [SemanticEngineService],
})
export class SemanticEngineModule {}
