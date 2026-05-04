# 09 - Template Method

## 1. Ideia principal

O **Template Method** é um padrão de projeto usado quando queremos definir o **esqueleto de um algoritmo** em uma classe base, mas deixar alguns passos específicos para as subclasses implementarem.

A ideia central é:

> Template Method define a estrutura geral de um algoritmo em uma classe abstrata e permite que subclasses personalizem alguns passos sem alterar essa estrutura.

Ou seja, a classe pai define a ordem principal do processo.

As subclasses implementam apenas os detalhes variáveis.

---

## 2. Problema que o Template Method resolve

Na apresentação, o exemplo usado é uma **folha de pagamento**.

Existe uma função que calcula salário de funcionários.

O cálculo geral é parecido para diferentes tipos de funcionários, por exemplo:

```text
funcionários públicos;
funcionários CLT;
outros tipos de funcionários.
```

O fluxo principal é semelhante:

```text
1. calcular desconto de previdência;
2. calcular desconto de plano de saúde;
3. calcular outros descontos;
4. calcular salário líquido.
```

Mas alguns detalhes mudam conforme o tipo de funcionário.

O problema é:

> Como manter o fluxo principal do algoritmo fixo, mas permitir que subclasses alterem alguns passos específicos?

---

## 3. Exemplo ruim sem Template Method

Imagine uma classe para funcionário CLT:

```ts
class FuncionarioCLT {
  constructor(private salario: number) {}

  public calcularSalarioLiquido(): number {
    const previdencia = this.salario * 0.08;
    const planoSaude = 200;
    const outros = 100;

    return this.salario - previdencia - planoSaude - outros;
  }
}
```

E uma classe para funcionário público:

```ts
class FuncionarioPublico {
  constructor(private salario: number) {}

  public calcularSalarioLiquido(): number {
    const previdencia = this.salario * 0.11;
    const planoSaude = 150;
    const outros = 50;

    return this.salario - previdencia - planoSaude - outros;
  }
}
```

O problema é que o algoritmo principal está duplicado:

```text
calcula previdência;
calcula plano de saúde;
calcula outros descontos;
retorna salário líquido.
```

O que muda são os valores e regras específicas.

---

## 4. Solução com Template Method

Criamos uma classe abstrata com o fluxo principal.

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

O método `calcularSalarioLiquido()` é o **Template Method**.

Ele define a estrutura do algoritmo.

Os métodos abstratos são os passos que as subclasses devem implementar.

---

## 5. Subclasses implementando os passos

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

class FuncionarioPublico extends Funcionario {
  protected calcularDescontoPrevidencia(): number {
    return this.salario * 0.11;
  }

  protected calcularDescontoPlanoSaude(): number {
    return 150;
  }

  protected calcularOutrosDescontos(): number {
    return 50;
  }
}
```

Uso:

```ts
const funcionarioCLT = new FuncionarioCLT(5000);
const funcionarioPublico = new FuncionarioPublico(5000);

console.log(funcionarioCLT.calcularSalarioLiquido());
console.log(funcionarioPublico.calcularSalarioLiquido());
```

As duas subclasses seguem o mesmo fluxo, mas implementam os descontos de forma diferente.

---

## 6. Exemplo da apresentação

Na apresentação, a classe abstrata `Funcionario` possui um método principal:

```text
calcSalarioLiquido()
```

Esse método chama outros métodos:

```text
calcDescontosPrevidencia()
calcDescontosPlanoSaude()
calcOutrosDescontos()
```

Esses métodos são implementados pelas subclasses.

A estrutura geral fica na classe pai.

Os detalhes ficam nas subclasses.

---

## 7. Estrutura do padrão Template Method

```text
+-----------------------------+
|      AbstractClass          |
+-----------------------------+
| + templateMethod()          |
| # step1()                   |
| # step2()                   |
| # step3()                   |
+-----------------------------+
              ^
              |
+-----------------------------+
|      ConcreteClass          |
+-----------------------------+
| # step1()                   |
| # step2()                   |
| # step3()                   |
+-----------------------------+
```

No exemplo da folha de pagamento:

```text
AbstractClass = Funcionario
templateMethod = calcularSalarioLiquido()
step1 = calcularDescontoPrevidencia()
step2 = calcularDescontoPlanoSaude()
step3 = calcularOutrosDescontos()
ConcreteClass = FuncionarioCLT, FuncionarioPublico
```

---

## 8. Código completo em TypeScript

```ts
abstract class Funcionario {
  constructor(
    protected nome: string,
    protected salario: number
  ) {}

  protected abstract calcularDescontoPrevidencia(): number;
  protected abstract calcularDescontoPlanoSaude(): number;
  protected abstract calcularOutrosDescontos(): number;

  public calcularSalarioLiquido(): number {
    const previdencia = this.calcularDescontoPrevidencia();
    const planoSaude = this.calcularDescontoPlanoSaude();
    const outros = this.calcularOutrosDescontos();

    return this.salario - previdencia - planoSaude - outros;
  }

  public imprimirResumo(): void {
    console.log(`${this.nome}: R$ ${this.calcularSalarioLiquido()}`);
  }
}

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

class FuncionarioPublico extends Funcionario {
  protected calcularDescontoPrevidencia(): number {
    return this.salario * 0.11;
  }

  protected calcularDescontoPlanoSaude(): number {
    return 150;
  }

  protected calcularOutrosDescontos(): number {
    return 50;
  }
}

const ana = new FuncionarioCLT("Ana", 5000);
const joao = new FuncionarioPublico("João", 5000);

ana.imprimirResumo();
joao.imprimirResumo();
```

---

## 9. O que acontece nesse código?

A classe `Funcionario` define o método principal:

```ts
public calcularSalarioLiquido(): number {
  const previdencia = this.calcularDescontoPrevidencia();
  const planoSaude = this.calcularDescontoPlanoSaude();
  const outros = this.calcularOutrosDescontos();

  return this.salario - previdencia - planoSaude - outros;
}
```

Esse método não muda nas subclasses.

As subclasses só implementam os passos variáveis:

```ts
calcularDescontoPrevidencia()
calcularDescontoPlanoSaude()
calcularOutrosDescontos()
```

Assim, o algoritmo principal fica protegido na classe pai.

---

## 10. Por que o método principal é chamado de Template Method?

Porque ele funciona como um **modelo** ou **template** do algoritmo.

Ele define a sequência de passos:

```text
1. fazer passo A;
2. fazer passo B;
3. fazer passo C;
4. retornar resultado final.
```

As subclasses não mudam a sequência.

Elas apenas preenchem alguns passos.

---

## 11. Relação com herança

Template Method usa **herança**.

A classe abstrata define o comportamento comum.

As subclasses herdam esse comportamento e implementam os detalhes específicos.

Exemplo:

```text
Funcionario
    FuncionarioCLT
    FuncionarioPublico
```

Isso é diferente de padrões como Strategy, que usam composição.

---

## 12. Relação com Inversão de Controle

A apresentação afirma que Template Method é usado para implementar **Inversão de Controle**, principalmente em frameworks.

A ideia de Inversão de Controle é:

> O fluxo principal não é controlado pelo código do cliente; ele é controlado por uma estrutura base, que chama partes específicas implementadas pelo cliente.

No Template Method, quem controla a ordem das chamadas é a classe pai.

Exemplo:

```ts
public calcularSalarioLiquido(): number {
  const previdencia = this.calcularDescontoPrevidencia();
  const planoSaude = this.calcularDescontoPlanoSaude();
  const outros = this.calcularOutrosDescontos();

  return this.salario - previdencia - planoSaude - outros;
}
```

A classe pai chama métodos que serão implementados pelas subclasses.

Ou seja, a subclasse fornece partes do comportamento, mas quem decide quando chamar é a classe pai.

---

## 13. Frameworks e Template Method

A apresentação compara frameworks e bibliotecas.

Em uma biblioteca, normalmente o seu código chama a biblioteca:

```text
Seu código ---> Biblioteca
```

Em um framework, o framework chama o seu código:

```text
Framework ---> Seu código
```

Isso é Inversão de Controle.

Template Method representa bem essa ideia.

A classe abstrata define o fluxo principal e chama os métodos implementados pelas subclasses.

Por isso, uma frase comum para explicar Inversão de Controle é:

```text
Não nos chame, nós chamaremos você.
```

---

## 14. Exemplo alternativo: processamento de arquivo

Imagine que todo processamento de arquivo segue a mesma sequência:

```text
1. abrir arquivo;
2. ler conteúdo;
3. processar conteúdo;
4. fechar arquivo.
```

Mas o processamento muda conforme o tipo de arquivo.

```ts
abstract class ProcessadorArquivo {
  public processar(nomeArquivo: string): void {
    this.abrir(nomeArquivo);
    const conteudo = this.ler(nomeArquivo);
    this.processarConteudo(conteudo);
    this.fechar(nomeArquivo);
  }

  private abrir(nomeArquivo: string): void {
    console.log(`Abrindo arquivo ${nomeArquivo}`);
  }

  private ler(nomeArquivo: string): string {
    console.log(`Lendo arquivo ${nomeArquivo}`);
    return "conteúdo do arquivo";
  }

  protected abstract processarConteudo(conteudo: string): void;

  private fechar(nomeArquivo: string): void {
    console.log(`Fechando arquivo ${nomeArquivo}`);
  }
}

class ProcessadorCSV extends ProcessadorArquivo {
  protected processarConteudo(conteudo: string): void {
    console.log(`Processando CSV: ${conteudo}`);
  }
}

class ProcessadorJSON extends ProcessadorArquivo {
  protected processarConteudo(conteudo: string): void {
    console.log(`Processando JSON: ${conteudo}`);
  }
}

const csv = new ProcessadorCSV();
csv.processar("dados.csv");

const json = new ProcessadorJSON();
json.processar("dados.json");
```

Aqui, `processar()` é o Template Method.

O passo variável é `processarConteudo()`.

---

## 15. Hooks no Template Method

Algumas implementações de Template Method usam **hooks**.

Hook é um método opcional que a subclasse pode sobrescrever, mas não é obrigada.

Exemplo:

```ts
abstract class Relatorio {
  public gerar(): void {
    this.buscarDados();
    this.formatarDados();

    if (this.deveEnviarEmail()) {
      this.enviarEmail();
    }
  }

  protected buscarDados(): void {
    console.log("Buscando dados");
  }

  protected abstract formatarDados(): void;

  protected deveEnviarEmail(): boolean {
    return false;
  }

  protected enviarEmail(): void {
    console.log("Enviando e-mail");
  }
}
```

O método `deveEnviarEmail()` é um hook.

A subclasse pode sobrescrever se quiser.

---

## 16. Diferença entre Template Method e Strategy

| Template Method | Strategy |
|---|---|
| Usa herança | Usa composição |
| Classe pai define o esqueleto do algoritmo | Classe principal delega para uma estratégia |
| Subclasses implementam passos | Estratégias implementam algoritmos completos ou partes variáveis |
| Troca de comportamento depende da subclasse | Troca de comportamento pode ocorrer em tempo de execução |
| Relacionado à Inversão de Controle | Relacionado à parametrização de algoritmos |

Exemplo de Template Method:

```text
Funcionario define calcularSalarioLiquido().
FuncionarioCLT implementa descontos.
FuncionarioPublico implementa descontos.
```

Exemplo de Strategy:

```text
MyList recebe QuickSortStrategy ou MergeSortStrategy.
```

---

## 17. Diferença entre Template Method e Factory Method

O nome pode confundir.

Template Method define o esqueleto de um algoritmo.

Factory Method cria objetos por meio de um método de fábrica.

| Template Method | Factory Method |
|---|---|
| Foco no fluxo de um algoritmo | Foco na criação de objetos |
| Define passos gerais e deixa detalhes para subclasses | Deixa a criação de objetos para subclasses ou métodos específicos |
| Exemplo: cálculo de salário | Exemplo: criar canal TCP ou UDP |

---

## 18. Relação com Aberto/Fechado

Template Method pode favorecer o Princípio Aberto/Fechado.

A classe abstrata define o algoritmo principal.

Para criar uma nova variação, criamos uma nova subclasse.

Exemplo:

```ts
class FuncionarioTemporario extends Funcionario {
  protected calcularDescontoPrevidencia(): number {
    return this.salario * 0.05;
  }

  protected calcularDescontoPlanoSaude(): number {
    return 0;
  }

  protected calcularOutrosDescontos(): number {
    return 30;
  }
}
```

A classe `Funcionario` não precisa ser modificada.

---

## 19. Relação com Responsabilidade Única

Template Method também ajuda a evitar duplicação e organizar responsabilidades.

A classe base cuida do fluxo comum.

As subclasses cuidam apenas das regras específicas.

Isso mantém o algoritmo principal em um único lugar.

---

## 20. Quando usar Template Method

Use Template Method quando:

```text
várias classes possuem algoritmos com a mesma estrutura geral;
alguns passos mudam conforme a subclasse;
você quer evitar duplicação de código;
você quer controlar a ordem dos passos na classe base;
subclasses devem customizar partes do processo.
```

Exemplos comuns:

```text
cálculo de salário;
processamento de arquivos;
geração de relatórios;
execução de testes;
fluxos de importação de dados;
frameworks.
```

---

## 21. Quando não usar Template Method

Evite Template Method quando:

```text
o algoritmo não tem estrutura comum;
as variações são muitas e muito diferentes;
a herança deixaria o sistema rígido;
você precisa trocar o comportamento em tempo de execução;
a composição seria mais flexível.
```

Nesse caso, Strategy pode ser uma opção melhor.

---

## 22. Como identificar Template Method em uma prova

Procure por situações como:

```text
existe um algoritmo com passos fixos;
alguns passos variam nas subclasses;
há uma classe abstrata;
há métodos abstratos chamados por um método concreto;
a classe pai controla o fluxo principal.
```

Palavras-chave:

```text
esqueleto de algoritmo;
workflow principal;
classe abstrata;
subclasses refinam passos;
inversão de controle;
template;
método modelo.
```

---

## 23. Possível pergunta de prova

### Pergunta

Explique o padrão Template Method usando o exemplo da folha de pagamento.

### Resposta sugerida

O Template Method define o esqueleto de um algoritmo em uma classe abstrata e deixa alguns passos para serem implementados pelas subclasses. No exemplo da folha de pagamento, a classe abstrata `Funcionario` define o método `calcularSalarioLiquido()`, que chama os passos de cálculo dos descontos de previdência, plano de saúde e outros descontos. Esses passos são implementados de forma diferente por subclasses como `FuncionarioCLT` e `FuncionarioPublico`. Assim, o fluxo principal fica fixo na classe pai, mas os detalhes variam nas subclasses.

---

## 24. Outra possível pergunta de prova

### Pergunta

Por que Template Method se relaciona com Inversão de Controle?

### Resposta sugerida

Template Method se relaciona com Inversão de Controle porque a classe base controla o fluxo principal do algoritmo e chama métodos implementados pelas subclasses. Ou seja, a subclasse não controla diretamente a ordem da execução; ela apenas fornece partes do comportamento. A classe pai decide quando esses métodos serão chamados, de forma semelhante ao que acontece em frameworks.

---

## 25. Resumo final

Template Method é:

```text
Um padrão que define o esqueleto de um algoritmo em uma classe abstrata e deixa alguns passos para subclasses.
```

Estrutura:

```text
Classe abstrata -> templateMethod() -> métodos abstratos implementados pelas subclasses
```

No exemplo da apresentação:

```text
Funcionario -> calcularSalarioLiquido()
FuncionarioCLT -> implementa descontos
FuncionarioPublico -> implementa descontos
```

Serve para:

```text
evitar duplicação;
fixar o fluxo principal;
permitir variações em passos específicos;
implementar Inversão de Controle.
```

Vantagens:

```text
reaproveita código comum;
mantém o algoritmo principal em um lugar;
permite extensão por subclasses;
favorece organização do fluxo.
```

Cuidado:

```text
usa herança e pode tornar o projeto rígido se houver muitas variações.
```

Frase para memorizar:

> Template Method fixa a estrutura geral de um algoritmo na classe pai e deixa as subclasses implementarem os detalhes variáveis.
