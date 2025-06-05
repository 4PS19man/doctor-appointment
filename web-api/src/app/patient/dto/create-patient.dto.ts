import { IsEmail, IsString, IsInt, Min, Max, IsEnum } from 'class-validator';

export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other',
}

export class CreatePatientDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;

  @IsString()
  name!: string;

  @IsString()
  phoneNumber!: string;

  @IsEnum(Gender, { message: 'gender must be one of male, female, or other' })
  gender!: Gender;

  @IsInt()
  @Min(0)
  @Max(120)
  age!: number;
}