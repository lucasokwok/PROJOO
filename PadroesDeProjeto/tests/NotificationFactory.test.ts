import { describe, expect, it, vi } from "vitest";
import { NotificationFactory } from "../src/factory/NotificationFactory";
import { LoggingProxy } from "../src/notifications/LoggingNotificationProxy";

describe("NotificationFactory", () => {
  it("deve criar uma notificacao de email passando pelo proxy", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const notification = NotificationFactory.create("email");

    expect(notification).toBeInstanceOf(LoggingProxy);

    const resultado = notification.send("teste@email.com", "Olá");

    expect(consoleSpy).toHaveBeenCalledWith(
      "Entrando no proxy - destinatario: teste@email.com; msg: Olá",
    );
    expect(resultado).toContain("EMAIL enviado para teste@email.com");

    consoleSpy.mockRestore();
  });

  it("deve criar uma notificacao de sms passando pelo proxy", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const notification = NotificationFactory.create("sms");

    expect(notification).toBeInstanceOf(LoggingProxy);

    const resultado = notification.send("11999999999", "Código 123");

    expect(consoleSpy).toHaveBeenCalledWith(
      "Entrando no proxy - destinatario: 11999999999; msg: Código 123",
    );
    expect(resultado).toContain("SMS enviado para 11999999999");

    consoleSpy.mockRestore();
  });

  it("deve criar uma notificacao de push passando pelo proxy", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const notification = NotificationFactory.create("push");

    expect(notification).toBeInstanceOf(LoggingProxy);

    const resultado = notification.send("usuario01", "Nova mensagem");

    expect(consoleSpy).toHaveBeenCalledWith(
      "Entrando no proxy - destinatario: usuario01; msg: Nova mensagem",
    );
    expect(resultado).toContain("PUSH enviado para usuario01");

    consoleSpy.mockRestore();
  });

  it("deve lançar erro para tipo invalido", () => {
    expect(() => NotificationFactory.create("invalido" as any)).toThrow(
      "Tipo de notificação inválido.",
    );
  });
});
