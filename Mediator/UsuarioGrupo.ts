import { Usuario } from "./Usuario";

export class UsuarioGrupo extends Usuario {
  public enviarMensagem(mensagem: string): void {
    this.mediator.enviarMensagem(this, mensagem);
  }

  public receberMensagem(remetente: Usuario, mensagem: string): void {
    console.log(
      `${this.getNome()} recebeu de ${remetente.getNome()}: ${mensagem}`,
    );
  }
}
