# 08 - Observer

## 1. Ideia principal

O **Observer** é um padrão de projeto usado quando um objeto precisa avisar automaticamente vários outros objetos quando seu estado muda.

A ideia central é:

> Observer define uma relação um-para-muitos entre objetos, em que um sujeito notifica seus observadores quando seu estado é alterado.

Em outras palavras:

```text
Quando o Subject muda, ele notifica todos os Observers.
```

---

## 2. Exemplo da apresentação

Na apresentação, o exemplo usado é uma **estação meteorológica**.

Existem duas ideias principais:

```text
Temperatura
Termômetros
```

A classe `Temperatura` representa o valor da temperatura.

Os termômetros representam diferentes formas de exibir essa temperatura:

```text
termômetro digital;
termômetro analógico;
termômetro web;
termômetro de celular;
outros.
```

Quando a temperatura muda, todos os termômetros precisam ser atualizados.

---

## 3. Problema que o Observer resolve

O problema é que não queremos acoplar a classe `Temperatura` aos tipos concretos de termômetros.

Exemplo ruim:

```ts
class Temperatura {
  private valor = 0;

  private termometroDigital = new TermometroDigital();
  private termometroAnalogico = new TermometroAnalogico();
  private termometroWeb = new TermometroWeb();

  public setValor(valor: number): void {
    this.valor = valor;

    this.termometroDigital.atualizar(valor);
    this.termometroAnalogico.atualizar(valor);
    this.termometroWeb.atualizar(valor);
  }
}
```

Esse código tem problemas:

```text
Temperatura conhece classes concretas de termômetros.
Para adicionar um novo termômetro, é preciso alterar Temperatura.
A classe de dados fica acoplada à interface/visualização.
O código viola o Princípio Aberto/Fechado.
```

Se amanhã surgir um `TermometroCelular`, teremos que alterar a classe `Temperatura`.

Isso é ruim.

---

## 4. Solução com Observer

A solução é fazer a classe `Temperatura` depender apenas de uma interface comum para os observadores.

Exemplo:

```ts
interface Observer {
  update(temperatura: number): void;
}
```

A classe `Temperatura` mantém uma lista de observadores:

```ts
private observers: Observer[] = [];
```

Quando a temperatura muda, ela notifica todos:

```ts
private notifyObservers(): void {
  for (const observer of this.observers) {
    observer.update(this.valor);
  }
}
```

Agora `Temperatura` não precisa saber se o observador é digital, analógico, web ou celular.

Ela só sabe que todos implementam `Observer`.

---

## 5. Estrutura do padrão Observer

```text
+---------------------+
|       Subject       |
+---------------------+
| - observers         |
+---------------------+
| + addObserver()     |
| + removeObserver()  |
| + notifyObservers() |
+---------------------+
           |
           | mantém lista de
           v
+---------------------+
|      Observer       | <<interface>>
+---------------------+
| + update()          |
+---------------------+
           ^
           |
+-------------------------+
|   ConcreteObserver      |
+-------------------------+
| + update()              |
+-------------------------+
```

No exemplo da apresentação:

```text
Subject = Temperatura
Observer = Termometro
ConcreteObserver = TermometroDigital, TermometroAnalogico, TermometroWeb
```

---

## 6. Código completo em TypeScript

```ts
interface Observer {
  update(temperatura: number): void;
}

class Temperatura {
  private valor = 0;
  private observers: Observer[] = [];

  public addObserver(observer: Observer): void {
    this.observers.push(observer);
  }

  public removeObserver(observer: Observer): void {
    this.observers = this.observers.filter(
      (currentObserver) => currentObserver !== observer
    );
  }

  public setValor(valor: number): void {
    this.valor = valor;
    this.notifyObservers();
  }

  public getValor(): number {
    return this.valor;
  }

  private notifyObservers(): void {
    for (const observer of this.observers) {
      observer.update(this.valor);
    }
  }
}

class TermometroDigital implements Observer {
  public update(temperatura: number): void {
    console.log(`Termômetro digital: ${temperatura}°C`);
  }
}

class TermometroAnalogico implements Observer {
  public update(temperatura: number): void {
    console.log(`Termômetro analógico atualizado para ${temperatura}°C`);
  }
}

class TermometroWeb implements Observer {
  public update(temperatura: number): void {
    console.log(`Termômetro web exibindo ${temperatura}°C`);
  }
}

const temperatura = new Temperatura();

const digital = new TermometroDigital();
const analogico = new TermometroAnalogico();
const web = new TermometroWeb();

temperatura.addObserver(digital);
temperatura.addObserver(analogico);
temperatura.addObserver(web);

temperatura.setValor(25);
temperatura.setValor(30);
```

---

## 7. O que acontece nesse código?

Primeiro, criamos o sujeito:

```ts
const temperatura = new Temperatura();
```

Depois, criamos os observadores:

```ts
const digital = new TermometroDigital();
const analogico = new TermometroAnalogico();
const web = new TermometroWeb();
```

Em seguida, registramos os observadores no sujeito:

```ts
temperatura.addObserver(digital);
temperatura.addObserver(analogico);
temperatura.addObserver(web);
```

Quando a temperatura muda:

```ts
temperatura.setValor(25);
```

a classe `Temperatura` chama:

```ts
this.notifyObservers();
```

Esse método percorre todos os observadores e chama:

```ts
observer.update(this.valor);
```

Cada observador reage do seu próprio jeito.

---

## 8. Subject

O **Subject** é o objeto observado.

Ele mantém uma lista de observadores.

No exemplo:

```ts
class Temperatura {
  private observers: Observer[] = [];
}
```

Ele possui métodos para adicionar, remover e notificar observadores:

```ts
addObserver()
removeObserver()
notifyObservers()
```

O Subject não precisa conhecer os tipos concretos dos observadores.

Ele conhece apenas a interface.

---

## 9. Observer

O **Observer** é a interface que define o método de atualização.

Exemplo:

```ts
interface Observer {
  update(temperatura: number): void;
}
```

Todos os observadores concretos devem implementar esse método.

---

## 10. ConcreteObserver

Os **ConcreteObservers** são os objetos que reagem à mudança.

Exemplo:

```ts
class TermometroDigital implements Observer {
  public update(temperatura: number): void {
    console.log(`Termômetro digital: ${temperatura}°C`);
  }
}
```

Cada observador pode reagir de forma diferente.

---

## 11. Diagrama para desenhar na prova

Se a prova pedir para desenhar o diagrama do Observer, use esta estrutura:

```text
+-----------------------------+
|          Subject            |
+-----------------------------+
| - observers: Observer[]     |
+-----------------------------+
| + addObserver(o: Observer)  |
| + removeObserver(o: Observer)|
| + notifyObservers()         |
+-----------------------------+
              |
              | 0..*
              v
+-----------------------------+
|          Observer           | <<interface>>
+-----------------------------+
| + update()                  |
+-----------------------------+
              ^
              |
+-----------------------------+
|      ConcreteObserver       |
+-----------------------------+
| + update()                  |
+-----------------------------+
```

Adaptando ao exemplo da aula:

```text
+-----------------------------+
|        Temperatura          |
+-----------------------------+
| - valor: number             |
| - observers: Observer[]     |
+-----------------------------+
| + addObserver()             |
| + removeObserver()          |
| + setValor()                |
| - notifyObservers()         |
+-----------------------------+
              |
              | mantém lista
              v
+-----------------------------+
|          Observer           |
+-----------------------------+
| + update(temperatura)       |
+-----------------------------+
              ^
              |
+-----------------------------+
|     TermometroDigital       |
+-----------------------------+
| + update(temperatura)       |
+-----------------------------+

+-----------------------------+
|    TermometroAnalogico      |
+-----------------------------+
| + update(temperatura)       |
+-----------------------------+
```

---

## 12. Como explicar o diagrama

Resposta de prova:

> No Observer, o Subject mantém uma lista de Observers. Os Observers implementam uma interface comum com o método `update()`. Quando o estado do Subject muda, ele chama `notifyObservers()`, que percorre a lista e chama `update()` em cada observador. O Subject não conhece as classes concretas dos observadores, apenas a interface.

---

## 13. Relação um-para-muitos

O Observer representa uma relação:

```text
um Subject -> muitos Observers
```

No exemplo:

```text
uma Temperatura -> vários Termômetros
```

Quando a temperatura muda, todos os termômetros cadastrados são atualizados.

Essa relação é útil quando vários objetos dependem do estado de um único objeto.

---

## 14. Relação com MVC

A apresentação destaca que um motivo para usar Observer é tornar a classe de dados independente das classes de visão.

Isso aparece muito na ideia de separação entre modelo e interface.

Exemplo:

```text
Modelo = Temperatura
Visões = TermometroDigital, TermometroWeb, TermometroCelular
```

A classe `Temperatura` representa o dado.

Os termômetros representam diferentes visualizações.

O modelo não deve depender diretamente das visões concretas.

Com Observer, novas visões podem ser adicionadas sem alterar o modelo.

---

## 15. Outro exemplo da apresentação: planilhas

A apresentação também cita o exemplo de planilhas.

Quando o valor de uma célula muda, outras células que dependem dela são atualizadas automaticamente.

Exemplo:

```text
Célula A1 = 10
Célula B1 = A1 * 2
```

Se A1 mudar para 20, B1 precisa ser recalculada.

Nesse caso:

```text
Subject = célula observada
Observer = células dependentes
```

Quando o valor da célula observada muda, as células dependentes são notificadas.

---

## 16. Exemplo com planilha em TypeScript

```ts
interface CellObserver {
  update(): void;
}

class Cell {
  private value = 0;
  private observers: CellObserver[] = [];

  public setValue(value: number): void {
    this.value = value;
    this.notifyObservers();
  }

  public getValue(): number {
    return this.value;
  }

  public addObserver(observer: CellObserver): void {
    this.observers.push(observer);
  }

  private notifyObservers(): void {
    for (const observer of this.observers) {
      observer.update();
    }
  }
}

class DoubleCell implements CellObserver {
  private value = 0;

  constructor(private source: Cell) {}

  public update(): void {
    this.value = this.source.getValue() * 2;
    console.log(`Célula dependente atualizada: ${this.value}`);
  }
}

const cellA = new Cell();
const cellB = new DoubleCell(cellA);

cellA.addObserver(cellB);

cellA.setValue(10);
cellA.setValue(20);
```

Nesse exemplo, `cellB` observa `cellA`.

Quando `cellA` muda, `cellB` recalcula seu valor.

---

## 17. Relação com Aberto/Fechado

Observer favorece o **Princípio Aberto/Fechado**.

Sem Observer, a classe `Temperatura` precisaria ser modificada sempre que surgisse um novo termômetro.

Com Observer, basta criar uma nova classe que implemente `Observer`:

```ts
class TermometroCelular implements Observer {
  public update(temperatura: number): void {
    console.log(`Celular recebeu nova temperatura: ${temperatura}°C`);
  }
}
```

Uso:

```ts
temperatura.addObserver(new TermometroCelular());
```

A classe `Temperatura` não precisa ser alterada.

Resposta de prova:

> Observer favorece o Princípio Aberto/Fechado porque permite adicionar novos observadores sem modificar o sujeito observado.

---

## 18. Relação com Inversão de Dependência

Observer também se relaciona com **Inversão de Dependência**.

A classe `Temperatura` não depende de classes concretas como:

```text
TermometroDigital
TermometroAnalogico
TermometroWeb
```

Ela depende da abstração:

```ts
interface Observer {
  update(temperatura: number): void;
}
```

Assim, o sujeito depende de uma interface, e não de implementações concretas.

---

## 19. Relação com baixo acoplamento

Observer reduz o acoplamento entre o objeto observado e os objetos interessados em sua mudança.

Sem Observer:

```text
Temperatura conhece TermometroDigital, TermometroAnalogico e TermometroWeb.
```

Com Observer:

```text
Temperatura conhece apenas Observer.
```

Isso deixa o sistema mais flexível.

---

## 20. Relação com Responsabilidade Única

Observer também ajuda a manter responsabilidades separadas.

A classe `Temperatura` cuida de armazenar e alterar a temperatura.

Os termômetros cuidam de exibir ou reagir à temperatura.

Assim:

```text
Temperatura = dado/modelo;
Termômetros = visualização/reação.
```

---

## 21. Push vs Pull

Existem duas formas comuns de implementar Observer.

### 21.1. Push

O Subject envia os dados para os observadores.

Exemplo:

```ts
observer.update(this.valor);
```

Nesse caso, o valor da temperatura é “empurrado” para o observador.

### 21.2. Pull

O Subject apenas avisa que mudou, e o observador busca os dados depois.

Exemplo:

```ts
observer.update();
```

Depois, o observador consulta:

```ts
subject.getValor();
```

Na prática, os dois modelos são válidos.

---

## 22. Quando usar Observer

Use Observer quando:

```text
um objeto precisa avisar vários outros sobre mudanças;
não queremos acoplar o objeto observado aos objetos concretos;
vários elementos precisam reagir a uma alteração;
novos interessados podem ser adicionados futuramente;
queremos separar modelo e visualização.
```

Exemplos comuns:

```text
interfaces gráficas;
eventos de botão;
sistemas de notificação;
planilhas;
sensores;
monitoramento;
MVC;
publicação e assinatura de eventos.
```

---

## 23. Quando não usar Observer

Evite Observer quando:

```text
existe apenas um objeto dependente e isso não deve mudar;
o fluxo de chamadas precisa ser extremamente explícito;
muitas notificações podem deixar o sistema difícil de rastrear;
a ordem das notificações é crítica e complexa;
a solução adiciona complexidade sem necessidade.
```

Observer pode dificultar a depuração se muitos observadores forem notificados indiretamente.

---

## 24. Diferença entre Observer e Strategy

| Observer | Strategy |
|---|---|
| Um objeto notifica vários objetos | Uma classe delega um algoritmo para uma estratégia |
| Foco em eventos e mudanças de estado | Foco em variação de algoritmo |
| Relação um-para-muitos | Relação contexto-estratégia |
| Exemplo: temperatura notifica termômetros | Exemplo: lista usa QuickSort ou MergeSort |

---

## 25. Diferença entre Observer e Proxy

| Observer | Proxy |
|---|---|
| Notifica interessados sobre mudanças | Controla acesso a um objeto real |
| Um sujeito possui vários observadores | Proxy fica entre cliente e objeto real |
| Foco em propagação de eventos | Foco em intermediação |
| Exemplo: planilha recalcula células | Exemplo: cache em busca de livros |

---

## 26. Como identificar Observer em uma prova

Procure por situações como:

```text
um objeto muda e vários precisam ser atualizados;
não queremos que o objeto principal conheça os tipos concretos dos dependentes;
há uma lista de interessados;
existe método update();
existe addObserver() ou subscribe();
existe notifyObservers();
```

Palavras-chave:

```text
observador
sujeito
notificar
atualizar
um-para-muitos
evento
subscribe
update
notify
```

---

## 27. Possível pergunta de prova

### Pergunta

Explique o padrão Observer usando o exemplo da estação meteorológica.

### Resposta sugerida

O Observer define uma relação um-para-muitos entre objetos. No exemplo da estação meteorológica, a classe `Temperatura` é o sujeito observado, e os termômetros são os observadores. Quando o valor da temperatura muda, a classe `Temperatura` chama `notifyObservers()`, que percorre sua lista de observadores e chama `update()` em cada um. Assim, a temperatura não precisa conhecer as classes concretas dos termômetros, apenas a interface `Observer`.

---

## 28. Outra possível pergunta de prova

### Pergunta

Por que Observer reduz acoplamento?

### Resposta sugerida

Observer reduz acoplamento porque o sujeito observado não depende diretamente das classes concretas dos observadores. Ele mantém apenas uma lista de objetos que implementam uma interface comum, como `Observer`. Dessa forma, novos observadores podem ser adicionados sem alterar o sujeito. No exemplo da temperatura, podemos adicionar um novo termômetro criando uma nova classe que implemente `Observer`, sem modificar a classe `Temperatura`.

---

## 29. Outra possível pergunta de prova

### Pergunta

Desenhe e explique o diagrama do Observer.

### Resposta sugerida

O diagrama possui um `Subject`, que mantém uma lista de `Observer`. O `Subject` possui métodos como `addObserver()`, `removeObserver()` e `notifyObservers()`. A interface `Observer` possui o método `update()`. Os observadores concretos implementam `Observer`. Quando o estado do `Subject` muda, ele chama `notifyObservers()`, que chama `update()` em cada observador.

---

## 30. Resumo final

Observer é:

```text
Um padrão que permite que um objeto notifique vários outros quando seu estado muda.
```

Estrutura:

```text
Subject -> lista de Observers -> update()
```

No exemplo da apresentação:

```text
Temperatura -> Termômetros
```

Serve para:

```text
notificar mudanças de estado;
atualizar várias visões;
desacoplar modelo e interface;
adicionar novos observadores sem alterar o sujeito.
```

Vantagens:

```text
reduz acoplamento;
favorece Aberto/Fechado;
favorece Inversão de Dependência;
separa dados de visualizações;
permite relação um-para-muitos.
```

Cuidado:

```text
pode dificultar depuração se houver muitos observadores e notificações indiretas.
```

Frase para memorizar:

> Observer permite que um sujeito notifique vários observadores quando seu estado muda, sem conhecer as classes concretas desses observadores.
