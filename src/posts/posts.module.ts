import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PostsRepository } from '../repositories/post.repository';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [TypeOrmModule.forFeature([PostsRepository]), ConfigModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
