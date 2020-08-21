import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';
import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';
import UsersRepository from '@modules/users/repositories/UsersRepository';
import HashProvider from '@modules/users/providers/HashProvider/models/HashProvider';

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

@injectable()
class CreateSessionService {
  constructor(
    @inject('UsersRepository') private usersRepository: UsersRepository,
    @inject('HashProvider') private hashProvider: HashProvider,
  ) {}

  public async execute({ email, password }: Request): Promise<Response> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    const passwordMatched = await this.hashProvider.compareHash(
      password,
      user.password,
    );

    if (!passwordMatched) {
      throw new AppError('Incorrect email/password combination', 401);
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    delete user.password;

    return {
      user,
      token,
    };
  }
}

export default CreateSessionService;
