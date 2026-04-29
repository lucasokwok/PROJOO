import { Relatorio } from "./Relatorio";
import { Visitor } from "./Visitor";

export class Dashboard implements Relatorio {
  accept(visitor: Visitor): void {
    visitor.visit(this);
  }
}
