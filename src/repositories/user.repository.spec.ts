import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { UserRepository } from './user.repository';

describe('User Repository', () => {
  let repository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserRepository],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
  });

  afterEach(async () => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it('should check if email exists', async () => {
    const findSpy = jest
      .spyOn(repository, 'query')
      .mockReturnValueOnce([{ exists: true }] as never);

    const rs = repository.checkIfEmailExists('email');

    await expect(rs).resolves.toBeTruthy();
    expect(findSpy).toHaveBeenCalledTimes(1);
    expect(findSpy).toHaveBeenCalledWith(
      'SELECT EXISTS(SELECT * FROM "user" WHERE email=\'email\');',
    );
  });

  describe('Get by Email', () => {
    it('should return user', async () => {
      const user = { email: 'asasa@uhg.com' };
      const findSpy = jest
        .spyOn(repository, 'findOne')
        .mockResolvedValueOnce(user as never);

      const rs = repository.getByEmail('email');

      await expect(rs).resolves.toEqual(user);
      expect(findSpy).toHaveBeenCalledTimes(1);
      expect(findSpy).toHaveBeenCalledWith({ email: 'email' });
    });

    it('should return error', async () => {
      const findSpy = jest
        .spyOn(repository, 'findOne')
        .mockResolvedValueOnce(undefined as never);

      const rs = repository.getByEmail('email');

      await expect(rs).rejects.toThrow(
        new HttpException(
          'User with this email does not exist',
          HttpStatus.NOT_FOUND,
        ),
      );
      expect(findSpy).toHaveBeenCalledTimes(1);
      expect(findSpy).toHaveBeenCalledWith({ email: 'email' });
    });
  });
});
