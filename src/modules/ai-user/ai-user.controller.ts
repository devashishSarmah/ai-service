import { Body, Controller, Post } from '@nestjs/common';
import { AiUserService } from './ai-user.service';

@Controller('ai-user')
export class AiUserController {
  constructor(private readonly aiUserService: AiUserService) {}

  @Post('create')
  async create(): Promise<{ status_message: string }> {
    await this.aiUserService.create();
    return { status_message: 'User created successfully' };
  }
}
