import ParseMailTemplateDTO from '@shared/container/providers/MailTemplateProvider/dtos/ParseMailTemplateDTO';
import MailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/MailTemplateProvider';

class FakeMailTemplateProvider implements MailTemplateProvider {
  public async parse({ template }: ParseMailTemplateDTO): Promise<string> {
    return template;
  }
}

export default FakeMailTemplateProvider;
