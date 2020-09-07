import ParseMailTemplateDTO from '@shared/container/providers/MailTemplateProvider/dtos/ParseMailTemplateDTO';

export default interface MailTemplateProvider {
  parse(data: ParseMailTemplateDTO): Promise<string>;
}
