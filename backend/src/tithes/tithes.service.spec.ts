import { Test, TestingModule } from '@nestjs/testing';
import { TithesService } from './tithes.service';

describe('TithesService', () => {
  let service: TithesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TithesService],
    }).compile();

    service = module.get<TithesService>(TithesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
