import { injectable, inject } from 'tsyringe';
import { classToClass } from 'class-transformer';

import User from '@modules/users/infra/typeorm/entities/User';
import UsersRepository from '@modules/users/repositories/UsersRepository';
import CacheProvider from '@shared/container/providers/CacheProvider/models/CacheProvider';

interface Request {
  user_id: string;
}

@injectable()
class ListProviderService {
  constructor(
    @inject('UsersRepository') private usersRepository: UsersRepository,

    @inject('CacheProvider')
    private cacheProvider: CacheProvider,
  ) {}

  public async execute({ user_id }: Request): Promise<User[]> {
    const listProviderCacheKey = `providers-list:${user_id}`;

    let foundUsers = await this.cacheProvider.recover<User[]>(
      listProviderCacheKey,
    );

    if (!foundUsers) {
      foundUsers = await this.usersRepository.findAllProviders({
        except_user_id: user_id,
      });

      foundUsers = classToClass(foundUsers);

      await this.cacheProvider.save(listProviderCacheKey, foundUsers);
    }

    return foundUsers;
  }
}

export default ListProviderService;
