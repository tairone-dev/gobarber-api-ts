import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import CreateAppointmentDTO from '@modules/appointments/dtos/CreateAppointmentDTO';

export default interface AppointmentsRepository {
  index(): Promise<Appointment[]>;
  create(data: CreateAppointmentDTO): Promise<Appointment>;
  findByDate(date: Date): Promise<Appointment | undefined>;
}
