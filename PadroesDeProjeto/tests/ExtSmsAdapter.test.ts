import { describe, expect, it, vi } from "vitest";
import { ExtSmsServiceAdapter } from "../src/notifications/ExtSmsNotificationAdapter";
import { ExtSmsService } from "../src/ext/ExtSmsService";

describe("ExtSmsServiceAdapter", () => {
  it("deve adaptar send para sendEXT com a apiKey fixa", () => {
    const extSmsMock = {
      sendEXT: vi.fn().mockReturnValue("SMS externo enviado com sucesso"),
    } as unknown as ExtSmsService;

    const adapter = new ExtSmsServiceAdapter(extSmsMock);

    const resultado = adapter.send("11999999999", "Olá!");

    expect((extSmsMock as any).sendEXT).toHaveBeenCalledWith(
      "11999999999",
      "Olá!",
      "apiKeyExemplo",
    );

    expect(resultado).toBe("SMS externo enviado com sucesso");
  });
});
