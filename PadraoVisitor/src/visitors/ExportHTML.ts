import { Visitor } from "../Visitor";
import { Dashboard } from "../Dashboard";
import { Texto } from "../Texto";
import { Topicos } from "../Topicos";

export class ExportHTML implements Visitor {
  public visit(relatorio: Dashboard): void;
  public visit(relatorio: Texto): void;
  public visit(relatorio: Topicos): void;

  public visit(relatorio: Dashboard | Texto | Topicos): void {
    console.log("export em HTML");
  }
}
