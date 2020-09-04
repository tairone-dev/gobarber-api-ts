import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import SendForgotPasswordEmailService from '@modules/users/services/SendForgotPasswordEmailService';

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendForgotPasswordEmailService: SendForgotPasswordEmailService;

describe('Send Forgot Password Email', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    sendForgotPasswordEmailService = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeMailProvider,
    );
  });

  it('should be able to recover the password using the email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    const name = 'John Doe';
    const email = 'john.doe@example.com';
    const password = '123456';

    await fakeUsersRepository.create({
      name,
      email,
      password,
    });

    await sendForgotPasswordEmailService.execute({
      email,
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to recover the password using a non-existing user email', async () => {
    const email = 'john.doe@example.com';

    const error = new AppError('User does not exists.', 400);

    await expect(
      sendForgotPasswordEmailService.execute({
        email,
      }),
    ).rejects.toEqual(error);
  });

  it('should generate a forgot password token', async () => {
    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

    const name = 'John Doe';
    const email = 'john.doe@example.com';
    const password = '123456';

    const user = await fakeUsersRepository.create({
      name,
      email,
      password,
    });

    await sendForgotPasswordEmailService.execute({
      email,
    });

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
