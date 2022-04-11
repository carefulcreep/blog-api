import { EntityRepository, Repository } from 'typeorm';
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';

import { PostCreateResponseDto } from '../posts/dto/post.create.response.dto';
import Post from '../entities/post.entity';
import { PostPatchResponseDto } from '../posts/dto/post.patch.response.dto';
import { PostDeleteResponseDto } from '../posts/dto/post.delete.response.dto';
import { PostGetAllResponseDto } from '../posts/dto/post.get-all.response.dto';
import { PostGetUserResponseDto } from '../posts/dto/post.get-all-user.response.dto';

@EntityRepository(Post)
export class PostsRepository extends Repository<any> {
  async addEntity(body): Promise<PostCreateResponseDto> {
    const createdPost = this.create(body);

    return this.save(createdPost);
  }

  async patchEntity(id, body, requestUserId): Promise<PostPatchResponseDto> {
    try {
      await this.checkAccess(requestUserId, id);

      return this.update(id, body);
    } catch (err) {
      throw new Error(err);
    }
  }

  async checkAccess(requestUserId, id) {
    const entity = await this.findByIds(id);

    if (entity[0].createdBy != requestUserId) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'This is not your post',
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async deleteEntity(id, requestUserId): Promise<PostDeleteResponseDto[]> {
    await this.checkAccess(requestUserId, id);

    const entity = await this.findByIds(id);

    if (!entity) {
      throw new NotFoundException('Entity was not found by this id');
    }

    return this.remove(entity);
  }

  async getAllEntities(): Promise<PostGetAllResponseDto[]> {
    let entities = await this.find({
      where: {
        postStatus: 'Visible',
      },
    });

    entities = entities.map((entity) => {
      return {
        header: entity.header,
        body: entity.body,
        createdAt: entity.createdAt,
      };
    });

    return entities;
  }

  async getUserPosts(userid, requestUserId): Promise<PostGetUserResponseDto[]> {
    let entities = await this.find({
      where: { createdBy: userid },
    });

    if (entities[0]?.createdBy != requestUserId) {
      entities = entities.filter((entity) => {
        return entity.postStatus != 'Invisible';
      });
    }

    entities = entities.map((entity) => {
      return {
        header: entity.header,
        body: entity.body,
        createdAt: entity.createdAt,
      };
    });

    return entities;
  }
}
