import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

import { PaymentMethod } from '../../common/enums/order.enum.js';

export class CreateOrderDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  firstName: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  lastName: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  companyName?: string;

  @IsString()
  @MaxLength(100)
  country: string;

  @IsString()
  @MinLength(5)
  @MaxLength(255)
  streetAddress: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  city: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  state: string;

  @IsString()
  @Matches(/^\d{6}$/, {
    message: 'PIN code must be 6 digits',
  })
  pinCode: string;

  @IsString()
  @Matches(/^\+?[0-9]{10,15}$/, {
    message: 'Phone number must be valid',
  })
  phone: string;

  @IsEmail()
  @MaxLength(150)
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  additionalInformation?: string;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;
}