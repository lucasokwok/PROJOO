import { Bebida } from "./Bebida";

export abstract class BebidaDecorator implements Bebida {
  protected pedido: Bebida;

  constructor(pedido: Bebida) {
    this.pedido = pedido;
  }

  getPrice(): number {
    return this.pedido.getPrice();
  }

  getDescription(): string {
    return this.pedido.getDescription();
  }
}
