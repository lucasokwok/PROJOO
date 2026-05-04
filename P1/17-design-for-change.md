# 16 - Design for Change

## 1. Ideia principal

**Design for Change** significa projetar o software pensando em mudanças futuras.

A ideia central é:

> Design for Change é criar um projeto de software flexível o suficiente para aceitar mudanças sem exigir grandes alterações no código existente.

Em português, podemos entender como:

```text
projetar para mudança;
projetar para evolução;
preparar o código para variações futuras.
```

A apresentação destaca que os padrões de projeto ajudam justamente nisso.

Eles tornam o sistema mais fácil de modificar quando novos requisitos aparecem.

---

## 2. Por que mudanças acontecem?

Em sistemas reais, mudanças são comuns.

Exemplos:

```text
novo tipo de relatório;
novo formato de exportação;
novo canal de notificação;
nova regra de desconto;
novo meio de pagamento;
novo tipo de usuário;
novo algoritmo;
nova integração externa;
nova forma de autenticação.
```

Se o código não foi projetado para mudar, cada nova regra pode exigir várias alterações espalhadas.

Isso aumenta o risco de bugs.

---

## 3. Código sem Design for Change

Imagine um sistema de notificação.

```ts
class NotificacaoService {
  public enviar(tipo: string, destino: string, mensagem: string): void {
    if (tipo === "email") {
      console.log(`Enviando e-mail para ${destino}: ${mensagem}`);
    }

    if (tipo === "sms") {
      console.log(`Enviando SMS para ${destino}: ${mensagem}`);
    }

    if (tipo === "whatsapp") {
      console.log(`Enviando WhatsApp para ${destino}: ${mensagem}`);
    }
  }
}
```

Uso:

```ts
const service = new NotificacaoService();

service.enviar("email", "teste@email.com", "Olá");
```

---

## 4. Por que esse código não está preparado para mudança?

Se amanhã surgir um novo canal, como:

```text
push notification;
telegram;
slack;
discord.
```

será necessário modificar a classe `NotificacaoService`.

Exemplo:

```ts
if (tipo === "push") {
  console.log(`Enviando push para ${destino}: ${mensagem}`);
}
```

Esse código tem alguns problemas:

```text
a classe cresce conforme novos tipos aparecem;
a cada mudança, mexemos em código já existente;
fica mais fácil introduzir bugs;
o método começa a concentrar muitas regras;
o sistema fica mais difícil de testar.
```

Esse projeto não está bem preparado para mudanças.

---

## 5. Código com Design for Change

Podemos criar uma interface para representar uma notificação:

```ts
interface Notificacao {
  enviar(destino: string, mensagem: string): void;
}
```

Cada tipo de notificação vira uma classe:

```ts
class EmailNotificacao implements Notificacao {
  public enviar(destino: string, mensagem: string): void {
    console.log(`Enviando e-mail para ${destino}: ${mensagem}`);
  }
}

class SmsNotificacao implements Notificacao {
  public enviar(destino: string, mensagem: string): void {
    console.log(`Enviando SMS para ${destino}: ${mensagem}`);
  }
}

class WhatsAppNotificacao implements Notificacao {
  public enviar(destino: string, mensagem: string): void {
    console.log(`Enviando WhatsApp para ${destino}: ${mensagem}`);
  }
}
```

A classe principal passa a depender da abstração:

```ts
class NotificacaoService {
  constructor(private notificacao: Notificacao) {}

  public enviar(destino: string, mensagem: string): void {
    this.notificacao.enviar(destino, mensagem);
  }
}
```

Uso:

```ts
const service = new NotificacaoService(new EmailNotificacao());

service.enviar("teste@email.com", "Olá");
```

---

## 6. Como adicionar uma nova mudança?

Agora, se surgir um novo canal, basta criar uma nova classe:

```ts
class PushNotificacao implements Notificacao {
  public enviar(destino: string, mensagem: string): void {
    console.log(`Enviando push para ${destino}: ${mensagem}`);
  }
}
```

Uso:

```ts
const service = new NotificacaoService(new PushNotificacao());

service.enviar("usuario-123", "Nova mensagem");
```

A classe `NotificacaoService` não precisou ser modificada.

Isso é Design for Change.

---

## 7. Relação com o Princípio Aberto/Fechado

Design for Change está diretamente relacionado ao **Princípio Aberto/Fechado**.

O Princípio Aberto/Fechado diz:

```text
classes devem estar abertas para extensão e fechadas para modificação.
```

No exemplo da notificação:

```text
aberto para extensão: posso criar PushNotificacao;
fechado para modificação: não altero NotificacaoService.
```

Ou seja, o código foi projetado para aceitar mudanças por extensão.

---

## 8. Relação com Inversão de Dependência

Design for Change também se relaciona com **Inversão de Dependência**.

O código fica mais flexível quando depende de interfaces.

Exemplo:

```ts
class NotificacaoService {
  constructor(private notificacao: Notificacao) {}
}
```

Aqui, `NotificacaoService` depende da interface `Notificacao`, e não de uma classe concreta como `EmailNotificacao`.

Isso permite trocar facilmente a implementação.

---

## 9. Relação com baixo acoplamento

Um sistema preparado para mudanças normalmente tem baixo acoplamento.

Sem Design for Change:

```text
PedidoService depende diretamente de EmailService.
```

Com Design for Change:

```text
PedidoService depende de Notificacao.
EmailService implementa Notificacao.
SmsService implementa Notificacao.
```

Quanto menor o acoplamento com detalhes concretos, mais fácil trocar partes do sistema.

---

## 10. Relação com coesão

Design for Change também melhora a coesão.

Cada classe tende a ter uma responsabilidade mais clara.

Exemplo:

```text
EmailNotificacao cuida de e-mail.
SmsNotificacao cuida de SMS.
WhatsAppNotificacao cuida de WhatsApp.
NotificacaoService apenas usa uma notificação.
```

Isso evita uma classe gigante com várias regras misturadas.

---

# Parte 1 - Design for Change e padrões de projeto

## 11. Factory

Factory ajuda quando a criação de objetos pode mudar.

Sem Factory:

```ts
class Cliente {
  public conectar(): void {
    const channel = new TCPChannel();
    channel.send("Olá");
  }
}
```

Se amanhã mudar para UDP, será necessário alterar todos os pontos que usam `new TCPChannel()`.

Com Factory:

```ts
interface Channel {
  send(message: string): void;
}

class TCPChannel implements Channel {
  public send(message: string): void {
    console.log(`TCP: ${message}`);
  }
}

class UDPChannel implements Channel {
  public send(message: string): void {
    console.log(`UDP: ${message}`);
  }
}

class ChannelFactory {
  public static create(): Channel {
    return new TCPChannel();
  }
}
```

Uso:

```ts
const channel = ChannelFactory.create();

channel.send("Olá");
```

Se mudar para UDP:

```ts
class ChannelFactory {
  public static create(): Channel {
    return new UDPChannel();
  }
}
```

A mudança fica centralizada.

---

## 12. Strategy

Strategy ajuda quando o algoritmo pode mudar.

Exemplo:

```text
hoje usa QuickSort;
amanhã pode usar MergeSort;
depois pode usar HeapSort.
```

Com Strategy:

```ts
interface SortStrategy {
  sort(items: number[]): number[];
}

class QuickSortStrategy implements SortStrategy {
  public sort(items: number[]): number[] {
    return [...items].sort((a, b) => a - b);
  }
}

class MyList {
  constructor(private strategy: SortStrategy) {}

  public sort(items: number[]): number[] {
    return this.strategy.sort(items);
  }
}
```

Para mudar o algoritmo, trocamos a estratégia.

---

## 13. Observer

Observer ajuda quando novos interessados podem surgir.

Exemplo:

```text
Temperatura muda.
Termômetro digital precisa atualizar.
Termômetro web precisa atualizar.
Futuramente, app de celular também pode atualizar.
```

Com Observer, adicionamos novos observadores sem alterar `Temperatura`.

---

## 14. Decorator

Decorator ajuda quando funcionalidades extras podem ser combinadas.

Exemplo:

```text
café;
café com leite;
café com leite e chantilly;
café com leite, chantilly e canela.
```

Com Decorator, cada adicional é uma classe e pode ser combinado dinamicamente.

---

## 15. Adapter

Adapter ajuda quando novas integrações externas podem aparecer.

Exemplo:

```text
hoje uso API de SMS A;
amanhã posso usar API de SMS B;
depois posso integrar uma API legada.
```

Com Adapter, o sistema depende de uma interface própria, e cada integração externa recebe um adaptador.

---

## 16. Proxy

Proxy ajuda quando queremos adicionar controle sem modificar o objeto real.

Exemplo:

```text
adicionar cache;
adicionar log;
adicionar validação;
adicionar controle de acesso.
```

O objeto original continua igual.

O Proxy adiciona o comportamento extra.

---

## 17. Facade

Facade ajuda quando o subsistema é complexo e pode mudar internamente.

O cliente usa uma interface simples.

Se a organização interna mudar, a fachada pode absorver essa mudança.

---

## 18. Template Method

Template Method ajuda quando o fluxo principal é fixo, mas alguns passos podem mudar.

Exemplo:

```text
processar arquivo:
1. abrir;
2. ler;
3. processar;
4. fechar.
```

Cada subclasse implementa o processamento específico.

---

## 19. Visitor

Visitor ajuda quando uma hierarquia de classes é estável, mas novas operações podem surgir.

Exemplo:

```text
Carro, Ônibus e Motocicleta raramente mudam.
Mas novas operações aparecem: imprimir, salvar, calcular imposto, exportar.
```

Nesse caso, criamos novos Visitors.

---

# Parte 2 - Exemplo no estilo da prova

## 20. Código quebrado

```ts
class RelatorioService {
  public exportar(formato: string): void {
    if (formato === "pdf") {
      console.log("Exportando em PDF");
    }

    if (formato === "csv") {
      console.log("Exportando em CSV");
    }

    if (formato === "xlsx") {
      console.log("Exportando em XLSX");
    }
  }
}
```

---

## 21. Por que não está preparado para mudanças?

Esse código não está bem projetado para mudanças porque toda vez que surgir um novo formato será necessário modificar `RelatorioService`.

Exemplos de novos formatos:

```text
JSON;
XML;
HTML;
DOCX.
```

A classe crescerá com novos `if`.

Isso viola o Princípio Aberto/Fechado e dificulta manutenção.

---

## 22. Código corrigido

```ts
interface ExportadorRelatorio {
  exportar(): void;
}

class ExportadorPDF implements ExportadorRelatorio {
  public exportar(): void {
    console.log("Exportando em PDF");
  }
}

class ExportadorCSV implements ExportadorRelatorio {
  public exportar(): void {
    console.log("Exportando em CSV");
  }
}

class ExportadorXLSX implements ExportadorRelatorio {
  public exportar(): void {
    console.log("Exportando em XLSX");
  }
}

class RelatorioService {
  constructor(private exportador: ExportadorRelatorio) {}

  public exportar(): void {
    this.exportador.exportar();
  }
}
```

Nova extensão:

```ts
class ExportadorJSON implements ExportadorRelatorio {
  public exportar(): void {
    console.log("Exportando em JSON");
  }
}
```

Uso:

```ts
const service = new RelatorioService(new ExportadorJSON());

service.exportar();
```

Agora o sistema aceita novos formatos por extensão.

---

## 23. Explicação da correção

A correção criou uma abstração:

```text
ExportadorRelatorio
```

Cada formato virou uma implementação:

```text
ExportadorPDF;
ExportadorCSV;
ExportadorXLSX;
ExportadorJSON.
```

A classe principal depende da interface, e não dos formatos concretos.

Assim, o projeto fica preparado para mudanças futuras.

---

# Parte 3 - Quando aplicar Design for Change?

## 24. Use Design for Change quando

```text
a regra tem chance real de mudar;
novas variações são esperadas;
o sistema será mantido por mais tempo;
o custo de alterar código existente é alto;
vários clientes usam a mesma classe;
há integrações externas;
há muitos tipos/formatos/canais/algoritmos;
a mudança pode se repetir no futuro.
```

Exemplos:

```text
formas de pagamento;
canais de notificação;
tipos de relatório;
formatos de exportação;
algoritmos de cálculo;
integrações com APIs externas.
```

---

## 25. Cuidado

Design for Change não significa criar abstrações para tudo.

Se uma parte do sistema provavelmente nunca vai mudar, criar muitas interfaces e classes extras pode tornar o código mais complexo sem necessidade.

Isso leva ao problema de **Overengineering**.

---

## 26. Diferença entre flexibilidade e complexidade

Todo Design for Change tem um custo.

Normalmente ele cria:

```text
mais classes;
mais interfaces;
mais indireção;
mais arquivos;
mais conceitos para entender.
```

Isso pode valer a pena quando a mudança é provável.

Mas pode ser exagero quando a mudança é improvável.

---

## 27. Como responder em prova

Resposta sugerida:

> Design for Change é a ideia de projetar o software para facilitar mudanças futuras. Em vez de escrever código rígido, cheio de condicionais e dependente de classes concretas, criamos abstrações e pontos de extensão. Assim, novas funcionalidades podem ser adicionadas com menos impacto no código existente. Padrões como Strategy, Observer, Decorator, Factory e Adapter ajudam nesse objetivo, pois reduzem acoplamento e favorecem o Princípio Aberto/Fechado.

---

## 28. Resumo final

Design for Change significa:

```text
Projetar pensando em mudanças futuras.
```

Ele busca:

```text
reduzir acoplamento;
aumentar coesão;
usar abstrações;
facilitar extensão;
evitar alterações espalhadas.
```

Ajuda a aplicar:

```text
Aberto/Fechado;
Inversão de Dependência;
Responsabilidade Única.
```

Padrões relacionados:

```text
Factory;
Strategy;
Observer;
Decorator;
Adapter;
Proxy;
Facade;
Template Method;
Visitor.
```

Frase para memorizar:

> Design for Change é preparar o projeto para que novas mudanças sejam feitas por extensão, com o menor impacto possível no código existente.
