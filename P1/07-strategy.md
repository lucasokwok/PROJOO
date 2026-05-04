# 07 - Strategy

## 1. Ideia principal

O **Strategy** é um padrão de projeto usado quando uma classe precisa variar um **algoritmo** ou **comportamento**, sem que a própria classe precise ser modificada.

A ideia central é:

> Strategy permite parametrizar uma classe com diferentes algoritmos, deixando-a aberta para extensão e fechada para modificação.

Em vez de colocar vários algoritmos dentro da mesma classe usando `if`, `else` ou `switch`, criamos uma interface comum para as estratégias e implementamos cada algoritmo em uma classe separada.

---

## 2. Problema que o Strategy resolve

Na apresentação, o exemplo usado é uma biblioteca de estruturas de dados com uma classe `MyList`.

Essa classe possui um algoritmo de ordenação.

O problema aparece quando queremos permitir diferentes algoritmos de ordenação, como:

```text
ShellSort
HeapSort
QuickSort
MergeSort
InsertionSort
```

Se a classe `MyList` tiver o algoritmo fixo dentro dela, toda vez que quisermos trocar ou adicionar um algoritmo, teremos que modificar a própria classe.

Exemplo ruim:

```ts
class MyList {
  private items: number[] = [];

  public add(item: number): void {
    this.items.push(item);
  }

  public sort(type: string): void {
    if (type === "quick") {
      console.log("Ordenando com QuickSort");
    } else if (type === "merge") {
      console.log("Ordenando com MergeSort");
    } else if (type === "heap") {
      console.log("Ordenando com HeapSort");
    }
  }
}
```

Esse código funciona, mas tem um problema de projeto.

Sempre que surgir um novo algoritmo, será necessário alterar o método `sort`.

Exemplo:

```ts
else if (type === "shell") {
  console.log("Ordenando com ShellSort");
}
```

Isso viola o **Princípio Aberto/Fechado**, porque a classe `MyList` não está fechada para modificação.

---

## 3. Solução com Strategy

A solução é separar os algoritmos em classes próprias.

Primeiro, criamos uma interface comum:

```ts
interface SortStrategy {
  sort(items: number[]): number[];
}
```

Depois, cada algoritmo implementa essa interface:

```ts
class QuickSortStrategy implements SortStrategy {
  public sort(items: number[]): number[] {
    console.log("Ordenando com QuickSort");
    return [...items].sort((a, b) => a - b);
  }
}

class MergeSortStrategy implements SortStrategy {
  public sort(items: number[]): number[] {
    console.log("Ordenando com MergeSort");
    return [...items].sort((a, b) => a - b);
  }
}
```

A classe `MyList` passa a receber uma estratégia:

```ts
class MyList {
  private items: number[] = [];

  constructor(private sortStrategy: SortStrategy) {}

  public add(item: number): void {
    this.items.push(item);
  }

  public sort(): void {
    this.items = this.sortStrategy.sort(this.items);
  }

  public getItems(): number[] {
    return this.items;
  }
}
```

Uso:

```ts
const list = new MyList(new QuickSortStrategy());

list.add(3);
list.add(1);
list.add(2);

list.sort();

console.log(list.getItems());
```

Agora `MyList` não precisa saber qual algoritmo está sendo usado.

Ela apenas delega a ordenação para a estratégia.

---

## 4. Exemplo da apresentação

A apresentação diz que o objetivo do Strategy é:

```text
parametrizar os algoritmos usados por uma classe;
tornar uma classe aberta a novos algoritmos.
```

No exemplo da aula:

```text
MyList = classe principal
SortStrategy = abstração para algoritmo de ordenação
ShellSort, HeapSort etc. = estratégias concretas
```

A classe `MyList` deixa de implementar diretamente um algoritmo fixo e passa a usar uma estratégia.

---

## 5. Estrutura do padrão Strategy

```text
+------------------+
|     Context      |
+------------------+
| - strategy       |
+------------------+
| + operation()    |
+------------------+
          |
          v
+------------------+
|     Strategy     | <<interface>>
+------------------+
| + algorithm()    |
+------------------+
          ^
          |
+-------------------------+
| ConcreteStrategyA       |
+-------------------------+
| + algorithm()           |
+-------------------------+

+-------------------------+
| ConcreteStrategyB       |
+-------------------------+
| + algorithm()           |
+-------------------------+
```

Aplicando ao exemplo da apresentação:

```text
Context = MyList
Strategy = SortStrategy
ConcreteStrategyA = QuickSortStrategy
ConcreteStrategyB = MergeSortStrategy
ConcreteStrategyC = HeapSortStrategy
```

---

## 6. Código completo em TypeScript

```ts
interface SortStrategy {
  sort(items: number[]): number[];
}

class QuickSortStrategy implements SortStrategy {
  public sort(items: number[]): number[] {
    console.log("Ordenando com QuickSort");
    return [...items].sort((a, b) => a - b);
  }
}

class MergeSortStrategy implements SortStrategy {
  public sort(items: number[]): number[] {
    console.log("Ordenando com MergeSort");
    return [...items].sort((a, b) => a - b);
  }
}

class HeapSortStrategy implements SortStrategy {
  public sort(items: number[]): number[] {
    console.log("Ordenando com HeapSort");
    return [...items].sort((a, b) => a - b);
  }
}

class MyList {
  private items: number[] = [];

  constructor(private sortStrategy: SortStrategy) {}

  public setSortStrategy(sortStrategy: SortStrategy): void {
    this.sortStrategy = sortStrategy;
  }

  public add(item: number): void {
    this.items.push(item);
  }

  public sort(): void {
    this.items = this.sortStrategy.sort(this.items);
  }

  public getItems(): number[] {
    return this.items;
  }
}

const list = new MyList(new QuickSortStrategy());

list.add(30);
list.add(10);
list.add(20);

list.sort();
console.log(list.getItems());

list.setSortStrategy(new MergeSortStrategy());

list.add(5);
list.sort();
console.log(list.getItems());
```

---

## 7. O que acontece nesse código?

A classe `MyList` não conhece os detalhes de `QuickSort`, `MergeSort` ou `HeapSort`.

Ela conhece apenas a interface:

```ts
interface SortStrategy {
  sort(items: number[]): number[];
}
```

Quando o método `sort()` de `MyList` é chamado, ela delega a execução:

```ts
this.items = this.sortStrategy.sort(this.items);
```

Isso significa que o algoritmo usado depende do objeto de estratégia recebido.

A estratégia pode ser trocada no construtor:

```ts
const list = new MyList(new QuickSortStrategy());
```

ou em tempo de execução:

```ts
list.setSortStrategy(new MergeSortStrategy());
```

---

## 8. Por que Strategy evita muitos `if`?

Sem Strategy, a classe principal costuma ter muitos testes condicionais:

```ts
if (type === "quick") {
  // QuickSort
} else if (type === "merge") {
  // MergeSort
} else if (type === "heap") {
  // HeapSort
}
```

Com Strategy, cada variação vira uma classe:

```text
QuickSortStrategy
MergeSortStrategy
HeapSortStrategy
```

A classe principal não precisa ficar perguntando qual algoritmo deve usar.

Ela apenas chama:

```ts
this.sortStrategy.sort(this.items);
```

Isso deixa o código mais extensível.

---

## 9. Relação com o Princípio Aberto/Fechado

Strategy é um dos padrões mais importantes para entender o **Princípio Aberto/Fechado**.

O princípio diz que uma classe deve estar:

```text
aberta para extensão;
fechada para modificação.
```

Com Strategy, a classe `MyList` fica fechada para modificação.

Se surgir um novo algoritmo, não alteramos `MyList`.

Criamos uma nova estratégia:

```ts
class ShellSortStrategy implements SortStrategy {
  public sort(items: number[]): number[] {
    console.log("Ordenando com ShellSort");
    return [...items].sort((a, b) => a - b);
  }
}
```

Uso:

```ts
const list = new MyList(new ShellSortStrategy());
```

A classe `MyList` continua igual.

Resposta de prova:

> Strategy favorece o Princípio Aberto/Fechado porque permite adicionar novos algoritmos criando novas classes de estratégia, sem modificar a classe que usa esses algoritmos.

---

## 10. Relação com Inversão de Dependência

Strategy também se relaciona com a **Inversão de Dependência**.

A classe principal não depende de uma classe concreta como `QuickSortStrategy`.

Ela depende da abstração:

```ts
interface SortStrategy {
  sort(items: number[]): number[];
}
```

Exemplo:

```ts
class MyList {
  constructor(private sortStrategy: SortStrategy) {}
}
```

`MyList` depende de `SortStrategy`, não de `QuickSortStrategy`, `MergeSortStrategy` ou `HeapSortStrategy`.

Isso reduz o acoplamento.

Resposta de prova:

> Strategy favorece a Inversão de Dependência porque a classe principal depende de uma abstração que representa o algoritmo, e não de uma implementação concreta.

---

## 11. Relação com Responsabilidade Única

Strategy também melhora a separação de responsabilidades.

Sem Strategy, `MyList` teria duas responsabilidades:

```text
armazenar/manipular lista;
implementar algoritmos de ordenação.
```

Com Strategy:

```text
MyList cuida da lista;
SortStrategy cuida da ordenação.
```

Cada algoritmo fica em sua própria classe.

---

## 12. Exemplo alternativo: cálculo de frete

Esse exemplo ajuda muito em prova, porque mostra claramente o problema dos `if`.

Código ruim:

```ts
class CalculadoraFrete {
  public calcular(tipo: string, peso: number): number {
    if (tipo === "sedex") {
      return peso * 10;
    }

    if (tipo === "pac") {
      return peso * 5;
    }

    if (tipo === "transportadora") {
      return peso * 8;
    }

    throw new Error("Tipo de frete inválido");
  }
}
```

Problema:

```text
Sempre que surgir um novo tipo de frete, a classe CalculadoraFrete precisa ser alterada.
```

Refatoração com Strategy:

```ts
interface FreteStrategy {
  calcular(peso: number): number;
}

class SedexStrategy implements FreteStrategy {
  public calcular(peso: number): number {
    return peso * 10;
  }
}

class PacStrategy implements FreteStrategy {
  public calcular(peso: number): number {
    return peso * 5;
  }
}

class TransportadoraStrategy implements FreteStrategy {
  public calcular(peso: number): number {
    return peso * 8;
  }
}

class CalculadoraFrete {
  constructor(private strategy: FreteStrategy) {}

  public calcular(peso: number): number {
    return this.strategy.calcular(peso);
  }
}

const calculadora = new CalculadoraFrete(new SedexStrategy());

console.log(calculadora.calcular(3));
```

Agora, para criar um novo frete, basta criar uma nova estratégia.

---

## 13. Strategy e refatoração de código que viola Aberto/Fechado

Se a prova der um código com vários `if` ou `switch` escolhendo comportamento, provavelmente Strategy é uma boa opção.

Exemplo de violação:

```ts
class Relatorio {
  public exportar(formato: string): void {
    if (formato === "pdf") {
      console.log("Exportando PDF");
    } else if (formato === "csv") {
      console.log("Exportando CSV");
    } else if (formato === "xlsx") {
      console.log("Exportando XLSX");
    }
  }
}
```

Problema:

```text
Para adicionar JSON, XML ou HTML, seria preciso modificar a classe Relatorio.
```

Refatoração:

```ts
interface ExportStrategy {
  exportar(): void;
}

class PdfExportStrategy implements ExportStrategy {
  public exportar(): void {
    console.log("Exportando PDF");
  }
}

class CsvExportStrategy implements ExportStrategy {
  public exportar(): void {
    console.log("Exportando CSV");
  }
}

class XlsxExportStrategy implements ExportStrategy {
  public exportar(): void {
    console.log("Exportando XLSX");
  }
}

class Relatorio {
  constructor(private exportStrategy: ExportStrategy) {}

  public exportar(): void {
    this.exportStrategy.exportar();
  }
}
```

Nova extensão:

```ts
class JsonExportStrategy implements ExportStrategy {
  public exportar(): void {
    console.log("Exportando JSON");
  }
}
```

A classe `Relatorio` não precisa ser modificada.

---

## 14. Diferença entre Strategy e Factory

| Strategy | Factory |
|---|---|
| Varia um algoritmo ou comportamento | Centraliza a criação de objetos |
| A classe principal usa uma estratégia | A fábrica cria objetos concretos |
| Foco em comportamento | Foco em instanciação |
| Exemplo: QuickSort, MergeSort, HeapSort | Exemplo: criar TCPChannel ou UDPChannel |

É comum usar Factory junto com Strategy.

Exemplo:

```ts
class FreteStrategyFactory {
  public static create(tipo: string): FreteStrategy {
    if (tipo === "sedex") {
      return new SedexStrategy();
    }

    if (tipo === "pac") {
      return new PacStrategy();
    }

    throw new Error("Tipo inválido");
  }
}
```

A Factory decide qual Strategy criar.

---

## 15. Diferença entre Strategy e Template Method

| Strategy | Template Method |
|---|---|
| Usa composição | Usa herança |
| Algoritmo é trocado por objeto de estratégia | Classe pai define o esqueleto do algoritmo |
| Mais flexível em tempo de execução | Estrutura mais fixa |
| Exemplo: trocar algoritmo de ordenação | Exemplo: cálculo de salário com passos fixos |

No Strategy, posso trocar a estratégia em tempo de execução:

```ts
list.setSortStrategy(new MergeSortStrategy());
```

No Template Method, normalmente o comportamento vem da subclasse escolhida.

---

## 16. Quando usar Strategy

Use Strategy quando:

```text
uma classe possui vários algoritmos possíveis;
há muitos if/switch escolhendo comportamento;
você quer trocar comportamento sem alterar a classe principal;
você quer adicionar novos algoritmos com facilidade;
diferentes objetos usam variações do mesmo comportamento.
```

Exemplos comuns:

```text
algoritmos de ordenação;
formas de pagamento;
cálculo de frete;
cálculo de desconto;
exportação de relatórios;
validação de dados;
algoritmos de compressão;
algoritmos de autenticação.
```

---

## 17. Quando não usar Strategy

Evite Strategy quando:

```text
existe apenas um algoritmo e ele não deve variar;
a variação é pequena demais;
a criação de várias classes deixaria o sistema mais complexo sem necessidade;
não existe expectativa real de mudança.
```

Nesse caso, Strategy pode virar overengineering.

---

## 18. Como identificar Strategy em uma prova

Procure por situações como:

```text
vários algoritmos;
vários comportamentos alternativos;
if/switch escolhendo tipo de cálculo;
classe que precisa ser aberta para novos algoritmos;
desejo de trocar algoritmo em tempo de execução.
```

Palavras-chave:

```text
algoritmo
estratégia
variação de comportamento
parametrizar algoritmo
aberto para novos algoritmos
evitar if/switch
```

---

## 19. Possível pergunta de prova

### Pergunta

Explique o padrão Strategy usando o exemplo da lista que pode usar diferentes algoritmos de ordenação.

### Resposta sugerida

O Strategy permite parametrizar uma classe com diferentes algoritmos. No exemplo da lista, a classe `MyList` não deve implementar diretamente todos os algoritmos de ordenação, como QuickSort, MergeSort ou HeapSort. Em vez disso, criamos uma interface `SortStrategy` e várias estratégias concretas. A classe `MyList` recebe uma `SortStrategy` e delega a ordenação para ela. Assim, novos algoritmos podem ser adicionados criando novas classes de estratégia, sem modificar `MyList`.

---

## 20. Outra possível pergunta de prova

### Pergunta

Por que Strategy ajuda a respeitar o Princípio Aberto/Fechado?

### Resposta sugerida

Strategy ajuda a respeitar o Princípio Aberto/Fechado porque permite adicionar novos comportamentos por extensão, criando novas classes que implementam uma interface de estratégia. A classe principal fica fechada para modificação, pois não precisa ser alterada quando surge um novo algoritmo. Por exemplo, uma lista que depende de `SortStrategy` pode receber `QuickSortStrategy`, `MergeSortStrategy` ou uma nova `ShellSortStrategy` sem alterar seu código interno.

---

## 21. Resumo final

Strategy é:

```text
Um padrão que encapsula algoritmos em classes separadas e permite trocá-los sem modificar a classe principal.
```

Estrutura:

```text
Context -> Strategy -> ConcreteStrategy
```

No exemplo da apresentação:

```text
MyList -> SortStrategy -> QuickSortStrategy, HeapSortStrategy, ShellSortStrategy
```

Serve para:

```text
variar algoritmos;
evitar if/switch;
trocar comportamento em tempo de execução;
adicionar novos algoritmos sem alterar a classe principal.
```

Vantagens:

```text
favorece Aberto/Fechado;
favorece Inversão de Dependência;
melhora Responsabilidade Única;
reduz acoplamento;
facilita testes e manutenção.
```

Frase para memorizar:

> Strategy separa algoritmos em classes próprias e permite que uma classe use diferentes comportamentos sem precisar ser modificada.
