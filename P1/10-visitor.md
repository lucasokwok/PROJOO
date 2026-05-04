# 10 - Visitor

## 1. Ideia principal

O **Visitor** é um padrão de projeto usado quando queremos adicionar novas operações a uma família de classes sem colocar essas operações diretamente dentro dessas classes.

A ideia central é:

> Visitor permite adicionar uma operação genérica em uma hierarquia de classes sem modificar diretamente as classes dessa hierarquia.

Ele separa os dados das operações.

As classes visitadas representam os elementos.

Os Visitors representam operações feitas sobre esses elementos.

---

## 2. Problema que o Visitor resolve

Na apresentação, o exemplo usado é uma hierarquia de veículos.

```text
Veiculo
  Carro
  Onibus
  Motocicleta
```

E existe uma lista polimórfica:

```ts
const veiculos: Veiculo[] = [
  new Carro(),
  new Onibus(),
  new Motocicleta()
];
```

Essa lista é chamada de polimórfica porque guarda objetos de diferentes subclasses usando o tipo da superclasse ou interface `Veiculo`.

---

## 3. Operações sobre a hierarquia

Imagine que precisamos realizar várias operações sobre os veículos:

```text
imprimir dados dos veículos;
salvar dados em disco;
enviar mensagem aos donos;
calcular imposto;
exportar para JSON;
gerar relatório.
```

Uma solução simples seria colocar todos esses métodos dentro das próprias classes.

Exemplo ruim:

```ts
class Carro {
  public imprimir(): void {}
  public salvarEmDisco(): void {}
  public enviarMensagemDono(): void {}
  public calcularImposto(): number {
    return 0;
  }
}

class Onibus {
  public imprimir(): void {}
  public salvarEmDisco(): void {}
  public enviarMensagemDono(): void {}
  public calcularImposto(): number {
    return 0;
  }
}
```

O problema é que as classes da hierarquia começam a crescer muito.

Além disso, sempre que uma nova operação surgir, todas as classes precisarão ser alteradas.

---

## 4. Problema com o Princípio Aberto/Fechado

Queremos seguir o **Princípio Aberto/Fechado**:

```text
Classes devem estar abertas para extensão, mas fechadas para modificação.
```

No caso do Visitor, queremos manter `Veiculo`, `Carro`, `Onibus` e `Motocicleta` fechados para mudanças.

Mas queremos permitir novas operações, como:

```text
PrintVisitor
SaveVisitor
MailVisitor
TaxVisitor
```

Ou seja, queremos adicionar operações sem modificar as classes dos veículos.

---

## 5. Solução com Visitor

A solução é criar uma interface `Visitor`.

Essa interface declara um método `visit` para cada tipo concreto da hierarquia.

```ts
interface VeiculoVisitor {
  visitCarro(carro: Carro): void;
  visitOnibus(onibus: Onibus): void;
  visitMotocicleta(motocicleta: Motocicleta): void;
}
```

Cada classe da hierarquia implementa um método `accept`.

```ts
interface Veiculo {
  accept(visitor: VeiculoVisitor): void;
}
```

Exemplo:

```ts
class Carro implements Veiculo {
  public accept(visitor: VeiculoVisitor): void {
    visitor.visitCarro(this);
  }
}
```

A classe `Carro` aceita um Visitor e chama o método correspondente.

---

## 6. Estrutura do padrão Visitor

```text
+----------------------+
|       Visitor        |
+----------------------+
| + visitA(a: A)       |
| + visitB(b: B)       |
| + visitC(c: C)       |
+----------------------+
           ^
           |
+----------------------+
|   ConcreteVisitor    |
+----------------------+
| + visitA(a: A)       |
| + visitB(b: B)       |
| + visitC(c: C)       |
+----------------------+


+----------------------+
|       Element        |
+----------------------+
| + accept(visitor)    |
+----------------------+
           ^
           |
+----------------------+
|    ConcreteElement   |
+----------------------+
| + accept(visitor)    |
+----------------------+
```

No exemplo da apresentação:

```text
Element = Veiculo
ConcreteElement = Carro, Onibus, Motocicleta
Visitor = VeiculoVisitor
ConcreteVisitor = PrintVisitor, SaveVisitor, MailVisitor
```

---

## 7. Código completo em TypeScript

```ts
interface Veiculo {
  accept(visitor: VeiculoVisitor): void;
}

class Carro implements Veiculo {
  constructor(
    public modelo: string,
    public dono: string
  ) {}

  public accept(visitor: VeiculoVisitor): void {
    visitor.visitCarro(this);
  }
}

class Onibus implements Veiculo {
  constructor(
    public linha: string,
    public capacidade: number
  ) {}

  public accept(visitor: VeiculoVisitor): void {
    visitor.visitOnibus(this);
  }
}

class Motocicleta implements Veiculo {
  constructor(
    public modelo: string,
    public cilindradas: number
  ) {}

  public accept(visitor: VeiculoVisitor): void {
    visitor.visitMotocicleta(this);
  }
}

interface VeiculoVisitor {
  visitCarro(carro: Carro): void;
  visitOnibus(onibus: Onibus): void;
  visitMotocicleta(motocicleta: Motocicleta): void;
}

class PrintVisitor implements VeiculoVisitor {
  public visitCarro(carro: Carro): void {
    console.log(`Carro: ${carro.modelo}, dono: ${carro.dono}`);
  }

  public visitOnibus(onibus: Onibus): void {
    console.log(`Ônibus linha ${onibus.linha}, capacidade: ${onibus.capacidade}`);
  }

  public visitMotocicleta(motocicleta: Motocicleta): void {
    console.log(`Moto: ${motocicleta.modelo}, ${motocicleta.cilindradas}cc`);
  }
}

const veiculos: Veiculo[] = [
  new Carro("Civic", "João"),
  new Onibus("Linha 302", 45),
  new Motocicleta("CG 160", 160)
];

const printVisitor = new PrintVisitor();

for (const veiculo of veiculos) {
  veiculo.accept(printVisitor);
}
```

---

## 8. O que acontece nesse código?

A lista é declarada como:

```ts
const veiculos: Veiculo[] = [
  new Carro("Civic", "João"),
  new Onibus("Linha 302", 45),
  new Motocicleta("CG 160", 160)
];
```

Apesar de a lista ser do tipo `Veiculo[]`, cada objeto possui um tipo concreto em tempo de execução.

Quando chamamos:

```ts
veiculo.accept(printVisitor);
```

cada classe concreta executa seu próprio `accept`.

Exemplo em `Carro`:

```ts
public accept(visitor: VeiculoVisitor): void {
  visitor.visitCarro(this);
}
```

O `this` dentro de `Carro` é conhecido como `Carro`.

Por isso, o método correto do Visitor é chamado:

```ts
visitCarro(carro)
```

---

## 9. Por que não chamar diretamente `visitor.visit(veiculo)`?

A apresentação explica que, em Java e linguagens similares, o compilador não conhece o tipo dinâmico do parâmetro `veiculo` no momento de escolher qual método sobrecarregado chamar.

Imagine uma interface com métodos sobrecarregados:

```ts
interface Visitor {
  visit(carro: Carro): void;
  visit(onibus: Onibus): void;
  visit(motocicleta: Motocicleta): void;
}
```

Se temos:

```ts
const veiculo: Veiculo = new Carro();
visitor.visit(veiculo);
```

O tipo estático da variável é `Veiculo`, não `Carro`.

Então o compilador não consegue escolher corretamente entre:

```text
visit(Carro)
visit(Onibus)
visit(Motocicleta)
```

O Visitor resolve isso usando o método `accept`.

---

## 10. Double dispatch

A apresentação diz que o Visitor simula **multiple dispatching** em linguagens que oferecem apenas **single dispatching**.

Para entender de forma simples:

### Single dispatch

Em linguagens como Java, TypeScript e C#, normalmente a escolha do método depende do objeto que recebe a chamada.

Exemplo:

```ts
veiculo.accept(visitor);
```

O método `accept` chamado depende do tipo real de `veiculo`.

Se for `Carro`, chama `Carro.accept`.

Se for `Onibus`, chama `Onibus.accept`.

### Double dispatch

No Visitor, a escolha acontece em dois passos:

```text
1. chama accept() do objeto concreto;
2. dentro de accept(), chama o visit específico do Visitor.
```

Exemplo:

```ts
veiculo.accept(visitor);
```

Se `veiculo` for um `Carro`, executa:

```ts
visitor.visitCarro(this);
```

Assim, a operação final depende de dois elementos:

```text
tipo concreto do veículo;
tipo concreto do visitor.
```

---

## 11. Exemplo com outro Visitor

A vantagem do Visitor é adicionar uma nova operação criando uma nova classe Visitor.

Exemplo: calcular imposto.

```ts
class TaxVisitor implements VeiculoVisitor {
  public visitCarro(carro: Carro): void {
    console.log(`Imposto do carro ${carro.modelo}: R$ 1000`);
  }

  public visitOnibus(onibus: Onibus): void {
    console.log(`Imposto do ônibus ${onibus.linha}: R$ 3000`);
  }

  public visitMotocicleta(motocicleta: Motocicleta): void {
    console.log(`Imposto da moto ${motocicleta.modelo}: R$ 500`);
  }
}
```

Uso:

```ts
const taxVisitor = new TaxVisitor();

for (const veiculo of veiculos) {
  veiculo.accept(taxVisitor);
}
```

As classes `Carro`, `Onibus` e `Motocicleta` não foram alteradas para adicionar a operação de imposto.

---

## 12. Exemplo com exportação

```ts
class JsonExportVisitor implements VeiculoVisitor {
  public visitCarro(carro: Carro): void {
    console.log(JSON.stringify({
      tipo: "carro",
      modelo: carro.modelo,
      dono: carro.dono
    }));
  }

  public visitOnibus(onibus: Onibus): void {
    console.log(JSON.stringify({
      tipo: "onibus",
      linha: onibus.linha,
      capacidade: onibus.capacidade
    }));
  }

  public visitMotocicleta(motocicleta: Motocicleta): void {
    console.log(JSON.stringify({
      tipo: "motocicleta",
      modelo: motocicleta.modelo,
      cilindradas: motocicleta.cilindradas
    }));
  }
}
```

Uso:

```ts
const exportVisitor = new JsonExportVisitor();

for (const veiculo of veiculos) {
  veiculo.accept(exportVisitor);
}
```

---

## 13. Vantagem principal do Visitor

A principal vantagem é:

> Facilitar a adição de novas operações em uma hierarquia de classes.

Exemplo:

```text
PrintVisitor
TaxVisitor
JsonExportVisitor
MailVisitor
SaveVisitor
```

Cada Visitor representa uma nova operação.

As classes da hierarquia não precisam receber novos métodos para cada operação.

---

## 14. Desvantagem principal do Visitor

A apresentação destaca uma desvantagem importante:

> Adicionar uma nova classe na hierarquia obriga todos os Visitors a serem atualizados.

Exemplo:

```text
Carro
Onibus
Motocicleta
Caminhao
```

Se adicionarmos `Caminhao`, a interface `VeiculoVisitor` precisará mudar:

```ts
interface VeiculoVisitor {
  visitCarro(carro: Carro): void;
  visitOnibus(onibus: Onibus): void;
  visitMotocicleta(motocicleta: Motocicleta): void;
  visitCaminhao(caminhao: Caminhao): void;
}
```

E todos os Visitors existentes precisarão implementar:

```ts
visitCaminhao(caminhao: Caminhao): void;
```

Isso pode gerar muito retrabalho.

---

## 15. Visitor pode quebrar encapsulamento

Outra desvantagem destacada na apresentação é que Visitors podem quebrar encapsulamento.

Isso acontece porque o Visitor precisa acessar dados internos dos objetos visitados.

Exemplo:

```ts
class Carro {
  constructor(
    public modelo: string,
    public dono: string
  ) {}
}
```

Os atributos foram deixados públicos para que o Visitor consiga acessá-los.

Em projetos reais, talvez fosse necessário criar getters.

Mesmo assim, a classe pode acabar expondo mais informações do que deveria.

---

## 16. Relação com Aberto/Fechado

Visitor favorece o Princípio Aberto/Fechado em um sentido específico:

```text
facilita adicionar novas operações sem modificar as classes da hierarquia.
```

Por exemplo, posso criar `TaxVisitor` sem alterar `Carro`, `Onibus` e `Motocicleta`.

Mas ele não favorece tão bem a adição de novos tipos de elementos.

Se adicionarmos `Caminhao`, todos os Visitors precisam mudar.

Portanto:

```text
Visitor é bom quando a hierarquia de classes é estável, mas as operações mudam bastante.
```

---

## 17. Quando Visitor vale a pena?

Visitor vale a pena quando:

```text
a hierarquia de classes muda pouco;
novas operações são adicionadas com frequência;
não queremos encher as classes da hierarquia com muitos métodos;
queremos separar operações dos objetos visitados.
```

Exemplo:

```text
Veiculo raramente ganha novos tipos;
mas sempre surgem novas operações sobre veículos.
```

Nesse caso, Visitor pode ser adequado.

---

## 18. Quando Visitor não vale a pena?

Evite Visitor quando:

```text
novas classes concretas são adicionadas com frequência;
a hierarquia ainda está instável;
os Visitors precisariam acessar muitos detalhes internos;
a solução ficaria complexa demais.
```

Se a cada semana surgir um novo tipo de veículo, Visitor pode ser ruim, porque todos os Visitors precisarão ser alterados.

---

## 19. Relação com polimorfismo

Visitor depende bastante de polimorfismo.

A lista da apresentação é polimórfica:

```ts
const veiculos: Veiculo[] = [
  new Carro("Civic", "João"),
  new Onibus("Linha 302", 45),
  new Motocicleta("CG 160", 160)
];
```

O código percorre todos como `Veiculo`.

Mas cada objeto executa seu próprio `accept`.

Isso é polimorfismo.

---

## 20. Diferença entre Visitor e Strategy

| Visitor | Strategy |
|---|---|
| Adiciona operações a uma hierarquia de classes | Varia um algoritmo usado por uma classe |
| Trabalha com vários tipos de elementos | Trabalha com uma família de algoritmos |
| Usa `accept(visitor)` e `visit(...)` | Usa uma interface de estratégia |
| Bom para operações sobre objetos diferentes | Bom para trocar comportamento/algoritmo |

Exemplo de Visitor:

```text
PrintVisitor visita Carro, Onibus e Motocicleta.
```

Exemplo de Strategy:

```text
MyList usa QuickSortStrategy ou MergeSortStrategy.
```

---

## 21. Diferença entre Visitor e Template Method

| Visitor | Template Method |
|---|---|
| Adiciona operações externas a uma hierarquia | Define o esqueleto de um algoritmo em uma classe base |
| Usa objetos visitantes | Usa herança com classe abstrata |
| Bom quando operações variam | Bom quando o fluxo principal é fixo |
| Pode ter muitos métodos visit | Tem método template e passos abstratos |

---

## 22. Como identificar Visitor em uma prova

Procure por situações como:

```text
existe uma hierarquia de classes;
há uma lista polimórfica;
querem adicionar várias operações sobre os objetos;
não querem modificar as classes da hierarquia;
aparece accept(visitor);
aparece visit(ClasseConcreta).
```

Palavras-chave:

```text
Visitor
visit
accept
lista polimórfica
double dispatch
adicionar operações
hierarquia estável
```

---

## 23. Possível pergunta de prova

### Pergunta

Explique o padrão Visitor usando o exemplo dos veículos.

### Resposta sugerida

O Visitor permite adicionar novas operações a uma hierarquia de classes sem inserir essas operações diretamente nas classes da hierarquia. No exemplo dos veículos, temos classes como `Carro`, `Onibus` e `Motocicleta`, todas implementando `Veiculo`. Cada uma possui um método `accept(visitor)`, que chama o método correspondente no Visitor, como `visitCarro(this)`. Assim, operações como imprimir, salvar ou calcular imposto podem ser implementadas em classes Visitor diferentes, sem alterar diretamente as classes dos veículos.

---

## 24. Outra possível pergunta de prova

### Pergunta

Quais são as vantagens e desvantagens do Visitor?

### Resposta sugerida

A principal vantagem do Visitor é facilitar a adição de novas operações a uma hierarquia de classes. Basta criar um novo Visitor, como `PrintVisitor` ou `TaxVisitor`, sem modificar as classes visitadas. A principal desvantagem é que, se uma nova classe for adicionada à hierarquia, como `Caminhao`, todos os Visitors precisarão ser atualizados com um novo método `visitCaminhao`. Além disso, Visitor pode quebrar encapsulamento, pois os objetos visitados podem precisar expor dados internos para que o Visitor realize sua operação.

---

## 25. Outra possível pergunta de prova

### Pergunta

Por que a lista de veículos é chamada de polimórfica?

### Resposta sugerida

A lista é chamada de polimórfica porque é declarada com o tipo geral `Veiculo`, mas armazena objetos de diferentes subclasses, como `Carro`, `Onibus` e `Motocicleta`. Mesmo sendo tratados como `Veiculo`, cada objeto mantém seu tipo concreto em tempo de execução e pode executar seu próprio comportamento, como o método `accept`.

---

## 26. Resumo final

Visitor é:

```text
Um padrão que permite adicionar operações a uma hierarquia de classes sem modificar diretamente essas classes.
```

Estrutura:

```text
Element -> accept(visitor)
Visitor -> visit(ConcreteElement)
```

No exemplo da apresentação:

```text
Veiculo -> Carro, Onibus, Motocicleta
Visitor -> PrintVisitor, TaxVisitor, SaveVisitor
```

Serve para:

```text
adicionar novas operações;
separar operações dos dados;
trabalhar com listas polimórficas;
evitar encher as classes da hierarquia com muitos métodos.
```

Vantagens:

```text
facilita adicionar novas operações;
organiza operações em classes separadas;
mantém a hierarquia mais limpa quando as operações mudam muito.
```

Desvantagens:

```text
dificulta adicionar novos tipos de elementos;
pode exigir alteração em todos os Visitors;
pode quebrar encapsulamento.
```

Frase para memorizar:

> Visitor é bom quando a hierarquia de classes é estável, mas as operações sobre ela mudam com frequência.
