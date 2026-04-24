import { Subject } from "./Subject";
import { DadosClimaticos } from "./DadosClimaticos";

export class PCD extends Subject {
  private identificador: string;
  private localizacao: string;
  private dados: DadosClimaticos;

  constructor(identificador: string, localizacao: string) {
    super();

    this.identificador = identificador;
    this.localizacao = localizacao;

    this.dados = {
      temperatura: 0,
      pressaoAtmosferica: 0,
      umidadeAr: 0,
    };
  }

  getIdentificador(): string {
    return this.identificador;
  }

  getLocalizacao(): string {
    return this.localizacao;
  }

  getDados(): DadosClimaticos {
    return this.dados;
  }

  atualizarDados(dados: DadosClimaticos): void {
    this.dados = dados;

    console.log(`\nPCD ${this.identificador} atualizou os dados.`);

    // "Não nos ligue, nós ligaremos para você."
    // aqui a inversão de controle já está aplicada pois as universidades nao ficam consultando pcd's em busca
    // de novos dados, mas sim as universidades se inscrevem e serão notificadas quando os dados dos pcds sao
    // atualizados
    this.notifyObservers();
  }
}
