import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
  } from '@nestjs/common';
  import { AppointmentsService } from './appointment.service';
  import { CreateAppointmentDto } from './dto/create-appointment.dto';
  import { UpdateAppointmentDto } from './dto/update-appointment.dto';
  import { Appointment } from './appointment.entity';
  import { AppointmentStatus } from './appointment.entity';
  
  @Controller('appointments')
  export class AppointmentsController {
    constructor(private readonly appointmentsService: AppointmentsService) {}
  
    @Post()
    async create(@Body() dto: CreateAppointmentDto): Promise<Appointment> {
      return this.appointmentsService.create(dto);
    }
  
    @Get()
    async findAll(): Promise<Appointment[]> {
      return this.appointmentsService.findAll();
    }
  
    @Get(':id')
    async findById(@Param('id') id: number): Promise<Appointment> {
      return this.appointmentsService.findById(id);
    }
  
    @Get('by-doctor/:doctorId')
    async findByDoctor(@Param('doctorId') doctorId: number): Promise<Appointment[]> {
      return this.appointmentsService.findByDoctorId(doctorId);
    }
  
    @Get('by-patient/:patientId')
    async findByPatient(@Param('patientId') patientId: number): Promise<Appointment[]> {
      return this.appointmentsService.findByPatientId(patientId);
    }
  
    // Update by appointment id
    @Put(':id')
    async updateById(@Param('id') id: number, @Body() dto: UpdateAppointmentDto): Promise<Appointment> {
      return this.appointmentsService.updateById(id, dto);
    }
  
    @Put('by-doctor/:doctorId')
    async updateByDoctorId(
      @Param('doctorId') doctorId: number,
      @Body() dto: UpdateAppointmentDto,
    ): Promise<{ message: string }> {
      return this.appointmentsService.updateAllByDoctorId(doctorId, dto);
    }
    
    @Put('by-patient/:patientId')
    async updateByPatientId(
      @Param('patientId') patientId: number,
      @Body() dto: UpdateAppointmentDto,
    ): Promise<{ message: string }> {
      return this.appointmentsService.updateAllByPatientId(patientId, dto);
    }
    
  
    @Delete(':id')
    async delete(@Param('id') id: number): Promise<{ message: string }> {
      return this.appointmentsService.deleteById(id);
    }
  
    @Delete('by-patient/:patientId')
    async deleteByPatient(@Param('patientId') patientId: number): Promise<{ message: string }> {
      return this.appointmentsService.deleteByPatientId(patientId);
    }
  
    @Delete('by-doctor/:doctorId')
    async deleteByDoctor(@Param('doctorId') doctorId: number): Promise<{ message: string }> {
      return this.appointmentsService.deleteByDoctorId(doctorId);
    }
  
    @Get('by-doctor/:doctorId/status/:status')
  async findByDoctorAndStatus(
    @Param('doctorId') doctorId: number,
    @Param('status') status: AppointmentStatus,
  ): Promise<Appointment[]> {
    return this.appointmentsService.findByDoctorAndStatus(doctorId, status);
  }
  
  @Get('by-patient/:patientId/status/:status')
  async findByPatientAndStatus(
    @Param('patientId') patientId: number,
    @Param('status') status: AppointmentStatus,
  ): Promise<Appointment[]> {
    return this.appointmentsService.findByPatientAndStatus(patientId, status);
  }
  
  
  
  }