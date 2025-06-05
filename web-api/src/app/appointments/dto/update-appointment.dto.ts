import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';
import { day } from '../appointment.entity'; // adjust path if needed

export class UpdateAppointmentDto {
  @IsOptional()
  @IsString()
  doctorName?: string;

  @IsOptional()
  @IsString()
  name?: string; // patient name

  @IsOptional()
  @IsEnum(day, { message: 'day must be a valid day of the week' })
  day?: day;

  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;

  @IsOptional()
  @IsString()
  slotStartTime?: string; // ✅ changed from !: to ?:

  @IsOptional()
  @IsString()
  slotEndTime?: string;   // ✅ changed from !: to ?:

  @IsOptional()
  @IsDateString({}, { message: 'date must be a valid ISO date string' })
  date?: string;  // 'YYYY-MM-DD' format
}