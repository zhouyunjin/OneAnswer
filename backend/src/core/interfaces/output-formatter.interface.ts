import { QueryIntent } from '../enums/query-intent.enum';
import { QueryResult, StructuredOutput } from './query.interface';

export interface IOutputFormatter {
  format(result: QueryResult): StructuredOutput;
  generateSummary(result: QueryResult): string;
}
