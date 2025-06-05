import {
    Controller,
    Delete,
    Param,
    ParseIntPipe,
    Put,
    Body,
    Post,
    Get,
  } from '@nestjs/common';
  import { SlotService } from './slot.service';
  import { Slot } from './slot.entity';
  
  @Controller('slots')
  export class SlotController {
    constructor(private readonly slotService: SlotService) {}
  
    @Delete(':id')
    async deleteSlot(@Param('id', ParseIntPipe) id: number) {
      return this.slotService.deleteSlot(id);
    }
  
    @Put(':id')
    async updateSlot(
      @Param('id', ParseIntPipe) id: number,
      @Body() body: { startTime: string; endTime: string },
    ): Promise<Slot> {
      const { startTime, endTime } = body;
      return this.slotService.updateSlot(id, startTime, endTime);
    }
  
    @Post('upsert')
    async upsertSlots(
      @Body()
      body: {
        availabilityId: number;
        slots: { id?: number; startTime: string; endTime: string }[];
      },
    ): Promise<Slot[]> {
      const { availabilityId, slots } = body;
      return this.slotService.upsertSlots(availabilityId, slots);
    }
  
    @Get('availability/:availabilityId')  //  Place this first
    async getSlotsByAvailability(
      @Param('availabilityId', ParseIntPipe) availabilityId: number,
    ): Promise<Slot[]> {
      return this.slotService.getSlotsByAvailability(availabilityId);
    }
  
    @Get(':id') //  Place this after
    async getSlotById(@Param('id', ParseIntPipe) id: number): Promise<Slot> {
      return this.slotService.getSlotById(id);
    }
  }
  
   
    


  
  