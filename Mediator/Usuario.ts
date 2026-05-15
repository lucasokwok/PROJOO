import { Mediator } from "./Mediator";

export abstract class Usuario {
  private mediator!: Mediator;
  // "!" eh para o typescript nao reclamar de nao inicializar a var

  constructor(private nome: string) {}

  public setMediator(mediator: Mediator): void {
    this.mediator = mediator;
  }

  public getNome(): string {
    return this.nome;
  }

  public abstract enviarMensagem(mensagem: string): void;

  public abstract receberMensagem(remetente: Usuario, mensagem: string): void;
}
