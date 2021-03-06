import { Injectable, NotFoundException } from '@nestjs/common';

import { PostsRepository } from '../repositories/post.repository';

@Injectable()
export class AdminService {
  constructor(private readonly postRepository: PostsRepository) {}

  async deletePost(id, requestUserId) {
    const entity = await this.postRepository.findByIds(id);

    if (
      entity[0].postStatus == 'Invisible' &&
      entity[0].createdBy != requestUserId
    ) {
      throw new NotFoundException('This post is currently in private');
    }

    await this.postRepository.remove(entity);
  }
}
