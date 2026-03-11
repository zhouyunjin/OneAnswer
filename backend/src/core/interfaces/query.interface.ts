import { QueryIntent } from '../enums/query-intent.enum';

export interface QueryParams {
  timeRange?: {
    start?: string;
    end?: string;
    duration?: string;
  };
  deviceIds?: string[];
  materialType?: string;
  steelGrade?: string;
  processType?: string;
  [key: string]: any;
}

export interface QueryResult {
  intentType: QueryIntent;
  data: Record<string, any>;
  rawData?: Record<string, any>;
}

export interface OutputMetadata {
  queryTime: string;
  intentType: QueryIntent;
  dataSource: string;
}

export interface StructuredOutput {
  metadata: OutputMetadata;
  summary: string;
  data: Record<string, any>;
}
