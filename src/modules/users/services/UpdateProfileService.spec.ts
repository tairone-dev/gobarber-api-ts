import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from '@modules/users/services/UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;

describe('Update Profile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfileService = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update an users profile', async () => {
    const name = 'John Doe';
    const email = 'john.doe@example.com';
    const password = '123456';

    const user = await fakeUsersRepository.create({
      name,
      email,
      password,
    });

    const newName = 'John Trê';
    const newEmail = 'john.tre@example.com';

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: newName,
      email: newEmail,
    });

    expect(updatedUser.name).toEqual(newName);
    expect(updatedUser.email).toEqual(newEmail);
  });

  it('should not be able to update unexisting user', async () => {
    const name = 'Teste';
    const email = 'teste@example.com';

    const error = new AppError('User not found.', 404);

    await expect(
      updateProfileService.execute({
        user_id: 'unexisting-user',
        name,
        email,
      }),
    ).rejects.toEqual(error);
  });

  it('should not be able to change to another users email', async () => {
    const teste = 'Teste';
    const testeEmail = 'teste@example.com';
    const testePassword = '123456';

    await fakeUsersRepository.create({
      name: teste,
      email: testeEmail,
      password: testePassword,
    });

    const johnDoe = 'John Doe';
    const johnDoeEmail = 'john.doe@example.com';
    const johnDoePassword = '123456';

    const user = await fakeUsersRepository.create({
      name: johnDoe,
      email: johnDoeEmail,
      password: johnDoePassword,
    });

    const newName = 'John Trê';
    const newEmail = testeEmail;

    const error = new AppError('Email already taken.', 422);

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: newName,
        email: newEmail,
      }),
    ).rejects.toEqual(error);
  });

  it('should be able to update an users password', async () => {
    const name = 'John Doe';
    const email = 'john.doe@example.com';
    const password = '123456';

    const user = await fakeUsersRepository.create({
      name,
      email,
      password,
    });

    const newPassword = '12345678';

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name,
      email,
      old_password: password,
      password: newPassword,
    });

    expect(updatedUser.password).toEqual(newPassword);
  });

  it('should not be able to update an users password without the old password', async () => {
    const name = 'John Doe';
    const email = 'john.doe@example.com';
    const password = '123456';

    const user = await fakeUsersRepository.create({
      name,
      email,
      password,
    });

    const newPassword = '12345678';

    const error = new AppError('Invalid old password.', 422);

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name,
        email,
        password: newPassword,
      }),
    ).rejects.toEqual(error);
  });

  it('should not be able to update an users password with wrong old password', async () => {
    const name = 'John Doe';
    const email = 'john.doe@example.com';
    const password = '123456';

    const user = await fakeUsersRepository.create({
      name,
      email,
      password,
    });

    const newPassword = '12345678';
    const wrongOldPassword = '12345';

    const error = new AppError('Invalid old password.', 422);

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name,
        email,
        old_password: wrongOldPassword,
        password: newPassword,
      }),
    ).rejects.toEqual(error);
  });
});
