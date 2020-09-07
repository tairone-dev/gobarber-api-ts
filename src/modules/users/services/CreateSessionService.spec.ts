import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from '@modules/users/services/CreateUserService';
import CreateSessionService from '@modules/users/services/CreateSessionService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUserService: CreateUserService;
let createSessionService: CreateSessionService;

describe('Create Session', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
    createSessionService = new CreateSessionService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to create a new session', async () => {
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
    const email = 'john.doe@example.com';
    const password = '123456';

    const error = new AppError('Incorrect email/password combination.', 401);

    await expect(
      createSessionService.execute({
        email,
        password,
      }),
    ).rejects.toEqual(error);
  });

  it('should not be able to create a new session with a wrong password', async () => {
    const name = 'John Doe';
    const email = 'john.doe@example.com';
    const password = '123456';
    const wrongPassword = '1234567';

    await createUserService.execute({
      name,
      email,
      password,
    });

    const error = new AppError('Incorrect email/password combination.', 401);

    await expect(
      createSessionService.execute({
        email,
        password: wrongPassword,
      }),
    ).rejects.toEqual(error);
  });
});
