# 06 - Decorator

## 1. Ideia principal

O **Decorator** é um padrão de projeto usado para adicionar funcionalidades extras a um objeto de forma flexível, usando **composição**.

A ideia central é:

> Decorator adiciona responsabilidades a um objeto dinamicamente, sem alterar sua classe original e sem criar uma explosão de subclasses.

O Decorator funciona como uma camada em volta de outra camada.

Exemplo conceitual:

```text
ZipChannel(
  BufferChannel(
    TCPChannel
  )
)
```

Ou seja:

```text
Decorator -> Decorator -> Objeto base
```

Cada camada adiciona um comportamento.

---

## 2. Problema que o Decorator resolve

Na apresentação, o exemplo inicial é o sistema de canais de comunicação.

Existem canais básicos:

```text
TCPChannel
UDPChannel
```

Depois surge a necessidade de adicionar funcionalidades extras:

```text
compactação/descompactação;
buffer/cache;
logging;
criptografia;
outros comportamentos.
```

Sem Decorator, uma solução comum seria criar subclasses para cada combinação possível.

Exemplo:

```text
TCPChannel
UDPChannel
TCPChannelComLog
TCPChannelComBuffer
TCPChannelComZip
TCPChannelComLogEBuffer
TCPChannelComLogEZip
TCPChannelComBufferEZip
TCPChannelComLogBufferEZip
```

O problema é que isso gera uma explosão de classes.

Quanto mais funcionalidades combináveis existem, mais classes seriam necessárias.

---

## 3. Solução com Decorator

A solução é fazer todos os objetos seguirem a mesma interface.

Exemplo:

```ts
interface Channel {
  send(message: string): void;
}
```

Depois temos os canais base:

```ts
class TCPChannel implements Channel {
  public send(message: string): void {
    console.log(`Enviando via TCP: ${message}`);
  }
}
```

E temos uma classe decoradora base:

```ts
abstract class ChannelDecorator implements Channel {
  constructor(protected channel: Channel) {}

  public send(message: string): void {
    this.channel.send(message);
  }
}
```

Agora cada funcionalidade extra vira um decorador:

```ts
class LogChannel extends ChannelDecorator {
  public send(message: string): void {
    console.log("Log: enviando mensagem");
    this.channel.send(message);
  }
}
```

Uso:

```ts
const channel: Channel = new LogChannel(
  new TCPChannel()
);

channel.send("Olá");
```

---

## 4. Exemplo da apresentação: canais

A apresentação compara o Decorator com uma caixa dentro de outra caixa, até chegar ao objeto final.

Exemplo:

```text
ZipChannel
  BufferChannel
    TCPChannel
```

O `TCPChannel` é o canal real/base.

O `BufferChannel` adiciona buffer.

O `ZipChannel` adiciona compactação.

Todos implementam a mesma interface `Channel`.

---

## 5. Estrutura do padrão Decorator

```text
+----------------+
|   Component    |  <<interface>>
+----------------+
| operation()    |
+----------------+
        ^
        |
+----------------+             +----------------+
| ConcreteComp.  |             |   Decorator    |
+----------------+             +----------------+
| operation()    |             | component      |
+----------------+             | operation()    |
                               +----------------+
                                      ^
                                      |
                           +----------------------+
                           | ConcreteDecorator    |
                           +----------------------+
                           | operation()          |
                           +----------------------+
```

Mapeando para canais:

```text
Component          = Channel
ConcreteComponent  = TCPChannel, UDPChannel
Decorator          = ChannelDecorator
ConcreteDecorator  = ZipChannel, BufferChannel, LogChannel
```

---

## 6. Código completo em TypeScript com canais

```ts
interface Channel {
  send(message: string): void;
}

class TCPChannel implements Channel {
  public send(message: string): void {
    console.log(`Enviando via TCP: ${message}`);
  }
}

class UDPChannel implements Channel {
  public send(message: string): void {
    console.log(`Enviando via UDP: ${message}`);
  }
}

abstract class ChannelDecorator implements Channel {
  constructor(protected channel: Channel) {}

  public send(message: string): void {
    this.channel.send(message);
  }
}

class LogChannel extends ChannelDecorator {
  public send(message: string): void {
    console.log("Log: mensagem será enviada");
    this.channel.send(message);
    console.log("Log: mensagem enviada");
  }
}

class ZipChannel extends ChannelDecorator {
  public send(message: string): void {
    const compressedMessage = `[compactado] ${message}`;
    this.channel.send(compressedMessage);
  }
}

class BufferChannel extends ChannelDecorator {
  private buffer: string[] = [];

  public send(message: string): void {
    this.buffer.push(message);
    console.log("Mensagem adicionada ao buffer");

    const messageFromBuffer = this.buffer.shift();

    if (messageFromBuffer) {
      this.channel.send(messageFromBuffer);
    }
  }
}

const channel: Channel = new LogChannel(
  new ZipChannel(
    new BufferChannel(
      new TCPChannel()
    )
  )
);

channel.send("Olá, mundo!");
```

---

## 7. O que acontece nesse código?

A montagem foi:

```ts
const channel: Channel = new LogChannel(
  new ZipChannel(
    new BufferChannel(
      new TCPChannel()
    )
  )
);
```

A ordem de execução é de fora para dentro:

```text
LogChannel
ZipChannel
BufferChannel
TCPChannel
```

Cada decorador adiciona um comportamento e depois delega para o objeto interno.

O `TCPChannel` é o objeto base que realmente envia a mensagem.

---

## 8. Por que usar composição?

O Decorator usa composição porque cada decorador guarda uma referência para outro objeto da mesma interface.

Exemplo:

```ts
abstract class ChannelDecorator implements Channel {
  constructor(protected channel: Channel) {}
}
```

Isso permite encaixar objetos em camadas.

Como todos implementam `Channel`, qualquer combinação é possível:

```ts
new LogChannel(new TCPChannel())

new ZipChannel(new TCPChannel())

new BufferChannel(new UDPChannel())

new LogChannel(
  new ZipChannel(
    new UDPChannel()
  )
)
```

Essa flexibilidade é a principal força do Decorator.

---

## 9. Exemplo da cafeteria

A apresentação também usa o exemplo de uma cafeteria.

O sistema possui bebidas base:

```text
Café expresso
Cappuccino
Chá
```

E complementos:

```text
Leite
Chantilly
Canela
Calda de chocolate
```

O problema é que criar uma classe para cada combinação seria inviável.

Exemplo ruim:

```text
Cafe
CafeComLeite
CafeComChantilly
CafeComLeiteEChantilly
CafeComLeiteECanela
CafeComLeiteECanelaEChocolate
...
```

Com Decorator, a bebida base e os adicionais seguem a mesma interface.

---

## 10. Código completo em TypeScript com cafeteria

```ts
interface Bebida {
  getDescricao(): string;
  getPreco(): number;
}

class CafeExpresso implements Bebida {
  public getDescricao(): string {
    return "Café expresso";
  }

  public getPreco(): number {
    return 5;
  }
}

class Cappuccino implements Bebida {
  public getDescricao(): string {
    return "Cappuccino";
  }

  public getPreco(): number {
    return 7;
  }
}

abstract class BebidaDecorator implements Bebida {
  constructor(protected bebida: Bebida) {}

  public getDescricao(): string {
    return this.bebida.getDescricao();
  }

  public getPreco(): number {
    return this.bebida.getPreco();
  }
}

class Leite extends BebidaDecorator {
  public getDescricao(): string {
    return `${this.bebida.getDescricao()} + leite`;
  }

  public getPreco(): number {
    return this.bebida.getPreco() + 2;
  }
}

class Chantilly extends BebidaDecorator {
  public getDescricao(): string {
    return `${this.bebida.getDescricao()} + chantilly`;
  }

  public getPreco(): number {
    return this.bebida.getPreco() + 3;
  }
}

class Canela extends BebidaDecorator {
  public getDescricao(): string {
    return `${this.bebida.getDescricao()} + canela`;
  }

  public getPreco(): number {
    return this.bebida.getPreco() + 1;
  }
}

const bebida: Bebida = new Chantilly(
  new Leite(
    new CafeExpresso()
  )
);

console.log(bebida.getDescricao());
console.log(bebida.getPreco());
```

Saída esperada:

```text
Café expresso + leite + chantilly
10
```

---

## 11. Explicando o exemplo da cafeteria

A interface `Bebida` define o contrato:

```ts
interface Bebida {
  getDescricao(): string;
  getPreco(): number;
}
```

As bebidas base implementam essa interface:

```text
CafeExpresso
Cappuccino
```

Os adicionais também implementam a mesma interface por meio de `BebidaDecorator`.

Cada adicional recebe uma bebida no construtor:

```ts
constructor(protected bebida: Bebida) {}
```

Assim, é possível criar combinações dinamicamente.

Exemplo:

```ts
new Canela(
  new Chantilly(
    new Leite(
      new Cappuccino()
    )
  )
)
```

Não precisamos criar uma classe `CappuccinoComLeiteChantillyECanela`.

---

## 12. Por que a classe Decorator costuma ser abstrata?

A classe base do decorador, como `BebidaDecorator`, costuma ser abstrata porque ela serve apenas como base para os decoradores concretos.

Ela não representa um adicional específico.

Exemplo:

```ts
abstract class BebidaDecorator implements Bebida {
  constructor(protected bebida: Bebida) {}

  public getDescricao(): string {
    return this.bebida.getDescricao();
  }

  public getPreco(): number {
    return this.bebida.getPreco();
  }
}
```

Ela centraliza o comportamento comum:

```text
guardar a bebida decorada;
repassar chamadas para a bebida interna.
```

Mas quem adiciona comportamento de verdade são as subclasses:

```text
Leite
Chantilly
Canela
```

---

## 13. Relação com Aberto/Fechado

Decorator é um dos padrões que mais favorecem o **Princípio Aberto/Fechado**.

A classe base fica fechada para modificação.

Para adicionar uma nova funcionalidade, criamos um novo decorador.

Exemplo:

```ts
class Chocolate extends BebidaDecorator {
  public getDescricao(): string {
    return `${this.bebida.getDescricao()} + chocolate`;
  }

  public getPreco(): number {
    return this.bebida.getPreco() + 4;
  }
}
```

Não foi necessário alterar:

```text
CafeExpresso
Cappuccino
Leite
Chantilly
Canela
```

Apenas adicionamos uma nova classe.

Resposta de prova:

> Decorator favorece o Princípio Aberto/Fechado porque permite adicionar novos comportamentos criando novos decoradores, sem modificar as classes base existentes.

---

## 14. Relação com herança e composição

Sem Decorator, poderíamos tentar resolver o problema com herança.

Mas a herança gera muitas combinações.

Exemplo:

```text
CafeComLeite
CafeComChantilly
CafeComLeiteEChantilly
CafeComLeiteECanela
CafeComLeiteChantillyCanela
```

Com Decorator, usamos composição:

```ts
new Chantilly(
  new Leite(
    new CafeExpresso()
  )
)
```

A composição permite combinar objetos em tempo de execução.

Por isso, Decorator é uma alternativa flexível à herança quando queremos adicionar responsabilidades combináveis.

---

## 15. Relação com Responsabilidade Única

Decorator também ajuda a separar responsabilidades.

Exemplo:

```text
CafeExpresso calcula preço base.
Leite adiciona preço e descrição do leite.
Chantilly adiciona preço e descrição do chantilly.
Canela adiciona preço e descrição da canela.
```

Cada classe cuida de uma responsabilidade pequena.

Isso evita que uma única classe fique cheia de `if`.

Exemplo ruim sem Decorator:

```ts
class Bebida {
  public calcularPreco(
    temLeite: boolean,
    temChantilly: boolean,
    temCanela: boolean
  ): number {
    let preco = 5;

    if (temLeite) {
      preco += 2;
    }

    if (temChantilly) {
      preco += 3;
    }

    if (temCanela) {
      preco += 1;
    }

    return preco;
  }
}
```

Esse código tende a crescer conforme novos adicionais aparecem.

---

## 16. Diferença entre Decorator e Proxy

Decorator e Proxy são parecidos estruturalmente, porque ambos envolvem outro objeto.

Mas a intenção é diferente.

| Decorator | Proxy |
|---|---|
| Adiciona responsabilidades ao objeto | Controla acesso ao objeto |
| Foco em extensão dinâmica | Foco em intermediação |
| Pode empilhar várias camadas | Geralmente representa um controle de acesso |
| Exemplo: bebida + leite + chantilly | Exemplo: cache antes de buscar livro |

Exemplo de Decorator:

```text
Café expresso + leite + chantilly.
```

Exemplo de Proxy:

```text
BookSearchProxy verifica cache antes de chamar BookSearch.
```

---

## 17. Diferença entre Decorator e Strategy

| Decorator | Strategy |
|---|---|
| Adiciona comportamento em camadas | Troca um algoritmo/comportamento |
| Combina responsabilidades | Escolhe uma estratégia entre várias |
| Usa composição recursiva | Usa delegação para uma estratégia |
| Exemplo: bebida com adicionais | Exemplo: lista com QuickSort ou MergeSort |

Exemplo de Decorator:

```ts
new Chantilly(new Leite(new CafeExpresso()))
```

Exemplo de Strategy:

```ts
new MyList(new QuickSortStrategy())
```

---

## 18. Quando usar Decorator

Use Decorator quando:

```text
você precisa adicionar funcionalidades extras a objetos;
as funcionalidades podem ser combinadas;
não quer criar uma classe para cada combinação;
quer evitar modificar as classes base;
quer adicionar responsabilidades em tempo de execução;
quer usar composição no lugar de herança excessiva.
```

Exemplos comuns:

```text
bebidas com adicionais;
canais com log, buffer e compactação;
streams de entrada e saída;
componentes visuais com borda, sombra ou rolagem;
notificações com log, validação e auditoria.
```

---

## 19. Quando não usar Decorator

Evite Decorator quando:

```text
existem poucas variações fixas;
as combinações não são necessárias;
a estrutura de objetos em camadas ficaria difícil de entender;
a solução adiciona classes demais para um problema simples.
```

Nesse caso, pode virar overengineering.

---

## 20. Como identificar Decorator em uma prova

Procure por situações como:

```text
querem adicionar funcionalidades extras;
as funcionalidades podem ser combinadas;
criar subclasses para tudo geraria muitas classes;
o objeto base não deve ser alterado;
usa composição;
cada adicional envolve outro objeto da mesma interface.
```

Palavras-chave:

```text
adicionar responsabilidades dinamicamente
composição
combinações
evitar explosão de subclasses
decorador
objeto dentro de outro objeto
```

---

## 21. Possível pergunta de prova

### Pergunta

Explique o padrão Decorator usando o exemplo da cafeteria.

### Resposta sugerida

O Decorator permite adicionar responsabilidades dinamicamente a um objeto usando composição. No exemplo da cafeteria, temos bebidas base como café expresso e cappuccino, e adicionais como leite, chantilly e canela. Em vez de criar uma classe para cada combinação possível, cada adicional é implementado como um decorador que recebe uma `Bebida` e também implementa a interface `Bebida`. Assim, podemos montar combinações como `new Chantilly(new Leite(new CafeExpresso()))`, calculando descrição e preço sem modificar as classes base.

---

## 22. Outra possível pergunta de prova

### Pergunta

Por que Decorator favorece o Princípio Aberto/Fechado?

### Resposta sugerida

Decorator favorece o Princípio Aberto/Fechado porque permite adicionar novos comportamentos criando novos decoradores, sem modificar as classes já existentes. Por exemplo, se uma cafeteria quiser adicionar chocolate como novo complemento, basta criar a classe `Chocolate` que estende `BebidaDecorator`. As classes `CafeExpresso`, `Leite` e `Chantilly` continuam inalteradas.

---

## 23. Resumo final

Decorator é:

```text
Um padrão que adiciona responsabilidades dinamicamente a um objeto usando composição.
```

Estrutura:

```text
Cliente -> Decorator -> Decorator -> Objeto Base
```

No exemplo dos canais:

```text
LogChannel -> ZipChannel -> BufferChannel -> TCPChannel
```

No exemplo da cafeteria:

```text
Chantilly -> Leite -> CafeExpresso
```

Serve para:

```text
adicionar comportamentos extras;
combinar funcionalidades;
evitar explosão de subclasses;
manter classes base fechadas para modificação;
montar objetos dinamicamente.
```

Vantagens:

```text
favorece Aberto/Fechado;
usa composição;
reduz necessidade de herança;
permite combinações flexíveis;
separa responsabilidades em classes pequenas.
```

Frase para memorizar:

> Decorator permite adicionar funcionalidades extras a um objeto em camadas, sem alterar a classe original e sem criar uma classe para cada combinação possível.
