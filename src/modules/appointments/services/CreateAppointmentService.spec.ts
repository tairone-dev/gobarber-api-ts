import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let createAppointmentService: CreateAppointmentService;

describe('Create Appointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
    );
  });

  it('should be able to create a new appointment', async () => {
    const date = new Date(2020, 4, 10, 13);
    const provider_id = 'provider-id';
    const user_id = 'user-id';

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const appointment = await createAppointmentService.execute({
      date,
      provider_id,
      user_id,
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.date).toEqual(date);
    expect(appointment.provider_id).toEqual(provider_id);
  });

  it('should not be able to create a new appointment with the same schedule date', async () => {
    const date = new Date(2020, 4, 10, 13);
    const provider_id = 'provider-id';
    const user_id = 'user-id';

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await createAppointmentService.execute({
      date,
      provider_id,
      user_id,
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const error = new AppError('This appointment is already booked.', 400);

    await expect(
      createAppointmentService.execute({
        date,
        provider_id,
        user_id,
      }),
    ).rejects.toEqual(error);
  });

  it('should not be able to create an appointment on a past date', async () => {
    const date = new Date(2020, 4, 10, 11);
    const provider_id = 'provider-id';
    const user_id = 'user-id';

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const error = new AppError('Appointment on a past date.', 422);

    await expect(
      createAppointmentService.execute({
        date,
        provider_id,
        user_id,
      }),
    ).rejects.toEqual(error);
  });

  it('should not be able to create an appointment with same user as provider', async () => {
    const date = new Date(2020, 4, 10, 11);
    const provider_id = 'provider-id';

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const error = new AppError(
      'This user is the provider of the appointment.',
      422,
    );

    await expect(
      createAppointmentService.execute({
        date,
        provider_id,
        user_id: provider_id,
      }),
    ).rejects.toEqual(error);
  });

  it('should not be able to create an appointment before 8am', async () => {
    const date = new Date(2020, 4, 11, 7);
    const provider_id = 'provider-id';
    const user_id = 'user-id';

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const error = new AppError(
      'You can only book an appointment between 8am and 5pm.',
      422,
    );

    await expect(
      createAppointmentService.execute({
        date,
        provider_id,
        user_id,
      }),
    ).rejects.toEqual(error);
  });

  it('should not be able to create an appointment after 5pm', async () => {
    const date = new Date(2020, 4, 11, 18);
    const provider_id = 'provider-id';
    const user_id = 'user-id';

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const error = new AppError(
      'You can only book an appointment between 8am and 5pm.',
      422,
    );

    await expect(
      createAppointmentService.execute({
        date,
        provider_id,
        user_id,
      }),
    ).rejects.toEqual(error);
  });
});
