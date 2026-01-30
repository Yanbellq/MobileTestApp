import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  budget: number;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsNotEmpty()
  @IsNumber()
  category: number;

  @IsOptional()
  @IsDateString()
  startTask?: Date;

  @IsOptional()
  @IsDateString()
  endTask?: Date;
}

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  budget?: number;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsNumber()
  category?: number;

  @IsOptional()
  @IsDateString()
  startTask?: Date;

  @IsOptional()
  @IsDateString()
  endTask?: Date;

  @IsOptional()
  @IsString()
  status?: string;
}
