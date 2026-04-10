export interface Notification {
  send(destinatario: string, mensagem: string): string;
}
