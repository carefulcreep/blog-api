import { Test, TestingModule } from '@nestjs/testing';

import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostsRepository } from '../repositories/post.repository';
import { REPOSITORY_MOCK } from '../mocks/repository.mock';
import { PostPatchResponseDto } from './dto/post.patch.response.dto';

describe('PostsController', () => {
  let controller: PostsController;
  let service: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        PostsService,
        {
          provide: PostsRepository,
          useValue: REPOSITORY_MOCK,
        },
      ],
    }).compile();

    controller = module.get<PostsController>(PostsController);
    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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
    const mockRequest = {
      user: {
        id: 'userId',
      },
    };
    const mockAddSpy = jest
      .spyOn(service, 'add')
      .mockResolvedValueOnce(expected);

    const response = controller.add(mockBody, mockRequest);

    await expect(response).resolves.toEqual(expected);
    expect(mockAddSpy).toHaveBeenCalledTimes(1);
    expect(mockAddSpy).toHaveBeenCalledWith(mockBody, mockRequest.user.id);
  });

  it('should patch a post', async () => {
    const mockBody = {
      header: 'string',
      body: 'string',
      postStatus: 'Invisible',
    };
    const mockId = 'id';
    const expected: PostPatchResponseDto = {
      generatedMaps: [],
      raw: [],
      affected: 1,
    };
    const mockRequest = {
      user: {
        id: 'userId',
      },
    };
    const mockPatchSpy = jest
      .spyOn(service, 'patch')
      .mockResolvedValueOnce(expected);

    const response = controller.patch(mockId, mockBody, mockRequest);

    await expect(response).resolves.toEqual(expected);
    expect(mockPatchSpy).toHaveBeenCalledTimes(1);
    expect(mockPatchSpy).toHaveBeenCalledWith(
      mockId,
      mockBody,
      mockRequest.user.id,
    );
  });

  it('should delete a post', async () => {
    const mockId = 'id';
    const expected = [
      {
        status: 'string',
        header: 'string',
        body: 'string',
        createdAt: 'string',
        updatedAt: 'string',
      },
    ];
    const mockPatchSpy = jest
      .spyOn(service, 'delete')
      .mockResolvedValueOnce(expected);
    const mockRequest = {
      user: {
        id: 'userId',
      },
    };

    const response = controller.delete(mockId, mockRequest);

    await expect(response).resolves.toEqual(expected);
    expect(mockPatchSpy).toHaveBeenCalledTimes(1);
    expect(mockPatchSpy).toHaveBeenCalledWith(mockId, mockRequest.user.id);
  });

  it('should get all posts', async () => {
    const expected = [
      {
        createdAt: 'string',
        header: 'string',
        body: 'string',
      },
    ];
    const mockGetAllPostsSpy = jest
      .spyOn(service, 'getAllPosts')
      .mockResolvedValueOnce(expected);

    const response = controller.getAllPosts();

    await expect(response).resolves.toEqual(expected);
    expect(mockGetAllPostsSpy).toHaveBeenCalledTimes(1);
    expect(mockGetAllPostsSpy).toHaveBeenCalledWith();
  });

  it("should get user's posts", async () => {
    const expected = [
      {
        createdAt: 'string',
        header: 'string',
        body: 'string',
      },
    ];
    const mockId = 'id';
    const mockRequest = {
      user: {
        id: 'userId',
      },
    };
    const mockGetUserPostsSpy = jest
      .spyOn(service, 'getUserPosts')
      .mockResolvedValueOnce(expected);

    const response = controller.getUserPosts(mockId, mockRequest);

    await expect(response).resolves.toEqual(expected);
    expect(mockGetUserPostsSpy).toHaveBeenCalledTimes(1);
    expect(mockGetUserPostsSpy).toHaveBeenCalledWith(
      mockId,
      mockRequest.user.id,
    );
  });
});
