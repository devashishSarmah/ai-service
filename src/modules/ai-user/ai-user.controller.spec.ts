import { Test, TestingModule } from '@nestjs/testing';
import { AiUserController } from './ai-user.controller';
import { AiUserService } from './ai-user.service';

describe('AiUserController', () => {
  let controller: AiUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiUserController],
      providers: [AiUserService],
    }).compile();

    controller = module.get<AiUserController>(AiUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
