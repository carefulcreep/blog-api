import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { ConfigService } from '../config/config.service';
import { UserTokenPayloadDto } from '../auth/dto/userTokenPayload.dto';

@Injectable()
export class JwtAccessValidateStrategy extends PassportStrategy(
  Strategy,
  'jwt-access-validate-guard',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.jwtAccessConfig.secret,
    });
  }

  validate(payload: UserTokenPayloadDto) {
    return payload;
  }
}
