import { container } from 'tsyringe';
import mailConfig from '@config/mail';

import MailProvider from '@shared/container/providers/MailProvider/models/MailProvider';
import EtherealMailProvider from '@shared/container/providers/MailProvider/implementations/EtherealMailProvider';
import SESMailProvider from '@shared/container/providers/MailProvider/implementations/SESMailProvider';

const providers = {
  ethereal: container.resolve(EtherealMailProvider),
  ses: container.resolve(SESMailProvider),
};

container.registerInstance<MailProvider>(
  'MailProvider',
  providers[mailConfig.driver],
);
