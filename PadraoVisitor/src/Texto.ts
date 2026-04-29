import { Relatorio } from "./Relatorio";
import { Visitor } from "./Visitor";

class Texto implements Relatorio {
  accept(visitor: Visitor): void {
    visitor.visit(this);
  }
}
