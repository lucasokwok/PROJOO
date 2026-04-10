import { describe, expect, it, vi } from "vitest";
import { LoggingProxy } from "../src/notifications/LoggingNotificationProxy";
import { Notification } from "../src/notifications/Notification";

describe("LoggingProxy", () => {
  it("deve logar e delegar o envio para a notificacao real", () => {
    const notificationMock: Notification = {
      send: vi.fn().mockReturnValue("Notificacao enviada com sucesso"),
    };

    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const proxy = new LoggingProxy(notificationMock);
    const resultado = proxy.send("11999999999", "Ola!");

    expect(consoleSpy).toHaveBeenCalledWith(
      "Entrando no proxy - destinatario: 11999999999; msg: Ola!",
    );

    expect(notificationMock.send).toHaveBeenCalledWith("11999999999", "Ola!");

    expect(resultado).toBe("Notificacao enviada com sucesso");

    consoleSpy.mockRestore();
  });
});
