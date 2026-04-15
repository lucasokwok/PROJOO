import { Bebida } from "./Bebida";

export class Cappuccino implements Bebida {
  public getPrice(): number {
    return 8.0;
  }
}
