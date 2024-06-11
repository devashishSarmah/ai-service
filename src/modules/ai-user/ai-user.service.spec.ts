import { Test, TestingModule } from '@nestjs/testing';
import { AiUserService } from './ai-user.service';

describe('AiUserService', () => {
  let service: AiUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AiUserService],
    }).compile();

    service = module.get<AiUserService>(AiUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
