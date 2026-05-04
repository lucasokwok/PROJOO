# 01 - Factory

## 1. Ideia principal

O **Factory** é um padrão de projeto usado para **centralizar a criação de objetos**.

Em vez de várias partes do sistema criarem objetos diretamente com `new`, a criação passa a ser feita por uma **classe fábrica** ou por um **método fábrica**.

A ideia central é:

```text
Não espalhar a criação de objetos concretos pelo sistema.
Centralizar essa criação em um único ponto.
```

Isso facilita mudanças futuras, porque se a classe concreta que deve ser criada mudar, a alteração fica concentrada na fábrica, e não espalhada por vários arquivos.

---

## 2. Problema apresentado na aula

Na apresentação, o exemplo usado é um sistema que trabalha com **canais de comunicação**.

Inicialmente, várias partes do código criam diretamente um canal TCP:

```java
void f() {
    TCPChannel c = new TCPChannel();
    ...
}

void g() {
    TCPChannel c = new TCPChannel();
    ...
}

void h() {
    TCPChannel c = new TCPChannel();
    ...
}
```

O problema é que a criação do objeto está espalhada em vários pontos do sistema:

```java
new TCPChannel()
```

Se futuramente alguns clientes precisarem usar `UDPChannel` em vez de `TCPChannel`, será necessário procurar todos os lugares onde aparece `new TCPChannel()` e alterar manualmente.

Isso torna o sistema rígido e difícil de modificar.

---

## 3. Por que isso é um problema de projeto?

O problema não é apenas repetir código. O problema principal é o **alto acoplamento com uma classe concreta**.

Quando o cliente faz isto:

```java
TCPChannel c = new TCPChannel();
```

essa parte do código depende diretamente da classe concreta `TCPChannel`.

Então, se o canal de comunicação mudar para UDP, o código cliente também precisa mudar.

Ou seja, o cliente não está protegido contra mudanças na forma de criação do objeto.

---

## 4. Solução: usar uma Factory

A solução apresentada é criar uma fábrica responsável por criar os canais.

Exemplo:

```java
class ChannelFactory {
    public static Channel create() {
        return new TCPChannel();
    }
}
```

Agora, em vez de o cliente fazer:

```java
TCPChannel c = new TCPChannel();
```

faz:

```java
Channel c = ChannelFactory.create();
```

A criação do objeto fica centralizada no método `create()`.

---

## 5. Comparação: sem Factory e com Factory

### Sem Factory

```java
void f() {
    TCPChannel c = new TCPChannel();
    ...
}

void g() {
    TCPChannel c = new TCPChannel();
    ...
}

void h() {
    TCPChannel c = new TCPChannel();
    ...
}
```

Problema:

```text
A classe concreta TCPChannel aparece em vários pontos.
Se trocar para UDPChannel, vários métodos precisam ser modificados.
```

### Com Factory

```java
void f() {
    Channel c = ChannelFactory.create();
    ...
}

void g() {
    Channel c = ChannelFactory.create();
    ...
}

void h() {
    Channel c = ChannelFactory.create();
    ...
}
```

Agora, se quisermos trocar de TCP para UDP, alteramos apenas a fábrica:

```java
class ChannelFactory {
    public static Channel create() {
        return new UDPChannel();
    }
}
```

O código cliente continua igual.

---

## 6. Estrutura básica do padrão

Uma estrutura simples de Factory envolve:

```text
Interface ou classe abstrata comum
Classes concretas
Classe fábrica
Cliente
```

Exemplo:

```text
Channel
    TCPChannel
    UDPChannel

ChannelFactory

Cliente usa ChannelFactory.create()
```

O cliente depende de `Channel`, não diretamente de `TCPChannel` ou `UDPChannel`.

---

## 7. Exemplo em TypeScript

Vamos usar um exemplo parecido com o que você já trabalhou: sistema de notificações.

### Interface comum

```ts
export interface Notification {
  send(destinatario: string, mensagem: string): void;
}
```

A interface define o contrato. Toda notificação precisa ter o método `send()`.

---

### Classes concretas

```ts
import { Notification } from "./Notification";

export class EmailNotification implements Notification {
  send(destinatario: string, mensagem: string): void {
    console.log(`Enviando e-mail para ${destinatario}: ${mensagem}`);
  }
}
```

```ts
import { Notification } from "./Notification";

export class SmsNotification implements Notification {
  send(destinatario: string, mensagem: string): void {
    console.log(`Enviando SMS para ${destinatario}: ${mensagem}`);
  }
}
```

```ts
import { Notification } from "./Notification";

export class PushNotification implements Notification {
  send(destinatario: string, mensagem: string): void {
    console.log(`Enviando push para ${destinatario}: ${mensagem}`);
  }
}
```

---

### Factory

```ts
import { Notification } from "../notifications/Notification";
import { EmailNotification } from "../notifications/EmailNotification";
import { SmsNotification } from "../notifications/SmsNotification";
import { PushNotification } from "../notifications/PushNotification";

export class NotificationFactory {
  static create(tipo: string): Notification {
    if (tipo === "email") {
      return new EmailNotification();
    }

    if (tipo === "sms") {
      return new SmsNotification();
    }

    if (tipo === "push") {
      return new PushNotification();
    }

    throw new Error("Tipo de notificação inválido");
  }
}
```

---

### Cliente usando a Factory

```ts
import { NotificationFactory } from "./factory/NotificationFactory";

const notification = NotificationFactory.create("email");

notification.send("cliente@email.com", "Sua reserva foi confirmada.");
```

O cliente não precisa saber como um `EmailNotification`, `SmsNotification` ou `PushNotification` é criado.

Ele apenas pede para a fábrica criar uma notificação.

---

## 8. O que melhora no projeto?

O Factory melhora principalmente:

```text
Baixo acoplamento
Reúso de projeto
Facilidade de manutenção
Centralização da criação de objetos
Preparação para mudanças futuras
```

O cliente deixa de depender diretamente de classes concretas e passa a depender de uma abstração.

No exemplo:

```ts
const notification = NotificationFactory.create("email");
```

O cliente recebe um objeto do tipo `Notification`.

Ele não precisa conhecer todos os detalhes das classes concretas.

---

## 9. Relação com SOLID

### 9.1. Relação com o Princípio Aberto/Fechado

O Factory pode ajudar o sistema a se aproximar do **Princípio Aberto/Fechado**, que diz:

```text
Uma classe deve estar aberta para extensão, mas fechada para modificação.
```

Por exemplo, se o sistema usa uma interface `Notification`, podemos criar novas classes de notificação:

```ts
class WhatsAppNotification implements Notification {
  send(destinatario: string, mensagem: string): void {
    console.log(`Enviando WhatsApp para ${destinatario}: ${mensagem}`);
  }
}
```

Porém, atenção: se a Factory for feita com vários `if`, talvez ainda seja necessário alterar a própria fábrica para adicionar um novo tipo.

Então, uma Factory simples melhora bastante a organização, mas não elimina completamente todas as alterações futuras.

Mesmo assim, ela já concentra a mudança em um único ponto, o que é melhor do que espalhar `new` por todo o sistema.

---

### 9.2. Relação com Inversão de Dependência

Factory também se relaciona com **Inversão de Dependência**, porque o cliente pode trabalhar com uma interface em vez de uma classe concreta.

Ruim:

```ts
const notification = new EmailNotification();
```

Melhor:

```ts
const notification: Notification = NotificationFactory.create("email");
```

O cliente passa a depender da abstração `Notification`, e não diretamente de `EmailNotification`.

---

## 10. Factory simples ainda pode ter problema?

Sim.

Uma Factory simples com muitos `if` ou `switch` pode crescer demais:

```ts
if (tipo === "email") { ... }
if (tipo === "sms") { ... }
if (tipo === "push") { ... }
if (tipo === "whatsapp") { ... }
if (tipo === "telegram") { ... }
```

Isso pode começar a violar o Princípio Aberto/Fechado, porque a fábrica precisa ser modificada sempre que surge um novo tipo.

Mas, para o nível da apresentação, a ideia mais importante é:

```text
Factory centraliza a criação dos objetos.
```

Em sistemas mais avançados, existem formas de tornar a fábrica ainda mais flexível, usando registro de classes, injeção de dependência ou configurações externas.

---

## 11. Quando usar Factory?

Use Factory quando:

```text
A criação de objetos está espalhada pelo código.
O cliente não deveria conhecer a classe concreta criada.
O tipo de objeto pode variar.
A criação do objeto envolve alguma regra.
Você quer centralizar mudanças futuras.
```

Exemplos comuns:

```text
Criar notificações: Email, SMS, Push.
Criar canais de comunicação: TCP, UDP.
Criar formas de pagamento: Pix, Cartão, Boleto.
Criar relatórios: PDF, Excel, HTML.
Criar conexões: MySQL, PostgreSQL, SQLite.
```

---

## 12. Quando não usar Factory?

Não faz sentido usar Factory se:

```text
Só existe uma classe concreta.
A criação do objeto é simples e nunca deve variar.
O padrão só adicionaria classes extras sem necessidade.
```

Nesse caso, usar Factory pode ser overengineering.

A apresentação chama atenção para isso: padrões de projeto ajudam em mudanças futuras, mas se a chance de mudança é muito baixa, o padrão pode complicar o projeto sem necessidade.

---

## 13. Exemplo de resposta de prova

Uma resposta boa para uma questão pedindo para explicar Factory seria:

> O padrão Factory é usado para centralizar a criação de objetos. Em vez de espalhar chamadas `new` de classes concretas por várias partes do sistema, cria-se uma classe ou método responsável por instanciar o objeto adequado. Isso reduz o acoplamento entre o cliente e as classes concretas, pois o cliente pode trabalhar com uma interface ou classe abstrata. No exemplo dos canais de comunicação, em vez de vários métodos criarem diretamente `new TCPChannel()`, todos chamam `ChannelFactory.create()`. Assim, se for necessário trocar TCP por UDP, a alteração fica concentrada na fábrica.

---

## 14. Resposta mais curta para memorizar

> Factory centraliza a criação de objetos. Ele evita que o código fique cheio de `new ClasseConcreta()` espalhado. Com isso, se a implementação concreta mudar, a alteração fica concentrada em um único ponto, reduzindo acoplamento e facilitando manutenção.

---

## 15. Palavras-chave para lembrar

```text
Criação de objetos
Centralização do new
Baixo acoplamento
Classe concreta
Interface
Mudança futura
Design for change
```

---

## 16. Ligação com a apresentação

Na apresentação, o Factory aparece como o primeiro padrão estudado. O problema mostrado é a criação direta de `TCPChannel` em vários métodos. A solução é usar `ChannelFactory.create()`, deixando a criação do canal em um único ponto. Assim, caso o sistema precise usar `UDPChannel`, a mudança fica concentrada na fábrica, e não espalhada pelos clientes.
