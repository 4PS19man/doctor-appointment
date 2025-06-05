import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Put,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DoctorService } from './doctors.service';
import { Doctor } from './doctor.entity';
import { CreateDoctorDto } from './dto/create-doctor.dto';



@Controller('doctors')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @UploadedFile() file: Express.Multer.File,
  @Body() doctorData: CreateDoctorDto,
  ) {
    return this.doctorService.create(doctorData, file);
  }

  @Get()
  async getAllDoctors(): Promise<Doctor[]> {
    return this.doctorService.findAllDoctors();
  }

  @Get(':id')
  async getDoctorWithAvailability(@Param('id') id: number): Promise<Doctor | null> {
    return this.doctorService.findDoctorWithAvailabilities(id);
  }

  @Put(':id')
  async updateDoctor(
    @Param('id') id: number,
    @Body() updateData: Partial<Doctor>,
  ): Promise<Doctor> {
    return this.doctorService.updateDoctor(id, updateData);
  }

  @Delete(':id')
  async deleteDoctor(@Param('id') id: number): Promise<{ message: string }> {
    return this.doctorService.deleteDoctor(id);
  }
}