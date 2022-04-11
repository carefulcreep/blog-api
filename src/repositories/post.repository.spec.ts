import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { PostsRepository } from './post.repository';
import { PostCreateResponseDto } from '../posts/dto/post.create.response.dto';
import { PostPatchResponseDto } from '../posts/dto/post.patch.response.dto';
import { PostDeleteResponseDto } from '../posts/dto/post.delete.response.dto';

describe('Post Repository', () => {
  let repository: PostsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostsRepository],
    }).compile();

    repository = module.get<PostsRepository>(PostsRepository);
  });

  afterEach(async () => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it('add entity', async () => {
    const mockQuery = {
      header: 'header',
      body: 'body',
      createdBy: 'id',
    };
    const expected: PostCreateResponseDto = {
      status: 'string',
      createdAt: 'string',
      updatedAt: 'string',
      createdBy: 'string',
    };
    const addPostSpy = jest
      .spyOn(repository, 'create')
      .mockReturnValue(expected);
    const saveParserSpy = jest
      .spyOn(repository, 'save')
      .mockResolvedValueOnce(expected);

    const response = repository.addEntity(mockQuery);

    await expect(response).resolves.toEqual(expected);
    expect(addPostSpy).toHaveBeenCalledTimes(1);
    expect(addPostSpy).toHaveBeenCalledWith(mockQuery);
    expect(saveParserSpy).toHaveBeenCalledTimes(1);
    expect(saveParserSpy).toHaveBeenCalledWith(expected);
  });

  it('patch entity', async () => {
    const mockQuery = {
      header: 'header',
      body: 'body',
      postStatus: 'Visible',
    };
    const expected: PostPatchResponseDto = {
      generatedMaps: [],
      raw: [],
      affected: 1,
    };
    const patchPostSpy = jest
      .spyOn(repository, 'update')
      .mockResolvedValue(expected);
    const checkAccessSpy = jest
      .spyOn(repository, 'checkAccess')
      .mockResolvedValueOnce(undefined);

    const response = repository.patchEntity(
      'id',
      mockQuery,
      'mockRequestUserId',
    );

    await expect(response).resolves.toEqual(expected);
    expect(patchPostSpy).toHaveBeenCalledTimes(1);
    expect(patchPostSpy).toHaveBeenCalledWith('id', mockQuery);
    expect(checkAccessSpy).toHaveBeenCalledTimes(1);
    expect(checkAccessSpy).toHaveBeenCalledWith('mockRequestUserId', 'id');
  });

  describe('check permission', () => {
    it('checks out', async () => {
      const mockId = 'id';
      const mockRequestUserId = 'userId';
      const findEntitySpy = jest
        .spyOn(repository, 'findByIds')
        .mockResolvedValueOnce([{ createdBy: 'userId' }]);

      const response = repository.checkAccess(mockRequestUserId, mockId);

      await expect(response).resolves.toBeUndefined();
      expect(findEntitySpy).toHaveBeenCalledTimes(1);
      expect(findEntitySpy).toHaveBeenCalledWith(mockId);
    });

    it('does not check out', async () => {
      const mockId = 'id';
      const mockRequestUserId = 'userId';
      const findEntitySpy = jest
        .spyOn(repository, 'findByIds')
        .mockResolvedValueOnce([{ createdBy: 'otherUserId' }]);

      const response = repository.checkAccess(mockRequestUserId, mockId);

      await expect(response).rejects.toThrow(
        new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            error: 'This is not your post',
          },
          HttpStatus.FORBIDDEN,
        ),
      );
      expect(findEntitySpy).toHaveBeenCalledTimes(1);
      expect(findEntitySpy).toHaveBeenCalledWith(mockId);
    });
  });

  describe('delete entity', () => {
    it('success', async () => {
      const mockId = 'id';
      const mockRequestUserId = 'userId';
      const expected: PostDeleteResponseDto = {
        status: 'string',
        header: 'string',
        body: 'string',
        createdAt: 'string',
        updatedAt: 'string',
      };
      const checkAccessSpy = jest
        .spyOn(repository, 'checkAccess')
        .mockResolvedValueOnce(undefined);
      const findEntitySpy = jest
        .spyOn(repository, 'findByIds')
        .mockResolvedValueOnce([{ createdBy: 'userId' }]);
      const removeEntitySpy = jest
        .spyOn(repository, 'remove')
        .mockResolvedValueOnce(expected);

      const response = repository.deleteEntity(mockId, mockRequestUserId);

      await expect(response).resolves.toEqual(expected);
      expect(findEntitySpy).toHaveBeenCalledTimes(1);
      expect(findEntitySpy).toHaveBeenCalledWith(mockId);
      expect(removeEntitySpy).toHaveBeenCalledTimes(1);
      expect(removeEntitySpy).toHaveBeenCalledWith([{ createdBy: 'userId' }]);
      expect(checkAccessSpy).toHaveBeenCalledTimes(1);
      expect(checkAccessSpy).toHaveBeenCalledWith(mockRequestUserId, mockId);
    });
  });

  it('get all entities', async () => {
    const findEntitiesSpy = jest
      .spyOn(repository, 'find')
      .mockResolvedValueOnce([{}]);
    const expected = [{}];

    const response = repository.getAllEntities();
    await expect(response).resolves.toEqual(expected);
    expect(findEntitiesSpy).toHaveBeenCalledTimes(1);
    expect(findEntitiesSpy).toHaveBeenCalledWith({
      where: {
        postStatus: 'Visible',
      },
    });
  });

  it("get user's entities", async () => {
    const mockId = 'id';
    const mockRequestUserId = 'userId';
    const findEntitiesSpy = jest
      .spyOn(repository, 'find')
      .mockResolvedValueOnce([{}]);
    const expected = [{}];

    const response = repository.getUserPosts(mockId, mockRequestUserId);
    await expect(response).resolves.toEqual(expected);
    expect(findEntitiesSpy).toHaveBeenCalledTimes(1);
    expect(findEntitiesSpy).toHaveBeenCalledWith({
      where: {
        createdBy: mockId,
      },
    });
  });
});
