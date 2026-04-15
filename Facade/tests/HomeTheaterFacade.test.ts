import { describe, it, expect } from "vitest";
import { HomeTheaterFacade } from "../src/HomeTheaterFacade";
import { TV } from "../src/TV";
import { Projetor } from "../src/Projetor";
import { Receiver } from "../src/Receiver";
import { PlayerMidia } from "../src/PlayerMidia";
import { SistemaSom } from "../src/SistemaSom";
import { LuzAmbiente } from "../src/LuzAmbiente";

describe("HomeTheaterFacade", () => {
  it("deve executar a sequência correta ao assistir filme", () => {
    const tv = new TV();
    const projetor = new Projetor();
    const receiver = new Receiver();
    const playerMidia = new PlayerMidia();
    const sistemaSom = new SistemaSom();
    const luzAmbiente = new LuzAmbiente();

    const facade = new HomeTheaterFacade(
      tv,
      projetor,
      receiver,
      playerMidia,
      sistemaSom,
      luzAmbiente,
    );

    const resultado = facade.assistirFilme();

    expect(resultado).toEqual([
      "TV - LIGADO",
      "TV - BRILHO MAXIMO",
      "Projetor - LIGADO",
      "Receiver - LIGADO",
      "Player de Midia - FILME CARREGADO",
      "Sistema de Som - LIGADO",
      "LuzAmbiente - LIGADO",
      "LuzAmbiente - DIMINUI INTENSIDADE",
    ]);
  });

  it("deve executar a sequência correta ao ouvir música", () => {
    const tv = new TV();
    const projetor = new Projetor();
    const receiver = new Receiver();
    const playerMidia = new PlayerMidia();
    const sistemaSom = new SistemaSom();
    const luzAmbiente = new LuzAmbiente();

    const facade = new HomeTheaterFacade(
      tv,
      projetor,
      receiver,
      playerMidia,
      sistemaSom,
      luzAmbiente,
    );

    const resultado = facade.ouvirMusica();

    expect(resultado).toEqual([
      "Sistema de Som - LIGADO",
      "Sistema de Som - VOL. MAXIMO",
    ]);
  });
});
