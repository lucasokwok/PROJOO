import { EmailNotification } from "../notifications/EmailNotification";
import { Notification } from "../notifications/Notification";
import { PushNotification } from "../notifications/PushNotification";
import { SmsNotification } from "../notifications/SmsNotification";
import { NotificationType } from "../types/NotificationType";
import { LoggingProxy } from "../notifications/LoggingNotificationProxy";
import { ExtSmsServiceAdapter } from "../notifications/ExtSmsNotificationAdapter";
import { ExtSmsService } from "../ext/ExtSmsService";

export class NotificationFactory {
  public static create(type: NotificationType): Notification {
    switch (type) {
      case "email":
        return new LoggingProxy(new EmailNotification());
      case "sms":
        return new LoggingProxy(new SmsNotification());
      case "push":
        return new LoggingProxy(new PushNotification());
      case "ext":
        return new LoggingProxy(new ExtSmsServiceAdapter(new ExtSmsService()));
      default:
        throw new Error("Tipo de notificação inválido.");
    }
  }
}
