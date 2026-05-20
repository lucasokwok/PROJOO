import { test } from "vitest";
import { AlgarismoFactory } from "./AlgarismoFactory.ts";

test("executa 100 vezes e mostra a média de objetos criados", () => {
  let somaObjetosCriados = 0;

  for (let execucao = 1; execucao <= 100; execucao++) {
    const factory = new AlgarismoFactory();

    for (let i = 0; i < 10; i++) {
      const numero = Math.floor(Math.random() * 10);
      factory.getAlgarismo(numero);
    }

    somaObjetosCriados += factory.getQuantidadeObjetosCriados();
  }

  const media = somaObjetosCriados / 100;

  console.log("Média de objetos criados:", media);
});
