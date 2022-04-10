import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { PostsRepository } from './post.repository';
import { PostCreateResponseDto } from '../posts/dto/post.create.response.dto';

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
});
