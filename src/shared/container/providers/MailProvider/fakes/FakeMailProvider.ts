import SendMailDTO from '@shared/container/providers/MailProvider/dtos/SendMailDTO';
import MailProvider from '@shared/container/providers/MailProvider/models/MailProvider';

export default class FakeMailProvider implements MailProvider {
  private messages: SendMailDTO[] = [];

  public async sendMail(message: SendMailDTO): Promise<void> {
    this.messages.push(message);
  }
}
