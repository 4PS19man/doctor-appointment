import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Availability } from './availability.entity';
import { AvailabilityService } from './availability.service';
import { AvailabilityController } from './availability.controller';
import { Doctor } from '../doctors/doctor.entity';
import { Slot } from '../slots/slot.entity'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Availability, Doctor, Slot]) 
  ],
  providers: [AvailabilityService],
  controllers: [AvailabilityController],
})
export class AvailabilityModule {}