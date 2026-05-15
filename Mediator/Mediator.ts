import { Usuario } from "./Usuario";

export interface Mediator {
  enviarMensagem(user: Usuario, msg: string): void;
  addUsuario(user: Usuario): void;
}
