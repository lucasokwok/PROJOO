import { Visitor } from "../Visitor";
import { Dashboard } from "../Dashboard";
import { Texto } from "../Texto";
import { Topicos } from "../Topicos";

export class ExportHTML implements Visitor {
  public visit(relatorio: Dashboard): void;
  public visit(relatorio: Texto): void;
  public visit(relatorio: Topicos): void;

  public visit(relatorio: Dashboard | Texto | Topicos): void {
    console.log("Exportando em HTML:");

    if (relatorio instanceof Dashboard) {
      console.log(`<h1>${relatorio.titulo}</h1>`);
      console.log(`<p>Tipo de gráfico: ${relatorio.tipoGrafico}</p>`);
      console.log(
        `<p>Quantidade de indicadores: ${relatorio.quantidadeIndicadores}</p>`,
      );
    }

    if (relatorio instanceof Texto) {
      console.log(`<h1>${relatorio.titulo}</h1>`);
      console.log(`<p>Autor: ${relatorio.autor}</p>`);
      console.log(`<p>Número de linhas: ${relatorio.numeroLinhas}</p>`);
    }

    if (relatorio instanceof Topicos) {
      console.log(`<h1>${relatorio.titulo}</h1>`);
      console.log("<ul>");
      console.log(`<p>Número de linhas: ${relatorio.qtdtopicos}</p>`);
      console.log("</ul>");
    }
  }
}
