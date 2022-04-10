import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { ConfigService } from '../config/config.service';
import { UserRepository } from '../repositories/user.repository';
import RegisterDto from './dto/register.dto';
import { TokenDto } from './dto/token.dto';
import { UserTokenPayloadDto } from './dto/userTokenPayload.dto';

@Injectable()
export class AuthService {
  constructor(
    public readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registrationData: RegisterDto): Promise<TokenDto> {
    if (await this.userRepository.checkIfEmailExists(registrationData.email)) {
      throw new HttpException(
        'User with that email already exists',
        HttpStatus.CONFLICT,
      );
    }

    const hashedPassword = await bcrypt.hash(registrationData.password, 12);

    const createdUser = this.userRepository.create({
      ...registrationData,
      password: hashedPassword,
    });

    await this.userRepository.save(createdUser);

    const payload: UserTokenPayloadDto = {
      id: createdUser.id,
      roles: createdUser.roles,
      firstName: 'first name',
      lastName: 'last name',
    };

    return this.getJWTTokens(payload);
  }

  getJWTTokens(payload: UserTokenPayloadDto): TokenDto {
    const accessToken = this.jwtService.sign(
      payload,
      this.configService.jwtAccessConfig,
    );

    return {
      accessToken,
    };
  }

  async getAuthenticatedUser(email: string, plainTextPassword: string) {
    try {
      const user = await this.userRepository.findOne({ email });
      await this.verifyPassword(plainTextPassword, user.password);

      return user;
    } catch (error) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async verifyPassword(plainTextPassword: string, hashedPassword: string) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );

    if (!isPasswordMatching) {
      throw new HttpException("Password don't match", HttpStatus.FORBIDDEN);
    }
  }
}
