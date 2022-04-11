import { Test, TestingModule } from '@nestjs/testing';

import { AdminService } from './admin.service';
import { REPOSITORY_MOCK } from '../mocks/repository.mock';
import { PostsRepository } from '../repositories/post.repository';

describe('AdminService', () => {
  let service: AdminService;
  let repository: PostsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: PostsRepository,
          useValue: REPOSITORY_MOCK,
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
    repository = module.get<PostsRepository>(PostsRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should delete a post', async () => {
    const mockId = 'id';
    const mockRequestUserId = 'userId';
    const findPostSpy = jest
      .spyOn(repository, 'findByIds')
      .mockResolvedValueOnce([{}]);
    const deletePostSpy = jest
      .spyOn(repository, 'remove')
      .mockResolvedValueOnce(undefined);

    const response = service.deletePost(mockId, mockRequestUserId);
    await expect(response).resolves.toBeUndefined();
    expect(findPostSpy).toHaveBeenCalledWith(mockId);
    expect(findPostSpy).toHaveBeenCalledTimes(1);
    expect(deletePostSpy).toHaveBeenCalledWith([{}]);
    expect(deletePostSpy).toHaveBeenCalledTimes(1);
  });
});
