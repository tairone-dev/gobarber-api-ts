import { injectable, inject } from 'tsyringe';

// import User from '@modules/users/infra/typeorm/entities/User';
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

    await this.userTokensRepository.generate(user.id);

    this.mailProvider.sendMail(
      email,
      'Pedido de recuperação de senha recebido.',
    );
  }
}

export default SendForgotEmailPasswordService;
