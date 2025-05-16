import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DoctorsController } from './doctors/doctors.controller';
import { DoctorsService } from './doctors/doctors.service';
import { PatientsController } from './patient/PatientsController';
import { PatientsService } from './patient/PatientsService';

@Module({
  imports: [],
  controllers: [AppController, DoctorsController, PatientsController],
  providers: [AppService, DoctorsService, PatientsService],
})
export class AppModule {}
