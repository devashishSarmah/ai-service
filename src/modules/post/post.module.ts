import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { GeminiAiService } from '../../services/gemini-ai/gemini-ai.service';
import { StableDiffusionService } from '../../services/stable-diffusion/stable-diffusion.service';

@Module({
  controllers: [PostController],
  providers: [PostService, GeminiAiService, StableDiffusionService],
})
export class PostModule {}
