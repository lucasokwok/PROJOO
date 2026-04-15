import { Bebida } from "./Bebida";
import { BebidaDecorator } from "./BebidaDecorator";

export class Canela extends BebidaDecorator {
  constructor(pedido: Bebida) {
    super(pedido);
  }

  getPrice(): number {
    return super.getPrice() + 1.5;
  }

  getDescription(): string {
    return super.getDescription() + ", canela";
  }
}
