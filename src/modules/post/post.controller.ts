import { Controller, Get, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { PostDTO } from '../../dtos/post.dto';
import { SshAuthGuard } from '../../guards/ssh-auth/ssh-auth.guard';

@Controller('post')
@UseGuards(SshAuthGuard)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('create')
  async create(): Promise<Partial<PostDTO>> {
    return this.postService.createPost();
  }
}
