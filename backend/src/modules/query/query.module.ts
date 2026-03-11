import { Module } from '@nestjs/common';
import { QueryService } from './query.service';
import { QueryController } from '../../api/query.controller';
import { SemanticEngineModule } from '../../services/semantic-engine.module';
import { OutputFormatterModule } from '../../services/output-formatter.module';

@Module({
  imports: [SemanticEngineModule, OutputFormatterModule],
  controllers: [QueryController],
  providers: [QueryService],
  exports: [QueryService],
})
export class QueryModule {}