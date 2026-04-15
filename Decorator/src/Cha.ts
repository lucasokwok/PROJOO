import { Bebida } from "./Bebida";

export class Cha implements Bebida {
  public getPrice(): number {
    return 4.0;
  }
}
