import { describe, expect, it } from "vitest";
import { AppConfig } from "../src/config/AppConfig";
import { NotificationService } from "../src/services/NotificationService";

describe("NotificationService", () => {
  it("deve enviar email usando a configuração global", () => {
    const config = AppConfig.getInstance();
    config.setServidorEnvio("smtp.teste.com");

    const service = new NotificationService();
    const resultado = service.enviar("email", "teste@email.com", "Olá");

    expect(resultado).toContain("EMAIL enviado para teste@email.com");
    expect(resultado).toContain("smtp.teste.com");
  });

  it("deve enviar sms usando a configuração global", () => {
    const config = AppConfig.getInstance();
    config.setMaxTentativasReenvio(7);

    const service = new NotificationService();
    const resultado = service.enviar("sms", "11999999999", "Código 123");

    expect(resultado).toContain("SMS enviado para 11999999999");
    expect(resultado).toContain("limite de tentativas 7");
  });

  it("deve enviar push usando a configuração global", () => {
    const config = AppConfig.getInstance();
    config.setNomeAplicacao("Meu App");

    const service = new NotificationService();
    const resultado = service.enviar("push", "usuario01", "Nova mensagem");

    expect(resultado).toContain("PUSH enviado para usuario01");
    expect(resultado).toContain("Meu App");
  });
});
