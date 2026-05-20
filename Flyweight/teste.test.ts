import { test } from "vitest";
import { AlgarismoFactory } from "./AlgarismoFactory.ts";

test("deve reutilizar objetos flyweight", () => {
  const factory = new AlgarismoFactory();

  const numerosSorteados: number[] = [];

  for (let i = 0; i < 10; i++) {
    const numero = Math.floor(Math.random() * 10);
    numerosSorteados.push(numero);

    const algarismo = factory.getAlgarismo(numero);

    console.log(
      `Número sorteado: ${numero} | Objeto usado: ${algarismo.numero}`,
    );
  }

  console.log("Números sorteados:", numerosSorteados.join(" "));
  console.log("Objetos criados:", factory.getQuantidadeObjetosCriados());

  // sua lógica aqui dentro
});
