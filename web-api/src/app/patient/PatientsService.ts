import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import * as bcrypt from 'bcryptjs';


@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
  ) {}

  private validatePatientData(dto: Partial<CreatePatientDto>): void {
    const allowedGenders = ['male', 'female', 'other'];

    if (dto.gender && !allowedGenders.includes(dto.gender)) {
      throw new BadRequestException('Gender must be one of male, female, or other');
    }

    if (dto.phoneNumber && !/^\d{10}$/.test(dto.phoneNumber)) {
      throw new BadRequestException('Phone number must be 10 digits');
    }

    if (
      typeof dto.age === 'number' &&
      (dto.age < 0 || dto.age > 120 || !Number.isInteger(dto.age))
    ) {
      throw new BadRequestException('Age must be an integer between 0 and 120');
    }
  }

  async registerPatient(dto: CreatePatientDto): Promise<Patient> {
    const existing = await this.patientRepository.findOne({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('Email already registered');
    }

    this.validatePatientData(dto);

    const newPatient = this.patientRepository.create(dto);
    newPatient.password = await bcrypt.hash(newPatient.password,10)
    return this.patientRepository.save(newPatient);
  }

  async getAllPatients(): Promise<Patient[]> {
    return this.patientRepository.find();
  }

  async getPatientByIdOrThrow(id: number): Promise<Patient> {
    const patient = await this.patientRepository.findOne({ where: { id } });
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    return patient;
  }

  async updatePatient(
    id: number,
    updateData: Partial<CreatePatientDto>,
  ): Promise<Patient> {
    const patient = await this.getPatientByIdOrThrow(id);

    this.validatePatientData(updateData);

    Object.assign(patient, updateData);
    return this.patientRepository.save(patient);
  }

  async deletePatient(id: number): Promise<{ message: string }> {
    await this.getPatientByIdOrThrow(id);
    await this.patientRepository.delete(id);
    return { message: `Patient with ID ${id} deleted successfully` };
  }
}