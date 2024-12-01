import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserService } from './user.service';
import { PostService } from './post.service';
import { PrismaService } from './prisma.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, UserService, PostService, PrismaService],
})
export class AppModule {}
