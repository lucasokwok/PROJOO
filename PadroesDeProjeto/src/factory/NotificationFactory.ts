import { EmailNotification } from "../notifications/EmailNotification";
import { Notification } from "../notifications/Notification";
import { PushNotification } from "../notifications/PushNotification";
import { SmsNotification } from "../notifications/SmsNotification";
import { NotificationType } from "../types/NotificationType";
import { LoggingProxy } from "../notifications/LoggingNotificationProxy";

export class NotificationFactory {
  public static create(type: NotificationType): Notification {
    switch (type) {
      case "email":
        return new LoggingProxy(new EmailNotification());
      case "sms":
        return new LoggingProxy(new SmsNotification());
      case "push":
        return new LoggingProxy(new PushNotification());
      default:
        throw new Error("Tipo de notificação inválido.");
    }
  }
}
