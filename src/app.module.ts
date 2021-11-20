import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { ClientDesafiosService } from './infrastructure/services/client-desafios.service';
import { ClientAdminBackendService } from './infrastructure/services/client-admin-backend.service';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS
        }
      }
    })
  ],
  controllers: [AppController],
  providers: [AppService, ClientDesafiosService, ClientAdminBackendService],
})
export class AppModule {}
