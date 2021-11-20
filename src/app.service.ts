import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Desafio, DesafioStatus } from './interfaces/desafio.interface';
import { MailerService } from '@nestjs-modules/mailer';
import { ClientDesafiosService } from './infrastructure/services/client-desafios.service';
import { ClientAdminBackendService } from './infrastructure/services/client-admin-backend.service';
import { lastValueFrom } from 'rxjs';
import { Jogador } from './interfaces/jogador.interface';
import HTML_NOTIFICACAO_ADVERSARIO from './static/html-notificacao-adversario';

@Injectable()
export class AppService {
  
  private readonly logger = new Logger(AppService.name);
  private readonly mailerService: MailerService;
  private readonly clientDesafiosService: ClientDesafiosService;
  private readonly clientAdminBackendService: ClientAdminBackendService;

  constructor (
    mailerService: MailerService,
    clientAdminBackendService: ClientAdminBackendService,
    clientDesafiosService: ClientDesafiosService
  ) {
    this.mailerService = mailerService;
    this.clientDesafiosService = clientDesafiosService;
    this.clientAdminBackendService = clientAdminBackendService;
  }

  async enviarEmailParaAdversario(desafio: Desafio): Promise<void>
  {
    try {

      let idAdversario = desafio.jogadores.find(jogador => jogador !== desafio.solicitante);
      const adversarioObserver = this.clientAdminBackendService.client().send('consultar-jogadores', idAdversario);
      const adversario: Jogador = await lastValueFrom(adversarioObserver);

      const solicitanteObserver = this.clientAdminBackendService.client().send('consultar-jogadores', desafio.solicitante);
      const solicitante: Jogador = await lastValueFrom(solicitanteObserver);

      let markup = '';
      markup = HTML_NOTIFICACAO_ADVERSARIO;
      markup = markup.replace(/#NOME_ADVERSARIO/g, adversario.nome);
      markup = markup.replace(/#NOME_SOLICITANTE/g, solicitante.nome);

      this.mailerService.sendMail({
        to: adversario.email,
        from: `"SMART RANKING" <craudiomonza20@gmail.com>`,
        subject: 'Notificação de Desafio',
        html: markup
      })
      .then(success => {
          this.logger.log(success);
      })
      .catch(error => {
        this.logger.error(error);
      });
    } catch (error) {
      this.logger.log(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

}
