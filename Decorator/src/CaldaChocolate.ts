import { Bebida } from "./Bebida";

export class CaldaChocolate implements Bebida {
  public getPrice(): number {
    return 2.5;
  }
}
