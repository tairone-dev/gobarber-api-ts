import ParseMailProviderDTO from '@shared/container/providers/MailTemplateProvider/dtos/ParseMailTemplateDTO';

interface MailContact {
  name: string;
  email: string;
}

export default interface SendMailDTO {
  to: MailContact;
  from?: MailContact;
  subject: string;
  template: ParseMailProviderDTO;
}
