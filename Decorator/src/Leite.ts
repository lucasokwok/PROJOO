import { Bebida } from "./Bebida";
import { BebidaDecorator } from "./BebidaDecorator";

export class Leite extends BebidaDecorator {
  constructor(pedido: Bebida) {
    super(pedido);
  }

  getPrice(): number {
    return super.getPrice() + 2.0;
  }

  getDescription(): string {
    return super.getDescription() + ", leite";
  }
}
