import { Dashboard } from "./Dashboard";
import { Texto } from "./Texto";
import { Topicos } from "./Topicos";

export interface Visitor {
  visit(relatorio: Dashboard): void;
  visit(relatorio: Texto): void;
  visit(relatorio: Topicos): void;
}
