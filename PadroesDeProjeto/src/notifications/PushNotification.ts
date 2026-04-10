import { AppConfig } from "../config/AppConfig";
import { Notification } from "./Notification";

export class PushNotification implements Notification {
  public send(destinatario: string, mensagem: string): string {
    const config = AppConfig.getInstance();

    return `PUSH enviado para ${destinatario} pelo app ${config.getNomeAplicacao()}: ${mensagem}`;
  }
}
