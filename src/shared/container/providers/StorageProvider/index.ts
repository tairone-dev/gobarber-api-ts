import { container } from 'tsyringe';

import StorageProvider from '@shared/container/providers/StorageProvider/models/StorageProvider';
import DiskStorageProvider from '@shared/container/providers/StorageProvider/implementations/DiskStorageProvider';

const providers = {
  disk: DiskStorageProvider,
};

container.registerSingleton<StorageProvider>('StorageProvider', providers.disk);
