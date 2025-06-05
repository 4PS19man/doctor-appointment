// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   ManyToOne,
//   JoinColumn,
// } from 'typeorm';
// import { Patient } from '../patient/patient.entity';
// import { Doctor } from '../doctors/doctor.entity';



// // Enum defined in the same file
// export enum day {
//   MONDAY = 'Monday',
//   TUESDAY = 'Tuesday',
//   WEDNESDAY = 'Wednesday',
//   THURSDAY = 'Thursday',
//   FRIDAY = 'Friday',
//   SATURDAY = 'Saturday',
//   SUNDAY = 'Sunday',
// }

// @Entity()
// export class Appointment {
//   @PrimaryGeneratedColumn()
//   id!: number;


//   @Column({
//       type: 'enum',
//       enum:   day,
//     })
//     day!:   day;

//   @Column()
//   name!: string; // Patient name (optional if already in Patient entity)

//   @Column()
//   doctorName!: string; // Doctor name (optional if already in Doctor entity)

//   @ManyToOne(() => Patient, (patient) => patient.appointments, { eager: true })
//   @JoinColumn({ name: 'patientId' })
//   patient!: Patient;

//   @ManyToOne(() => Doctor, (doctor) => doctor.appointments, { eager: true })
//   @JoinColumn({ name: 'doctorId' })
//   doctor!: Doctor;

//   // Removed slot relation

//   @Column({ type: 'time' })
//   startTime!: string;

//   @Column({ type: 'time' })
//   endTime!: string;
// }



import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { Patient } from '../patient/patient.entity';
  import { Doctor } from '../doctors/doctor.entity';
  
  // Enum defined in the same file
  export enum day {
    MONDAY = 'Monday',
    TUESDAY = 'Tuesday',
    WEDNESDAY = 'Wednesday',
    THURSDAY = 'Thursday',
    FRIDAY = 'Friday',
    SATURDAY = 'Saturday',
    SUNDAY = 'Sunday',
  }
  
  export enum AppointmentStatus {
    BOOKED = 'BOOKED',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
  }
  
  @Entity()
  export class Appointment {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @Column({
      type: 'enum',
      enum: day,
    })
    day!: day;
  
    @Column({ type: 'date' })
    date!: string; // <-- New date field (e.g., "2025-06-02")
  
    @Column()
    name!: string;
  
    @Column()
    doctorName!: string;
  
    @ManyToOne(() => Patient, (patient) => patient.appointments, { eager: true })
    @JoinColumn({ name: 'patientId' })
    patient!: Patient;
  
    @ManyToOne(() => Doctor, (doctor) => doctor.appointments, { eager: true })
    @JoinColumn({ name: 'doctorId' })
    doctor!: Doctor;
  
    @Column({ type: 'time' })
    startTime!: string;
  
    @Column({ type: 'time' })
    endTime!: string;
  
    @Column({ type: 'time' })
    slotStartTime!: string;
    
    @Column({ type: 'time' })
    slotEndTime!: string;
    
  
    @Column({
      type: 'enum',
      enum: AppointmentStatus,
      default: AppointmentStatus.BOOKED,
    })
    status!: AppointmentStatus;
  }