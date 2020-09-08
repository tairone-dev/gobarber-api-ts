import { getRepository, Repository, Not } from 'typeorm';

import UsersRepository from '@modules/users/repositories/UsersRepository';
import CreateUserDTO from '@modules/users/dtos/CreateUserDTO';
import FindAllProvidersDTO from '@modules/users/dtos/FindAllProvidersDTO';

import User from '@modules/users/infra/typeorm/entities/User';

class UsersRepositoryImpl implements UsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async findById(id: string): Promise<User | undefined> {
    const userFound = await this.ormRepository.findOne(id);

    return userFound;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const userFound = await this.ormRepository.findOne({
      where: { email },
    });

    return userFound;
  }

  public async findAllProviders({
    except_user_id,
  }: FindAllProvidersDTO): Promise<User[]> {
    if (!except_user_id) {
      return this.ormRepository.find();
    }

    return this.ormRepository.find({
      where: {
        id: Not(except_user_id),
      },
    });
  }

  public async create(data: CreateUserDTO): Promise<User> {
    const user = this.ormRepository.create(data);

    await this.ormRepository.save(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }
}

export default UsersRepositoryImpl;
