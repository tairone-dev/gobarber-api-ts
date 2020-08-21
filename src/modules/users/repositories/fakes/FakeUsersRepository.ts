import { uuid } from 'uuidv4';

import UsersRepository from '@modules/users/repositories/UsersRepository';
import CreateUserDTO from '@modules/users/dtos/CreateUserDTO';

import User from '@modules/users/infra/typeorm/entities/User';

class FakeUsersRepository implements UsersRepository {
  private users: User[] = [];

  public async findById(id: string): Promise<User | undefined> {
    const userFound = this.users.find((user) => user.id === id);

    return userFound;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const userFound = this.users.find((user) => user.email === email);

    return userFound;
  }

  public async create({ email, name, password }: CreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, {
      id: uuid(),
      email,
      name,
      password,
    });

    this.users.push({ ...user });

    return user;
  }

  public async save(user: User): Promise<User> {
    const foundIndex = this.users.findIndex(
      (needleUser) => needleUser.id === user.id,
    );

    this.users[foundIndex] = user;

    return user;
  }
}

export default FakeUsersRepository;
