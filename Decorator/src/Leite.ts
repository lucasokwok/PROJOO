import { Bebida } from "./Bebida";

export class Leite implements Bebida {
  public getPrice(): number {
    return 2.0;
  }
}
