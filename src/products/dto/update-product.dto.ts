// import {
//   IsArray,
//   IsEnum,
//   IsInt,
//   IsNumber,
//   IsOptional,
//   IsString,
//   MaxLength,
//   Min,
//   MinLength,
// } from 'class-validator';

// import { ProductCategory } from '../entities/product.entity.js';

// export class UpdateProductDto {
//   @IsOptional()
//   @IsString()
//   @MinLength(2)
//   @MaxLength(150)
//   name?: string;

//   @IsOptional()
//   @IsString()
//   @MinLength(2)
//   @MaxLength(50)
//   sku?: string;

//   @IsOptional()
//   @IsEnum(ProductCategory)
//   category?: ProductCategory;

//   @IsOptional()
//   @IsString()
//   @MinLength(10)
//   description?: string;

//   @IsOptional()
//   @IsNumber()
//   @Min(0)
//   price?: number;

//   @IsOptional()
//   @IsNumber()
//   @Min(0)
//   discountPrice?: number;

//   @IsOptional()
//   @IsInt()
//   @Min(0)
//   stock?: number;

//   @IsOptional()
//   @IsArray()
//   @IsString({ each: true })
//   removeImages?: string[];

//   @IsOptional()
//   @IsArray()
//   @IsString({ each: true })
//   sizes?: string[];

//   @IsOptional()
//   @IsArray()
//   @IsString({ each: true })
//   colors?: string[];

//   @IsOptional()
//   isActive?: boolean;
// }


import {
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

import { Type, Transform } from 'class-transformer';

import { ProductCategory } from '../entities/product.entity.js';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  sku?: string;

  @IsOptional()
  @IsEnum(ProductCategory)
  category?: ProductCategory;

  @IsOptional()
  @IsString()
  @MinLength(10)
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  discountPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) =>
    Array.isArray(value) ? value : [value],
  )
  removeImages?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) =>
    Array.isArray(value) ? value : [value],
  )
  sizes?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) =>
    Array.isArray(value) ? value : [value],
  )
  colors?: string[];

  @IsOptional()
  isActive?: boolean;
}