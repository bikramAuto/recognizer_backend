import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { FaceModule } from './face/face.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UserModule, FaceModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
