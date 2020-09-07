import SendMailDTO from '@shared/container/providers/MailProvider/dtos/SendMailDTO';

export default interface MailProvider {
  sendMail(data: SendMailDTO): Promise<void>;
}
