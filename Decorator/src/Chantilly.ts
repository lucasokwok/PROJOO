import { Bebida } from "./Bebida";
import { BebidaDecorator } from "./BebidaDecorator";

export class Chantilly extends BebidaDecorator {
  constructor(pedido: Bebida) {
    super(pedido);
  }

  getPrice(): number {
    return super.getPrice() + 3.0;
  }

  getDescription(): string {
    return super.getDescription() + ", chantilly";
  }
}
