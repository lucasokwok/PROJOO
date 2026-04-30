import { Visitor } from "../Visitor";
import { Dashboard } from "../Dashboard";
import { Texto } from "../Texto";
import { Topicos } from "../Topicos";

export class ExportXLSX implements Visitor {
  public visit(relatorio: Dashboard): void;
  public visit(relatorio: Texto): void;
  public visit(relatorio: Topicos): void;

  public visit(relatorio: Dashboard | Texto | Topicos): void {
    console.log("Exportando em XLSX:");

    if (relatorio instanceof Dashboard) {
      console.log(["Título", "Tipo de Gráfico", "Quantidade de Indicadores"]);
      console.log([
        relatorio.titulo,
        relatorio.tipoGrafico,
        relatorio.quantidadeIndicadores,
      ]);
    }

    if (relatorio instanceof Texto) {
      console.log(["Título", "Autor", "Número de Linhas"]);
      console.log([relatorio.titulo, relatorio.autor, relatorio.numeroLinhas]);
    }

    if (relatorio instanceof Topicos) {
      console.log(["Número de Tópicos"]);
      console.log([relatorio.qtdtopicos]);
    }
  }
}
