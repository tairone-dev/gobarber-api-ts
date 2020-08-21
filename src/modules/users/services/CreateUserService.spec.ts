import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from '@modules/users/services/CreateUserService';

describe('Create User', () => {
  it('should be able to create a new user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const name = 'John Doe';
    const email = 'john.doe@example.com';
    const password = '123456';

    const user = await createUserService.execute({
      name,
      email,
      password,
    });

    expect(user).toHaveProperty('id');
    expect(user.name).toEqual(name);
    expect(user.email).toEqual(email);
    expect(user.password).toBeUndefined();
  });

  it('should not be able to create a new user with the same existing email', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const name = 'John Doe';
    const email = 'john.doe@example.com';
    const password = '123456';

    await createUserService.execute({
      name,
      email,
      password,
    });

    await createUserService
      .execute({
        name,
        email,
        password,
      })
      .catch((error) => {
        expect(error).toBeInstanceOf(AppError);
        expect(error.statusCode).toEqual(400);
      });
  });
});
