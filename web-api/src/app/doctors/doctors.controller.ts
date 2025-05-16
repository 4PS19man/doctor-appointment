

import { Controller, Get } from '@nestjs/common';

@Controller('/doctors')
export class DoctorsController {
  @Get()
  getAllDoctors() {
    return { message: 'hello Doctor' };
  }
}

