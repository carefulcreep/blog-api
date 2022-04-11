import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { PostsRepository } from '../repositories/post.repository';
import { REPOSITORY_MOCK } from '../mocks/repository.mock';

describe('AdminController', () => {
  let controller: AdminController;
  let service: AdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        AdminService,
        {
          provide: PostsRepository,
          useValue: REPOSITORY_MOCK,
        },
      ],
    }).compile();

    controller = module.get<AdminController>(AdminController);
    service = module.get<AdminService>(AdminService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should delete a post', async () => {
    const mockId = 'id';
    const mockDeletePostSpy = jest
      .spyOn(service, 'deletePost')
      .mockResolvedValueOnce(undefined);
    const mockRequest = {
      user: {
        id: 'userId',
      },
    };
    const response = controller.deletePost(mockId, mockRequest);

    await expect(response).resolves.toBeUndefined();
    expect(mockDeletePostSpy).toHaveBeenCalledTimes(1);
    expect(mockDeletePostSpy).toHaveBeenCalledWith('id', 'userId');
  });
});
