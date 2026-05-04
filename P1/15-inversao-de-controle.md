# 15 - Inversão de Controle

## 1. Ideia principal

**Inversão de Controle** é uma ideia importante em projeto de software e aparece na apresentação junto com o padrão **Template Method**.

Em inglês:

```text
Inversion of Control
IoC
```

A definição principal é:

> Inversão de Controle acontece quando o fluxo principal do programa não é controlado diretamente pelo código do usuário, mas por uma estrutura externa, como uma classe base, framework, sistema de eventos ou biblioteca estruturante.

Uma forma simples de lembrar:

```text
Sem Inversão de Controle:
meu código chama diretamente tudo o que deve acontecer.

Com Inversão de Controle:
uma estrutura externa controla o fluxo e chama o meu código quando necessário.
```

---

## 2. Exemplo sem Inversão de Controle

Imagine um processo de importação de arquivos.

```ts
class ImportadorCSV {
  public abrirArquivo(): void {
    console.log("Abrindo arquivo CSV");
  }

  public lerDados(): void {
    console.log("Lendo dados do CSV");
  }

  public validarDados(): void {
    console.log("Validando dados");
  }

  public salvarDados(): void {
    console.log("Salvando dados");
  }
}

const importador = new ImportadorCSV();

importador.abrirArquivo();
importador.lerDados();
importador.validarDados();
importador.salvarDados();
```

Nesse exemplo, o código cliente controla toda a sequência:

```text
abrir arquivo;
ler dados;
validar dados;
salvar dados.
```

O fluxo principal está no código cliente.

---

## 3. Problema desse código

Se existirem vários tipos de importadores, como CSV, JSON e XML, a sequência pode ser repetida várias vezes.

Exemplo:

```text
ImportadorCSV;
ImportadorJSON;
ImportadorXML.
```

Todos talvez sigam o mesmo fluxo:

```text
abrir;
ler;
validar;
salvar.
```

O que muda é apenas o modo de ler ou processar o conteúdo.

Isso gera duplicação e dificulta manter uma ordem padrão de execução.

---

## 4. Código com Inversão de Controle

Podemos criar uma classe abstrata que controla o fluxo principal.

```ts
abstract class Importador {
  public importar(): void {
    this.abrirArquivo();
    this.lerDados();
    this.validarDados();
    this.salvarDados();
  }

  protected abrirArquivo(): void {
    console.log("Abrindo arquivo");
  }

  protected abstract lerDados(): void;

  protected validarDados(): void {
    console.log("Validando dados");
  }

  protected salvarDados(): void {
    console.log("Salvando dados");
  }
}
```

Agora as subclasses implementam apenas o que muda.

```ts
class ImportadorCSV extends Importador {
  protected lerDados(): void {
    console.log("Lendo dados do CSV");
  }
}

class ImportadorJSON extends Importador {
  protected lerDados(): void {
    console.log("Lendo dados do JSON");
  }
}
```

Uso:

```ts
const importadorCSV = new ImportadorCSV();
importadorCSV.importar();

const importadorJSON = new ImportadorJSON();
importadorJSON.importar();
```

---

## 5. Por que isso é Inversão de Controle?

Porque a classe abstrata `Importador` controla a sequência do algoritmo.

A subclasse não decide a ordem dos passos.

Ela apenas implementa partes específicas.

O fluxo fica na classe base:

```ts
public importar(): void {
  this.abrirArquivo();
  this.lerDados();
  this.validarDados();
  this.salvarDados();
}
```

A classe base chama métodos implementados pelas subclasses:

```ts
protected abstract lerDados(): void;
```

Ou seja:

```text
A estrutura base chama o código específico da subclasse.
```

Isso é Inversão de Controle.

---

## 6. Relação com Template Method

O exemplo acima é também um exemplo de **Template Method**.

Template Method define o esqueleto de um algoritmo em uma classe abstrata e deixa alguns passos para as subclasses.

Na apresentação, o exemplo é a folha de pagamento.

A classe abstrata `Funcionario` define o fluxo:

```text
calcular desconto de previdência;
calcular desconto de plano de saúde;
calcular outros descontos;
calcular salário líquido.
```

Exemplo:

```ts
abstract class Funcionario {
  constructor(protected salario: number) {}

  protected abstract calcularDescontoPrevidencia(): number;
  protected abstract calcularDescontoPlanoSaude(): number;
  protected abstract calcularOutrosDescontos(): number;

  public calcularSalarioLiquido(): number {
    const previdencia = this.calcularDescontoPrevidencia();
    const planoSaude = this.calcularDescontoPlanoSaude();
    const outros = this.calcularOutrosDescontos();

    return this.salario - previdencia - planoSaude - outros;
  }
}
```

Subclasse:

```ts
class FuncionarioCLT extends Funcionario {
  protected calcularDescontoPrevidencia(): number {
    return this.salario * 0.08;
  }

  protected calcularDescontoPlanoSaude(): number {
    return 200;
  }

  protected calcularOutrosDescontos(): number {
    return 100;
  }
}
```

A classe `Funcionario` controla o algoritmo.

A classe `FuncionarioCLT` só fornece os detalhes.

---

## 7. Frase importante

Uma frase comum para explicar Inversão de Controle é:

```text
Não nos chame, nós chamaremos você.
```

Ou seja:

```text
Você não chama diretamente cada parte do fluxo.
A estrutura principal chama seu código no momento certo.
```

Essa ideia é muito usada para explicar frameworks.

---

## 8. Exemplo com eventos

Eventos também usam Inversão de Controle.

Exemplo conceitual:

```ts
button.addEventListener("click", () => {
  console.log("Botão clicado");
});
```

Você não chama manualmente a função quando o botão é clicado.

Você apenas registra uma função.

Quando o evento acontece, o sistema chama sua função.

Fluxo:

```text
Sistema de eventos -> sua função
```

Isso também é Inversão de Controle.

---

## 9. Exemplo com Observer

Observer também possui uma forma de Inversão de Controle.

Você registra observadores, mas quem chama `update()` é o sujeito observado.

```ts
interface Observer {
  update(valor: number): void;
}

class Temperatura {
  private observers: Observer[] = [];
  private valor = 0;

  public addObserver(observer: Observer): void {
    this.observers.push(observer);
  }

  public setValor(valor: number): void {
    this.valor = valor;
    this.notifyObservers();
  }

  private notifyObservers(): void {
    for (const observer of this.observers) {
      observer.update(this.valor);
    }
  }
}

class TermometroDigital implements Observer {
  public update(valor: number): void {
    console.log(`Temperatura atual: ${valor}`);
  }
}
```

Uso:

```ts
const temperatura = new Temperatura();
const termometro = new TermometroDigital();

temperatura.addObserver(termometro);

temperatura.setValor(25);
```

O usuário não chama `termometro.update(25)` diretamente.

Quem chama é `Temperatura`.

---

## 10. Exemplo com React

Em React, você escreve um componente:

```tsx
function App() {
  return <h1>Olá, mundo</h1>;
}
```

Você não chama diretamente os mecanismos internos de renderização.

O React chama seu componente quando precisa renderizar ou atualizar a tela.

Fluxo simplificado:

```text
React -> App()
```

Isso é uma aplicação prática de Inversão de Controle.

---

## 11. Exemplo com botão no React

```tsx
function Tela() {
  function salvar(): void {
    console.log("Salvando dados");
  }

  return <button onClick={salvar}>Salvar</button>;
}
```

Você não chama `salvar()` diretamente no momento do clique.

Você entrega a função ao React.

Quando o usuário clica, o React chama essa função.

---

## 12. Não confundir com Inversão de Dependência

**Inversão de Controle** e **Inversão de Dependência** têm nomes parecidos, mas são conceitos diferentes.

| Inversão de Controle | Inversão de Dependência |
|---|---|
| Fala sobre quem controla o fluxo de execução | Fala sobre de quem uma classe depende |
| Relacionada a frameworks, callbacks, eventos e Template Method | Relacionada a depender de interfaces/abstrações |
| Uma estrutura externa chama seu código | Uma classe depende de uma abstração, não de implementação concreta |
| Exemplo: React chama seu componente | Exemplo: PedidoService depende de NotificacaoService |

---

## 13. Exemplo de Inversão de Dependência

```ts
interface NotificacaoService {
  enviar(mensagem: string): void;
}

class EmailService implements NotificacaoService {
  public enviar(mensagem: string): void {
    console.log(`E-mail: ${mensagem}`);
  }
}

class PedidoService {
  constructor(private notificacaoService: NotificacaoService) {}

  public finalizarPedido(): void {
    this.notificacaoService.enviar("Pedido finalizado");
  }
}
```

Aqui o foco é a dependência em uma abstração.

Isso é Inversão de Dependência, não necessariamente Inversão de Controle.

---

## 14. Exemplo no estilo da prova

### Código sem Inversão de Controle

```ts
class ProcessadorRelatorioPDF {
  public buscarDados(): void {
    console.log("Buscando dados");
  }

  public formatarDados(): void {
    console.log("Formatando dados para PDF");
  }

  public exportar(): void {
    console.log("Exportando PDF");
  }
}

const relatorio = new ProcessadorRelatorioPDF();

relatorio.buscarDados();
relatorio.formatarDados();
relatorio.exportar();
```

---

### Problema

O cliente controla manualmente a ordem dos passos.

Se houver vários tipos de relatórios, a sequência pode ser duplicada.

Além disso, o cliente precisa saber detalhes do processo.

---

### Código corrigido com Inversão de Controle

```ts
abstract class ProcessadorRelatorio {
  public processar(): void {
    this.buscarDados();
    this.formatarDados();
    this.exportar();
  }

  protected buscarDados(): void {
    console.log("Buscando dados");
  }

  protected abstract formatarDados(): void;

  protected abstract exportar(): void;
}

class ProcessadorRelatorioPDF extends ProcessadorRelatorio {
  protected formatarDados(): void {
    console.log("Formatando dados para PDF");
  }

  protected exportar(): void {
    console.log("Exportando PDF");
  }
}

class ProcessadorRelatorioCSV extends ProcessadorRelatorio {
  protected formatarDados(): void {
    console.log("Formatando dados para CSV");
  }

  protected exportar(): void {
    console.log("Exportando CSV");
  }
}
```

Uso:

```ts
const relatorioPDF = new ProcessadorRelatorioPDF();
relatorioPDF.processar();

const relatorioCSV = new ProcessadorRelatorioCSV();
relatorioCSV.processar();
```

---

### Explicação da correção

A classe abstrata `ProcessadorRelatorio` controla a ordem do processo.

As subclasses só implementam os passos variáveis.

Isso aplica Inversão de Controle porque o fluxo principal está na classe base, que chama os métodos definidos nas subclasses.

---

## 15. Como identificar Inversão de Controle em prova

Procure por:

```text
classe abstrata definindo fluxo principal;
framework chamando código do usuário;
callbacks;
eventos;
métodos abstratos chamados pela classe pai;
Template Method;
Observer notificando objetos;
funções registradas para serem chamadas depois.
```

Palavras-chave:

```text
fluxo principal;
controle da execução;
framework;
callback;
evento;
classe base;
Template Method;
não nos chame, nós chamaremos você.
```

---

## 16. Resposta pronta para prova

> Inversão de Controle ocorre quando o fluxo principal da execução deixa de ser controlado diretamente pelo código do usuário e passa a ser controlado por uma estrutura externa, como uma classe base ou framework. O código do usuário fornece partes específicas do comportamento, e essa estrutura chama essas partes no momento adequado. Um exemplo é o Template Method, em que a classe abstrata define a sequência do algoritmo e chama métodos implementados pelas subclasses.

---

## 17. Resumo final

Inversão de Controle significa:

```text
Uma estrutura externa controla o fluxo principal e chama o meu código.
```

Exemplos:

```text
Template Method;
frameworks;
eventos;
callbacks;
Observer;
React chamando componentes.
```

Frase para memorizar:

> Inversão de Controle acontece quando eu não controlo diretamente toda a sequência; uma estrutura principal chama meu código no momento certo.
