import { injectable, inject } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';
import UsersRepository from '@modules/users/repositories/UsersRepository';

interface Request {
  user_id: string;
}

@injectable()
class ListProviderService {
  constructor(
    @inject('UsersRepository') private usersRepository: UsersRepository,
  ) {}

  public async execute({ user_id }: Request): Promise<User[]> {
    const foundUsers = await this.usersRepository.findAllProviders({
      except_user_id: user_id,
    });

    return foundUsers;
  }
}

export default ListProviderService;
