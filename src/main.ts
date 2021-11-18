import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as momentTimezone from 'moment-timezone';
import { Transport } from '@nestjs/microservices';

let amqpUrl = 'amqp://';
amqpUrl += `${process.env.RABBITMQ_USER}:`;
amqpUrl += process.env.RABBITMQ_PASS;
amqpUrl += `@${process.env.RABBITMQ_HOST}`;
amqpUrl += `:${process.env.RABBITMQ_PORT}/smartranking`;


async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [amqpUrl],
      noAck: false,
      queue: 'notificacoes'
    }
  });

  Date.prototype.toJSON = function(): any {
    return momentTimezone(this)
      .tz('America/Sao_Paulo')
      .format('YYYY-MM-DD HH:mm:ss.SSS');
  }
  await app.listen();
}
bootstrap();
