import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import CreateUserService from '@modules/users/services/CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;
let createUserService: CreateUserService;

describe('Create User', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();
    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );
  });

  it('should be able to create a new user', async () => {
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
    const name = 'John Doe';
    const email = 'john.doe@example.com';
    const password = '123456';

    await createUserService.execute({
      name,
      email,
      password,
    });

    const error = new AppError('Email address already used.', 400);

    await expect(
      createUserService.execute({
        name,
        email,
        password,
      }),
    ).rejects.toEqual(error);
  });
});
