import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { ConnectionsModule } from './connections/connections.module';
import { PostsModule } from './posts/posts.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule,
    ConnectionsModule,
    PostsModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule {}
