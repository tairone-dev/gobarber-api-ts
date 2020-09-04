import MailProvider from '@shared/container/providers/MailProvider/models/MailProvider';

interface Message {
  to: string;
  body: string;
}

export default class FakeMailProvider implements MailProvider {
  private messages: Message[] = [];

  public async sendMail(to: string, body: string): Promise<void> {
    this.messages.push({ to, body });
  }
}
