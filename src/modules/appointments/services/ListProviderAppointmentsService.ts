import { injectable, inject } from 'tsyringe';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import AppointmentsRepository from '@modules/appointments/repositories/AppointmentsRepository';

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
  ) {}

  public async execute({
    provider_id,
    year,
    month,
    day,
  }: Request): Promise<Appointment[]> {
    const appointments = await this.appointmentsRepository.findAllInDayFromProvider(
      {
        provider_id,
        year,
        month,
        day,
      },
    );

    return appointments;
  }
}

export default ListProviderAppointmentsService;
