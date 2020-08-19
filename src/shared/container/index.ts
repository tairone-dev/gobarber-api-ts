import { container } from 'tsyringe';

import AppointmentsRepository from '@modules/appointments/repositories/AppointmentsRepository';
import AppointmentsRepositoryImpl from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';

import UsersRepository from '@modules/users/repositories/UsersRepository';
import UsersRepositoryImpl from '@modules/users/infra/typeorm/repositories/UsersRepository';

container.registerSingleton<AppointmentsRepository>(
  'AppointmentsRepository',
  AppointmentsRepositoryImpl,
);

container.registerSingleton<UsersRepository>(
  'UsersRepository',
  UsersRepositoryImpl,
);
