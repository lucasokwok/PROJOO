# 17 - Overengineering

## 1. Ideia principal

**Overengineering** acontece quando uma solução fica mais complexa do que o problema realmente exige.

Em português, podemos entender como:

```text
engenharia exagerada;
complexidade desnecessária;
solução grande demais para um problema simples.
```

A ideia central é:

> Overengineering é criar uma solução muito flexível, abstrata ou complexa sem existir uma necessidade real para isso.

Na apresentação, o alerta é claro:

```text
Se o código dificilmente vai precisar mudar, usar padrões de projeto pode ser overengineering.
```

---

## 2. Relação com padrões de projeto

Padrões de projeto ajudam no **Design for Change**.

Eles tornam o sistema mais flexível e fácil de modificar.

Mas essa flexibilidade tem custo.

Normalmente, padrões adicionam:

```text
mais classes;
mais interfaces;
mais arquivos;
mais indireção;
mais conceitos;
mais dificuldade para entender o fluxo.
```

Se a mudança realmente for provável, esse custo pode valer a pena.

Se a mudança for improvável, o padrão pode ser exagero.

---

## 3. Exemplo simples sem necessidade de padrão

Imagine que um sistema sempre exporta relatório em PDF.

Não existe previsão de exportar em CSV, XLSX, JSON ou outro formato.

Código simples:

```ts
class RelatorioPDF {
  public exportar(): void {
    console.log("Exportando relatório em PDF");
  }
}
```

Uso:

```ts
const relatorio = new RelatorioPDF();

relatorio.exportar();
```

Esse código é simples e suficiente.

---

## 4. Exemplo com overengineering

Agora imagine que, mesmo sem necessidade real, criamos uma estrutura enorme:

```ts
interface ExportadorRelatorio {
  exportar(): void;
}

abstract class ExportadorBase implements ExportadorRelatorio {
  public abstract exportar(): void;

  protected validarPermissao(): void {
    console.log("Validando permissão");
  }

  protected registrarLog(): void {
    console.log("Registrando log");
  }
}

class ExportadorPDF extends ExportadorBase {
  public exportar(): void {
    this.validarPermissao();
    this.registrarLog();
    console.log("Exportando relatório em PDF");
  }
}

class ExportadorFactory {
  public static criar(tipo: string): ExportadorRelatorio {
    if (tipo === "pdf") {
      return new ExportadorPDF();
    }

    throw new Error("Tipo inválido");
  }
}

class RelatorioService {
  constructor(private exportador: ExportadorRelatorio) {}

  public exportar(): void {
    this.exportador.exportar();
  }
}
```

Uso:

```ts
const exportador = ExportadorFactory.criar("pdf");
const service = new RelatorioService(exportador);

service.exportar();
```

---

## 5. Por que isso pode ser overengineering?

Porque a solução adicionou:

```text
interface;
classe abstrata;
factory;
service;
herança;
indireção.
```

Mas o problema era apenas:

```text
exportar um relatório em PDF.
```

Se nunca houver outro formato, toda essa estrutura pode ser desnecessária.

A solução ficou maior que o problema.

---

## 6. Exemplo baseado em sistema de automações

Imagine um software que inicialmente só precisa processar planilhas `.xlsx`.

Código simples:

```ts
class ProcessadorXLSX {
  public processar(arquivo: string): void {
    console.log(`Processando planilha ${arquivo}`);
  }
}
```

Se o sistema realmente só usa `.xlsx`, isso pode ser suficiente.

---

## 7. Overengineering nesse caso

Agora imagine criar suporte antecipado para vários formatos sem necessidade real:

```ts
interface ProcessadorArquivo {
  processar(arquivo: string): void;
}

class ProcessadorXLSX implements ProcessadorArquivo {
  public processar(arquivo: string): void {
    console.log(`Processando XLSX: ${arquivo}`);
  }
}

class ProcessadorCSV implements ProcessadorArquivo {
  public processar(arquivo: string): void {
    console.log(`Processando CSV: ${arquivo}`);
  }
}

class ProcessadorDOCX implements ProcessadorArquivo {
  public processar(arquivo: string): void {
    console.log(`Processando DOCX: ${arquivo}`);
  }
}

class ProcessadorPDF implements ProcessadorArquivo {
  public processar(arquivo: string): void {
    console.log(`Processando PDF: ${arquivo}`);
  }
}

class ProcessadorArquivoFactory {
  public static criar(extensao: string): ProcessadorArquivo {
    if (extensao === "xlsx") {
      return new ProcessadorXLSX();
    }

    if (extensao === "csv") {
      return new ProcessadorCSV();
    }

    if (extensao === "docx") {
      return new ProcessadorDOCX();
    }

    if (extensao === "pdf") {
      return new ProcessadorPDF();
    }

    throw new Error("Formato não suportado");
  }
}
```

---

## 8. Por que é exagerado?

Se o sistema só usa `.xlsx`, as classes para CSV, DOCX e PDF foram criadas sem necessidade atual.

Isso gera:

```text
mais código para manter;
mais testes para escrever;
mais arquivos para entender;
mais pontos de falha;
mais tempo gasto antes de existir demanda.
```

Isso é overengineering.

---

## 9. Relação com YAGNI

Overengineering se relaciona com o princípio **YAGNI**:

```text
You Aren't Gonna Need It
```

Em português:

```text
Você não vai precisar disso.
```

A ideia é:

> Não implemente uma flexibilidade ou funcionalidade apenas porque talvez um dia ela seja necessária.

Se a necessidade aparecer no futuro, o código pode ser refatorado naquele momento.

---

## 10. Relação com KISS

Overengineering também se opõe ao princípio **KISS**:

```text
Keep It Simple, Stupid
```

Ou, de forma mais educada:

```text
Mantenha simples.
```

A ideia é:

> Prefira a solução mais simples que resolva bem o problema atual.

Simplicidade também é uma qualidade de projeto.

---

# Parte 1 - Overengineering e Design for Change

## 11. Diferença entre bom Design for Change e Overengineering

| Design for Change | Overengineering |
|---|---|
| Flexibilidade baseada em mudança provável | Flexibilidade baseada em hipótese fraca |
| Resolve um problema real de evolução | Cria complexidade antes da necessidade |
| Facilita manutenção futura | Dificulta entendimento atual |
| Usa abstrações com propósito claro | Usa abstrações sem necessidade clara |
| Custo compensa o benefício | Custo maior que o benefício |

---

## 12. Exemplo com desconto

### Situação em que Design for Change faz sentido

Se o sistema possui vários tipos de desconto e novos tipos são esperados, usar Strategy faz sentido.

```ts
interface DescontoStrategy {
  calcular(valor: number): number;
}

class DescontoVip implements DescontoStrategy {
  public calcular(valor: number): number {
    return valor * 0.1;
  }
}

class CalculadoraDesconto {
  constructor(private strategy: DescontoStrategy) {}

  public calcular(valor: number): number {
    return this.strategy.calcular(valor);
  }
}
```

Aqui, Strategy pode ser adequado.

---

### Situação em que pode ser overengineering

Se o sistema sempre terá apenas um desconto fixo de 10%, isso pode ser exagero.

Código simples:

```ts
class CalculadoraDesconto {
  public calcular(valor: number): number {
    return valor * 0.1;
  }
}
```

Esse código é suficiente se não há previsão real de variação.

---

## 13. Exemplo com Singleton

Singleton também pode ser overengineering se usado sem necessidade.

Exemplo exagerado:

```ts
class ConfiguracaoSingleton {
  private static instance: ConfiguracaoSingleton;

  private constructor() {}

  public static getInstance(): ConfiguracaoSingleton {
    if (!ConfiguracaoSingleton.instance) {
      ConfiguracaoSingleton.instance = new ConfiguracaoSingleton();
    }

    return ConfiguracaoSingleton.instance;
  }

  public getTema(): string {
    return "claro";
  }
}
```

Se a configuração é simples e poderia ser passada como objeto comum, Singleton pode criar acoplamento global desnecessário.

---

## 14. Exemplo com Facade

Facade é útil quando existe um subsistema complexo.

Mas pode ser exagero quando há apenas uma classe simples.

Overengineering:

```ts
class Calculadora {
  public somar(a: number, b: number): number {
    return a + b;
  }
}

class CalculadoraFacade {
  constructor(private calculadora: Calculadora) {}

  public somar(a: number, b: number): number {
    return this.calculadora.somar(a, b);
  }
}
```

Se a fachada apenas repassa a chamada sem simplificar nada, ela não agrega valor.

---

# Parte 2 - Como identificar Overengineering

## 15. Sinais comuns

Procure por:

```text
muitas interfaces com apenas uma implementação;
muitas classes para um fluxo simples;
factory para criar apenas um tipo;
strategy para um algoritmo que nunca muda;
facade que só repassa métodos;
decorator sem combinações reais;
adapter sem interface incompatível;
proxy sem controle adicional real;
abstrações criadas apenas para "caso um dia precise".
```

---

## 16. Perguntas úteis

Antes de aplicar um padrão, pergunte:

```text
Essa parte realmente vai mudar?
Essa flexibilidade já é necessária?
Existe mais de uma implementação?
Existe uma variação real prevista?
O custo da abstração compensa?
A solução simples resolveria bem?
O padrão está resolvendo um problema real?
```

Se a resposta for não para quase tudo, talvez seja overengineering.

---

## 17. Sinal forte: interface com uma única implementação sem previsão de mudança

Exemplo:

```ts
interface SaudacaoService {
  saudar(): void;
}

class SaudacaoServiceImpl implements SaudacaoService {
  public saudar(): void {
    console.log("Olá");
  }
}
```

Se nunca haverá outra implementação, a interface pode ser desnecessária.

Mas isso depende do contexto.

Em sistemas grandes, interfaces únicas podem existir por motivos de teste, arquitetura ou padronização.

Em exercícios simples, porém, muitas vezes é exagero.

---

## 18. Sinal forte: Factory sem necessidade

Exemplo:

```ts
class UsuarioFactory {
  public static criar(): Usuario {
    return new Usuario();
  }
}
```

Se a factory só faz `new Usuario()` e não há lógica de criação, talvez ela seja desnecessária.

---

## 19. Sinal forte: muitos padrões juntos

Às vezes o código combina vários padrões sem necessidade:

```text
Factory + Strategy + Singleton + Proxy + Facade
```

para resolver um problema simples.

Isso pode deixar o código difícil de entender.

Padrões devem resolver problemas reais, não ser usados apenas para parecer mais sofisticado.

---

# Parte 3 - Como responder em prova

## 20. Pergunta provável: Quando não vale a pena usar padrões de projeto?

Resposta sugerida:

> Não vale a pena usar padrões de projeto quando a parte do sistema dificilmente sofrerá mudanças ou quando o problema é simples o suficiente para ser resolvido com uma solução direta. Padrões ajudam no Design for Change, mas também adicionam complexidade, como mais classes, interfaces e indireções. Se essa flexibilidade não for necessária, o uso do padrão pode ser overengineering.

---

## 21. Pergunta provável: Explique Overengineering

Resposta sugerida:

> Overengineering ocorre quando criamos uma solução mais complexa do que o problema exige. Em orientação a objetos, isso pode acontecer quando usamos muitos padrões, interfaces e abstrações sem uma necessidade real de mudança. Embora padrões de projeto ajudem a preparar o sistema para evolução, eles também aumentam a complexidade. Por isso, se a chance de mudança for baixa, a solução simples pode ser melhor.

---

## 22. Pergunta provável: Dê um exemplo

Resposta sugerida:

> Um exemplo de overengineering seria criar uma interface `Exportador`, várias classes concretas, uma Factory e uma Facade para um sistema que sempre exporta apenas em PDF e não tem previsão de novos formatos. Nesse caso, uma classe simples `RelatorioPDF` resolveria o problema atual. A estrutura com vários padrões só adicionaria complexidade desnecessária.

---

## 23. Pergunta provável: Relacione Overengineering com Design for Change

Resposta sugerida:

> Design for Change busca preparar o sistema para mudanças futuras, mas essa flexibilidade tem custo. Overengineering acontece quando esse preparo é exagerado, ou seja, quando criamos abstrações e padrões para mudanças que provavelmente nunca ocorrerão. A diferença está na necessidade real: se a mudança é provável, Design for Change é positivo; se a mudança é improvável, a complexidade extra pode ser overengineering.

---

# Parte 4 - Exemplo completo no estilo da prova

## 24. Código exagerado

```ts
interface Saudacao {
  executar(): void;
}

class SaudacaoPadrao implements Saudacao {
  public executar(): void {
    console.log("Olá");
  }
}

class SaudacaoFactory {
  public static criar(): Saudacao {
    return new SaudacaoPadrao();
  }
}

class SaudacaoFacade {
  private saudacao: Saudacao;

  constructor() {
    this.saudacao = SaudacaoFactory.criar();
  }

  public saudar(): void {
    this.saudacao.executar();
  }
}
```

Uso:

```ts
const facade = new SaudacaoFacade();

facade.saudar();
```

---

## 25. Por que pode ser overengineering?

O objetivo era apenas imprimir:

```text
Olá
```

Mas o código criou:

```text
interface;
classe concreta;
factory;
facade.
```

Não existe variação real de saudação.

Não existe subsistema complexo.

Não existe criação complexa.

Não existe necessidade de abstração.

Logo, a solução ficou desnecessariamente complexa.

---

## 26. Código mais simples

```ts
class Saudacao {
  public saudar(): void {
    console.log("Olá");
  }
}
```

Uso:

```ts
const saudacao = new Saudacao();

saudacao.saudar();
```

Essa solução resolve o problema com menos complexidade.

---

# Parte 5 - Resumo final

Overengineering significa:

```text
Criar uma solução complexa demais para um problema simples.
```

Acontece quando usamos:

```text
interfaces sem necessidade;
classes abstratas sem variação;
factories para criar um único objeto simples;
facades que não simplificam nada;
strategies para algoritmos que nunca mudam;
decorators sem combinações reais;
padrões apenas por parecerem sofisticados.
```

Relação com padrões:

```text
Padrões ajudam em Design for Change.
Mas podem virar Overengineering se a mudança não for provável.
```

Frase para memorizar:

> Padrões de projeto devem ser usados para resolver problemas reais de flexibilidade e mudança; se a mudança é improvável, o padrão pode apenas adicionar complexidade desnecessária.
