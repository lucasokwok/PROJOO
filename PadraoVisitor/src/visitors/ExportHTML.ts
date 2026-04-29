// class PrintVisitor implements Visitor {

//    public void visit(Carro c) {
//      System.out.println("Visitando um Carro com placa: " + c.getPlaca());

//    }

//    public void visit(Onibus o)  {
//      System.out.println("Visitando um Onibus com placa: " + o.getPlaca());
//    }

// }
import { Visitor } from "../Visitor";

export class ExportHTML implements Visitor {
  public visit(): void {}
}
