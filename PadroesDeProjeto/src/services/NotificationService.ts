import { NotificationFactory } from "../factory/NotificationFactory";
import { NotificationType } from "../types/NotificationType";

export class NotificationService {
  public enviar(
    type: NotificationType,
    destinatario: string,
    mensagem: string,
  ): string {
    const notification = NotificationFactory.create(type);
    return notification.send(destinatario, mensagem);
  }
}
