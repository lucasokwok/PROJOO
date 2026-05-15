import { Mediator } from "./Mediator";

export abstract class Usuario {
  protected mediator!: Mediator;
  // "!" eh para o TypeScript nao reclamar de nao inicializar a var

  constructor(protected nome: string) {}

  public setMediator(mediator: Mediator): void {
    this.mediator = mediator;
  }

  public getNome(): string {
    return this.nome;
  }

  public abstract enviarMensagem(mensagem: string): void;

  public abstract receberMensagem(remetente: Usuario, mensagem: string): void;
}
