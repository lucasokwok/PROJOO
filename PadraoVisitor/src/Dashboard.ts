import { Relatorio } from "./Relatorio";
import { Visitor } from "./Visitor";

export class Dashboard implements Relatorio {
  constructor(
    public titulo: string,
    public tipoGrafico: string,
    public quantidadeIndicadores: number,
  ) {}

  accept(visitor: Visitor): void {
    visitor.visit(this);
  }
}
