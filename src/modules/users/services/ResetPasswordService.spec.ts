import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import ResetPasswordService from '@modules/users/services/ResetPasswordService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider;
let resetPasswordService: ResetPasswordService;

describe('Reset Password', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();

    resetPasswordService = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider,
    );
  });

  it('should be able to reset the users password', async () => {
    const name = 'John Doe';
    const email = 'john.doe@example.com';
    const password = '123456';
    const newPassword = '123123';

    const user = await fakeUsersRepository.create({
      name,
      email,
      password,
    });

    const token = await fakeUserTokensRepository.generate(user.id);

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    await resetPasswordService.execute({
      token: token.token,
      password: newPassword,
    });

    const updatedUser = await fakeUsersRepository.findById(user.id);

    expect(generateHash).toHaveBeenCalledWith(newPassword);
    expect(updatedUser?.password).toEqual(newPassword);
  });

  it('should not be able to reset password of a non-existing token', async () => {
    const error = new AppError('User token does not exists.', 400);

    const token = 'non-existing token';
    const password = '123456';

    await expect(
      resetPasswordService.execute({
        token,
        password,
      }),
    ).rejects.toEqual(error);
  });

  it('should not be able to reset password of a non-existing user', async () => {
    const error = new AppError('User does not exists.', 400);

    const password = '123456';
    const user_id = 'non-existing user';

    const { token } = await fakeUserTokensRepository.generate(user_id);

    await expect(
      resetPasswordService.execute({
        token,
        password,
      }),
    ).rejects.toEqual(error);
  });

  it('should not be able to reset password if token has expired', async () => {
    const name = 'John Doe';
    const email = 'john.doe@example.com';
    const password = '123456';
    const newPassword = '123123';

    const user = await fakeUsersRepository.create({
      name,
      email,
      password,
    });

    const token = await fakeUserTokensRepository.generate(user.id);

    const error = new AppError('Token expired.', 422);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(
      resetPasswordService.execute({
        token: token.token,
        password: newPassword,
      }),
    ).rejects.toEqual(error);
  });
});
