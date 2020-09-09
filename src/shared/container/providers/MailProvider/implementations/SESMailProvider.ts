import nodemailer, { Transporter } from 'nodemailer';
import aws from 'aws-sdk';
import { injectable, inject } from 'tsyringe';

import mailConfig from '@config/mail';
import SendMailDTO from '@shared/container/providers/MailProvider/dtos/SendMailDTO';
import MailProvider from '@shared/container/providers/MailProvider/models/MailProvider';
import MailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/MailTemplateProvider';

@injectable()
export default class SESMailProvider implements MailProvider {
  private client: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: MailTemplateProvider,
  ) {
    this.client = nodemailer.createTransport({
      SES: new aws.SES({
        apiVersion: '2010-12-01',
        region: 'us-east-2',
      }),
    });
  }

  public async sendMail({
    to,
    from,
    subject,
    template,
  }: SendMailDTO): Promise<void> {
    const { name, email } = mailConfig.defaults.from;

    await this.client.sendMail({
      from: {
        name: from?.name || name,
        address: from?.email || email,
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html: await this.mailTemplateProvider.parse(template),
    });
  }
}
