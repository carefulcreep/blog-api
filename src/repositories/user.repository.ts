import { HttpException, HttpStatus } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';

import User from '../entities/user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async checkIfEmailExists(email: string): Promise<boolean> {
    const response = await this.query(
      `SELECT EXISTS(SELECT * FROM "user" WHERE email='${email}');`,
    );

    return response[0].exists;
  }

  async getByEmail(email: string) {
    const user = await this.findOne({ email });

    if (!user) {
      throw new HttpException(
        'User with this email does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }

  async getUserByUUID(id: string) {
    const user = await this.findOne({ id });

    if (!user) {
      throw new HttpException(
        'User with this id does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }
}
