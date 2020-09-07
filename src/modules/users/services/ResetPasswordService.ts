import { injectable, inject } from 'tsyringe';
import { isAfter, addHours } from 'date-fns';

import UsersRepository from '@modules/users/repositories/UsersRepository';
import UserTokensRepository from '@modules/users/repositories/UserTokensRepository';
import HashProvider from '@modules/users/providers/HashProvider/models/HashProvider';
import AppError from '@shared/errors/AppError';

interface Request {
  token: string;
  password: string;
}

@injectable()
class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: UserTokensRepository,

    @inject('HashProvider')
    private hashProvider: HashProvider,
  ) {}

  public async execute({ token, password }: Request): Promise<void> {
    const userToken = await this.userTokensRepository.findByToken(token);

    if (!userToken) {
      throw new AppError('User token does not exists.', 400);
    }

    const user = await this.usersRepository.findById(userToken.user_id);

    if (!user) {
      throw new AppError('User does not exists.', 400);
    }

    const tokenCreatedAt = userToken.created_at;
    const limitDate = addHours(tokenCreatedAt, 2);

    if (isAfter(Date.now(), limitDate)) {
      throw new AppError('Token expired.', 422);
    }

    user.password = await this.hashProvider.generateHash(password);

    await this.usersRepository.save(user);
  }
}

export default ResetPasswordService;
