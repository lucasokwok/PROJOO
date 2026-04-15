import { Bebida } from "./Bebida";

export class Espresso implements Bebida {
  public getPrice(): number {
    return 5.0;
  }
}
