import { AppConfig } from "./config/AppConfig";
import { NotificationService } from "./services/NotificationService";

const config = AppConfig.getInstance();
config.setNomeAplicacao("Central de Alertas");
config.setServidorEnvio("mail.central.com");
config.setMaxTentativasReenvio(5);

const service = new NotificationService();

console.log(service.enviar("email", "ana@email.com", "Seu boleto venceu."));

console.log(service.enviar("sms", "11999999999", "Seu código é 1234."));

console.log(
  service.enviar("push", "usuario123", "Você recebeu uma nova mensagem."),
);
