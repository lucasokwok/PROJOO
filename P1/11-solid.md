# 11 - SOLID

## 1. O que é SOLID?

**SOLID** é um conjunto de cinco princípios de projeto orientado a objetos.

Esses princípios ajudam a criar sistemas mais:

```text
organizados;
flexíveis;
fáceis de manter;
fáceis de testar;
menos acoplados;
mais preparados para mudanças.
```

SOLID não é um padrão de projeto.

SOLID é um conjunto de princípios.

Os padrões de projeto, como **Factory**, **Strategy**, **Observer**, **Decorator**, **Adapter**, **Proxy**, **Facade**, **Template Method** e **Visitor**, muitas vezes ajudam a aplicar esses princípios na prática.

---

## 2. As cinco letras de SOLID

```text
S - Single Responsibility Principle
O - Open/Closed Principle
L - Liskov Substitution Principle
I - Interface Segregation Principle
D - Dependency Inversion Principle
```

Em português:

```text
S - Princípio da Responsabilidade Única
O - Princípio Aberto/Fechado
L - Princípio da Substituição de Liskov
I - Princípio da Segregação de Interfaces
D - Princípio da Inversão de Dependência
```

---

## 3. Tabela-resumo

| Letra | Princípio | Ideia central |
|---|---|---|
| S | Responsabilidade Única | Uma classe deve ter apenas um motivo para mudar |
| O | Aberto/Fechado | Classes devem ser abertas para extensão e fechadas para modificação |
| L | Substituição de Liskov | Subclasses devem poder substituir a superclasse sem quebrar o sistema |
| I | Segregação de Interfaces | Interfaces devem ser pequenas e específicas |
| D | Inversão de Dependência | Dependa de abstrações, não de classes concretas |

---

# 4. S - Single Responsibility Principle

## Ideia

O **Princípio da Responsabilidade Única** diz que:

> Uma classe deve ter apenas um motivo para mudar.

Isso significa que uma classe deve ter uma responsabilidade principal bem definida.

Não significa que uma classe só pode ter um método.

Significa que os métodos e atributos da classe devem estar relacionados ao mesmo assunto.

---

## Exemplo quebrando o princípio

```ts
class Pedido {
  constructor(
    public cliente: string,
    public valor: number
  ) {}

  public calcularTotal(): number {
    return this.valor * 1.1;
  }

  public salvarNoBanco(): void {
    console.log("Salvando pedido no banco de dados");
  }

  public enviarEmailConfirmacao(): void {
    console.log(`Enviando e-mail para ${this.cliente}`);
  }

  public gerarNotaFiscal(): void {
    console.log("Gerando nota fiscal");
  }
}
```

---

## Por que quebra?

A classe `Pedido` possui várias responsabilidades diferentes:

```text
calcular regra de negócio;
salvar no banco de dados;
enviar e-mail;
gerar nota fiscal.
```

Ela pode mudar por vários motivos:

```text
mudou a regra de cálculo;
mudou o banco de dados;
mudou o formato do e-mail;
mudou a regra de emissão de nota fiscal.
```

Portanto, ela viola a Responsabilidade Única.

---

## Código corrigido

```ts
class Pedido {
  constructor(
    public cliente: string,
    public valor: number
  ) {}

  public calcularTotal(): number {
    return this.valor * 1.1;
  }
}

class PedidoRepository {
  public salvar(pedido: Pedido): void {
    console.log(`Salvando pedido de ${pedido.cliente}`);
  }
}

class EmailService {
  public enviarConfirmacao(pedido: Pedido): void {
    console.log(`Enviando e-mail para ${pedido.cliente}`);
  }
}

class NotaFiscalService {
  public gerar(pedido: Pedido): void {
    console.log(`Gerando nota fiscal no valor de ${pedido.calcularTotal()}`);
  }
}
```

Agora cada classe tem uma responsabilidade:

| Classe | Responsabilidade |
|---|---|
| `Pedido` | Representar o pedido e calcular seu total |
| `PedidoRepository` | Salvar pedido |
| `EmailService` | Enviar e-mail |
| `NotaFiscalService` | Gerar nota fiscal |

---

# 5. O - Open/Closed Principle

## Ideia

O **Princípio Aberto/Fechado** diz que:

> Uma classe deve estar aberta para extensão, mas fechada para modificação.

Ou seja, devemos conseguir adicionar novos comportamentos sem precisar alterar uma classe que já existe e já funciona.

Esse princípio aparece muito em provas com códigos que têm muitos `if`, `else if` ou `switch`.

---

## Exemplo quebrando o princípio

```ts
class CalculadoraDesconto {
  public calcular(tipoCliente: string, valor: number): number {
    if (tipoCliente === "comum") {
      return valor * 0.05;
    }

    if (tipoCliente === "vip") {
      return valor * 0.1;
    }

    if (tipoCliente === "premium") {
      return valor * 0.15;
    }

    return 0;
  }
}
```

---

## Por que quebra?

A classe `CalculadoraDesconto` precisa ser modificada sempre que surgir um novo tipo de cliente.

Exemplo:

```text
cliente black;
cliente funcionário;
cliente parceiro;
cliente estudante.
```

Para cada novo tipo, seria necessário adicionar mais um `if`.

Isso quebra o Aberto/Fechado porque a classe não está fechada para modificação.

---

## Código corrigido com Strategy

```ts
interface DescontoStrategy {
  calcular(valor: number): number;
}

class DescontoComum implements DescontoStrategy {
  public calcular(valor: number): number {
    return valor * 0.05;
  }
}

class DescontoVip implements DescontoStrategy {
  public calcular(valor: number): number {
    return valor * 0.1;
  }
}

class DescontoPremium implements DescontoStrategy {
  public calcular(valor: number): number {
    return valor * 0.15;
  }
}

class CalculadoraDesconto {
  constructor(private descontoStrategy: DescontoStrategy) {}

  public calcular(valor: number): number {
    return this.descontoStrategy.calcular(valor);
  }
}
```

Agora, para adicionar um novo desconto, criamos uma nova classe:

```ts
class DescontoBlack implements DescontoStrategy {
  public calcular(valor: number): number {
    return valor * 0.2;
  }
}
```

A classe `CalculadoraDesconto` não precisa ser alterada.

---

## Resposta curta de prova

> O código quebrava o Princípio Aberto/Fechado porque toda vez que surgisse um novo tipo de desconto seria necessário modificar a classe existente. A correção foi criar uma abstração para o comportamento variável e implementar cada tipo de desconto em uma classe separada. Assim, novos descontos são adicionados por extensão, sem alterar a calculadora.

---

# 6. L - Liskov Substitution Principle

## Ideia

O **Princípio da Substituição de Liskov** diz que:

> Uma subclasse deve poder substituir sua superclasse sem quebrar o comportamento esperado do sistema.

Se uma função espera um objeto da classe pai, ela deve funcionar corretamente com qualquer subclasse.

---

## Exemplo quebrando o princípio

```ts
class Ave {
  public voar(): void {
    console.log("Voando");
  }
}

class Pinguim extends Ave {
  public voar(): void {
    throw new Error("Pinguim não voa");
  }
}
```

Uso:

```ts
function fazerAveVoar(ave: Ave): void {
  ave.voar();
}

fazerAveVoar(new Pinguim());
```

---

## Por que quebra?

`Pinguim` herda de `Ave`, mas não consegue cumprir o comportamento esperado de `Ave`.

Se o sistema espera que toda `Ave` consiga voar, `Pinguim` quebra essa expectativa.

A subclasse não substitui corretamente a superclasse.

---

## Código corrigido

```ts
class Ave {
  public comer(): void {
    console.log("Comendo");
  }
}

class AveVoadora extends Ave {
  public voar(): void {
    console.log("Voando");
  }
}

class Pardal extends AveVoadora {}

class Pinguim extends Ave {
  public nadar(): void {
    console.log("Nadando");
  }
}
```

Uso correto:

```ts
function fazerAveVoar(ave: AveVoadora): void {
  ave.voar();
}

fazerAveVoar(new Pardal());
```

Agora somente aves que realmente voam herdam de `AveVoadora`.

---

## Resposta curta de prova

> O código quebrava Liskov porque `Pinguim` era tratado como uma `Ave` que deveria voar, mas ao chamar `voar()` o sistema quebrava. A correção foi separar o conceito de ave comum do conceito de ave voadora, evitando que subclasses sejam obrigadas a oferecer comportamentos que não conseguem cumprir.

---

# 7. I - Interface Segregation Principle

## Ideia

O **Princípio da Segregação de Interfaces** diz que:

> Uma classe não deve ser obrigada a implementar métodos que não usa.

É melhor ter interfaces pequenas e específicas do que uma interface grande e genérica.

---

## Exemplo quebrando o princípio

```ts
interface Trabalhador {
  trabalhar(): void;
  comer(): void;
  dormir(): void;
}

class Humano implements Trabalhador {
  public trabalhar(): void {
    console.log("Humano trabalhando");
  }

  public comer(): void {
    console.log("Humano comendo");
  }

  public dormir(): void {
    console.log("Humano dormindo");
  }
}

class Robo implements Trabalhador {
  public trabalhar(): void {
    console.log("Robô trabalhando");
  }

  public comer(): void {
    throw new Error("Robô não come");
  }

  public dormir(): void {
    throw new Error("Robô não dorme");
  }
}
```

---

## Por que quebra?

A classe `Robo` foi obrigada a implementar métodos que não fazem sentido para ela:

```text
comer();
dormir();
```

Isso indica que a interface `Trabalhador` está grande demais e mistura responsabilidades diferentes.

---

## Código corrigido

```ts
interface Trabalhavel {
  trabalhar(): void;
}

interface Alimentavel {
  comer(): void;
}

interface Descansavel {
  dormir(): void;
}

class Humano implements Trabalhavel, Alimentavel, Descansavel {
  public trabalhar(): void {
    console.log("Humano trabalhando");
  }

  public comer(): void {
    console.log("Humano comendo");
  }

  public dormir(): void {
    console.log("Humano dormindo");
  }
}

class Robo implements Trabalhavel {
  public trabalhar(): void {
    console.log("Robô trabalhando");
  }
}
```

Agora cada classe implementa apenas aquilo que realmente faz sentido.

---

## Resposta curta de prova

> O código quebrava Segregação de Interfaces porque a classe `Robo` era obrigada a implementar métodos que não usava, como `comer()` e `dormir()`. A correção foi dividir a interface grande em interfaces menores e mais específicas, permitindo que cada classe implemente apenas os contratos necessários.

---

# 8. D - Dependency Inversion Principle

## Ideia

O **Princípio da Inversão de Dependência** diz que:

> Módulos de alto nível não devem depender de módulos de baixo nível. Ambos devem depender de abstrações.

Outra forma simples de lembrar:

> Dependa de interfaces, não de classes concretas.

---

## Exemplo quebrando o princípio

```ts
class EmailService {
  public enviar(mensagem: string): void {
    console.log(`Enviando e-mail: ${mensagem}`);
  }
}

class PedidoService {
  private emailService = new EmailService();

  public finalizarPedido(): void {
    this.emailService.enviar("Pedido finalizado");
  }
}
```

---

## Por que quebra?

A classe `PedidoService` depende diretamente da classe concreta `EmailService`.

Isso gera alto acoplamento.

Se amanhã o sistema precisar enviar SMS, WhatsApp ou notificação push, será necessário modificar `PedidoService`.

---

## Código corrigido

```ts
interface NotificacaoService {
  enviar(mensagem: string): void;
}

class EmailService implements NotificacaoService {
  public enviar(mensagem: string): void {
    console.log(`Enviando e-mail: ${mensagem}`);
  }
}

class SmsService implements NotificacaoService {
  public enviar(mensagem: string): void {
    console.log(`Enviando SMS: ${mensagem}`);
  }
}

class PedidoService {
  constructor(private notificacaoService: NotificacaoService) {}

  public finalizarPedido(): void {
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

Agora `PedidoService` depende da abstração `NotificacaoService`, e não de uma classe concreta.

---

## Resposta curta de prova

> O código quebrava Inversão de Dependência porque `PedidoService`, que representa uma regra de alto nível, dependia diretamente da classe concreta `EmailService`. A correção foi criar uma interface `NotificacaoService` e fazer `PedidoService` depender dessa abstração. Assim, é possível trocar e-mail por SMS ou outro serviço sem alterar a regra de negócio.

---

# 9. Relação entre SOLID e os padrões da apresentação

## Factory

Factory ajuda a reduzir acoplamento porque centraliza a criação de objetos.

Pode ajudar no Aberto/Fechado quando evita espalhar `new ClasseConcreta()` pelo sistema.

---

## Strategy

Strategy se relaciona fortemente com:

```text
Aberto/Fechado;
Inversão de Dependência;
Responsabilidade Única.
```

Ele separa algoritmos em classes diferentes.

---

## Observer

Observer se relaciona com:

```text
Aberto/Fechado;
Inversão de Dependência;
baixo acoplamento.
```

O sujeito depende da interface `Observer`, não dos observadores concretos.

---

## Decorator

Decorator se relaciona com:

```text
Aberto/Fechado;
Responsabilidade Única;
composição.
```

Novos comportamentos são adicionados criando novos decoradores.

---

## Adapter

Adapter se relaciona com:

```text
Inversão de Dependência;
Aberto/Fechado;
baixo acoplamento.
```

O cliente depende de uma interface esperada, e o adaptador traduz uma classe incompatível para essa interface.

---

## Proxy

Proxy se relaciona com:

```text
Responsabilidade Única;
Aberto/Fechado;
Information Hiding.
```

Ele adiciona cache, log, validação ou controle de acesso sem modificar o objeto real.

---

## Facade

Facade ajuda com:

```text
baixo acoplamento;
Information Hiding.
```

Mas pode violar Responsabilidade Única se virar uma classe grande que faz tudo.

---

## Template Method

Template Method se relaciona com:

```text
Inversão de Controle;
Aberto/Fechado;
reuso por herança.
```

A classe pai define o fluxo e as subclasses implementam passos específicos.

---

## Visitor

Visitor se relaciona com:

```text
Aberto/Fechado para novas operações;
polimorfismo;
separação entre dados e operações.
```

Ele facilita adicionar novas operações, mas dificulta adicionar novos tipos na hierarquia.

---

# 10. Como identificar cada princípio em uma questão

## Responsabilidade Única

Sinais:

```text
uma classe faz coisas de áreas diferentes;
classe salva no banco, envia e-mail e calcula regra;
muitos motivos para mudar.
```

---

## Aberto/Fechado

Sinais:

```text
muitos if/else;
switch por tipo;
precisa alterar classe existente para novo comportamento;
vários tipos concretos testados na mesma classe.
```

---

## Liskov

Sinais:

```text
subclasse lança erro em método herdado;
subclasse enfraquece comportamento da classe pai;
uma subclasse não pode ser usada no lugar da superclasse.
```

---

## Segregação de Interfaces

Sinais:

```text
interface grande demais;
classe implementa método vazio;
classe lança erro em método que não faz sentido;
classe é obrigada a implementar o que não usa.
```

---

## Inversão de Dependência

Sinais:

```text
classe de alto nível instancia classe concreta com new;
serviço depende diretamente de banco, e-mail ou API externa;
não existe interface/abstração;
alto acoplamento com detalhes.
```

---

# 11. Resumo rápido para prova

```text
S - Uma classe deve ter apenas um motivo para mudar.
O - Deve ser possível adicionar comportamento sem alterar classe existente.
L - Subclasses devem substituir superclasses sem quebrar o sistema.
I - Interfaces devem ser pequenas e específicas.
D - Dependa de abstrações, não de implementações concretas.
```

---

# 12. Frases para memorizar

> SOLID é um conjunto de princípios que ajuda a criar software mais flexível, organizado e fácil de manter.

> Responsabilidade Única busca alta coesão e evita classes com muitos motivos para mudar.

> Aberto/Fechado evita que classes existentes precisem ser alteradas a cada nova funcionalidade.

> Liskov exige que subclasses respeitem o comportamento esperado da superclasse.

> Segregação de Interfaces evita interfaces grandes que obrigam classes a implementar métodos desnecessários.

> Inversão de Dependência reduz acoplamento fazendo o código depender de abstrações.
