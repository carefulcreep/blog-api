import Role from '../../entities/role.enum';

export class UserTokenPayloadDto {
  id: string;
  firstName: string;
  lastName: string;
  roles: Role[];
}
