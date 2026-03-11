import { Module } from '@nestjs/common';
import { QueryService } from './query.service';
import { QueryController } from '../../api/query.controller';
import { SemanticEngineModule } from '../../services/semantic-engine.module';

@Module({
  imports: [SemanticEngineModule],
  controllers: [QueryController],
  providers: [QueryService],
  exports: [QueryService],
})
export class QueryModule {}