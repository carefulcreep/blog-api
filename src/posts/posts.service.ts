import { Injectable } from '@nestjs/common';

import { PostsRepository } from '../repositories/post.repository';
import { PostCreateResponseDto } from './dto/post.create.response.dto';
import { PostPatchResponseDto } from './dto/post.patch.response.dto';
import { PostDeleteResponseDto } from './dto/post.delete.response.dto';
import { PostGetAllResponseDto } from './dto/post.get-all.response.dto';
import { PostGetUserResponseDto } from './dto/post.get-all-user.response.dto';

@Injectable()
export class PostsService {
  constructor(public readonly parserRepository: PostsRepository) {}

  add(body, req): Promise<PostCreateResponseDto> {
    return this.parserRepository.addEntity({ ...body, createdBy: req.user.id });
  }

  patch(id, body, requestUserId): Promise<PostPatchResponseDto> {
    return this.parserRepository.patchEntity(id, body, requestUserId);
  }

  delete(id, requestUserId): Promise<PostDeleteResponseDto[]> {
    return this.parserRepository.deleteEntity(id, requestUserId);
  }

  getAllPosts(): Promise<PostGetAllResponseDto[]> {
    return this.parserRepository.getAllEntities();
  }

  getUserPosts(userid, requestUserId): Promise<PostGetUserResponseDto[]> {
    return this.parserRepository.getUserPosts(userid, requestUserId);
  }
}
