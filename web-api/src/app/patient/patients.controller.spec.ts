// import { Test, TestingModule } from '@nestjs/testing';
// import { PatientsController } from './PatientsController';
// import { PatientsService } from './PatientsService';

// describe('PatientsController', () => {
//   let controller: PatientsController;
//   let service: PatientsService;

//   const mockPatientsService = {
//     getPatients: jest.fn().mockReturnValue({ message: 'Hello PatientService' }),
//   };

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [PatientsController],
//       providers: [
//         {
//           provide: PatientsService,
//           useValue: mockPatientsService,
//         },
//       ],
//     }).compile();

//     controller = module.get<PatientsController>(PatientsController);
//     service = module.get<PatientsService>(PatientsService);
//   });

//   it('should be defined', () => {
//     expect(controller).toBeDefined();
//   });

//   it('should return patient data from the service', () => {
//     const result = controller.getPatients();
//     expect(result).toEqual({ message: 'Hello PatientService' });
//     expect(service.getPatients).toHaveBeenCalled();
//   });
// });



import { Test, TestingModule } from '@nestjs/testing';
import { PatientsController } from './PatientsController';
import { PatientsService } from './PatientsService';

describe('PatientsController', () => {
  let controller: PatientsController;
  let service: PatientsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatientsController],
      providers: [PatientsService],
    }).compile();

    controller = module.get<PatientsController>(PatientsController);
    service = module.get<PatientsService>(PatientsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return expected patient data from controller', () => {
    const mockResult = { message: 'Hello PatientService' };
    jest.spyOn(service, 'getPatients').mockReturnValue(mockResult);

    expect(controller.getPatients()).toEqual(mockResult);
  });
});

