import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Doctor } from '../doctors/doctor.entity';
import { Patient } from '../patient/patient.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Doctor, Patient])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}