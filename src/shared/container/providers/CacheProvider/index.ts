import { container } from 'tsyringe';

import CacheProvider from '@shared/container/providers/CacheProvider/models/CacheProvider';
import RedisCacheProvider from '@shared/container/providers/CacheProvider/implementations/RedisCacheProvider';

const providers = {
  redis: RedisCacheProvider,
};

container.registerSingleton<CacheProvider>('CacheProvider', providers.redis);
