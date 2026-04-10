import { AppConfig } from "../config/AppConfig";
import { Notification } from "./Notification";

export class SmsNotification implements Notification {
  public send(destinatario: string, mensagem: string): string {
    const config = AppConfig.getInstance();

    return `SMS enviado para ${destinatario} com limite de tentativas ${config.getMaxTentativasReenvio()}: ${mensagem}`;
  }
}
