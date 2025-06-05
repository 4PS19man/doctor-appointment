import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Slot } from './slot.entity';
import { Availability } from '../availability/availability.entity';


@Injectable()
export class SlotService {
  constructor(
    @InjectRepository(Slot)
    private slotRepository: Repository<Slot>,

    @InjectRepository(Availability)
    private availabilityRepository: Repository<Availability>,
  ) {}

 // Validates time strings in "HH:mm" 24-hour format
 private isValidTimeFormat(time: string): boolean {
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return timeRegex.test(time);
}

// Check if startTime < endTime
private isStartBeforeEnd(startTime: string, endTime: string): boolean {
  // Convert to minutes for comparison
  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);
  return startH < endH || (startH === endH && startM < endM);
}

  async deleteSlot(slotId: number): Promise<{ message: string }> {
    const result = await this.slotRepository.delete(slotId);
    if (result.affected === 0) {
      throw new NotFoundException(`Slot with ID ${slotId} not found`);
    }
    return { message: `Slot with ID ${slotId} deleted successfully` };
  }

  async updateSlot(
    slotId: number,
    startTime: string,
    endTime: string,
  ): Promise<Slot> {

    // Validate time format
  if (!this.isValidTimeFormat(startTime) || !this.isValidTimeFormat(endTime)) {
    throw new BadRequestException('startTime and endTime must be in HH:mm format');
  }

  // Validate time order
  if (!this.isStartBeforeEnd(startTime, endTime)) {
    throw new BadRequestException('startTime must be before endTime');
  }
    const slot = await this.slotRepository.findOne({
      where: { id: slotId },
      relations: ['availability', 'availability.slots'],
    });
  
    if (!slot) {
      throw new NotFoundException(`Slot with ID ${slotId} not found`);
    }
  
    // Get all slots under the same availability except the current one
    const otherSlots = slot.availability.slots.filter((s) => s.id !== slot.id);
  
    // Check for overlap
    const overlap = otherSlots.some((existingSlot) => {
      return (
        startTime < existingSlot.endTime &&
        endTime > existingSlot.startTime
      );
    });
  
    if (overlap) {
      throw new ConflictException(
        `Updated slot from ${startTime} to ${endTime} overlaps with an existing slot.`,
      );
    }
  
    // Update and save
    slot.startTime = startTime;
    slot.endTime = endTime;
  
    return this.slotRepository.save(slot);
  }
  

  async upsertSlots(
    availabilityId: number,
    slotsData: { id?: number; startTime: string; endTime: string }[],
  ): Promise<Slot[]> {
    const availability = await this.availabilityRepository.findOne({
      where: { id: availabilityId },
      relations: ['slots'],
    });
  
    if (!availability) {
      throw new NotFoundException(
        `Availability with ID ${availabilityId} not found`,
      );
    }
  
    for (const slotData of slotsData) {

      if (!this.isValidTimeFormat(slotData.startTime) || !this.isValidTimeFormat(slotData.endTime)) {
        throw new BadRequestException('startTime and endTime must be in HH:mm format');
      }
    
      if (!this.isStartBeforeEnd(slotData.startTime, slotData.endTime)) {
        throw new BadRequestException('startTime must be before endTime');
      }
      if (slotData.id) {
        // Update existing slot
        const slot = availability.slots.find((s) => s.id === slotData.id);
        if (!slot) {
          throw new NotFoundException(
            `Slot with ID ${slotData.id} not found in this availability`,
          );
        }
  
        // Overlap check excluding the current slot
        const overlap = availability.slots.some((existingSlot) => {
          return (
            existingSlot.id !== slot.id &&
            slotData.startTime < existingSlot.endTime &&
            slotData.endTime > existingSlot.startTime
          );
        });
  
        if (overlap) {
          throw new ConflictException(
            `Updated slot from ${slotData.startTime} to ${slotData.endTime} overlaps with an existing slot.`,
          );
        }
  
        // Proceed to update
        slot.startTime = slotData.startTime;
        slot.endTime = slotData.endTime;
      } else {
        // Create new slot – overlap check
        const overlap = availability.slots.some((existingSlot) => {
          return (
            slotData.startTime < existingSlot.endTime &&
            slotData.endTime > existingSlot.startTime
          );
        });
  
        if (overlap) {
          throw new ConflictException(
            `New slot from ${slotData.startTime} to ${slotData.endTime} overlaps with an existing slot.`,
          );
        }
  
        const newSlot = this.slotRepository.create({
          startTime: slotData.startTime,
          endTime: slotData.endTime,
          availability,
        });
  
        availability.slots.push(newSlot);
      }
    }
  
    await this.availabilityRepository.save(availability);
    return availability.slots;
  }
  

  async getSlotById(id: number): Promise<Slot> {
    const slot = await this.slotRepository.findOne({ where: { id } });
    if (!slot) {
      throw new NotFoundException(`Slot with ID ${id} not found`);
    }
    return slot;
  }
  
  async getSlotsByAvailability(availabilityId: number): Promise<Slot[]> {
    return this.slotRepository.find({
      where: { availability: { id: availabilityId } },
    });

}

  
}