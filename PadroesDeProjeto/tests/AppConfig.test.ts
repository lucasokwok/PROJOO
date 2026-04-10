import { describe, expect, it } from "vitest";
import { AppConfig } from "../src/config/AppConfig";

describe("AppConfig", () => {
  it("deve retornar sempre a mesma instância", () => {
    const c1 = AppConfig.getInstance();
    const c2 = AppConfig.getInstance();

    expect(c1).toBe(c2);
  });

  it("deve compartilhar alterações entre referências", () => {
    const c1 = AppConfig.getInstance();
    const c2 = AppConfig.getInstance();

    c1.setNomeAplicacao("Novo Nome");

    expect(c2.getNomeAplicacao()).toBe("Novo Nome");
  });
});
