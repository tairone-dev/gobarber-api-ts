import { injectable, inject } from 'tsyringe';
import path from 'path';

import UsersRepository from '@modules/users/repositories/UsersRepository';
import UserTokensRepository from '@modules/users/repositories/UserTokensRepository';
import MailProvider from '@shared/container/providers/MailProvider/models/MailProvider';
import AppError from '@shared/errors/AppError';

interface Request {
  email: string;
}

@injectable()
class SendForgotEmailPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: UserTokensRepository,

    @inject('MailProvider')
    private mailProvider: MailProvider,
  ) {}

  public async execute({ email }: Request): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('User does not exists.', 400);
    }

    const { token } = await this.userTokensRepository.generate(user.id);

    const forgotPasswordTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'forgot_password.hbs',
    );

    await this.mailProvider.sendMail({
      to: {
        name: user.name,
        email: user.email,
      },
      subject: '[GoBarber] Recuperação de senha',
      template: {
        file: forgotPasswordTemplate,
        variables: {
          name: user.name,
          link: `http://localhost:3000/reset-password?token=${token}`,
        },
      },
    });
  }
}

export default SendForgotEmailPasswordService;
