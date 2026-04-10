import { Notification } from "./Notification";
import { ExtSmsService } from "../ext/ExtSmsService";

export class ExtSmsServiceAdapter implements Notification {
  constructor(private extSms: ExtSmsService) {}

  public send(destinatario: string, mensagem: string): string {
    const apiKey = "apiKeyExemplo";

    return this.extSms.sendEXT(destinatario, mensagem, apiKey);
  }
}
