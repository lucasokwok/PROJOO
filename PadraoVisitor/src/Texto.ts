import { Relatorio } from "./Relatorio";
import { Visitor } from "./Visitor";

export class Texto implements Relatorio {
  constructor(
    public titulo: string,
    public numeroLinhas: number,
    public autor: string,
  ) {}

  accept(visitor: Visitor): void {
    visitor.visit(this);
  }
}
