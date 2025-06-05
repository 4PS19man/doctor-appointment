import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';



import { Doctor } from '../doctors/doctor.entity';
import { Patient } from '../patient/patient.entity';
import { LoginDto } from './dto/login.dto';
import { signToken } from './jwt-auth.guard';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepo: Repository<Doctor>,

    @InjectRepository(Patient)
    private readonly patientRepo: Repository<Patient>,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password, role } = loginDto;

    if (role === 'doctor') {
      const doctor = await this.doctorRepo.findOne({
        where: { email },
        relations: ['availabilities'],
      });

      if (!doctor || !(await bcrypt.compare(password, doctor.password))) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const token = signToken({ email: doctor.email, role });

      return {
        role,
        doctor: {
          ...doctor,
          password: undefined, // Do not return password
        },
        token,
      };
    }

    if (role === 'patient') {
      const patient = await this.patientRepo.findOne({
        where: { email },
      });
      console.log(patient);
      

      if (!patient || !(await bcrypt.compare(password, patient.password))) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const token = signToken({ email: patient.email, role });

      return {
        role,
        patient: {
          ...patient,
          password: undefined,
        },
        token,
      };
    }

    throw new UnauthorizedException('Invalid role');
  }
}