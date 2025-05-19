// import { Controller, Get } from '@nestjs/common';

// @Controller('/patients')
// export class PatientsController {
//   @Get()
//   getAllPatients() {
//     return { message: 'hello Patient' };
//   }
// }



import { Controller, Get } from '@nestjs/common';
import { PatientsService } from './PatientsService';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get()
  getPatients() {
    return this.patientsService.getPatients();
  }
}
