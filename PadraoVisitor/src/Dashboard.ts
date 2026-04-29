import { Relatorio } from "./Relatorio";
import { Visitor } from "./Visitor";

class Dashboard implements Relatorio {
  accept(visitor: Visitor): void {
    visitor.visit(this);
  }
}
