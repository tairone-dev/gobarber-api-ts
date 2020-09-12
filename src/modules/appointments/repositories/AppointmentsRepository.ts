import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import CreateAppointmentDTO from '@modules/appointments/dtos/CreateAppointmentDTO';
import FindAllInMonthFromProviderDTO from '@modules/appointments/dtos/FindAllInMonthFromProviderDTO';
import FindAllInDayFromProviderDTO from '@modules/appointments/dtos/FindAllInDayromProviderDTO';

export default interface AppointmentsRepository {
  index(): Promise<Appointment[]>;
  create(data: CreateAppointmentDTO): Promise<Appointment>;
  findByDate(date: Date, provider_id: string): Promise<Appointment | undefined>;
  findAllInMonthFromProvider(
    data: FindAllInMonthFromProviderDTO,
  ): Promise<Appointment[]>;
  findAllInDayFromProvider(
    data: FindAllInDayFromProviderDTO,
  ): Promise<Appointment[]>;
}
