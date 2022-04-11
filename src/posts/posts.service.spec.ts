import { Test, TestingModule } from '@nestjs/testing';

import { PostsService } from './posts.service';
import { PostsRepository } from '../repositories/post.repository';
import { PostDeleteResponseDto } from './dto/post.delete.response.dto';
import { PostGetAllResponseDto } from './dto/post.get-all.response.dto';
import { PostGetUserResponseDto } from './dto/post.get-all-user.response.dto';

describe('PostsService', () => {
  let service: PostsService;
  let repository: PostsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostsService, PostsRepository],
    }).compile();

    service = module.get<PostsService>(PostsService);
    repository = module.get<PostsRepository>(PostsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should add a post', async () => {
    const mockBody = {
      header: 'string',
      body: 'string',
    };
    const expected = {
      status: 'string',
      createdAt: 'string',
      updatedAt: 'string',
      createdBy: 'string',
    };
    const mockRequestUserId = 'id';
    const addEntitySpy = jest
      .spyOn(repository, 'addEntity')
      .mockResolvedValueOnce(expected);

    const response = service.add(mockBody, mockRequestUserId);

    await expect(response).resolves.toEqual(expected);
    expect(addEntitySpy).toHaveBeenCalledTimes(1);
    expect(addEntitySpy).toHaveBeenCalledWith({
      ...mockBody,
      createdBy: mockRequestUserId,
    });
  });

  it('should patch a post', async () => {
    const mockBody = {
      header: 'string',
      body: 'string',
    };
    const expected = {
      status: 'string',
      createdAt: 'string',
      updatedAt: 'string',
      createdBy: 'string',
    };
    const mockRequestUserId = 'id';
    const patchEntitySpy = jest
      .spyOn(repository, 'addEntity')
      .mockResolvedValueOnce(expected);

    const response = service.add(mockBody, mockRequestUserId);

    await expect(response).resolves.toEqual(expected);
    expect(patchEntitySpy).toHaveBeenCalledTimes(1);
    expect(patchEntitySpy).toHaveBeenCalledWith({
      ...mockBody,
      createdBy: mockRequestUserId,
    });
  });

  it('should delete a post', async () => {
    const mockId = 'id';
    const expected: PostDeleteResponseDto[] = [
      {
        status: 'string',
        header: 'string',
        body: 'string',
        createdAt: 'string',
        updatedAt: 'string',
      },
    ];
    const mockRequestUserId = 'id';
    const deleteEntitySpy = jest
      .spyOn(repository, 'deleteEntity')
      .mockResolvedValueOnce(expected);

    const response = service.delete(mockId, mockRequestUserId);

    await expect(response).resolves.toEqual(expected);
    expect(deleteEntitySpy).toHaveBeenCalledTimes(1);
    expect(deleteEntitySpy).toHaveBeenCalledWith(mockId, mockRequestUserId);
  });

  it('should get all posts', async () => {
    const expected: PostGetAllResponseDto[] = [
      {
        createdAt: 'string',
        header: 'string',
        body: 'string',
      },
    ];
    const getAllEntitiesSpy = jest
      .spyOn(repository, 'getAllEntities')
      .mockResolvedValueOnce(expected);

    const response = service.getAllPosts();

    await expect(response).resolves.toEqual(expected);
    expect(getAllEntitiesSpy).toHaveBeenCalledTimes(1);
    expect(getAllEntitiesSpy).toHaveBeenCalledWith();
  });

  it("should get user's posts", async () => {
    const mockId = 'id';
    const expected: PostGetUserResponseDto[] = [
      {
        createdAt: 'string',
        header: 'string',
        body: 'string',
      },
    ];
    const mockRequestUserId = 'id';
    const getUserPostsSpy = jest
      .spyOn(repository, 'getUserPosts')
      .mockResolvedValueOnce(expected);

    const response = service.getUserPosts(mockId, mockRequestUserId);

    await expect(response).resolves.toEqual(expected);
    expect(getUserPostsSpy).toHaveBeenCalledTimes(1);
    expect(getUserPostsSpy).toHaveBeenCalledWith(mockId, mockRequestUserId);
  });
});
