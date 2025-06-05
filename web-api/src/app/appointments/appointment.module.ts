import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentsService } from './appointment.service';
import { AppointmentsController } from './appointment.controller';

import { Appointment } from './appointment.entity';
import { Doctor } from '../doctors/doctor.entity';
import { Patient } from '../patient/patient.entity';
import { Slot } from '../slots/slot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, Doctor, Patient, Slot])],
  providers: [AppointmentsService],
  controllers: [AppointmentsController],
})
export class AppointmentsModule {}