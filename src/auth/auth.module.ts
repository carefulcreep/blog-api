import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '../config/config.module';
import { UserRepository } from '../repositories/user.repository';
import { LocalStrategy } from '../strategies/local.strategy';
import { JwtAccessValidateStrategy } from '../strategies/jwt-access-validate.guard';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    TypeOrmModule.forFeature([UserRepository]),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtAccessValidateStrategy],
})
export class AuthModule {}
