// src/slots/slot.entity.ts
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { Availability } from '../availability/availability.entity';
  
  @Entity()
  export class Slot {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @Column({ type: 'time' })
    startTime!: string;
  
    @Column({ type: 'time' })
    endTime!: string;
  
    @ManyToOne(() => Availability, (availability) => availability.slots, {
      onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'availabilityId' })
    availability!: Availability;
  }
  