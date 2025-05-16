import { Controller, Get } from '@nestjs/common';

@Controller('/patients')
export class PatientsController {
  @Get()
  getAllPatients() {
    return { message: 'hello Patient' };
  }
}
