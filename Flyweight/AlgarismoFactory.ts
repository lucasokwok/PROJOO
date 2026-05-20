import { Algarismo } from "./Algarismo.ts";

export class AlgarismoFactory {
  private algarismos: (Algarismo | null)[] = Array(10).fill(null);
  private objetosCriados = 0;

  getAlgarismo(numero: number): Algarismo {
    if (this.algarismos[numero] === null) {
      //garante que exista só uma instancia de cada numero
      this.objetosCriados++; //conta quantos objetos sao criados
      this.algarismos[numero] = new Algarismo(numero);
    }

    return this.algarismos[numero];
  }

  getQuantidadeObjetosCriados(): number {
    return this.objetosCriados;
  }
}
