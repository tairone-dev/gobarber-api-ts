import { injectable, inject } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';
import UsersRepository from '@modules/users/repositories/UsersRepository';
import HashProvider from '@modules/users/providers/HashProvider/models/HashProvider';
import AppError from '@shared/errors/AppError';
import CacheProvider from '@shared/container/providers/CacheProvider/models/CacheProvider';

interface Request {
  name: string;
  email: string;
  password: string;
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository') private usersRepository: UsersRepository,

    @inject('HashProvider') private hashProvider: HashProvider,

    @inject('CacheProvider')
    private cacheProvider: CacheProvider,
  ) {}

  public async execute({ name, email, password }: Request): Promise<User> {
    const userAlreadyExists = await this.usersRepository.findByEmail(email);

    if (userAlreadyExists) {
      throw new AppError('Email address already used.', 400);
    }

    const hashedPassword = await this.hashProvider.generateHash(password);

    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    delete user.password;

    await this.cacheProvider.invalidatePrefix('providers-list');

    return user;
  }
}

export default CreateUserService;
