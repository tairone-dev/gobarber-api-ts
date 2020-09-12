import { injectable, inject } from 'tsyringe';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import AppointmentsRepository from '@modules/appointments/repositories/AppointmentsRepository';
import CacheProvider from '@shared/container/providers/CacheProvider/models/CacheProvider';
import { classToClass } from 'class-transformer';

interface Request {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

@injectable()
class ListProviderAppointmentsService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: AppointmentsRepository,

    @inject('CacheProvider')
    private cacheProvider: CacheProvider,
  ) {}

  public async execute({
    provider_id,
    year,
    month,
    day,
  }: Request): Promise<Appointment[]> {
    const listAppointmentsCacheKey = `provider-appointments:${provider_id}:${year}-${month}-${day}`;

    let appointments = await this.cacheProvider.recover<Appointment[]>(
      listAppointmentsCacheKey,
    );

    if (!appointments) {
      appointments = await this.appointmentsRepository.findAllInDayFromProvider(
        {
          provider_id,
          year,
          month,
          day,
        },
      );

      await this.cacheProvider.save(
        listAppointmentsCacheKey,
        classToClass(appointments),
      );
    }

    return appointments;
  }
}

export default ListProviderAppointmentsService;
