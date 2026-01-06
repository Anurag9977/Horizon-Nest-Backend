import { Test, TestingModule } from '@nestjs/testing';
import { PlacesController } from './places.controller';
import { PlacesService } from './places.service';

describe('PlacesController', () => {
  let placesController: PlacesController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PlacesController],
      providers: [PlacesService],
    }).compile();

    placesController = app.get<PlacesController>(PlacesController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(placesController.getHello()).toBe('Hello World!');
    });
  });
});
