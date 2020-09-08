import { container } from 'tsyringe';

import '@modules/users/providers';

import '@shared/container/providers';

import AppointmentsRepository from '@modules/appointments/repositories/AppointmentsRepository';
import AppointmentsRepositoryImpl from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';

import UsersRepository from '@modules/users/repositories/UsersRepository';
import UsersRepositoryImpl from '@modules/users/infra/typeorm/repositories/UsersRepository';

import UserTokensRepository from '@modules/users/repositories/UserTokensRepository';
import UserTokensRepositoryImpl from '@modules/users/infra/typeorm/repositories/UserTokensRepository';

import NotificationsRepository from '@modules/notifications/repositories/NotificationsRepository';
import NotificationsRepositoryImpl from '@modules/notifications/infra/typeorm/repositories/NotificationsRepository';

container.registerSingleton<AppointmentsRepository>(
  'AppointmentsRepository',
  AppointmentsRepositoryImpl,
);

container.registerSingleton<UsersRepository>(
  'UsersRepository',
  UsersRepositoryImpl,
);

container.registerSingleton<UserTokensRepository>(
  'UserTokensRepository',
  UserTokensRepositoryImpl,
);

container.registerSingleton<NotificationsRepository>(
  'NotificationsRepository',
  NotificationsRepositoryImpl,
);
