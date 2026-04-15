import { Bebida } from "./Bebida";

export class Canela implements Bebida {
  public getPrice(): number {
    return 1.5;
  }
}
