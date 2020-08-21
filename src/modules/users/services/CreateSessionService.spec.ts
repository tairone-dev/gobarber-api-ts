import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from '@modules/users/services/CreateUserService';
import CreateSessionService from '@modules/users/services/CreateSessionService';

describe('Create Session', () => {
  it('should be able to create a new session', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
    const createSessionService = new CreateSessionService(
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

    const response = await createSessionService.execute({
      email,
      password,
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to create a new session with a non existing user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createSessionService = new CreateSessionService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const email = 'john.doe@example.com';
    const password = '123456';

    await createSessionService
      .execute({
        email,
        password,
      })
      .catch((error) => {
        expect(error).toBeInstanceOf(AppError);
        expect(error.statusCode).toEqual(401);
      });
  });

  it('should not be able to create a new session with a wrong password', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
    const createSessionService = new CreateSessionService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const name = 'John Doe';
    const email = 'john.doe@example.com';
    const password = '123456';
    const wrongPassword = '1234567';

    await createUserService.execute({
      name,
      email,
      password,
    });

    await createSessionService
      .execute({
        email,
        password: wrongPassword,
      })
      .catch((error) => {
        expect(error).toBeInstanceOf(AppError);
        expect(error.statusCode).toEqual(401);
      });
  });
});
