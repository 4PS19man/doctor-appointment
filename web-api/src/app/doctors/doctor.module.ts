// src/app/doctor/doctor.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from './doctor.entity';
import { DoctorService } from './doctors.service';
import { DoctorController } from './doctors.controller';


@Module({
  imports: [TypeOrmModule.forFeature([Doctor])],
  controllers: [DoctorController],
  providers: [DoctorService],
  exports: [DoctorService],  // <-- add this line
})
export class DoctorModule {}