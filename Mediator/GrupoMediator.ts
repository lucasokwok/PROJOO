import { Mediator } from "./Mediator";
import { Usuario } from "./Usuario";

export class GrupoMediator implements Mediator {
  private usuarios: Usuario[] = [];

  public addUsuario(user: Usuario): void {
    this.usuarios.push(user);
    user.setMediator(this);

    console.log(`${user.getNome()} entrou no grupo.`);
  }

  public enviarMensagem(user: Usuario, msg: string): void {
    console.log(`${user.getNome()} enviou: ${msg}`);

    for (const usuario of this.usuarios) {
      if (usuario !== user) {
        usuario.receberMensagem(user, msg);
      }
    }
  }
}
