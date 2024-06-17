import { Controller, Get } from '@nestjs/common';
import { PostService } from './post.service';
import { PostDTO } from '../../dtos/post.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('create')
  async create(): Promise<Partial<PostDTO>> {
    return this.postService.createPost();
  }
}
