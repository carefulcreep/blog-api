import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';

import { AuthService } from './auth.service';
import { UserRepository } from '../repositories/user.repository';
import { REPOSITORY_MOCK } from '../mocks/repository.mock';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '../config/config.service';
import { CONFIG_MOCK } from '../mocks/config.mock';
import { JWT_MOCK } from '../mocks/jwt.mock';
import Role from '../entities/role.enum';
import { TokenDto } from './dto/token.dto';
import RegisterDto from './dto/register.dto';
import User from '../entities/user.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UserTokenPayloadDto } from './dto/userTokenPayload.dto';

describe('AuthService', () => {
  let service: AuthService;
  let repository: UserRepository;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useValue: REPOSITORY_MOCK,
        },
        { provide: JwtService, useValue: JWT_MOCK },
        { provide: ConfigService, useValue: CONFIG_MOCK },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    repository = module.get<UserRepository>(UserRepository);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should return user', async () => {
      const user: User = {
        id: 'id',
        password: 'password',
        firstName: 'first name',
        lastName: 'last name',
        email: 'email',
        blocked: false,
        roles: [Role.Blogger],
      };
      const tokens: TokenDto = {
        accessToken: 'accessToken',
      };
      const hashSpy = jest
        .spyOn(bcrypt, 'hash')
        .mockResolvedValueOnce('hashed password' as never);
      const checkEmailSpy = jest
        .spyOn(repository, 'checkIfEmailExists')
        .mockResolvedValueOnce(false);
      const createSpy = jest
        .spyOn(repository, 'create')
        .mockReturnValueOnce(user);
      const saveSpy = jest.spyOn(repository, 'save').mockImplementation();
      const jwtSpy = jest
        .spyOn(service, 'getJWTTokens')
        .mockReturnValueOnce(tokens);
      const payload: RegisterDto = {
        email: 'email',
        firstName: 'firstName',
        lastName: 'lastName',
        password: 'password',
      };
      const expected = {
        email: 'email',
        firstName: 'firstName',
        lastName: 'lastName',
        password: 'hashed password',
      };

      const rs = service.register(payload);

      await expect(rs).resolves.toEqual(tokens);
      expect(checkEmailSpy).toHaveBeenCalledTimes(1);
      expect(checkEmailSpy).toHaveBeenCalledWith('email');
      expect(hashSpy).toHaveBeenCalledTimes(1);
      expect(hashSpy).toHaveBeenCalledWith('password', 12);
      expect(createSpy).toHaveBeenCalledTimes(1);
      expect(createSpy).toHaveBeenCalledWith(expected);
      expect(saveSpy).toHaveBeenCalledTimes(1);
      expect(saveSpy).toHaveBeenCalledWith(user);
      expect(jwtSpy).toHaveBeenCalledTimes(1);
      expect(jwtSpy).toHaveBeenCalledWith({
        id: 'id',
        roles: [Role.Blogger],
        firstName: 'first name',
        lastName: 'last name',
      });
    });

    it('should throw CONFLICT error if email already exists', async () => {
      const user: User = {
        id: 'id',
        password: 'password',
        firstName: 'first name',
        lastName: 'last name',
        email: 'email',
        blocked: false,
        roles: [Role.Blogger],
      };
      const tokens: TokenDto = {
        accessToken: 'accessToken',
      };
      const hashSpy = jest
        .spyOn(bcrypt, 'hash')
        .mockReturnValueOnce('hashed password' as never);
      const checkEmailSpy = jest
        .spyOn(repository, 'checkIfEmailExists')
        .mockResolvedValueOnce(true);
      const createSpy = jest
        .spyOn(repository, 'create')
        .mockReturnValueOnce(user);
      const saveSpy = jest.spyOn(repository, 'save').mockImplementation();
      const jwtSpy = jest
        .spyOn(service, 'getJWTTokens')
        .mockReturnValueOnce(tokens);
      const payload: RegisterDto = {
        email: 'email',
        firstName: 'firstName',
        lastName: 'lastName',
        password: 'password',
      };

      const rs = service.register(payload);

      await expect(rs).rejects.toThrow(
        new HttpException(
          'User with that email already exists',
          HttpStatus.CONFLICT,
        ),
      );
      expect(checkEmailSpy).toHaveBeenCalledTimes(1);
      expect(checkEmailSpy).toHaveBeenCalledWith('email');
      expect(hashSpy).toHaveBeenCalledTimes(0);
      expect(createSpy).toHaveBeenCalledTimes(0);
      expect(saveSpy).toHaveBeenCalledTimes(0);
      expect(jwtSpy).toHaveBeenCalledTimes(0);
    });
  });

  it('should get JWT tokens', () => {
    const tokens: TokenDto = {
      accessToken: 'access token',
    };
    const signSpy = jest
      .spyOn(jwtService, 'sign')
      .mockReturnValueOnce('access token')
      .mockReturnValueOnce('refresh token');
    const payload: UserTokenPayloadDto = {
      id: 'id',
      firstName: 'first name',
      lastName: 'last name',
      roles: [Role.Blogger],
    };

    const rs = service.getJWTTokens(payload);

    expect(rs).toEqual(tokens);
    expect(signSpy).toHaveBeenCalledTimes(1);
    expect(signSpy).toHaveBeenNthCalledWith(1, payload, {
      expiresIn: '100s',
      secret: 'secret',
    });
    expect(signSpy).toHaveBeenNthCalledWith(1, payload, {
      expiresIn: '100s',
      secret: 'secret',
    });
  });

  describe('get Authenticated User', () => {
    it('should return user', async () => {
      const user: User = {
        id: 'id',
        password: 'password',
        firstName: 'first name',
        lastName: 'last name',
        email: 'email',
        blocked: false,
        roles: [Role.Blogger],
      };
      const findSpy = jest
        .spyOn(repository, 'findOne')
        .mockResolvedValueOnce(user);
      const verifySpy = jest
        .spyOn(service, 'verifyPassword')
        .mockResolvedValueOnce();

      const rs = service.getAuthenticatedUser('email', 'plainTextPassword');

      await expect(rs).resolves.toEqual(user);
      expect(findSpy).toHaveBeenCalledTimes(1);
      expect(findSpy).toHaveBeenCalledWith({ email: 'email' });
      expect(verifySpy).toHaveBeenCalledTimes(1);
      expect(verifySpy).toHaveBeenCalledWith('plainTextPassword', 'password');
    });

    it('should throw wrong BAD_REQUEST', async () => {
      const findSpy = jest
        .spyOn(repository, 'findOne')
        .mockRejectedValueOnce(new Error('err'));
      const verifySpy = jest
        .spyOn(service, 'verifyPassword')
        .mockResolvedValueOnce();

      const rs = service.getAuthenticatedUser('email', 'plainTextPassword');

      await expect(rs).rejects.toThrow(
        new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST),
      );
      expect(findSpy).toHaveBeenCalledTimes(1);
      expect(findSpy).toHaveBeenCalledWith({ email: 'email' });
      expect(verifySpy).toHaveBeenCalledTimes(0);
    });
  });

  describe('verify password', () => {
    it('success', async () => {
      const compareSpy = jest
        .spyOn(bcrypt, 'compare')
        .mockResolvedValueOnce(true as never);

      const rs = service.verifyPassword('a', 'b');

      await expect(rs).resolves.toBeUndefined();
      expect(compareSpy).toHaveBeenCalledTimes(1);
      expect(compareSpy).toHaveBeenCalledWith('a', 'b');
    });

    it('wrong credentials', async () => {
      const compareSpy = jest
        .spyOn(bcrypt, 'compare')
        .mockResolvedValueOnce(false as never);

      const rs = service.verifyPassword('a', 'b');

      await expect(rs).rejects.toThrow(new Error("Password don't match"));
      expect(compareSpy).toHaveBeenCalledTimes(1);
      expect(compareSpy).toHaveBeenCalledWith('a', 'b');
    });
  });
});
