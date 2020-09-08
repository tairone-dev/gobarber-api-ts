import { injectable, inject } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import UsersRepository from '@modules/users/repositories/UsersRepository';
import HashProvider from '@modules/users/providers/HashProvider/models/HashProvider';

interface Request {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository') private usersRepository: UsersRepository,
    @inject('HashProvider') private hashProvider: HashProvider,
  ) {}

  public async execute({
    user_id,
    name,
    email,
    password,
    old_password,
  }: Request): Promise<User> {
    const foundUser = await this.usersRepository.findById(user_id);

    if (!foundUser) {
      throw new AppError('User not found.', 404);
    }

    const userWithEmail = await this.usersRepository.findByEmail(email);

    if (userWithEmail && userWithEmail.id !== user_id) {
      throw new AppError('Email already taken.', 422);
    }

    foundUser.name = name;
    foundUser.email = email;

    if (password && !old_password) {
      throw new AppError('Invalid old password.', 422);
    }

    if (password && old_password) {
      const validOldPassword = await this.hashProvider.compareHash(
        old_password,
        foundUser.password,
      );

      if (!validOldPassword) {
        throw new AppError('Invalid old password.', 422);
      }

      foundUser.password = await this.hashProvider.generateHash(password);
    }

    return this.usersRepository.save(foundUser);
  }
}

export default UpdateProfileService;
