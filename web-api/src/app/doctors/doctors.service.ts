import { Injectable } from '@nestjs/common';

@Injectable()
export class DoctorsService {
  getDoctors(): string[] {
    return ['hello'];
  }
}
