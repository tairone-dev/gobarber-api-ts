import { uuid } from 'uuidv4';
import { isEqual, getMonth, getYear, getDate } from 'date-fns';

import AppointmentsRepository from '@modules/appointments/repositories/AppointmentsRepository';
import CreateAppointmentDTO from '@modules/appointments/dtos/CreateAppointmentDTO';
import FindAllInMonthFromProviderDTO from '@modules/appointments/dtos/FindAllInMonthFromProviderDTO';
import FindAllInDayFromProviderDTO from '@modules/appointments/dtos/FindAllInDayromProviderDTO';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

class AppointmentsRepositoryImpl implements AppointmentsRepository {
  private appointments: Appointment[] = [];

  public async index(): Promise<Appointment[]> {
    return this.appointments;
  }

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const foundAppointment = this.appointments.find((appointment) =>
      isEqual(appointment.date, date),
    );

    return foundAppointment;
  }

  public async findAllInMonthFromProvider({
    provider_id,
    month,
    year,
  }: FindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    const appointments = this.appointments.filter((appointment) => {
      return (
        appointment.provider_id === provider_id &&
        getYear(appointment.date) === year &&
        getMonth(appointment.date) + 1 === month
      );
    });

    return appointments;
  }

  public async findAllInDayFromProvider({
    provider_id,
    year,
    month,
    day,
  }: FindAllInDayFromProviderDTO): Promise<Appointment[]> {
    const appointments = this.appointments.filter((appointment) => {
      return (
        appointment.provider_id === provider_id &&
        getYear(appointment.date) === year &&
        getMonth(appointment.date) + 1 === month &&
        getDate(appointment.date) === day
      );
    });

    return appointments;
  }

  public async create({
    provider_id,
    date,
  }: CreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();

    Object.assign(appointment, { id: uuid(), date, provider_id });

    this.appointments.push(appointment);

    return appointment;
  }
}

export default AppointmentsRepositoryImpl;
