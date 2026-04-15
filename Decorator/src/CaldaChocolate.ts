import { Bebida } from "./Bebida";
import { BebidaDecorator } from "./BebidaDecorator";

export class CaldaChocolate extends BebidaDecorator {
  constructor(pedido: Bebida) {
    super(pedido);
  }

  getPrice(): number {
    return super.getPrice() + 2.5;
  }

  getDescription(): string {
    return super.getDescription() + ", calda de chocolate";
  }
}
