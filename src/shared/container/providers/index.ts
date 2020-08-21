import { container } from 'tsyringe';

import StorageProvider from '@shared/container/providers/StorageProvider/models/StorageProvider';
import DiskStorageProvider from '@shared/container/providers/StorageProvider/implementations/DiskStorageProvider';

container.registerSingleton<StorageProvider>(
  'StorageProvider',
  DiskStorageProvider,
);
