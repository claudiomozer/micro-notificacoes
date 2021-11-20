import { Controller, Get, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { AppService } from './app.service';
import { Desafio } from './interfaces/desafio.interface';

const ackErrors: string[] = ['E11000'];
@Controller('app')
export class AppController 
{
  private readonly appService: AppService;
  private readonly logger = new Logger(AppController.name);  

  constructor(appService: AppService) {
    this.appService = appService;
  }

  @EventPattern('notificacao-novo-desafio')
  async enviarEmailAdversario (
    @Payload() desafio: Desafio,
    @Ctx() context: RmqContext
  ) : Promise<void>
  {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      this.logger.log(`desafio: ${JSON.stringify(desafio)}`);
      this.appService.enviarEmailParaAdversario(desafio);
      await channel.ack(originalMessage);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      const filteredError = ackErrors.filter(async ackError => {
          return error.message.includes(ackError);
      })

      if (filteredError) {
          await channel.ack(originalMessage);
      }
    }
  }

}
