import { startOfHour, isBefore, getHours, format } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import AppointmentsRepository from '@modules/appointments/repositories/AppointmentsRepository';
import NotificationsRepository from '@modules/notifications/repositories/NotificationsRepository';
import AppError from '@shared/errors/AppError';
import CacheProvider from '@shared/container/providers/CacheProvider/models/CacheProvider';

interface Request {
  provider_id: string;
  user_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: AppointmentsRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: NotificationsRepository,

    @inject('CacheProvider')
    private cacheProvider: CacheProvider,
  ) {}

  public async execute({
    provider_id,
    user_id,
    date,
  }: Request): Promise<Appointment> {
    if (user_id === provider_id) {
      throw new AppError('This user is the provider of the appointment.', 422);
    }

    const appointmentDate = startOfHour(date);

    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError('Appointment on a past date.', 422);
    }

    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError(
        'You can only book an appointment between 8am and 5pm.',
        422,
      );
    }

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked.', 400);
    }

    const appointment = this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appointmentDate,
    });

    const formattedDate = format(appointmentDate, "dd/MM/yyyy 'às' HH:mm'h'");

    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento para ${formattedDate}`,
    });

    await this.cacheProvider.invalidatePrefix(
      `provider-appointments:${provider_id}:${format(
        appointmentDate,
        'yyyy-M-d',
      )}`,
    );

    return appointment;
  }
}

export default CreateAppointmentService;
