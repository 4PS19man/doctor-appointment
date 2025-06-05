import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
  } from 'typeorm';
  import { Doctor } from '../doctors/doctor.entity';
  import { Slot } from '../slots/slot.entity';
  
  // Enum defined in the same file
  export enum DayOfWeek {
    MONDAY = 'Monday',
    TUESDAY = 'Tuesday',
    WEDNESDAY = 'Wednesday',
    THURSDAY = 'Thursday',
    FRIDAY = 'Friday',
    SATURDAY = 'Saturday',
    SUNDAY = 'Sunday',
  }
  
  @Entity()
  export class Availability {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @Column()
    location!: string;
  
    @Column({
      type: 'enum',
      enum: DayOfWeek,
    })
    dayOfWeek!: DayOfWeek;
  
    @ManyToOne(() => Doctor, (doctor) => doctor.availabilities, {
      onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'doctorId' })
    doctor!: Doctor;
  
    @OneToMany(() => Slot, (slot) => slot.availability, {
      cascade: true,
      eager: true,
    })
    slots!: Slot[];
  }