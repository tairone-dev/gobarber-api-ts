import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ShowProfileService from '@modules/users/services/ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfileService: ShowProfileService;

describe('Update Profile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showProfileService = new ShowProfileService(fakeUsersRepository);
  });

  it('should be able to show an users profile', async () => {
    const name = 'John Doe';
    const email = 'john.doe@example.com';
    const password = '123456';

    const user = await fakeUsersRepository.create({
      name,
      email,
      password,
    });

    const foundUser = await showProfileService.execute({
      user_id: user.id,
    });

    expect(user).toEqual(foundUser);
  });

  it('should not be able to show non-existing users profile', async () => {
    const error = new AppError('User not found.', 404);

    await expect(
      showProfileService.execute({
        user_id: 'non-existing',
      }),
    ).rejects.toEqual(error);
  });
});
