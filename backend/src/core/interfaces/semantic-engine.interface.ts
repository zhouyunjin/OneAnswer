import { QueryIntent } from '../enums/query-intent.enum';
import { QueryParams } from './query.interface';

export interface ISemanticEngine {
  classifyIntent(query: string): Promise<QueryIntent>;
  extractParameters(query: string, intent: QueryIntent): Promise<QueryParams>;
}
