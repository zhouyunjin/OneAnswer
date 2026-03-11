import { IsString, IsOptional, IsIn, IsNumberString } from 'class-validator';

export class QueryRequestDto {
  @IsString()
  query: string;

  @IsOptional()
  @IsString()
  @IsIn(['production', 'quality', 'equipment', 'material', 'energy', 'alerts'])
  tab?: string;

  @IsOptional()
  @IsString()
  outputFormat?: string = 'json';
}