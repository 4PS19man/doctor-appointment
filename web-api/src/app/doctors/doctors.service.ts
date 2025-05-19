// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class DoctorsService {
//   getDoctors(): string[] {
//     return ['hello'];
//   }
// }


import { Injectable } from '@nestjs/common';

@Injectable()
export class DoctorsService {
  getDoctors() {
    return { message: 'Hello from DoctorsService' }; 
  }
}

