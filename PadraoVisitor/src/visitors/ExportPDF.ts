import { Visitor } from "../Visitor";
import { Dashboard } from "../Dashboard";
import { Texto } from "../Texto";
import { Topicos } from "../Topicos";

export class ExportPDF implements Visitor {
  public visit(relatorio: Dashboard): void;
  public visit(relatorio: Texto): void;
  public visit(relatorio: Topicos): void;

  public visit(relatorio: Dashboard | Texto | Topicos): void {
    console.log("Exportando em PDF:");

    if (relatorio instanceof Dashboard) {
      console.log(`PDF - ${relatorio.titulo}`);
      console.log(`Gráfico utilizado: ${relatorio.tipoGrafico}`);
      console.log(`Indicadores exibidos: ${relatorio.quantidadeIndicadores}`);
    }

    if (relatorio instanceof Texto) {
      console.log(`PDF - ${relatorio.titulo}`);
      console.log(`Autor: ${relatorio.autor}`);
      console.log(`Quantidade de linhas: ${relatorio.numeroLinhas}`);
    }

    if (relatorio instanceof Topicos) {
      console.log(`PDF - ${relatorio.titulo}`);
      console.log(`Quantidade de linhas: ${relatorio.qtdtopicos}`);
    }
  }
}
