import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './patient.entity';
import { PatientService } from './PatientsService';
import { PatientController } from './PatientsController';

@Module({
  imports: [TypeOrmModule.forFeature([Patient])],
  providers: [PatientService],
  controllers: [PatientController],
  exports: [PatientService],  
})
export class PatientModule {}