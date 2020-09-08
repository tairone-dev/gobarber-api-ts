import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProviderService from '@modules/appointments/services/ListProviderService';

let fakeUsersRepository: FakeUsersRepository;
let listProviderService: ListProviderService;

describe('List Providers', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    listProviderService = new ListProviderService(fakeUsersRepository);
  });

  it('should be able to list the providers', async () => {
    const johnDoe = 'John Doe';
    const johnDoeEmail = 'john.doe@example.com';
    const johnDoePassword = '123456';

    const user1 = await fakeUsersRepository.create({
      name: johnDoe,
      email: johnDoeEmail,
      password: johnDoePassword,
    });

    const johnTre = 'John Trê';
    const johnTreEmail = 'john.tre@example.com';
    const johnTrePassword = '123456';

    const user2 = await fakeUsersRepository.create({
      name: johnTre,
      email: johnTreEmail,
      password: johnTrePassword,
    });

    const johnQua = 'John Qua';
    const johnQuaEmail = 'john.qua@example.com';
    const johnQuaPassword = '123456';

    const authenticatedUser = await fakeUsersRepository.create({
      name: johnQua,
      email: johnQuaEmail,
      password: johnQuaPassword,
    });

    const foundUsers = await listProviderService.execute({
      user_id: authenticatedUser.id,
    });

    expect(foundUsers).toEqual([user1, user2]);
  });
});
