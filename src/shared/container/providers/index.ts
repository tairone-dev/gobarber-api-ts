import { container } from 'tsyringe';
import mailConfig from '@config/mail';

import StorageProvider from '@shared/container/providers/StorageProvider/models/StorageProvider';
import DiskStorageProvider from '@shared/container/providers/StorageProvider/implementations/DiskStorageProvider';

import MailProvider from '@shared/container/providers/MailProvider/models/MailProvider';
import EtherealMailProvider from '@shared/container/providers/MailProvider/implementations/EtherealMailProvider';
import SESMailProvider from '@shared/container/providers/MailProvider/implementations/SESMailProvider';

import MailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/MailTemplateProvider';
import HandlebarsMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/implementations/HandlebarsMailTemplateProvider';

container.registerSingleton<StorageProvider>(
  'StorageProvider',
  DiskStorageProvider,
);

container.registerSingleton<MailTemplateProvider>(
  'MailTemplateProvider',
  HandlebarsMailTemplateProvider,
);

container.registerInstance<MailProvider>(
  'MailProvider',
  mailConfig.driver === 'ethereal'
    ? container.resolve(EtherealMailProvider)
    : container.resolve(SESMailProvider),
);
