import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { GrupoMediator } from "../GrupoMediator";
import { UsuarioGrupo } from "../UsuarioGrupo";

describe("GrupoMediator", () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it("deve adicionar usuarios ao grupo", () => {
    const grupo = new GrupoMediator();

    const ana = new UsuarioGrupo("Ana");
    const bruno = new UsuarioGrupo("Bruno");
    const carla = new UsuarioGrupo("Carla");

    grupo.addUsuario(ana);
    grupo.addUsuario(bruno);
    grupo.addUsuario(carla);

    expect(consoleSpy).toHaveBeenCalledWith("Ana entrou no grupo.");
    expect(consoleSpy).toHaveBeenCalledWith("Bruno entrou no grupo.");
    expect(consoleSpy).toHaveBeenCalledWith("Carla entrou no grupo.");
  });

  it("deve enviar a mensagem de um usuario para os outros usuarios do grupo", () => {
    const grupo = new GrupoMediator();

    const ana = new UsuarioGrupo("Ana");
    const bruno = new UsuarioGrupo("Bruno");
    const carla = new UsuarioGrupo("Carla");

    grupo.addUsuario(ana);
    grupo.addUsuario(bruno);
    grupo.addUsuario(carla);

    consoleSpy.mockClear();

    ana.enviarMensagem("Bom dia, pessoal!");

    expect(consoleSpy).toHaveBeenCalledWith("Ana enviou: Bom dia, pessoal!");
    expect(consoleSpy).toHaveBeenCalledWith(
      "Bruno recebeu de Ana: Bom dia, pessoal!",
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      "Carla recebeu de Ana: Bom dia, pessoal!",
    );
  });

  it("nao deve enviar a mensagem para o proprio remetente", () => {
    const grupo = new GrupoMediator();

    const ana = new UsuarioGrupo("Ana");
    const bruno = new UsuarioGrupo("Bruno");
    const carla = new UsuarioGrupo("Carla");

    grupo.addUsuario(ana);
    grupo.addUsuario(bruno);
    grupo.addUsuario(carla);

    consoleSpy.mockClear();

    ana.enviarMensagem("Teste");

    expect(consoleSpy).not.toHaveBeenCalledWith("Ana recebeu de Ana: Teste");
  });

  it("com 3 usuarios, deve entregar a mensagem exatamente para 2 usuarios", () => {
    const grupo = new GrupoMediator();

    const ana = new UsuarioGrupo("Ana");
    const bruno = new UsuarioGrupo("Bruno");
    const carla = new UsuarioGrupo("Carla");

    grupo.addUsuario(ana);
    grupo.addUsuario(bruno);
    grupo.addUsuario(carla);

    consoleSpy.mockClear();

    ana.enviarMensagem("Mensagem de teste");

    const chamadas: unknown[] = consoleSpy.mock.calls.map(
      (call: unknown[]) => call[0],
    );

    const mensagensRecebidas: string[] = chamadas
      .map((msg: unknown) => String(msg))
      .filter((msg: string) => msg.includes("recebeu de Ana"));

    expect(mensagensRecebidas).toHaveLength(2);
    expect(mensagensRecebidas).toContain(
      "Bruno recebeu de Ana: Mensagem de teste",
    );
    expect(mensagensRecebidas).toContain(
      "Carla recebeu de Ana: Mensagem de teste",
    );
  });

  it("deve permitir que outro usuario tambem envie mensagem ao grupo", () => {
    const grupo = new GrupoMediator();

    const ana = new UsuarioGrupo("Ana");
    const bruno = new UsuarioGrupo("Bruno");
    const carla = new UsuarioGrupo("Carla");

    grupo.addUsuario(ana);
    grupo.addUsuario(bruno);
    grupo.addUsuario(carla);

    consoleSpy.mockClear();

    bruno.enviarMensagem("Oi, Ana!");

    expect(consoleSpy).toHaveBeenCalledWith("Bruno enviou: Oi, Ana!");
    expect(consoleSpy).toHaveBeenCalledWith("Ana recebeu de Bruno: Oi, Ana!");
    expect(consoleSpy).toHaveBeenCalledWith("Carla recebeu de Bruno: Oi, Ana!");

    expect(consoleSpy).not.toHaveBeenCalledWith(
      "Bruno recebeu de Bruno: Oi, Ana!",
    );
  });
});
