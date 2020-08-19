import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

describe('Create Appointment', () => {
  it('should be able to create a new appointment', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );

    const date = new Date('2020-08-19T19:00:00.000Z');
    const provider_id = '123';

    const appointment = await createAppointmentService.execute({
      date,
      provider_id,
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.date).toEqual(date);
    expect(appointment.provider_id).toEqual(provider_id);
  });

  it('should not be able to create a new appointment with the same schedule date', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );

    const date = new Date('2020-08-19T19:00:00.000Z');
    const provider_id = '123';

    await createAppointmentService.execute({
      date,
      provider_id,
    });

    expect(
      createAppointmentService.execute({
        date,
        provider_id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
