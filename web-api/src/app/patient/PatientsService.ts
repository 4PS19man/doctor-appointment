import { Injectable } from '@nestjs/common';

@Injectable()
export class PatientsService {
  getPatients(): string[] {
    return ['hello'];
  }
}
