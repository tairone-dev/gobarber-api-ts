import { getRepository, Repository } from 'typeorm';

import UserTokensRepository from '@modules/users/repositories/UserTokensRepository';

import UserToken from '@modules/users/infra/typeorm/entities/UserToken';

class UserTokensRepositoryImpl implements UserTokensRepository {
  private ormRepository: Repository<UserToken>;

  constructor() {
    this.ormRepository = getRepository(UserToken);
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const userTokenFound = await this.ormRepository.findOne({
      where: { token },
    });

    return userTokenFound;
  }

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = this.ormRepository.create({
      user_id,
    });

    await this.ormRepository.save(userToken);

    return userToken;
  }
}

export default UserTokensRepositoryImpl;
