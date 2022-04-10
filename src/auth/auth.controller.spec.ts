import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepository } from '../repositories/user.repository';
import { REPOSITORY_MOCK } from '../mocks/repository.mock';
import { JwtService } from '@nestjs/jwt';
import { JWT_MOCK } from '../mocks/jwt.mock';
import { ConfigModule } from '../config/config.module';
import { TokenDto } from './dto/token.dto';
import RegisterDto from './dto/register.dto';
import User from '../entities/user.entity';
import Role from '../entities/role.enum';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useValue: REPOSITORY_MOCK,
        },
        {
          provide: JwtService,
          useValue: JWT_MOCK,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should register', async () => {
    const tokens: TokenDto = {
      accessToken: 'access token',
    };
    const registerSpy = jest
      .spyOn(service, 'register')
      .mockResolvedValueOnce(tokens);
    const payload: RegisterDto = {
      email: 'email',
      firstName: 'firstName',
      lastName: 'lastName',
      password: 'password',
    };

    const rs = controller.register(payload);

    await expect(rs).resolves.toEqual(tokens);
    expect(registerSpy).toHaveBeenCalledTimes(1);
    expect(registerSpy).toHaveBeenCalledWith(payload);
  });

  describe('login', () => {
    it('should login', async () => {
      const user: User = {
        id: 'id',
        email: 'email',
        firstName: 'firstName',
        lastName: 'lastName',
        password: 'password',
        blocked: false,
        roles: [Role.Blogger],
      };
      const tokens: TokenDto = {
        accessToken: 'access token',
      };
      const getUSerSpy = jest
        .spyOn(service, 'getAuthenticatedUser')
        .mockResolvedValueOnce(user);
      const jwtSpy = jest
        .spyOn(service, 'getJWTTokens')
        .mockReturnValueOnce(tokens);

      const rs = controller.login({
        email: 'email@email.com',
        password: 'password',
      });

      await expect(rs).resolves.toEqual(tokens);
      expect(getUSerSpy).toHaveBeenCalledTimes(1);
      expect(getUSerSpy).toHaveBeenCalledWith('email@email.com', 'password');
      expect(jwtSpy).toHaveBeenCalledTimes(1);
      expect(jwtSpy).toHaveBeenCalledWith({
        id: 'id',
        roles: [Role.Blogger],
        firstName: 'firstName',
        lastName: 'lastName',
      });
    });

    it('should throw error if user is blocked', async () => {
      const user: User = {
        id: 'id',
        email: 'email',
        firstName: 'firstName',
        lastName: 'lastName',
        password: 'password',
        blocked: true,
        roles: [Role.Blogger],
      };
      const tokens: TokenDto = {
        accessToken: 'access token',
      };
      const getUSerSpy = jest
        .spyOn(service, 'getAuthenticatedUser')
        .mockResolvedValueOnce(user);
      const jwtSpy = jest
        .spyOn(service, 'getJWTTokens')
        .mockReturnValueOnce(tokens);

      const rs = controller.login({
        email: 'email@email.com',
        password: 'password',
      });

      await expect(rs).rejects.toThrow(
        new HttpException(
          'Your account has been blocked',
          HttpStatus.UNAUTHORIZED,
        ),
      );
      expect(getUSerSpy).toHaveBeenCalledTimes(1);
      expect(getUSerSpy).toHaveBeenCalledWith('email@email.com', 'password');
      expect(jwtSpy).toHaveBeenCalledTimes(0);
    });
  });
});
