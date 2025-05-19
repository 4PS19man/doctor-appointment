// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class PatientsService {
//   getPatients(): string[] {
//     return ['hello'];
//   }
// }


import { Injectable } from '@nestjs/common';

@Injectable()
export class PatientsService {
  getPatients() {
    return { message: 'Hello PatientService' }; 
  }
}

