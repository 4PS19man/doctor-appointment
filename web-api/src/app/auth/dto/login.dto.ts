export class LoginDto {
    email!: string;
    password!: string;
    role!: 'doctor' | 'patient';
  }