import { container } from 'tsyringe';
import uploadConfig from '@config/upload';

import StorageProvider from '@shared/container/providers/StorageProvider/models/StorageProvider';
import DiskStorageProvider from '@shared/container/providers/StorageProvider/implementations/DiskStorageProvider';
import S3StorageProvider from '@shared/container/providers/StorageProvider/implementations/S3StorageProvider';

const providers = {
  disk: DiskStorageProvider,
  s3: S3StorageProvider,
};

container.registerSingleton<StorageProvider>(
  'StorageProvider',
  providers[uploadConfig.driver],
);
