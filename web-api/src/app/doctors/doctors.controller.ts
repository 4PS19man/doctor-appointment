

// import { Controller, Get } from '@nestjs/common';

// @Controller('/doctors')
// export class DoctorsController {
//   @Get()
//   getAllDoctors() {
//     return { message: 'hello Doctor' };
//   }
// }


import { Controller, Get } from '@nestjs/common';
import { DoctorsService } from './doctors.service';

@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Get()
  getDoctors() {
    return this.doctorsService.getDoctors();
  }
}

