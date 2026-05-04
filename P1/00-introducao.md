# 01 — Conceitos básicos de POO para entender Padrões de Projeto

Este resumo serve como uma revisão rápida dos principais conceitos de **Programação Orientada a Objetos (POO)** necessários para entender os padrões de projeto vistos na disciplina, como **Factory, Singleton, Proxy, Adapter, Facade, Decorator, Strategy, Observer, Template Method e Visitor**.

A ideia não é revisar POO em profundidade, mas lembrar os conceitos essenciais para conseguir interpretar diagramas, códigos e perguntas de prova.

---

## 1. Classe

Uma **classe** é um molde para criar objetos.

Ela define quais **atributos** e **métodos** os objetos daquele tipo terão.

Exemplo:

```ts
class Carro {
  marca: string;
  modelo: string;

  ligar(): void {
    console.log("Carro ligado");
  }
}
```

Nesse exemplo, `Carro` é uma classe. Ela ainda não representa um carro específico, mas define como um carro será dentro do sistema.

Resumo:

```text
Classe = molde, modelo, estrutura
```

---

## 2. Objeto

Um **objeto** é uma instância de uma classe.

Ou seja, é algo criado a partir do molde definido pela classe.

Exemplo:

```ts
const carro1 = new Carro();
const carro2 = new Carro();
```

`carro1` e `carro2` são objetos diferentes, mas ambos foram criados a partir da classe `Carro`.

Resumo:

```text
Objeto = instância concreta de uma classe
```

Analogia:

```text
Classe = planta de uma casa
Objeto = casa construída a partir da planta
```

---

## 3. Atributo

Um **atributo** é uma informação armazenada dentro de um objeto.

Exemplo:

```ts
class Carro {
  marca: string;
  modelo: string;
  velocidade: number;
}
```

Aqui, `marca`, `modelo` e `velocidade` são atributos.

Eles representam o **estado** do objeto.

Exemplo:

```ts
const carro = new Carro();
carro.marca = "Toyota";
carro.modelo = "Corolla";
carro.velocidade = 0;
```

Resumo:

```text
Atributo = dado/informação do objeto
```

---

## 4. Método

Um **método** é uma função que pertence a uma classe.

Ele representa um comportamento do objeto.

Exemplo:

```ts
class Carro {
  velocidade: number = 0;

  acelerar(): void {
    this.velocidade += 10;
  }

  frear(): void {
    this.velocidade -= 10;
  }
}
```

Resumo:

```text
Método = comportamento/ação do objeto
```

Exemplo conceitual:

```text
Carro tem: marca, modelo, velocidade
Carro faz: ligar, acelerar, frear
```

---

## 5. Construtor

O **construtor** é um método especial executado quando um objeto é criado.

Ele normalmente serve para inicializar os atributos do objeto.

Exemplo:

```ts
class Carro {
  constructor(
    public marca: string,
    public modelo: string,
  ) {}
}

const carro = new Carro("Toyota", "Corolla");
```

Quando fazemos `new Carro(...)`, o construtor da classe é chamado.

Resumo:

```text
Construtor = inicializa o objeto no momento da criação
```

---

## 6. Encapsulamento

**Encapsulamento** é o princípio de esconder os detalhes internos de uma classe e controlar o acesso aos seus dados.

Em vez de permitir que qualquer parte do sistema altere diretamente os atributos, a classe fornece métodos para controlar essas alterações.

Exemplo ruim:

```ts
class Conta {
  saldo: number = 0;
}

const conta = new Conta();
conta.saldo = -500;
```

Nesse exemplo, o saldo pode ser alterado livremente, inclusive para um valor inválido.

Exemplo melhor:

```ts
class Conta {
  private saldo: number = 0;

  depositar(valor: number): void {
    if (valor > 0) {
      this.saldo += valor;
    }
  }

  consultarSaldo(): number {
    return this.saldo;
  }
}
```

Agora o atributo `saldo` está protegido e só pode ser alterado por métodos da própria classe.

Resumo:

```text
Encapsulamento = esconder detalhes internos e controlar acesso
```

---

## 7. Interface

Uma **interface** é um contrato.

Ela define quais métodos uma classe deve possuir, mas não define como esses métodos serão implementados.

Exemplo:

```ts
interface Notificacao {
  enviar(destinatario: string, mensagem: string): void;
}
```

Essa interface diz que qualquer classe que quiser ser uma `Notificacao` precisa ter o método `enviar`.

Exemplo de classes que implementam essa interface:

```ts
class EmailNotificacao implements Notificacao {
  enviar(destinatario: string, mensagem: string): void {
    console.log(`Enviando e-mail para ${destinatario}: ${mensagem}`);
  }
}

class SmsNotificacao implements Notificacao {
  enviar(destinatario: string, mensagem: string): void {
    console.log(`Enviando SMS para ${destinatario}: ${mensagem}`);
  }
}
```

As duas classes são diferentes, mas seguem o mesmo contrato.

Resumo:

```text
Interface = contrato que define o que uma classe deve fazer
```

A interface é muito importante em padrões de projeto, porque permite programar dependendo de **abstrações**, e não de classes concretas.

Exemplo:

```ts
class Sistema {
  constructor(private notificacao: Notificacao) {}

  avisarUsuario(): void {
    this.notificacao.enviar("usuario@email.com", "Mensagem enviada");
  }
}
```

Nesse caso, `Sistema` não precisa saber se a notificação será por e-mail, SMS ou outro canal. Ele só depende da interface `Notificacao`.

---

## 8. Classe abstrata

Uma **classe abstrata** é uma classe que serve como base para outras classes.

Ela pode ter métodos prontos e também métodos abstratos, que obrigatoriamente devem ser implementados pelas subclasses.

Exemplo:

```ts
abstract class Funcionario {
  constructor(
    public nome: string,
    public salario: number,
  ) {}

  abstract calcularBonus(): number;

  exibirNome(): void {
    console.log(this.nome);
  }
}
```

A classe `Funcionario` não pode ser instanciada diretamente.

Exemplo de subclasses:

```ts
class Gerente extends Funcionario {
  calcularBonus(): number {
    return this.salario * 0.2;
  }
}

class Estagiario extends Funcionario {
  calcularBonus(): number {
    return this.salario * 0.05;
  }
}
```

Resumo:

```text
Classe abstrata = classe base incompleta, feita para ser herdada
```

Diferença simples:

```text
Interface = contrato, sem implementação obrigatória
Classe abstrata = contrato + código parcialmente pronto
```

---

## 9. Herança

**Herança** acontece quando uma classe reaproveita atributos e métodos de outra classe.

Exemplo:

```ts
class Animal {
  respirar(): void {
    console.log("Respirando");
  }
}

class Cachorro extends Animal {
  latir(): void {
    console.log("Au au");
  }
}
```

`Cachorro` herda de `Animal`.

Assim, um cachorro pode usar tanto os métodos da própria classe quanto os métodos herdados.

```ts
const cachorro = new Cachorro();
cachorro.respirar();
cachorro.latir();
```

Resumo:

```text
Herança = uma classe aproveita características de outra
```

Nos diagramas UML, herança normalmente aparece como uma seta com ponta triangular vazada apontando para a classe pai.

---

## 10. Implementação de interface

Quando uma classe segue o contrato definido por uma interface, dizemos que ela **implementa** a interface.

Exemplo:

```ts
interface Pagamento {
  pagar(valor: number): void;
}

class PagamentoCartao implements Pagamento {
  pagar(valor: number): void {
    console.log(`Pagando ${valor} no cartão`);
  }
}
```

Resumo:

```text
implements = a classe promete seguir o contrato da interface
```

Diferença importante:

```text
extends = herda de uma classe
implements = implementa uma interface
```

---

## 11. Polimorfismo

**Polimorfismo** significa que objetos diferentes podem ser tratados de forma comum por meio de uma mesma interface ou classe base.

Exemplo:

```ts
interface Animal {
  emitirSom(): void;
}

class Cachorro implements Animal {
  emitirSom(): void {
    console.log("Au au");
  }
}

class Gato implements Animal {
  emitirSom(): void {
    console.log("Miau");
  }
}
```

Agora posso tratar objetos diferentes como `Animal`:

```ts
const animais: Animal[] = [new Cachorro(), new Gato()];

for (const animal of animais) {
  animal.emitirSom();
}
```

Mesmo que `Cachorro` e `Gato` sejam classes diferentes, ambos podem ser tratados pela interface `Animal`.

Resumo:

```text
Polimorfismo = objetos diferentes respondem a uma mesma chamada de formas diferentes
```

Esse conceito é essencial para entender padrões como **Strategy, Observer, Decorator, Adapter, Proxy e Visitor**.

---

## 12. Abstração

**Abstração** é representar apenas o que é importante para o sistema, escondendo detalhes desnecessários.

Exemplo:

```ts
interface Notificacao {
  enviar(destinatario: string, mensagem: string): void;
}
```

O sistema não precisa saber se a mensagem será enviada por e-mail, SMS ou WhatsApp.

Ele só precisa saber que existe algo capaz de `enviar`.

Resumo:

```text
Abstração = focar no que importa e esconder detalhes concretos
```

Abstração é fundamental para entender o Princípio da Inversão de Dependência.

---

## 13. Acoplamento

**Acoplamento** é o grau de dependência entre partes do sistema.

Quando uma classe depende diretamente de outra classe concreta, dizemos que há alto acoplamento.

Exemplo com alto acoplamento:

```ts
class PedidoService {
  private notificacao = new EmailNotificacao();

  finalizarPedido(): void {
    this.notificacao.enviar("cliente@email.com", "Pedido finalizado");
  }
}
```

Aqui, `PedidoService` depende diretamente de `EmailNotificacao`.

Se amanhã o sistema precisar usar SMS, será necessário alterar `PedidoService`.

Exemplo com menor acoplamento:

```ts
class PedidoService {
  constructor(private notificacao: Notificacao) {}

  finalizarPedido(): void {
    this.notificacao.enviar("cliente@email.com", "Pedido finalizado");
  }
}
```

Agora `PedidoService` depende da interface `Notificacao`, e não de uma classe concreta.

Resumo:

```text
Acoplamento = quanto uma classe depende de outra
Baixo acoplamento = mais fácil modificar e testar
```

---

## 14. Coesão

**Coesão** é o quanto uma classe está focada em uma única responsabilidade.

Classe com baixa coesão:

```ts
class Pedido {
  calcularTotal(): void {}
  salvarNoBanco(): void {}
  enviarEmail(): void {}
  gerarPDF(): void {}
}
```

Essa classe faz muitas coisas diferentes.

Uma separação melhor seria:

```text
Pedido -> representa os dados e regras principais do pedido
PedidoRepository -> salva pedido no banco
EmailService -> envia e-mails
GeradorPDF -> gera documentos PDF
```

Resumo:

```text
Coesão = quanto uma classe está focada em uma responsabilidade
Alta coesão = classe mais clara e mais fácil de manter
```

Esse conceito está diretamente ligado ao Princípio da Responsabilidade Única.

---

## 15. Composição

**Composição** acontece quando uma classe usa objetos de outras classes internamente.

Exemplo:

```ts
class Motor {
  ligar(): void {
    console.log("Motor ligado");
  }
}

class Carro {
  constructor(private motor: Motor) {}

  ligar(): void {
    this.motor.ligar();
  }
}
```

Aqui, `Carro` possui ou usa um `Motor`.

Resumo:

```text
Composição = uma classe é formada ou funciona usando outros objetos
```

Composição é muito usada em padrões como **Decorator, Proxy, Adapter, Facade e Strategy**.

Frase comum em projeto de software:

```text
Prefira composição a herança quando quiser mais flexibilidade.
```

---

## 16. Delegação

**Delegação** acontece quando uma classe recebe uma chamada, mas repassa parte do trabalho para outro objeto.

Exemplo:

```ts
class PedidoService {
  constructor(private notificacao: Notificacao) {}

  finalizarPedido(): void {
    console.log("Pedido finalizado");
    this.notificacao.enviar("cliente@email.com", "Seu pedido foi finalizado");
  }
}
```

`PedidoService` não sabe enviar notificação diretamente. Ele delega isso para o objeto `notificacao`.

Resumo:

```text
Delegação = repassar uma responsabilidade para outro objeto
```

Delegação aparece em vários padrões de projeto.

---

## 17. Dependência

Uma classe tem uma **dependência** quando precisa de outra classe ou interface para funcionar.

Exemplo:

```ts
class RelatorioService {
  constructor(private exportador: Exportador) {}
}
```

`RelatorioService` depende de `Exportador`.

Quando essa dependência é uma interface ou abstração, o código tende a ser mais flexível.

Resumo:

```text
Dependência = algo que uma classe precisa para funcionar
```

---

## 18. Injeção de dependência

**Injeção de dependência** é uma forma de fornecer as dependências de uma classe por fora, normalmente pelo construtor.

Exemplo ruim:

```ts
class PedidoService {
  private notificacao = new EmailNotificacao();
}
```

A própria classe cria sua dependência.

Exemplo melhor:

```ts
class PedidoService {
  constructor(private notificacao: Notificacao) {}
}
```

Agora quem cria `PedidoService` escolhe qual implementação de `Notificacao` será usada.

Resumo:

```text
Injeção de dependência = receber dependências de fora, em vez de criá-las internamente
```

Esse conceito ajuda a entender a **Inversão de Dependência**.

---

## 19. Biblioteca

Uma **biblioteca** é um conjunto de códigos prontos que você chama quando precisa.

Você controla o fluxo do programa.

Exemplo:

```ts
import axios from "axios";

axios.get("https://api.exemplo.com/clientes");
```

Resumo:

```text
Biblioteca = seu código chama o código pronto
```

---

## 20. Framework

Um **framework** é uma estrutura maior que define o fluxo principal da aplicação.

Nesse caso, normalmente o framework chama o seu código.

Exemplo com React:

```tsx
function App() {
  return <h1>Olá</h1>;
}
```

Você escreve o componente, mas o React controla quando renderizar, atualizar e chamar seu código.

Resumo:

```text
Framework = estrutura que controla o fluxo e chama seu código
```

Diferença simples:

```text
Biblioteca: você chama ela.
Framework: ele chama você.
```

Essa ideia está relacionada com **Inversão de Controle**.

---

## 21. Inversão de Controle

**Inversão de Controle** acontece quando o controle do fluxo principal não está no seu código, mas em uma estrutura maior, como uma classe base ou framework.

Exemplo conceitual:

```ts
abstract class Processo {
  executar(): void {
    this.passo1();
    this.passo2();
    this.passo3();
  }

  abstract passo1(): void;
  abstract passo2(): void;
  abstract passo3(): void;
}
```

A classe `Processo` controla a ordem dos passos. As subclasses apenas implementam os detalhes.

Esse conceito aparece no padrão **Template Method**.

Resumo:

```text
Inversão de Controle = o fluxo principal chama o seu código, e não o contrário
```

---

## 22. Relação com SOLID

Os padrões de projeto aparecem muito ligados aos princípios SOLID.

### Responsabilidade Única

Uma classe deve ter apenas um motivo para mudar.

Conceitos relacionados:

```text
Coesão
Separação de responsabilidades
```

### Aberto/Fechado

Uma classe deve estar aberta para extensão, mas fechada para modificação.

Conceitos relacionados:

```text
Interface
Polimorfismo
Herança
Composição
Strategy
Decorator
Observer
Factory
```

### Inversão de Dependência

Classes de alto nível não devem depender de classes concretas de baixo nível. Ambas devem depender de abstrações.

Conceitos relacionados:

```text
Interface
Abstração
Injeção de dependência
Baixo acoplamento
```

---

## 23. Conceitos mais importantes para entender cada padrão

| Padrão          | Conceitos de POO mais importantes                               |
| --------------- | --------------------------------------------------------------- |
| Factory         | Classe, objeto, interface, abstração, acoplamento               |
| Singleton       | Classe, objeto, atributo estático, construtor privado           |
| Proxy           | Interface, composição, delegação, encapsulamento                |
| Adapter         | Interface, composição, delegação, abstração                     |
| Facade          | Encapsulamento, composição, baixo acoplamento                   |
| Decorator       | Interface, composição, polimorfismo, delegação                  |
| Strategy        | Interface, polimorfismo, injeção de dependência                 |
| Observer        | Interface, polimorfismo, lista de objetos, baixo acoplamento    |
| Template Method | Herança, classe abstrata, método abstrato, inversão de controle |
| Visitor         | Polimorfismo, herança, interface, double dispatch               |

---

## 24. Resumo final para revisar antes da prova

```text
Classe = molde para criar objetos.
Objeto = instância concreta de uma classe.
Atributo = dado armazenado no objeto.
Método = comportamento do objeto.
Construtor = inicializa o objeto.
Interface = contrato que define métodos obrigatórios.
Classe abstrata = classe base incompleta, com código comum e métodos abstratos.
Herança = uma classe reaproveita outra.
Polimorfismo = objetos diferentes tratados por uma mesma abstração.
Encapsulamento = esconder detalhes internos e controlar acesso.
Abstração = focar no essencial e esconder detalhes concretos.
Acoplamento = grau de dependência entre classes.
Coesão = foco de uma classe em uma responsabilidade.
Composição = uma classe usa objetos de outras classes.
Delegação = repassar trabalho para outro objeto.
Dependência = algo que uma classe precisa para funcionar.
Injeção de dependência = receber dependências de fora.
Biblioteca = você chama o código pronto.
Framework = estrutura que chama o seu código.
Inversão de Controle = o fluxo principal fica na estrutura base/framework.
```

---

## 25. Frases importantes para prova

> Uma interface permite programar para abstrações, e não para classes concretas.

> Polimorfismo permite tratar objetos diferentes de maneira uniforme.

> Baixo acoplamento facilita manutenção, testes e troca de implementações.

> Alta coesão significa que uma classe tem uma responsabilidade bem definida.

> Composição geralmente oferece mais flexibilidade do que herança.

> Padrões de projeto usam interfaces, polimorfismo e composição para tornar o sistema mais flexível a mudanças.
