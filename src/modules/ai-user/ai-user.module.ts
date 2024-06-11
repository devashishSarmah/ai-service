import { Module } from '@nestjs/common';
import { AiUserService } from './ai-user.service';
import { AiUserController } from './ai-user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AIUserClient } from './ai-user-client.entity';
import { HttpModule } from '@nestjs/axios';
import { OpenAiService } from './open-ai/open-ai.service';
import { GeminiAiService } from './gemini-ai/gemini-ai.service';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { StableDiffusionService } from './stable-diffusion/stable-diffusion.service';

@Module({
  imports: [TypeOrmModule.forFeature([AIUserClient]), HttpModule],
  controllers: [AiUserController],
  providers: [
    AiUserService,
    OpenAiService,
    GeminiAiService,
    CloudinaryService,
    StableDiffusionService,
  ],
})
export class AiUserModule {}