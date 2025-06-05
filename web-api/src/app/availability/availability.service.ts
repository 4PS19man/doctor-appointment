// availability.service.ts
import { Injectable , NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository  } from 'typeorm';
import { Availability } from './availability.entity';
import { Doctor } from '../doctors/doctor.entity';
import { Slot } from '../slots/slot.entity';
import { BadRequestException } from '@nestjs/common';
import { DayOfWeek } from './availability.entity';

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectRepository(Availability)
    private availabilityRepository: Repository<Availability>,

    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,

    @InjectRepository(Slot)
    private slotRepository: Repository<Slot>,
  ) {}

 
  private normalizeDayOfWeek(input: string): DayOfWeek {
    const formatted = input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
    if (!Object.values(DayOfWeek).includes(formatted as DayOfWeek)) {
      throw new BadRequestException(`Invalid dayOfWeek value: ${input}`);
    }
    return formatted as DayOfWeek;
  }
  private isValidTimeFormat(time: string): boolean {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return timeRegex.test(time);
  }
  
  private isStartBeforeEnd(startTime: string, endTime: string): boolean {
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    return startH < endH || (startH === endH && startM < endM);
  }
  


  async createAvailability(data: any, doctorId?: number) {
    let doctor: Doctor | null = null;
  
    // Get doctor
    if (doctorId) {
      doctor = await this.doctorRepository.findOne({
        where: { id: doctorId },
      });
    } else {
      const doctors = await this.doctorRepository.find({
        order: { id: 'DESC' },
        take: 1,
      });
      doctor = doctors[0] ?? null;
    }
  
    if (!doctor) {
      throw new Error('Doctor not found');
    }
  
    const { location, slots } = data;
    const dayOfWeek = this.normalizeDayOfWeek(data.dayOfWeek);
    
  
    // Check if availability already exists
    let availability = await this.availabilityRepository.findOne({
      where: {
        doctor: { id: doctor.id },
        location,
        dayOfWeek,
      },
      relations: ['slots'],
    });
  
    // If not exists, create new
    if (!availability) {
      availability = this.availabilityRepository.create({
        doctor,
        location,
        dayOfWeek,
        slots: [],
      });
      await this.availabilityRepository.save(availability);
    }
  
    const existingSlots = availability.slots;
  
    const nonOverlappingSlots = [];
  
    for (const newSlot of slots) {
      const newStart = newSlot.startTime;
      const newEnd = newSlot.endTime;

       //  Validate format
       if (!this.isValidTimeFormat(newStart) || !this.isValidTimeFormat(newEnd)) {
       throw new BadRequestException('startTime and endTime must be in HH:mm format');
       }

       //  Validate order
       if (!this.isStartBeforeEnd(newStart, newEnd)) {
       throw new BadRequestException('startTime must be before endTime');
  }
  
      const overlaps = existingSlots.some((existing) => {
        return (
          (newStart >= existing.startTime && newStart < existing.endTime) ||
          (newEnd > existing.startTime && newEnd <= existing.endTime) ||
          (newStart <= existing.startTime && newEnd >= existing.endTime)
        );
      });
  
      if (overlaps) {
        throw new BadRequestException('One or more provided slots overlap with existing availability.');
      }
  
      const slot = this.slotRepository.create({
        startTime: newStart,
        endTime: newEnd,
        availability,
      });
      nonOverlappingSlots.push(slot);
    }
  
    // Save only non-overlapping slots
    if (nonOverlappingSlots.length > 0) {
      await this.slotRepository.save(nonOverlappingSlots);
    }
  
    // Return the updated availability
    return this.availabilityRepository.findOne({
      where: { id: availability.id },
      relations: ['slots', 'doctor'],
    });
  }
  
async getAvailabilityByDoctor(doctorId: number): Promise<Availability[]> {
  return this.availabilityRepository.find({
    where: { doctor: { id: doctorId } },
    relations: ['slots'],
  });
}

// Get all availability entries
async getAllAvailability(): Promise<Availability[]> {
    return this.availabilityRepository.find({ relations: ['doctor', 'slots'], });
  }

  
     // Get availability by availability ID
     async getAvailabilityById(id: number): Promise<Availability> {
        const availability = await this.availabilityRepository.findOne({
          where: { id },
          relations: ['slots'],
        });
      
        if (!availability) {
          throw new NotFoundException(`Availability with ID ${id} not found`);
        }
      
        return availability;
      }
      

      async updateAvailabilityById(id: number, updateData: any): Promise<Availability> {
        const availability = await this.availabilityRepository.findOne({
          where: { id },
          relations: ['slots'],
        });
      
        if (!availability) {
          throw new NotFoundException(`Availability with ID ${id} not found`);
        }
      
        // Optional: Normalize and validate dayOfWeek if being updated
        if (updateData.dayOfWeek) {
          updateData.dayOfWeek = this.normalizeDayOfWeek(updateData.dayOfWeek);
        }
      
        // Validate and process slot updates if provided
        if (updateData.slots && Array.isArray(updateData.slots)) {
          const existingSlots = availability.slots;
      
          const nonOverlappingSlots = [];
      
          for (const newSlot of updateData.slots) {
            const { startTime, endTime } = newSlot;
      
            // ✅ Format validation
            if (!this.isValidTimeFormat(startTime) || !this.isValidTimeFormat(endTime)) {
              throw new BadRequestException('startTime and endTime must be in HH:mm format');
            }
      
            // ✅ Order validation
            if (!this.isStartBeforeEnd(startTime, endTime)) {
              throw new BadRequestException('startTime must be before endTime');
            }
      
            // ✅ Overlap check
            const overlaps = existingSlots.some((existing) => {
              return (
                (startTime >= existing.startTime && startTime < existing.endTime) ||
                (endTime > existing.startTime && endTime <= existing.endTime) ||
                (startTime <= existing.startTime && endTime >= existing.endTime)
              );
            });
      
            if (overlaps) {
              throw new BadRequestException('One or more provided slots overlap with existing availability.');
            }
      
            const slot = this.slotRepository.create({
              startTime,
              endTime,
              availability,
            });
      
            nonOverlappingSlots.push(slot);
          }
      
          if (nonOverlappingSlots.length > 0) {
            await this.slotRepository.save(nonOverlappingSlots);
          }
      
          delete updateData.slots; // Prevent TypeORM from attempting to auto-update slots directly
        }
      
        Object.assign(availability, updateData);
        return this.availabilityRepository.save(availability);
      }
      

  // Delete availability by availability ID
  async deleteAvailabilityById(id: number): Promise<{ message: string }> {
    const result = await this.availabilityRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Availability with ID ${id} not found`);
    }

    return { message: `Availability with ID ${id} deleted successfully` };
  }

   

}