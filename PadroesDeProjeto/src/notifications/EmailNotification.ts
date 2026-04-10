import { AppConfig } from "../config/AppConfig";
import { Notification } from "./Notification";

export class EmailNotification implements Notification {
  public send(destinatario: string, mensagem: string): string {
    const config = AppConfig.getInstance();

    return `EMAIL enviado para ${destinatario} via servidor ${config.getServidorEnvio()}: ${mensagem}`;
  }
}
