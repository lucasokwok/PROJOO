import { describe, expect, it, vi, afterEach } from "vitest";

import { Dashboard } from "../src/Dashboard";
import { Texto } from "../src/Texto";
import { Topicos } from "../src/Topicos";

import { ExportHTML } from "../src/visitors/ExportHTML";
import { ExportXLSX } from "../src/visitors/ExportXLSX";
import { ExportPDF } from "../src/visitors/ExportPDF";

describe("Visitor - Exportadores de Relatórios", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("deve exportar Dashboard em HTML", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const dashboard = new Dashboard("Dashboard de Vendas", "Barras", 5);
    const exportHTML = new ExportHTML();

    dashboard.accept(exportHTML);

    expect(consoleSpy).toHaveBeenCalledWith("Exportando em HTML:");
    expect(consoleSpy).toHaveBeenCalledWith("<h1>Dashboard de Vendas</h1>");
    expect(consoleSpy).toHaveBeenCalledWith("<p>Tipo de gráfico: Barras</p>");
    expect(consoleSpy).toHaveBeenCalledWith(
      "<p>Quantidade de indicadores: 5</p>",
    );
  });

  it("deve exportar Texto em HTML", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const texto = new Texto("Relatório Mensal", 30, "Carlos Silva");
    const exportHTML = new ExportHTML();

    texto.accept(exportHTML);

    expect(consoleSpy).toHaveBeenCalledWith("Exportando em HTML:");
    expect(consoleSpy).toHaveBeenCalledWith("<h1>Relatório Mensal</h1>");
    expect(consoleSpy).toHaveBeenCalledWith("<p>Autor: Carlos Silva</p>");
    expect(consoleSpy).toHaveBeenCalledWith("<p>Número de linhas: 30</p>");
  });

  it("deve exportar Topicos em HTML", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const topicos = new Topicos("Pauta da Reunião", 4);
    const exportHTML = new ExportHTML();

    topicos.accept(exportHTML);

    expect(consoleSpy).toHaveBeenCalledWith("Exportando em HTML:");
    expect(consoleSpy).toHaveBeenCalledWith("<h1>Pauta da Reunião</h1>");
    expect(consoleSpy).toHaveBeenCalledWith("<ul>");
    expect(consoleSpy).toHaveBeenCalledWith("<p>Número de linhas: 4</p>");
    expect(consoleSpy).toHaveBeenCalledWith("</ul>");
  });

  it("deve exportar Dashboard em XLSX", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const dashboard = new Dashboard("Dashboard de Vendas", "Barras", 5);
    const exportXLSX = new ExportXLSX();

    dashboard.accept(exportXLSX);

    expect(consoleSpy).toHaveBeenCalledWith("Exportando em XLSX:");
    expect(consoleSpy).toHaveBeenCalledWith([
      "Título",
      "Tipo de Gráfico",
      "Quantidade de Indicadores",
    ]);
    expect(consoleSpy).toHaveBeenCalledWith([
      "Dashboard de Vendas",
      "Barras",
      5,
    ]);
  });

  it("deve exportar Texto em XLSX", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const texto = new Texto("Relatório Mensal", 30, "Carlos Silva");
    const exportXLSX = new ExportXLSX();

    texto.accept(exportXLSX);

    expect(consoleSpy).toHaveBeenCalledWith("Exportando em XLSX:");
    expect(consoleSpy).toHaveBeenCalledWith([
      "Título",
      "Autor",
      "Número de Linhas",
    ]);
    expect(consoleSpy).toHaveBeenCalledWith([
      "Relatório Mensal",
      "Carlos Silva",
      30,
    ]);
  });

  it("deve exportar Topicos em XLSX", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const topicos = new Topicos("Pauta da Reunião", 4);
    const exportXLSX = new ExportXLSX();

    topicos.accept(exportXLSX);

    expect(consoleSpy).toHaveBeenCalledWith("Exportando em XLSX:");
    expect(consoleSpy).toHaveBeenCalledWith(["Número de Tópicos"]);
    expect(consoleSpy).toHaveBeenCalledWith([4]);
  });

  it("deve exportar Dashboard em PDF", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const dashboard = new Dashboard("Dashboard de Vendas", "Barras", 5);
    const exportPDF = new ExportPDF();

    dashboard.accept(exportPDF);

    expect(consoleSpy).toHaveBeenCalledWith("Exportando em PDF:");
    expect(consoleSpy).toHaveBeenCalledWith("PDF - Dashboard de Vendas");
    expect(consoleSpy).toHaveBeenCalledWith("Gráfico utilizado: Barras");
    expect(consoleSpy).toHaveBeenCalledWith("Indicadores exibidos: 5");
  });

  it("deve exportar Texto em PDF", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const texto = new Texto("Relatório Mensal", 30, "Carlos Silva");
    const exportPDF = new ExportPDF();

    texto.accept(exportPDF);

    expect(consoleSpy).toHaveBeenCalledWith("Exportando em PDF:");
    expect(consoleSpy).toHaveBeenCalledWith("PDF - Relatório Mensal");
    expect(consoleSpy).toHaveBeenCalledWith("Autor: Carlos Silva");
    expect(consoleSpy).toHaveBeenCalledWith("Quantidade de linhas: 30");
  });

  it("deve exportar Topicos em PDF", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const topicos = new Topicos("Pauta da Reunião", 4);
    const exportPDF = new ExportPDF();

    topicos.accept(exportPDF);

    expect(consoleSpy).toHaveBeenCalledWith("Exportando em PDF:");
    expect(consoleSpy).toHaveBeenCalledWith("PDF - Pauta da Reunião");
    expect(consoleSpy).toHaveBeenCalledWith("Quantidade de linhas: 4");
  });
});
