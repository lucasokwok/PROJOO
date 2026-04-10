import { EmailNotification } from "../notifications/EmailNotification";
import { Notification } from "../notifications/Notification";
import { PushNotification } from "../notifications/PushNotification";
import { SmsNotification } from "../notifications/SmsNotification";
import { NotificationType } from "../types/NotificationType";

export class NotificationFactory {
  public static create(type: NotificationType): Notification {
    switch (type) {
      case "email":
        return new EmailNotification();
      case "sms":
        return new SmsNotification();
      case "push":
        return new PushNotification();
      default:
        throw new Error("Tipo de notificação inválido.");
    }
  }
}
