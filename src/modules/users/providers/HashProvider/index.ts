import { container } from 'tsyringe';

import HashProvider from '@modules/users/providers/HashProvider/models/HashProvider';
import BCryptHashProvider from '@modules/users/providers/HashProvider/implementations/BCryptHashProvider';

container.registerSingleton<HashProvider>('HashProvider', BCryptHashProvider);
