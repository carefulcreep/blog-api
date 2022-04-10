import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { UserTokenPayloadDto } from '../auth/dto/userTokenPayload.dto';
import Role from '../entities/role.enum';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user: UserTokenPayloadDto = request?.user;

    return user?.roles.includes(Role.Admin);
  }
}
