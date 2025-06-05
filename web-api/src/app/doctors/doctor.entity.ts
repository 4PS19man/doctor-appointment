import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
  } from 'typeorm';
  import { Availability } from '../availability/availability.entity';
  import { Appointment } from '../appointments/appointment.entity';
  
  
  @Entity()
  export class Doctor {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @Column({ unique: true })
    email!: string;
  
    @Column()
    password!: string;
  
    @Column()
    name!: string;
  
    @Column()
    gender!: string;
  
    @Column()
    phoneNumber!: string;
  
    @Column()
    specialization!: string;
  
    @Column()
    experience!: string;
  
    // @Column({ nullable: true })
    // profileImageUrl!: string;
  
    @Column({ nullable: true })
    image?: string; // ✅ Add this to store uploaded image URL
  
  
    @OneToMany(() => Availability, (availability) => availability.doctor, {
           cascade: true, // optional: allows auto-saving availability with doctor
           eager: true,
         })
         availabilities!: Availability[];
  
  
    @OneToMany(() => Appointment, (appointment) => appointment.doctor)
        appointments!: Appointment[];
  
    
  }