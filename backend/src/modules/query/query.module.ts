import { Module } from '@nestjs/common';
import { QueryService } from './query.service';
import { QueryController } from '../../api/query.controller';
import { SemanticEngineModule } from '../../services/semantic-engine.module';
import { OutputFormatterModule } from '../../services/output-formatter.module';
import { DataServiceModule } from '../../services/data.module';

@Module({
  imports: [SemanticEngineModule, OutputFormatterModule, DataServiceModule],
  controllers: [QueryController],
  providers: [QueryService],
  exports: [QueryService],
})
export class QueryModule {}