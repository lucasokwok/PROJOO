import { Relatorio } from "./Relatorio";
import { Visitor } from "./Visitor";

export class Topicos implements Relatorio {
  constructor(
    public titulo: string,
    public qtdtopicos: number,
  ) {}

  accept(visitor: Visitor): void {
    visitor.visit(this);
  }
}
