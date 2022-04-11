import { Test, TestingModule } from '@nestjs/testing';

import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostsRepository } from '../repositories/post.repository';

describe('PostsController', () => {
  let controller: PostsController;
  let service: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [PostsService, PostsRepository],
    }).compile();

    controller = module.get<PostsController>(PostsController);
    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
