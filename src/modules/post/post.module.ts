import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { HttpModule } from '@nestjs/axios';
import { AiUserModule } from '../ai-user/ai-user.module';

@Module({
  imports: [HttpModule, AiUserModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
