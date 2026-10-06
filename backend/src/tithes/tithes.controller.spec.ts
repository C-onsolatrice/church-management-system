import { Test, TestingModule } from '@nestjs/testing';
import { TithesController } from './tithes.controller';

describe('TithesController', () => {
  let controller: TithesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TithesController],
    }).compile();

    controller = module.get<TithesController>(TithesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
