import { IsEmail, IsString, IsOptional, MinLength, Matches, MaxLength } from "class-validator";

export class RegisterDto {
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    name: string;   

    @IsEmail()
    @MaxLength(100)
    email:string;

    @IsString()
    @MinLength(6)
    @MaxLength(20)
    password:string;


    @IsOptional()
    @IsString()
    @Matches(/^[0-9]{10}$/,{message:"phone number must be 10 digits"})
    phone?:string;
    

}