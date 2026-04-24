import { Observer } from "./Observer";
import { PCD } from "./PCD";

export class Universidade implements Observer {
  private nome: string;

  constructor(nome: string) {
    this.nome = nome;
  }
  // callback
  // esse é o método de callback chamado pela PCD quando acontece uma atualização

  update(subject: unknown): void {
    if (subject instanceof PCD) {
      const dados = subject.getDados();

      console.log(
        `Universidade ${this.nome} recebeu dados da PCD ${subject.getIdentificador()}`,
      );
      console.log(`Localização: ${subject.getLocalizacao()}`);
      console.log(`Temperatura: ${dados.temperatura} °C`);
      console.log(`Pressão atmosférica: ${dados.pressaoAtmosferica} hPa`);
      console.log(`Umidade do ar: ${dados.umidadeAr}%`);
    }
  }
}
