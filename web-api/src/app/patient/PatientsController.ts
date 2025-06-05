// import { Controller, Get } from '@nestjs/common';

// @Controller('/patients')
// export class PatientsController {
//   @Get()
//   getAllPatients() {
//     return { message: 'hello Patient' };
//   }
// }



// import { Controller, Get } from '@nestjs/common';
// import { PatientsService } from './PatientsService';

// @Controller('patients')
// export class PatientsController {
//   constructor(private readonly patientsService: PatientsService) {}

//   @Get()
//   getPatients() {
//     return this.patientsService.getPatients();
//   }
// }


import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { PatientService } from './PatientsService';
import { CreatePatientDto } from './dto/create-patient.dto';
import { Patient } from './patient.entity';

@Controller('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post('')
  async register(@Body() dto: CreatePatientDto): Promise<Patient> {
    return this.patientService.registerPatient(dto);
  }

  @Get('')
  async getAll(): Promise<Patient[]> {
    return this.patientService.getAllPatients();
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<Patient> {
    return this.patientService.getPatientByIdOrThrow(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CreatePatientDto>,
  ): Promise<Patient> {
    return this.patientService.updatePatient(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    return this.patientService.deletePatient(id);
  }
}