// availability.controller.ts
import { Body, Controller, Post ,Get,Put,Delete,Param} from '@nestjs/common';
import { AvailabilityService } from './availability.service';



@Controller('availability')
export class AvailabilityController {
  constructor(private availabilityService: AvailabilityService) {}

  @Get()
getAll() {
  return this.availabilityService.getAllAvailability();
}

@Get(':id')
getById(@Param('id') id: number) {
  return this.availabilityService.getAvailabilityById(id);
}

@Get('doctor/:doctorId')
getByDoctor(@Param('doctorId') doctorId: number) {
  return this.availabilityService.getAvailabilityByDoctor(doctorId);
}

@Post()
create(@Body() body: any) {
  return this.availabilityService.createAvailability(body, body.doctorId);
}

@Put(':id')
update(@Param('id') id: number, @Body() updateData: any) {
  return this.availabilityService.updateAvailabilityById(id, updateData);
}

@Delete(':id')
delete(@Param('id') id: number) {
  return this.availabilityService.deleteAvailabilityById(id);
}



}