import { Mediator } from "./Mediator";
import { Usuario } from "./Usuario";

export class GrupoMediator implements Mediator {
  private users: Usuario[] = [];

  public adduser(user: Usuario): void {
    this.users.push(user);
    user.setMediator(this);

    console.log(`${user.getNome()} entrou no grupo.`);
  }

  public enviarMensagem(remetente: Usuario, mensagem: string): void {
    console.log(`${remetente.getNome()} enviou: ${mensagem}`);

    for (const user of this.users) {
      if (user !== remetente) {
        user.receberMensagem(remetente, mensagem);
      }
    }
  }
}
