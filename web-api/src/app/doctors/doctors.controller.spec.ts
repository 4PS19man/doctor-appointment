// import { Test, TestingModule } from '@nestjs/testing';
// import { DoctorsController } from './doctors.controller';
// import { DoctorsService } from './doctors.service';

// describe('DoctorsController', () => {
//   let controller: DoctorsController;
//   let service: DoctorsService;

//   const mockDoctorsService = {
//     getDoctors: jest.fn().mockReturnValue({ message: 'Hello from DoctorsService' }),
//   };

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [DoctorsController],
//       providers: [
//         {
//           provide: DoctorsService,
//           useValue: mockDoctorsService,
//         },
//       ],
//     }).compile();

//     controller = module.get<DoctorsController>(DoctorsController);
//     service = module.get<DoctorsService>(DoctorsService);
//   });

//   it('should be defined', () => {
//     expect(controller).toBeDefined();
//   });

//   it('should return doctor data from the service', () => {
//     const result = controller.getDoctors();
//     expect(result).toEqual({ message: 'Hello from DoctorsService' });
//     expect(service.getDoctors).toHaveBeenCalled();
//   });
// });



// import { Test, TestingModule } from '@nestjs/testing';
// import { DoctorsController } from './doctors.controller';
// import { DoctorsService } from './doctors.service';

// describe('DoctorsController', () => {
//   let controller: DoctorsController;
//   let service: DoctorsService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [DoctorsController],
//       providers: [DoctorsService],
//     }).compile();

//     controller = module.get<DoctorsController>(DoctorsController);
//     service = module.get<DoctorsService>(DoctorsService);
//   });

//   it('should be defined', () => {
//     expect(controller).toBeDefined();
//   });

//   it('should return expected doctor data from controller', () => {
//     const mockResult = { message: 'Hello from DoctorsService' };
//     jest.spyOn(service, 'getDoctors').mockReturnValue(mockResult);

//     expect(controller.getDoctors()).toEqual(mockResult);
//   });
// });



