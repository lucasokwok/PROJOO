# 14 - Inversão de Dependência

## 1. Ideia principal

O **Princípio da Inversão de Dependência** é a letra **D** do SOLID.

Em inglês:

```text
Dependency Inversion Principle
```

A definição mais importante é:

> Módulos de alto nível não devem depender de módulos de baixo nível. Ambos devem depender de abstrações.

Outra forma mais simples de lembrar:

> Dependa de interfaces, não de classes concretas.

---

## 2. O que são módulos de alto nível e baixo nível?

### Módulos de alto nível

São as partes mais próximas das regras de negócio.

Exemplos:

```text
PedidoService;
PagamentoService;
ReservaService;
UsuarioService;
RelatorioService.
```

Essas classes representam decisões importantes do sistema.

---

### Módulos de baixo nível

São detalhes técnicos.

Exemplos:

```text
EmailService;
SmsService;
MySQLRepository;
PostgresRepository;
ArquivoRepository;
API externa;
biblioteca de pagamento;
serviço de log.
```

Essas classes representam detalhes de implementação.

---

## 3. O problema

Uma classe de regra de negócio não deveria depender diretamente de um detalhe técnico.

Exemplo ruim:

```ts
class EmailService {
  public enviar(mensagem: string): void {
    console.log(`Enviando e-mail: ${mensagem}`);
  }
}

class PedidoService {
  private emailService = new EmailService();

  public finalizarPedido(): void {
    console.log("Finalizando pedido");
    this.emailService.enviar("Pedido finalizado");
  }
}
```

---

## 4. Por que esse código quebra o princípio?

A classe `PedidoService` representa uma regra de negócio.

Ela está dependendo diretamente da classe concreta `EmailService`.

Isso gera alto acoplamento.

Se amanhã o sistema precisar enviar SMS, WhatsApp ou notificação push, será necessário alterar `PedidoService`.

O problema é esta linha:

```ts
private emailService = new EmailService();
```

A classe de alto nível está criando e dependendo diretamente de uma classe concreta de baixo nível.

---

## 5. Código corrigido

Criamos uma abstração:

```ts
interface NotificacaoService {
  enviar(mensagem: string): void;
}
```

Agora o e-mail implementa essa interface:

```ts
class EmailService implements NotificacaoService {
  public enviar(mensagem: string): void {
    console.log(`Enviando e-mail: ${mensagem}`);
  }
}
```

Também podemos criar outro tipo de notificação:

```ts
class SmsService implements NotificacaoService {
  public enviar(mensagem: string): void {
    console.log(`Enviando SMS: ${mensagem}`);
  }
}
```

A classe de regra de negócio passa a depender da interface:

```ts
class PedidoService {
  constructor(private notificacaoService: NotificacaoService) {}

  public finalizarPedido(): void {
    console.log("Finalizando pedido");
    this.notificacaoService.enviar("Pedido finalizado");
  }
}
```

Uso:

```ts
const pedidoComEmail = new PedidoService(new EmailService());
pedidoComEmail.finalizarPedido();

const pedidoComSms = new PedidoService(new SmsService());
pedidoComSms.finalizarPedido();
```

Agora `PedidoService` não depende mais diretamente de `EmailService`.

Ela depende de `NotificacaoService`.

---

## 6. Por que isso é Inversão de Dependência?

Antes, a dependência era assim:

```text
PedidoService ---> EmailService
```

A regra de negócio dependia diretamente do detalhe.

Depois da correção:

```text
PedidoService ---> NotificacaoService <--- EmailService
```

Agora tanto a regra de negócio quanto o detalhe dependem da abstração.

Isso inverte a dependência.

A classe de alto nível não fica presa à classe concreta.

---

## 7. Exemplo no estilo da prova antiga

### Código dado

```ts
class MySQLClienteRepository {
  public salvar(nome: string): void {
    console.log(`Salvando ${nome} no MySQL`);
  }
}

class ClienteService {
  private repository = new MySQLClienteRepository();

  public cadastrar(nome: string): void {
    this.repository.salvar(nome);
  }
}
```

---

### O que está errado?

O código viola o Princípio da Inversão de Dependência.

A classe `ClienteService`, que representa uma regra de negócio de alto nível, depende diretamente da classe concreta `MySQLClienteRepository`, que é um detalhe de infraestrutura.

Se o banco mudar de MySQL para PostgreSQL, arquivo, API ou memória, será necessário alterar `ClienteService`.

---

### Código corrigido

```ts
interface ClienteRepository {
  salvar(nome: string): void;
}

class MySQLClienteRepository implements ClienteRepository {
  public salvar(nome: string): void {
    console.log(`Salvando ${nome} no MySQL`);
  }
}

class PostgreSQLClienteRepository implements ClienteRepository {
  public salvar(nome: string): void {
    console.log(`Salvando ${nome} no PostgreSQL`);
  }
}

class ClienteService {
  constructor(private repository: ClienteRepository) {}

  public cadastrar(nome: string): void {
    this.repository.salvar(nome);
  }
}
```

Uso:

```ts
const serviceMySQL = new ClienteService(new MySQLClienteRepository());
serviceMySQL.cadastrar("Ana");

const servicePostgreSQL = new ClienteService(new PostgreSQLClienteRepository());
servicePostgreSQL.cadastrar("João");
```

---

### Explicação da correção

Agora `ClienteService` depende da interface `ClienteRepository`, e não de uma classe concreta.

A implementação concreta pode ser trocada sem alterar a regra de negócio.

---

## 8. Resposta pronta para prova

> O código viola o Princípio da Inversão de Dependência porque uma classe de alto nível, `ClienteService`, depende diretamente de uma classe concreta de baixo nível, `MySQLClienteRepository`. Isso gera alto acoplamento e dificulta a troca da implementação. A correção é criar uma abstração, como `ClienteRepository`, fazer as classes concretas implementarem essa interface e fazer `ClienteService` depender da abstração, recebendo a implementação pelo construtor.

---

## 9. Exemplo com pagamento

### Código quebrando o princípio

```ts
class PagamentoCartaoCredito {
  public pagar(valor: number): void {
    console.log(`Pagando R$ ${valor} com cartão de crédito`);
  }
}

class CheckoutService {
  private pagamento = new PagamentoCartaoCredito();

  public finalizarCompra(valor: number): void {
    this.pagamento.pagar(valor);
  }
}
```

---

### Por que quebra?

`CheckoutService` depende diretamente de `PagamentoCartaoCredito`.

Se amanhã o sistema precisar aceitar Pix, boleto ou PayPal, será necessário modificar `CheckoutService`.

A regra de checkout está acoplada a uma forma específica de pagamento.

---

### Código corrigido

```ts
interface MetodoPagamento {
  pagar(valor: number): void;
}

class PagamentoCartaoCredito implements MetodoPagamento {
  public pagar(valor: number): void {
    console.log(`Pagando R$ ${valor} com cartão de crédito`);
  }
}

class PagamentoPix implements MetodoPagamento {
  public pagar(valor: number): void {
    console.log(`Pagando R$ ${valor} com Pix`);
  }
}

class PagamentoBoleto implements MetodoPagamento {
  public pagar(valor: number): void {
    console.log(`Pagando R$ ${valor} com boleto`);
  }
}

class CheckoutService {
  constructor(private metodoPagamento: MetodoPagamento) {}

  public finalizarCompra(valor: number): void {
    this.metodoPagamento.pagar(valor);
  }
}
```

Uso:

```ts
const checkoutPix = new CheckoutService(new PagamentoPix());
checkoutPix.finalizarCompra(200);

const checkoutCartao = new CheckoutService(new PagamentoCartaoCredito());
checkoutCartao.finalizarCompra(200);
```

---

## 10. Exemplo com logger

### Código quebrando o princípio

```ts
class ConsoleLogger {
  public log(mensagem: string): void {
    console.log(mensagem);
  }
}

class RelatorioService {
  private logger = new ConsoleLogger();

  public gerar(): void {
    this.logger.log("Gerando relatório");
    console.log("Relatório gerado");
  }
}
```

---

### Por que quebra?

`RelatorioService` depende diretamente de `ConsoleLogger`.

Se quisermos gravar log em arquivo, banco ou serviço externo, será necessário alterar `RelatorioService`.

---

### Código corrigido

```ts
interface Logger {
  log(mensagem: string): void;
}

class ConsoleLogger implements Logger {
  public log(mensagem: string): void {
    console.log(mensagem);
  }
}

class FileLogger implements Logger {
  public log(mensagem: string): void {
    console.log(`Salvando em arquivo: ${mensagem}`);
  }
}

class RelatorioService {
  constructor(private logger: Logger) {}

  public gerar(): void {
    this.logger.log("Gerando relatório");
    console.log("Relatório gerado");
  }
}
```

Uso:

```ts
const relatorioComConsole = new RelatorioService(new ConsoleLogger());
relatorioComConsole.gerar();

const relatorioComArquivo = new RelatorioService(new FileLogger());
relatorioComArquivo.gerar();
```

---

## 11. Inversão de Dependência e injeção de dependência

Os dois nomes são parecidos, mas não são a mesma coisa.

### Inversão de Dependência

É o princípio.

Diz que devemos depender de abstrações, não de classes concretas.

### Injeção de Dependência

É uma técnica para aplicar esse princípio.

Consiste em passar a dependência de fora para dentro da classe.

Exemplo:

```ts
class PedidoService {
  constructor(private notificacaoService: NotificacaoService) {}
}
```

A dependência é recebida pelo construtor.

Isso é injeção de dependência via construtor.

---

## 12. Tipos comuns de injeção de dependência

### Pelo construtor

```ts
class PedidoService {
  constructor(private notificacaoService: NotificacaoService) {}
}
```

Essa é a forma mais comum.

---

### Por método

```ts
class PedidoService {
  public finalizarPedido(notificacaoService: NotificacaoService): void {
    notificacaoService.enviar("Pedido finalizado");
  }
}
```

---

### Por propriedade

```ts
class PedidoService {
  public notificacaoService!: NotificacaoService;
}
```

Essa forma existe, mas costuma ser menos segura porque a dependência pode não ser inicializada.

---

## 13. Relação com baixo acoplamento

Inversão de Dependência reduz o acoplamento.

Sem o princípio:

```text
PedidoService depende diretamente de EmailService.
```

Com o princípio:

```text
PedidoService depende de NotificacaoService.
EmailService implementa NotificacaoService.
SmsService implementa NotificacaoService.
```

Assim, a classe de alto nível fica menos presa aos detalhes.

---

## 14. Relação com testes

Esse princípio facilita testes.

Exemplo:

```ts
interface NotificacaoService {
  enviar(mensagem: string): void;
}

class FakeNotificacaoService implements NotificacaoService {
  public mensagens: string[] = [];

  public enviar(mensagem: string): void {
    this.mensagens.push(mensagem);
  }
}

class PedidoService {
  constructor(private notificacaoService: NotificacaoService) {}

  public finalizarPedido(): void {
    this.notificacaoService.enviar("Pedido finalizado");
  }
}
```

Teste conceitual:

```ts
const fake = new FakeNotificacaoService();
const service = new PedidoService(fake);

service.finalizarPedido();

console.log(fake.mensagens);
```

Como `PedidoService` depende de uma interface, podemos substituir a notificação real por uma falsa nos testes.

---

## 15. Relação com padrões de projeto

Vários padrões da apresentação usam ou favorecem Inversão de Dependência.

---

## Strategy

A classe principal depende da interface da estratégia.

```text
MyList depende de SortStrategy.
QuickSortStrategy implementa SortStrategy.
MergeSortStrategy implementa SortStrategy.
```

---

## Observer

O sujeito depende da interface `Observer`.

```text
Temperatura depende de Observer.
TermometroDigital implementa Observer.
TermometroWeb implementa Observer.
```

---

## Adapter

O cliente depende da interface esperada.

```text
SistemaMultimidia depende de Projetor.
AdaptadorProjetorSamsung implementa Projetor.
ProjetorSamsung fica escondido atrás do Adapter.
```

---

## Decorator

O cliente depende da interface comum.

```text
Bebida é a interface.
CafeExpresso implementa Bebida.
LeiteDecorator implementa Bebida.
ChantillyDecorator implementa Bebida.
```

---

## Proxy

O cliente pode depender da mesma interface usada pelo objeto real e pelo proxy.

```text
Search é a interface.
BookSearch implementa Search.
BookSearchProxy implementa Search.
```

---

## Factory

Factory pode ajudar a esconder a criação das classes concretas.

Porém, a classe que usa o objeto deve preferir depender da interface.

---

## 16. Como identificar violação em prova

Procure por:

```text
classe de regra de negócio usando new ClasseConcreta();
service instanciando repository diretamente;
service dependendo de EmailService, MySQLRepository ou API externa;
ausência de interface;
difícil trocar implementação;
difícil criar teste com mock/fake.
```

Exemplo de sinal forte:

```ts
private repository = new MySQLRepository();
```

ou:

```ts
const email = new EmailService();
```

dentro de uma classe de regra de negócio.

---

## 17. Estrutura ideal da resposta de prova

Quando a questão pedir para explicar e corrigir, responda assim:

```text
1. O código viola a Inversão de Dependência.
2. A classe de alto nível depende diretamente de uma classe concreta de baixo nível.
3. Isso gera alto acoplamento e dificulta troca de implementação.
4. A correção é criar uma interface/abstração.
5. A classe de alto nível passa a depender da interface.
6. As classes concretas implementam essa interface.
7. A dependência concreta é passada por construtor.
```

---

## 18. Modelo de resposta curta

> O código viola a Inversão de Dependência porque a classe de alto nível instancia diretamente uma classe concreta de baixo nível. Isso cria alto acoplamento e dificulta trocar a implementação. Para corrigir, criamos uma interface que representa o comportamento esperado, fazemos as implementações concretas seguirem essa interface e passamos a dependência pelo construtor. Assim, a classe principal depende de uma abstração, e não de detalhes de implementação.

---

## 19. Diferença entre Inversão de Dependência e Aberto/Fechado

| Inversão de Dependência | Aberto/Fechado |
|---|---|
| Depender de abstrações | Adicionar comportamento sem modificar classe existente |
| Foco no acoplamento | Foco na extensibilidade |
| Evita dependência direta de classes concretas | Evita alterar código já pronto |
| Exemplo: Service depende de Repository interface | Exemplo: criar nova Strategy sem alterar Calculadora |

Eles aparecem juntos com frequência.

Quando uma classe depende de abstrações, normalmente fica mais fácil respeitar Aberto/Fechado.

---

## 20. Resumo final

Inversão de Dependência significa:

```text
Dependa de abstrações, não de classes concretas.
```

Sinais de violação:

```text
new ClasseConcreta dentro de service;
classe de regra de negócio dependendo de banco, e-mail ou API externa;
ausência de interface;
alto acoplamento.
```

Correção comum:

```text
criar interface;
fazer classes concretas implementarem a interface;
receber a dependência pelo construtor.
```

Frase para memorizar:

> Inversão de Dependência reduz acoplamento fazendo as classes principais dependerem de interfaces, e não de implementações concretas.
