import { IsEnum, IsNotEmpty, IsString, IsDateString } from 'class-validator';
import { day } from '../appointment.entity';

export class CreateAppointmentDto {
  @IsString()
  @IsNotEmpty()
  doctorName!: string;

  @IsString()
  @IsNotEmpty()
  name!: string; // patient name

  @IsEnum(day, { message: 'day must be a valid day of the week' })
  @IsNotEmpty()
  day!: day;

  @IsString()
  @IsNotEmpty()
  startTime!: string;

  @IsString()
  @IsNotEmpty()
  endTime!: string;

  @IsString()
  @IsNotEmpty()
  slotStartTime!: string;

  @IsString()
  @IsNotEmpty()
  slotEndTime!: string;

  @IsDateString({}, { message: 'date must be a valid ISO date string' })
  @IsNotEmpty()
  date!: string;  // 'YYYY-MM-DD' format expected
}