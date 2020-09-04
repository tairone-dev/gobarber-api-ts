import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

describe('Update User Avatar', () => {
  it('should be able to update an users avatar', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();
    const updateUserAvatarService = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const name = 'John Doe';
    const email = 'john.doe@example.com';
    const password = '123456';
    const avatarFilename = 'avatar.jpg';

    const user = await fakeUsersRepository.create({
      name,
      email,
      password,
    });

    const userWithAvatar = await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFilename,
    });

    expect(userWithAvatar.avatar).toEqual(avatarFilename);
  });

  it('should not be able to update an unexisting users avatar', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();
    const updateUserAvatarService = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const nonExistingUser = 'non-existing-user';
    const avatarFilename = 'avatar.jpg';

    const error = new AppError(
      'Only authenticated users can change avatar.',
      401,
    );

    await expect(
      updateUserAvatarService.execute({
        user_id: nonExistingUser,
        avatarFilename,
      }),
    ).rejects.toEqual(error);
  });

  it('should delete old avatar when recieving a new one', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();
    const updateUserAvatarService = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const name = 'John Doe';
    const email = 'john.doe@example.com';
    const password = '123456';
    const oldAvatarFilename = 'avatar.jpg';
    const newAvatarFilename = 'avatar2.jpg';

    const user = await fakeUsersRepository.create({
      name,
      email,
      password,
    });

    await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFilename: oldAvatarFilename,
    });

    const userWithAvatar = await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFilename: newAvatarFilename,
    });

    expect(deleteFile).toHaveBeenCalledWith(oldAvatarFilename);
    expect(userWithAvatar.avatar).toEqual(newAvatarFilename);
  });
});
