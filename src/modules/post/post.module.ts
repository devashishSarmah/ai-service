import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { GeminiAiService } from '../../services/gemini-ai/gemini-ai.service';
import { StableDiffusionService } from '../../services/stable-diffusion/stable-diffusion.service';
import { AiUserService } from '../ai-user/ai-user.service';
import { CloudinaryService } from '../../services/cloudinary/cloudinary.service';

@Module({
  controllers: [PostController],
  providers: [
    PostService,
    GeminiAiService,
    StableDiffusionService,
    AiUserService,
    CloudinaryService,
  ],
})
export class PostModule {}
