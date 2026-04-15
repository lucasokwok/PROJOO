import { describe, expect, it } from "vitest";
import { Espresso } from "../src/Espresso";
import { Cha } from "../src/Cha";
import { Cappuccino } from "../src/Cappuccino";
import { Leite } from "../src/Leite";
import { Canela } from "../src/Canela";
import { Chantilly } from "../src/Chantilly";
import { CaldaChocolate } from "../src/CaldaChocolate";

describe("Decorator de bebidas", () => {
  it("deve retornar o preço e a descrição de uma bebida base", () => {
    const bebida = new Espresso();

    expect(bebida.getDescription()).toBe("Espresso");
    expect(bebida.getPrice()).toBe(5.0);
  });

  it("deve adicionar leite a uma bebida", () => {
    const bebida = new Leite(new Espresso());

    expect(bebida.getDescription()).toBe("Espresso, leite");
    expect(bebida.getPrice()).toBe(7.0);
  });

  it("deve adicionar mais de um adicional corretamente", () => {
    const bebida = new Canela(new Leite(new Espresso()));

    expect(bebida.getDescription()).toBe("Espresso, leite, canela");
    expect(bebida.getPrice()).toBe(8.5);
  });

  it("deve permitir combinar vários decorators", () => {
    const bebida = new Chantilly(
      new CaldaChocolate(new Leite(new Cappuccino())),
    );

    expect(bebida.getDescription()).toBe(
      "Cappuccino, leite, calda de chocolate, chantilly",
    );
    expect(bebida.getPrice()).toBe(15.5);
  });

  it("deve funcionar com outra bebida base", () => {
    const bebida = new CaldaChocolate(new Cha());

    expect(bebida.getDescription()).toBe("Cha, calda de chocolate");
    expect(bebida.getPrice()).toBe(6.5);
  });
});
