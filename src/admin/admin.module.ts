import { Module } from '@nestjs/common';

import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsRepository } from '../repositories/post.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PostsRepository])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
