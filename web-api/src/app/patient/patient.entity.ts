import { Entity, PrimaryGeneratedColumn, Column , OneToMany} from 'typeorm';
import { Appointment } from '../appointments/appointment.entity';


@Entity()
export class Patient {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  name!: string;

  @Column()
  phoneNumber!: string;

  @Column()
  gender!: string;

  @Column()
  age!: number;

  @OneToMany(() => Appointment, (appointment) => appointment.patient)
  appointments!: Appointment[];


}