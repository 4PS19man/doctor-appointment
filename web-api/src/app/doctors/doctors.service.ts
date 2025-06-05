import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import * as bcrypt from 'bcryptjs';

import { Repository } from 'typeorm';
import { Doctor } from './doctor.entity';
import { cloudinary } from '../shared/config/cloudinary.config';
import { Readable } from 'stream';
import { BadRequestException } from '@nestjs/common';


@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
  ) {}


  async uploadPhoto(file: Express.Multer.File): Promise<any> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'profiles' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );
  
      Readable.from(file.buffer).pipe(uploadStream);
    });
  }

  async create(data: Partial<Doctor>, file?: Express.Multer.File): Promise<Doctor> {
    if (!data.password) {
      throw new BadRequestException('Password is required');
    }
  
    data.password = await bcrypt.hash(data.password, 10);
  
    if (file?.buffer) {
      const result: any = await this.uploadPhoto(file);
      data.image = result.secure_url;
    }
  
    const doctor = this.doctorRepository.create(data);
    return this.doctorRepository.save(doctor);
  }

  async findAllDoctors(): Promise<Doctor[]> {
    return this.doctorRepository.find();
  }

  async findDoctorWithAvailabilities(id: number): Promise<Doctor | null> {
    return this.doctorRepository.findOne({
      where: { id },
      relations: ['availabilities'],
    });
  }

  // Update doctor by ID
  async updateDoctor(id: number, updateData: Partial<Doctor>): Promise<Doctor> {
    const doctor = await this.doctorRepository.findOne({ where: { id } });
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }
    const updated = this.doctorRepository.merge(doctor, updateData);
    return this.doctorRepository.save(updated);
  }

  // Delete doctor by ID
  async deleteDoctor(id: number): Promise<{ message: string }> {
    const result = await this.doctorRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Doctor not found');
    }
    return { message: `Doctor with ID ${id} deleted successfully.` };
  }
}