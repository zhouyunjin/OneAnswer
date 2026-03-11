import { QueryIntent } from '../enums/query-intent.enum';
import { QueryParams, QueryResult } from './query.interface';

export interface IDataService {
  query(intent: QueryIntent, params: QueryParams): Promise<QueryResult>;
  validateParams(params: QueryParams): boolean;
}
