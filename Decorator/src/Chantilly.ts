import { Bebida } from "./Bebida";

export class Chantilly implements Bebida {
  public getPrice(): number {
    return 3.0;
  }

  public getDescription(): string {
    return "Chantilly";
  }
}
