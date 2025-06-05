import {
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import { Appointment } from './appointment.entity';
  import { CreateAppointmentDto } from './dto/create-appointment.dto';
  import { UpdateAppointmentDto } from './dto/update-appointment.dto';
  import { Doctor } from '../doctors/doctor.entity';
  import { Patient } from '../patient/patient.entity';
  import { AppointmentStatus } from './appointment.entity';
  
  @Injectable()
  export class AppointmentsService {
    constructor(
      @InjectRepository(Appointment)
      private readonly appointmentRepo: Repository<Appointment>,
  
      @InjectRepository(Doctor)
      private readonly doctorRepo: Repository<Doctor>,
  
      @InjectRepository(Patient)
      private readonly patientRepo: Repository<Patient>,
    ) {}
  
    async create(dto: CreateAppointmentDto): Promise<Appointment> {
      const doctor = await this.doctorRepo.findOneBy({ name: dto.doctorName });
      if (!doctor) throw new NotFoundException(`Doctor with name ${dto.doctorName} not found`);
    
      const patient = await this.patientRepo.findOneBy({ name: dto.name });
      if (!patient) throw new NotFoundException(`Patient with name ${dto.name} not found`);
    
      const appointment = this.appointmentRepo.create({
        day: dto.day,
        date: dto.date,
        startTime: dto.startTime,
        endTime: dto.endTime,
        slotStartTime: dto.slotStartTime, // ✅ Add this
        slotEndTime: dto.slotEndTime,     // ✅ Add this
        name: dto.name,
        doctorName: dto.doctorName,
        doctor,
        patient,
        status: AppointmentStatus.BOOKED, // optional but good practice
      });
    
      return this.appointmentRepo.save(appointment);
    }
    
    async findAll(): Promise<Appointment[]> {
      return this.appointmentRepo.find({ relations: ['doctor', 'patient'] });
    }
  
    async findById(id: number): Promise<Appointment> {
      const appointment = await this.appointmentRepo.findOne({
        where: { id },
        relations: ['doctor', 'patient'],
      });
      if (!appointment) throw new NotFoundException('Appointment not found');
      return appointment;
    }
  
    async findByDoctorId(doctorId: number): Promise<Appointment[]> {
      return this.appointmentRepo.find({
        where: { doctor: { id: doctorId } },
        relations: ['doctor', 'patient'],
      });
    }
  
    async findByPatientId(patientId: number): Promise<Appointment[]> {
      return this.appointmentRepo.find({
        where: { patient: { id: patientId } },
        relations: ['doctor', 'patient'],
      });
    }
  
    async updateById(id: number, dto: UpdateAppointmentDto): Promise<Appointment> {
      const appointment = await this.findById(id);
  
      // No slot logic here anymore
  
      Object.assign(appointment, dto);
  
      return this.appointmentRepo.save(appointment);
    }
  
    async updateAllByDoctorId(doctorId: number, dto: UpdateAppointmentDto): Promise<{ message: string }> {
      const appointments = await this.appointmentRepo.find({ where: { doctor: { id: doctorId } } });
  
      if (appointments.length === 0) throw new NotFoundException('No appointments found for this doctor');
  
      for (const appt of appointments) {
        Object.assign(appt, dto);
        await this.appointmentRepo.save(appt);
      }
  
      return { message: `Updated ${appointments.length} appointment(s) for doctor ${doctorId}` };
    }
  
    async updateAllByPatientId(patientId: number, dto: UpdateAppointmentDto): Promise<{ message: string }> {
      const appointments = await this.appointmentRepo.find({ where: { patient: { id: patientId } } });
  
      if (appointments.length === 0) throw new NotFoundException('No appointments found for this patient');
  
      for (const appt of appointments) {
        Object.assign(appt, dto);
        await this.appointmentRepo.save(appt);
      }
  
      return { message: `Updated ${appointments.length} appointment(s) for patient ${patientId}` };
    }
  
    async deleteById(id: number): Promise<{ message: string }> {
      const res = await this.appointmentRepo.delete(id);
      if (!res.affected) throw new NotFoundException('Appointment not found');
      return { message: 'Appointment deleted' };
    }
  
    async deleteByDoctorId(doctorId: number): Promise<{ message: string }> {
      await this.appointmentRepo.delete({ doctor: { id: doctorId } });
      return { message: 'Appointments for doctor deleted' };
    }
  
    async deleteByPatientId(patientId: number): Promise<{ message: string }> {
      await this.appointmentRepo.delete({ patient: { id: patientId } });
      return { message: 'Appointments for patient deleted' };
    }
  
  
    async updateStatus(id: number, status: AppointmentStatus): Promise<Appointment> {
      const appointment = await this.findById(id);
      appointment.status = status;
      return this.appointmentRepo.save(appointment);
    }
    
    async findByDoctorAndStatus(doctorId: number, status: AppointmentStatus): Promise<Appointment[]> {
      return this.appointmentRepo.find({
        where: {
          doctor: { id: doctorId },
          status,
        },
        relations: ['doctor', 'patient'],
      });
    }
    
    async findByPatientAndStatus(patientId: number, status: AppointmentStatus): Promise<Appointment[]> {
      return this.appointmentRepo.find({
        where: {
          patient: { id: patientId },
          status,
        },
        relations: ['doctor', 'patient'],
      });
    }
  }