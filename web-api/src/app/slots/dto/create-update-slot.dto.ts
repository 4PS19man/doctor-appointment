// src/slots/dto/create-update-slot.dto.ts
import { IsString, Matches } from 'class-validator';

export class CreateUpdateSlotDto {
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'startTime must be in HH:mm 24-hour format',
  })
  startTime!: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'endTime must be in HH:mm 24-hour format',
  })
  endTime!: string;
}