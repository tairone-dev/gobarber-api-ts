import { container } from 'tsyringe';

import MailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/MailTemplateProvider';
import HandlebarsMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/implementations/HandlebarsMailTemplateProvider';

const providers = {
  handlebars: HandlebarsMailTemplateProvider,
};

container.registerSingleton<MailTemplateProvider>(
  'MailTemplateProvider',
  providers.handlebars,
);
