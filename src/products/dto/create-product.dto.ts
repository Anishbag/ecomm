import {
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

import { ProductCategory } from '../entities/product.entity.js';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  name: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  sku: string;

  @IsEnum(ProductCategory)
  category: ProductCategory;

  @IsString()
  @MinLength(10)
  description: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(0)
  price: number;

  @Transform(({ value }) =>
    value === undefined || value === ''
      ? undefined
      : Number(value),
  )
  @IsOptional()
  @IsNumber()
  @Min(0)
  discountPrice?: number;

  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(0)
  stock: number;

  @Transform(({ value }) => {
    if (!value) return undefined;

    if (Array.isArray(value)) {
      return value;
    }

    return value
      .split(',')
      .map((item: string) => item.trim())
      .filter(Boolean);
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @Transform(({ value }) => {
    if (!value) return undefined;

    if (Array.isArray(value)) {
      return value;
    }

    return value
      .split(',')
      .map((item: string) => item.trim())
      .filter(Boolean);
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sizes?: string[];

  @Transform(({ value }) => {
    if (!value) return undefined;

    if (Array.isArray(value)) {
      return value;
    }

    return value
      .split(',')
      .map((item: string) => item.trim())
      .filter(Boolean);
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  colors?: string[];
}
