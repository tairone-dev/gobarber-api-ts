import CreateNotificationDTO from '@modules/notifications/dtos/CreateNotificationDTO';
import Notification from '@modules/notifications/infra/typeorm/schemas/Notification';

export default interface NotificationsRepository {
  create(data: CreateNotificationDTO): Promise<Notification>;
}
