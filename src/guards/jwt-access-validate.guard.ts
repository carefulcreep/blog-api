import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAccessValidateGuard extends AuthGuard(
  'jwt-access-validate-guard',
) {}
