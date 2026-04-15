import { TV } from "./TV";
import { Projetor } from "./Projetor";
import { Receiver } from "./Receiver";
import { PlayerMidia } from "./PlayerMidia";
import { SistemaSom } from "./SistemaSom";
import { LuzAmbiente } from "./LuzAmbiente";

export class HomeTheaterFacade {
  constructor(
    private tv: TV,
    private projetor: Projetor,
    private receiver: Receiver,
    private playerMidia: PlayerMidia,
    private sistemaSom: SistemaSom,
    private luzAmbiente: LuzAmbiente,
  ) {}

  public assistirFilme(): string[] {
    const retornos: string[] = [];

    retornos.push(this.tv.ligar());
    retornos.push(this.tv.aumentaBrilho());

    retornos.push(this.projetor.ligar());

    retornos.push(this.receiver.ligar());

    retornos.push(this.playerMidia.carregaFilme());

    retornos.push(this.sistemaSom.ligar());

    retornos.push(this.luzAmbiente.ligar());
    retornos.push(this.luzAmbiente.diminuiIntensidade());

    return retornos;
  }

  public ouvirMusica(): string[] {
    const retornos: string[] = [];

    retornos.push(this.sistemaSom.ligar());
    retornos.push(this.sistemaSom.volumeMaximo());

    return retornos;
  }
}
