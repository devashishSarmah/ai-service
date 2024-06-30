import { Controller, Post, UseGuards } from '@nestjs/common';
import { AiUserService } from './ai-user.service';
import { SshAuthGuard } from '../../guards/ssh-auth/ssh-auth.guard';

@Controller('ai-user')
@UseGuards(SshAuthGuard)
export class AiUserController {
  constructor(private readonly aiUserService: AiUserService) {}

  @Post('create')
  async create(): Promise<{ status_message: string }> {
    await this.aiUserService.create();
    return { status_message: 'User created successfully' };
  }
}
