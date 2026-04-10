export class ExtSmsService {
  // send(destinatario: string, mensagem: string): string;
  public sendEXT(phone: string, text: string, apiKey: string): string {
    return `EXT_SMS enviado para ${phone} com apiKey ${apiKey}: ${text}`;
  }
}
