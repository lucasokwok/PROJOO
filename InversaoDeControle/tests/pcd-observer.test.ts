import { describe, expect, it, vi, afterEach } from "vitest";
import { PCD } from "../src/observer/PCD";
import { Universidade } from "../src/observer/Universidade";

describe("Padrão Observer aplicado a PCDs", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("deve exibir no console os dados recebidos por uma universidade", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const pcd = new PCD("PCD-001", "São José dos Campos");
    const unifesp = new Universidade("UNIFESP");

    // aqui por exemplo a universidade é adicionada a lista de observadores
    pcd.addObserver(unifesp);

    pcd.atualizarDados({
      temperatura: 27.5,
      pressaoAtmosferica: 1012,
      umidadeAr: 68,
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      "\nPCD PCD-001 atualizou os dados.",
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      "Universidade UNIFESP recebeu dados da PCD PCD-001",
    );

    expect(consoleSpy).toHaveBeenCalledWith("Localização: São José dos Campos");

    expect(consoleSpy).toHaveBeenCalledWith("Temperatura: 27.5 °C");

    expect(consoleSpy).toHaveBeenCalledWith("Pressão atmosférica: 1012 hPa");

    expect(consoleSpy).toHaveBeenCalledWith("Umidade do ar: 68%");
  });

  it("deve exibir no console os dados para várias universidades inscritas", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const pcd = new PCD("PCD-001", "São José dos Campos");

    const unifesp = new Universidade("UNIFESP");
    const usp = new Universidade("USP");
    const unicamp = new Universidade("UNICAMP");

    pcd.addObserver(unifesp);
    pcd.addObserver(usp);
    pcd.addObserver(unicamp);

    pcd.atualizarDados({
      temperatura: 30,
      pressaoAtmosferica: 1010,
      umidadeAr: 60,
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      "Universidade UNIFESP recebeu dados da PCD PCD-001",
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      "Universidade USP recebeu dados da PCD PCD-001",
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      "Universidade UNICAMP recebeu dados da PCD PCD-001",
    );
  });

  it("não deve exibir dados para uma universidade removida da lista de observers", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const pcd = new PCD("PCD-001", "São José dos Campos");

    const unifesp = new Universidade("UNIFESP");
    const usp = new Universidade("USP");

    pcd.addObserver(unifesp);
    pcd.addObserver(usp);

    pcd.removeObserver(usp);

    pcd.atualizarDados({
      temperatura: 28,
      pressaoAtmosferica: 1009,
      umidadeAr: 70,
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      "Universidade UNIFESP recebeu dados da PCD PCD-001",
    );

    expect(consoleSpy).not.toHaveBeenCalledWith(
      "Universidade USP recebeu dados da PCD PCD-001",
    );
  });

  it("deve exibir no console dados de mais de uma PCD para a mesma universidade", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const pcdSaoJose = new PCD("PCD-001", "São José dos Campos");
    const pcdUbatuba = new PCD("PCD-002", "Ubatuba");

    const unifesp = new Universidade("UNIFESP");

    pcdSaoJose.addObserver(unifesp);
    pcdUbatuba.addObserver(unifesp);

    pcdSaoJose.atualizarDados({
      temperatura: 29,
      pressaoAtmosferica: 1011,
      umidadeAr: 64,
    });

    pcdUbatuba.atualizarDados({
      temperatura: 24,
      pressaoAtmosferica: 1007,
      umidadeAr: 85,
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      "Universidade UNIFESP recebeu dados da PCD PCD-001",
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      "Universidade UNIFESP recebeu dados da PCD PCD-002",
    );

    expect(consoleSpy).toHaveBeenCalledWith("Localização: São José dos Campos");

    expect(consoleSpy).toHaveBeenCalledWith("Localização: Ubatuba");
  });
});
