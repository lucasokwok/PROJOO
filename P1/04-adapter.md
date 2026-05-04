# 04 - Adapter

## 1. Ideia principal

O **Adapter** é um padrão de projeto usado quando queremos utilizar uma classe que já existe, mas ela possui uma **interface incompatível** com o que o nosso sistema espera.

A ideia central é:

> Adapter cria uma classe intermediária que adapta uma interface existente para a interface esperada pelo cliente.

Em outras palavras, o Adapter funciona como um **tradutor**.

O cliente espera falar em um determinado “formato”, mas a classe existente fala em outro. O Adapter fica no meio e converte uma chamada na outra.

Fluxo geral:

```text
Cliente ---> Interface esperada ---> Adapter ---> Classe incompatível
```

---

## 2. Problema que o Adapter resolve

Imagine que o seu sistema foi projetado para trabalhar com uma interface chamada `Projetor`.

Exemplo:

```ts
interface Projetor {
  ligar(): void;
  desligar(): void;
  definirEntrada(entrada: string): void;
}
```

O sistema todo espera usar objetos desse tipo:

```ts
class SistemaMultimidia {
  constructor(private projetor: Projetor) {}

  public iniciarApresentacao(): void {
    this.projetor.ligar();
    this.projetor.definirEntrada("HDMI");
  }
}
```

O problema é que você recebeu uma classe pronta de um fabricante, por exemplo `ProjetorSamsung`, mas ela não implementa a interface `Projetor`.

Exemplo:

```ts
class ProjetorSamsung {
  public turnOn(): void {
    console.log("Projetor Samsung ligado");
  }

  public turnOff(): void {
    console.log("Projetor Samsung desligado");
  }

  public selectInput(source: string): void {
    console.log(`Entrada Samsung selecionada: ${source}`);
  }
}
```

Essa classe faz praticamente o que precisamos, mas com nomes de métodos diferentes:

```text
Projetor espera: ligar()
Samsung oferece: turnOn()

Projetor espera: desligar()
Samsung oferece: turnOff()

Projetor espera: definirEntrada()
Samsung oferece: selectInput()
```

O sistema quer usar `Projetor`, mas a classe pronta é `ProjetorSamsung`.

Além disso, normalmente não podemos alterar a classe do fabricante.

O problema é:

> Como usar uma classe existente, externa ou legada, que possui uma interface incompatível com a interface esperada pelo sistema?

---

## 3. Solução com Adapter

A solução é criar uma classe adaptadora.

Essa classe implementa a interface esperada pelo sistema, mas internamente chama a classe incompatível.

Exemplo:

```ts
class AdaptadorProjetorSamsung implements Projetor {
  constructor(private projetorSamsung: ProjetorSamsung) {}

  public ligar(): void {
    this.projetorSamsung.turnOn();
  }

  public desligar(): void {
    this.projetorSamsung.turnOff();
  }

  public definirEntrada(entrada: string): void {
    this.projetorSamsung.selectInput(entrada);
  }
}
```

Agora o sistema pode usar o projetor Samsung sem conhecer diretamente a classe `ProjetorSamsung`.

Uso:

```ts
const projetorSamsung = new ProjetorSamsung();
const projetor: Projetor = new AdaptadorProjetorSamsung(projetorSamsung);

const sistema = new SistemaMultimidia(projetor);

sistema.iniciarApresentacao();
```

O `SistemaMultimidia` continua dependendo apenas da interface `Projetor`.

Ele não precisa saber que por trás existe um `ProjetorSamsung`.

---

## 4. Exemplo da apresentação

Na apresentação, o exemplo usado é um **sistema para controlar projetores multimídia**.

O sistema deseja manipular todos os projetores por meio de uma única interface, chamada conceitualmente de `Projetor`.

Porém, as classes dos fabricantes não seguem essa interface.

A solução apresentada é criar uma classe adaptadora.

No exemplo:

```text
Projetor
    ^
    |
AdaptadorProjetorSamsung
    |
    v
ProjetorSamsung
```

A classe `AdaptadorProjetorSamsung` implementa a interface `Projetor` e, internamente, usa a classe `ProjetorSamsung`.

---

## 5. Papéis no padrão Adapter

O padrão Adapter possui três papéis principais:

| Papel | Significado | Exemplo dos projetores |
|---|---|---|
| Target | Interface esperada pelo cliente | `Projetor` |
| Adapter | Classe que faz a adaptação | `AdaptadorProjetorSamsung` |
| Adaptee | Classe existente com interface incompatível | `ProjetorSamsung` |

---

## 6. Target

O **Target** é a interface que o cliente espera usar.

No exemplo:

```ts
interface Projetor {
  ligar(): void;
  desligar(): void;
  definirEntrada(entrada: string): void;
}
```

O cliente foi programado para depender dessa interface.

Exemplo:

```ts
class SistemaMultimidia {
  constructor(private projetor: Projetor) {}

  public iniciarApresentacao(): void {
    this.projetor.ligar();
    this.projetor.definirEntrada("HDMI");
  }
}
```

O sistema não quer saber qual é o fabricante do projetor.

Ele só quer algo que cumpra o contrato `Projetor`.

---

## 7. Adaptee

O **Adaptee** é a classe existente que queremos reaproveitar, mas que possui uma interface incompatível.

Exemplo:

```ts
class ProjetorSamsung {
  public turnOn(): void {
    console.log("Projetor Samsung ligado");
  }

  public turnOff(): void {
    console.log("Projetor Samsung desligado");
  }

  public selectInput(source: string): void {
    console.log(`Entrada Samsung selecionada: ${source}`);
  }
}
```

Essa classe já existe e funciona, mas não possui os métodos esperados pelo sistema.

Ela não tem:

```text
ligar()
desligar()
definirEntrada()
```

Ela tem:

```text
turnOn()
turnOff()
selectInput()
```

---

## 8. Adapter

O **Adapter** é a classe que conecta o Target ao Adaptee.

Exemplo:

```ts
class AdaptadorProjetorSamsung implements Projetor {
  constructor(private projetorSamsung: ProjetorSamsung) {}

  public ligar(): void {
    this.projetorSamsung.turnOn();
  }

  public desligar(): void {
    this.projetorSamsung.turnOff();
  }

  public definirEntrada(entrada: string): void {
    this.projetorSamsung.selectInput(entrada);
  }
}
```

O Adapter implementa a interface que o cliente espera.

Mas, internamente, ele chama os métodos da classe incompatível.

---

## 9. Código completo em TypeScript

```ts
interface Projetor {
  ligar(): void;
  desligar(): void;
  definirEntrada(entrada: string): void;
}

class ProjetorSamsung {
  public turnOn(): void {
    console.log("Projetor Samsung ligado");
  }

  public turnOff(): void {
    console.log("Projetor Samsung desligado");
  }

  public selectInput(source: string): void {
    console.log(`Entrada Samsung selecionada: ${source}`);
  }
}

class AdaptadorProjetorSamsung implements Projetor {
  constructor(private projetorSamsung: ProjetorSamsung) {}

  public ligar(): void {
    this.projetorSamsung.turnOn();
  }

  public desligar(): void {
    this.projetorSamsung.turnOff();
  }

  public definirEntrada(entrada: string): void {
    this.projetorSamsung.selectInput(entrada);
  }
}

class SistemaMultimidia {
  constructor(private projetor: Projetor) {}

  public iniciarApresentacao(): void {
    this.projetor.ligar();
    this.projetor.definirEntrada("HDMI");
  }

  public finalizarApresentacao(): void {
    this.projetor.desligar();
  }
}

const projetorSamsung = new ProjetorSamsung();
const projetorAdaptado: Projetor = new AdaptadorProjetorSamsung(projetorSamsung);

const sistema = new SistemaMultimidia(projetorAdaptado);

sistema.iniciarApresentacao();
sistema.finalizarApresentacao();
```

---

## 10. O que acontece nesse código?

Primeiro, temos a interface esperada:

```ts
interface Projetor {
  ligar(): void;
  desligar(): void;
  definirEntrada(entrada: string): void;
}
```

Depois, temos a classe incompatível:

```ts
class ProjetorSamsung {
  public turnOn(): void {}
  public turnOff(): void {}
  public selectInput(source: string): void {}
}
```

Em seguida, criamos o adaptador:

```ts
class AdaptadorProjetorSamsung implements Projetor {
  constructor(private projetorSamsung: ProjetorSamsung) {}
}
```

O adaptador recebe um `ProjetorSamsung` e o transforma em algo que pode ser usado como `Projetor`.

Por fim, o sistema usa apenas a interface:

```ts
const projetorAdaptado: Projetor = new AdaptadorProjetorSamsung(projetorSamsung);
```

O cliente não depende diretamente de `ProjetorSamsung`.

---

## 11. Diagrama conceitual

```text
+-----------------------+
|        Projetor       |  <<interface>>
+-----------------------+
| + ligar()             |
| + desligar()          |
| + definirEntrada()    |
+-----------------------+
            ^
            |
            | implements
            |
+-------------------------------+
| AdaptadorProjetorSamsung      |
+-------------------------------+
| - projetorSamsung             |
+-------------------------------+
| + ligar()                     |
| + desligar()                  |
| + definirEntrada()            |
+-------------------------------+
            |
            | usa
            v
+-----------------------+
|    ProjetorSamsung    |
+-----------------------+
| + turnOn()            |
| + turnOff()           |
| + selectInput()       |
+-----------------------+
```

---

## 12. Tipo de relação em UML

Na questão da apresentação, aparece um diagrama clássico do Adapter e é perguntado o tipo das relações.

Em geral:

```text
Adapter ----|> Target
```

Essa relação é **generalização/realização**, dependendo se `Target` é classe abstrata ou interface.

Em TypeScript, como `Target` é uma interface, dizemos que o Adapter **implementa** o Target.

```text
Adapter ---> Adaptee
```

Essa relação é uma **associação**, porque o Adapter possui uma referência para o Adaptee.

Aplicando ao exemplo:

```text
AdaptadorProjetorSamsung implementa Projetor.
AdaptadorProjetorSamsung possui/usa ProjetorSamsung.
```

Resposta de prova:

> A relação entre Adapter e Target é de generalização ou realização, pois o Adapter segue a interface esperada pelo cliente. A relação entre Adapter e Adaptee é de associação, pois o Adapter mantém uma referência para o objeto adaptado e delega chamadas para ele.

---

## 13. Relação com Inversão de Dependência

O Adapter se relaciona diretamente com o princípio da **Inversão de Dependência**.

Sem Adapter, o sistema poderia depender diretamente de uma classe concreta de fabricante:

```ts
class SistemaMultimidia {
  constructor(private projetor: ProjetorSamsung) {}
}
```

Isso é ruim porque o sistema fica acoplado à Samsung.

Se amanhã for necessário usar um projetor Epson, LG ou BenQ, o sistema precisará mudar.

Com Adapter, o sistema depende da abstração:

```ts
class SistemaMultimidia {
  constructor(private projetor: Projetor) {}
}
```

Agora qualquer projetor pode ser usado, desde que exista um adaptador para ele.

Exemplo:

```ts
const sistema = new SistemaMultimidia(
  new AdaptadorProjetorSamsung(new ProjetorSamsung())
);
```

O sistema depende da interface `Projetor`, e não da classe concreta do fabricante.

Resposta de prova:

> O Adapter favorece a Inversão de Dependência porque permite que o cliente dependa de uma abstração, como a interface `Projetor`, em vez de depender diretamente da classe concreta de um fabricante.

---

## 14. Relação com Aberto/Fechado

O Adapter também pode favorecer o **Princípio Aberto/Fechado**.

O sistema fica fechado para modificação, mas aberto para extensão.

Exemplo:

Se amanhã surgir um projetor Epson:

```ts
class ProjetorEpson {
  public powerOn(): void {
    console.log("Projetor Epson ligado");
  }

  public powerOff(): void {
    console.log("Projetor Epson desligado");
  }

  public input(source: string): void {
    console.log(`Entrada Epson: ${source}`);
  }
}
```

Não precisamos alterar `SistemaMultimidia`.

Criamos apenas um novo adaptador:

```ts
class AdaptadorProjetorEpson implements Projetor {
  constructor(private projetorEpson: ProjetorEpson) {}

  public ligar(): void {
    this.projetorEpson.powerOn();
  }

  public desligar(): void {
    this.projetorEpson.powerOff();
  }

  public definirEntrada(entrada: string): void {
    this.projetorEpson.input(entrada);
  }
}
```

Uso:

```ts
const projetor: Projetor = new AdaptadorProjetorEpson(new ProjetorEpson());
const sistema = new SistemaMultimidia(projetor);
```

A classe `SistemaMultimidia` continua igual.

Resposta de prova:

> Adapter pode favorecer o Princípio Aberto/Fechado porque novos tipos de objetos incompatíveis podem ser integrados por meio de novos adaptadores, sem modificar o código cliente.

---

## 15. Exemplo próximo do exercício de notificações

Imagine que seu sistema trabalha com esta interface:

```ts
interface Notification {
  send(to: string, message: string): string;
}
```

O sistema espera que toda notificação tenha o método `send()`.

Agora imagine que você recebeu uma API externa de SMS com outro formato:

```ts
class ExternalSmsApi {
  public sendSms(phoneNumber: string, text: string): boolean {
    console.log(`SMS externo enviado para ${phoneNumber}: ${text}`);
    return true;
  }
}
```

Essa API não implementa `Notification`.

Ela tem `sendSms()`, não `send()`.

Criamos então um Adapter:

```ts
class SmsApiAdapter implements Notification {
  constructor(private externalSmsApi: ExternalSmsApi) {}

  public send(to: string, message: string): string {
    const success = this.externalSmsApi.sendSms(to, message);

    if (success) {
      return "SMS enviado com sucesso";
    }

    return "Erro ao enviar SMS";
  }
}
```

Uso:

```ts
const smsNotification: Notification = new SmsApiAdapter(new ExternalSmsApi());

const result = smsNotification.send("11999999999", "Olá");

console.log(result);
```

Agora a API externa pode ser usada dentro do sistema como se fosse uma `Notification`.

---

## 16. Adapter com serviço externo

Esse é um caso muito comum em sistemas reais.

Você cria sua aplicação com uma interface própria:

```ts
interface PaymentGateway {
  pay(value: number): void;
}
```

Mas a API externa tem outro formato:

```ts
class StripeApi {
  public createCharge(amountInCents: number): void {
    console.log(`Cobrando ${amountInCents} centavos pela Stripe`);
  }
}
```

Adapter:

```ts
class StripeAdapter implements PaymentGateway {
  constructor(private stripeApi: StripeApi) {}

  public pay(value: number): void {
    const amountInCents = value * 100;
    this.stripeApi.createCharge(amountInCents);
  }
}
```

Cliente:

```ts
class CheckoutService {
  constructor(private paymentGateway: PaymentGateway) {}

  public checkout(total: number): void {
    this.paymentGateway.pay(total);
  }
}

const gateway: PaymentGateway = new StripeAdapter(new StripeApi());
const checkout = new CheckoutService(gateway);

checkout.checkout(150);
```

O `CheckoutService` não sabe que está usando Stripe.

Ele sabe apenas que usa um `PaymentGateway`.

---

## 17. Diferença entre Adapter e Proxy

Adapter e Proxy podem parecer parecidos porque ambos ficam entre o cliente e outra classe.

Mas a intenção é diferente.

| Adapter | Proxy |
|---|---|
| Converte uma interface incompatível em outra | Controla o acesso ao objeto real |
| Usado quando a classe existente não segue a interface esperada | Usado quando queremos adicionar cache, log, segurança etc. |
| O foco é compatibilidade | O foco é controle/intermediação |
| Normalmente traduz métodos | Normalmente adiciona comportamento antes/depois da chamada |

Exemplo de Adapter:

```text
O sistema espera send(), mas a API externa oferece sendSms().
```

Exemplo de Proxy:

```text
Antes de chamar getBook(), verifica se o resultado já está no cache.
```

---

## 18. Diferença entre Adapter e Facade

| Adapter | Facade |
|---|---|
| Adapta uma interface incompatível | Simplifica o uso de um subsistema complexo |
| Normalmente envolve uma classe ou API incompatível | Normalmente coordena várias classes internas |
| Foco em compatibilidade | Foco em simplicidade |
| Converte chamadas | Esconde complexidade |

Exemplo de Adapter:

```text
Adaptar ProjetorSamsung para a interface Projetor.
```

Exemplo de Facade:

```text
Criar HomeTheaterFacade para controlar TV, projetor, som, luz e receiver.
```

---

## 19. Quando usar Adapter

Use Adapter quando:

```text
uma classe existente tem métodos incompatíveis com o que o sistema espera;
você não pode ou não quer modificar essa classe;
quer integrar uma biblioteca, API externa ou código legado;
quer manter o cliente dependendo de uma interface própria;
quer reduzir acoplamento com classes concretas externas.
```

Exemplos típicos:

```text
Adaptar API externa de SMS.
Adaptar biblioteca de pagamento.
Adaptar classe legada.
Adaptar serviço de e-mail.
Adaptar projetores de fabricantes diferentes.
Adaptar formato de dados vindo de outro sistema.
```

---

## 20. Quando não usar Adapter

Evite Adapter quando:

```text
a classe já implementa a interface esperada;
você pode alterar a classe original de forma simples;
a adaptação não agrega valor;
o sistema é pequeno e não existe risco real de mudança;
a solução cria classes extras sem necessidade.
```

Nesse caso, usar Adapter pode virar overengineering.

---

## 21. Como identificar Adapter em uma prova

Procure por sinais como:

```text
classe externa;
biblioteca de terceiro;
código legado;
interface incompatível;
métodos com nomes diferentes;
sistema espera uma interface, mas a classe existente oferece outra;
não é possível modificar a classe existente.
```

Palavras-chave:

```text
adaptar
compatibilizar
integrar
classe legada
serviço externo
interface incompatível
Target
Adapter
Adaptee
```

---

## 22. Possível pergunta de prova

### Pergunta

Explique o padrão Adapter e aplique ao exemplo dos projetores visto em aula.

### Resposta sugerida

O padrão Adapter é usado quando queremos utilizar uma classe existente que possui uma interface incompatível com a interface esperada pelo sistema. Para isso, criamos uma classe adaptadora que implementa a interface esperada pelo cliente e, internamente, chama os métodos da classe incompatível. No exemplo dos projetores, `Projetor` é o Target, `AdaptadorProjetorSamsung` é o Adapter e `ProjetorSamsung` é o Adaptee. Assim, o sistema pode trabalhar apenas com a interface `Projetor`, sem depender diretamente da classe concreta do fabricante.

---

## 23. Outra possível pergunta de prova

### Pergunta

Mapeie Target, Adapter e Adaptee para o exemplo de projetores.

### Resposta sugerida

No exemplo de projetores, o `Target` é a interface `Projetor`, pois é a interface esperada pelo sistema cliente. O `Adapter` é a classe `AdaptadorProjetorSamsung`, pois ela implementa `Projetor` e traduz as chamadas para a classe concreta. O `Adaptee` é a classe `ProjetorSamsung`, pois é a classe existente do fabricante que possui uma interface incompatível com a interface esperada.

---

## 24. Outra possível pergunta de prova

### Pergunta

Qual princípio SOLID é favorecido pelo uso do Adapter no exemplo dos projetores?

### Resposta sugerida

O Adapter favorece principalmente a Inversão de Dependência, pois o sistema cliente passa a depender da interface `Projetor`, e não da classe concreta `ProjetorSamsung`. Também pode favorecer o Princípio Aberto/Fechado, pois novos projetores podem ser integrados criando novos adaptadores, sem alterar o código do cliente.

---

## 25. Resumo final

Adapter é:

```text
Um padrão que adapta uma classe com interface incompatível para a interface esperada pelo sistema.
```

Estrutura:

```text
Cliente -> Target -> Adapter -> Adaptee
```

No exemplo dos projetores:

```text
Target  = Projetor
Adapter = AdaptadorProjetorSamsung
Adaptee = ProjetorSamsung
```

Serve para:

```text
integrar classes externas;
usar APIs incompatíveis;
aproveitar código legado;
manter o cliente dependente de uma interface própria;
evitar alterar classes de terceiros.
```

Vantagens:

```text
reduz acoplamento com classes concretas externas;
favorece Inversão de Dependência;
pode favorecer Aberto/Fechado;
permite reaproveitar classes existentes;
mantém o cliente trabalhando com uma interface padronizada.
```

Frase para memorizar:

> Adapter é um tradutor entre a interface que o sistema espera e a interface que uma classe existente oferece.
