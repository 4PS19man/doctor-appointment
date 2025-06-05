// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule } from '@nestjs/config';

import { DoctorModule } from './doctors/doctor.module';
import { AvailabilityModule } from './availability/availability.module';
import { SlotModule } from './slots/slot.module';
import { PatientModule } from './patient/patient.module';
import { AppointmentsModule } from './appointments/appointment.module';
import { AuthModule } from './auth/auth.module';

import { Doctor } from './doctors/doctor.entity';
import { Availability } from './availability/availability.entity';
import { Slot } from './slots/slot.entity';
import { Patient } from './patient/patient.entity';
import { Appointment } from './appointments/appointment.entity';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST!,
      port: parseInt(process.env.DB_PORT!, 10),
      username: process.env.DB_USERNAME!,
      password: process.env.DB_PASSWORD!,
      database: process.env.DB_NAME!,

      entities: [Doctor, Availability, Slot , Patient , Appointment],
      synchronize: true,
    }),
    DoctorModule,
    AvailabilityModule,
    SlotModule,
    PatientModule,
    AppointmentsModule,
    AuthModule
  ],
})
export class AppModule {
 
}