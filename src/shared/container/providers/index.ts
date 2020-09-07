import { container } from 'tsyringe';

import StorageProvider from '@shared/container/providers/StorageProvider/models/StorageProvider';
import DiskStorageProvider from '@shared/container/providers/StorageProvider/implementations/DiskStorageProvider';

import MailProvider from '@shared/container/providers/MailProvider/models/MailProvider';
import EtherealMailProvider from '@shared/container/providers/MailProvider/implementations/EtherealMailProvider';

container.registerSingleton<StorageProvider>(
  'StorageProvider',
  DiskStorageProvider,
);

container.registerInstance<MailProvider>(
  'MailProvider',
  new EtherealMailProvider(),
);
