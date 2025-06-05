import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Slot } from './slot.entity';
import { SlotService } from './slot.service';
import { SlotController } from './slot.controller';
import { Availability } from '../availability/availability.entity'; // required if slot needs availability info

@Module({
  imports: [TypeOrmModule.forFeature([Slot, Availability])],
  providers: [SlotService],
  controllers: [SlotController],
  exports: [SlotService], // optional: if you want to use SlotService in other modules
})
export class SlotModule {}