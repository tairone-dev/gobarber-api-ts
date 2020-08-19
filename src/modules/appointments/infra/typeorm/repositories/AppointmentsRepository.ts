import { getRepository, Repository } from 'typeorm';

import AppointmentsRepository from '@modules/appointments/repositories/AppointmentsRepository';
import CreateAppointmentDTO from '@modules/appointments/dtos/CreateAppointmentDTO';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

class AppointmentsRepositoryImpl implements AppointmentsRepository {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  public async index(): Promise<Appointment[]> {
    const appointments = await this.ormRepository.find();

    return appointments;
  }

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const appointmentFound = await this.ormRepository.findOne({
      where: { date },
    });

    return appointmentFound;
  }

  public async create({
    provider_id,
    date,
  }: CreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({
      provider_id,
      date,
    });

    await this.ormRepository.save(appointment);

    return appointment;
  }
}

export default AppointmentsRepositoryImpl;
