import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import RegisterDto from './dto/register.dto';
import { TokenDto } from './dto/token.dto';
import LoginDto from './dto/login.dto';
import { UserTokenPayloadDto } from './dto/userTokenPayload.dto';
import { LocalAuthGuard } from '../guards/local-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User was created',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'User with that email already exists',
  })
  @ApiOperation({ summary: 'Register on the platform' })
  @Post('register')
  register(@Body() registrationData: RegisterDto): Promise<TokenDto> {
    return this.authService.register(registrationData);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User was logged in',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials',
  })
  @ApiOperation({ summary: 'Login on the platform' })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginData: LoginDto): Promise<TokenDto> {
    const user = await this.authService.getAuthenticatedUser(
      loginData.email,
      loginData.password,
    );

    if (user.blocked) {
      throw new HttpException(
        'Your account has been blocked',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const payload: UserTokenPayloadDto = {
      id: user.id,
      roles: user.roles,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    return this.authService.getJWTTokens(payload);
  }
}
