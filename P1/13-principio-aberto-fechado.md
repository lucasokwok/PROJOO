# 13 - Princípio Aberto/Fechado

## 1. Ideia principal

O **Princípio Aberto/Fechado** é a letra **O** do SOLID.

Em inglês:

```text
Open/Closed Principle
```

A definição mais importante é:

> Uma classe deve estar aberta para extensão, mas fechada para modificação.

Isso significa que devemos conseguir adicionar novos comportamentos ao sistema sem precisar alterar o código de uma classe que já existe e já funciona.

---

## 2. O que significa “aberta para extensão”?

Uma classe está **aberta para extensão** quando conseguimos adicionar novos comportamentos sem mexer diretamente nela.

Normalmente fazemos isso usando:

```text
interfaces;
classes abstratas;
herança;
composição;
polimorfismo;
padrões como Strategy, Decorator, Observer e Factory.
```

Exemplo:

```text
Adicionar um novo tipo de desconto criando uma nova classe.
Adicionar um novo algoritmo criando uma nova estratégia.
Adicionar um novo observador criando uma nova classe Observer.
```

---

## 3. O que significa “fechada para modificação”?

Uma classe está **fechada para modificação** quando não precisamos alterar seu código interno toda vez que uma nova variação aparece.

Isso é importante porque uma classe já testada e funcionando deve ser modificada o mínimo possível.

Modificar código existente pode introduzir bugs.

---

## 4. Exemplo clássico de violação

Imagine uma classe que calcula desconto com base no tipo de cliente.

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

Uso:

```ts
const calculadora = new CalculadoraDesconto();

console.log(calculadora.calcular("vip", 1000));
```

---

## 5. Por que esse código quebra o princípio?

Esse código viola o Princípio Aberto/Fechado porque, toda vez que surgir um novo tipo de cliente, será necessário alterar a classe `CalculadoraDesconto`.

Exemplo:

```text
cliente black;
cliente estudante;
cliente funcionário;
cliente parceiro.
```

Para adicionar um novo tipo, precisaríamos abrir a classe e adicionar mais um `if`.

Exemplo:

```ts
if (tipoCliente === "black") {
  return valor * 0.2;
}
```

Isso significa que a classe não está fechada para modificação.

---

## 6. Código corrigido com Strategy

Uma forma comum de corrigir é usar o padrão **Strategy**.

Primeiro, criamos uma interface para o comportamento variável:

```ts
interface DescontoStrategy {
  calcular(valor: number): number;
}
```

Depois, criamos uma classe para cada tipo de desconto:

```ts
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
```

A calculadora passa a depender da abstração:

```ts
class CalculadoraDesconto {
  constructor(private descontoStrategy: DescontoStrategy) {}

  public calcular(valor: number): number {
    return this.descontoStrategy.calcular(valor);
  }
}
```

Uso:

```ts
const calculadoraVip = new CalculadoraDesconto(new DescontoVip());

console.log(calculadoraVip.calcular(1000));
```

---

## 7. Como adicionar um novo desconto agora?

Agora, para adicionar um desconto novo, criamos uma nova classe:

```ts
class DescontoBlack implements DescontoStrategy {
  public calcular(valor: number): number {
    return valor * 0.2;
  }
}
```

Uso:

```ts
const calculadoraBlack = new CalculadoraDesconto(new DescontoBlack());

console.log(calculadoraBlack.calcular(1000));
```

A classe `CalculadoraDesconto` não foi alterada.

Portanto, ela está:

```text
aberta para extensão: posso criar novos descontos;
fechada para modificação: não preciso alterar a calculadora.
```

---

## 8. Exemplo no estilo da prova antiga

### Código dado

```ts
class ExportadorRelatorio {
  public exportar(formato: string): void {
    if (formato === "pdf") {
      console.log("Exportando relatório em PDF");
    } else if (formato === "csv") {
      console.log("Exportando relatório em CSV");
    } else if (formato === "xlsx") {
      console.log("Exportando relatório em XLSX");
    }
  }
}
```

---

### O que está errado?

A classe `ExportadorRelatorio` viola o Princípio Aberto/Fechado.

Ela precisa ser modificada sempre que surgir um novo formato de exportação.

Exemplo:

```text
JSON;
XML;
HTML;
DOCX.
```

Para adicionar `JSON`, seria necessário alterar a classe e adicionar mais um `else if`.

Isso aumenta o risco de erro e torna o código menos flexível.

---

### Código corrigido

```ts
interface Exportador {
  exportar(): void;
}

class ExportadorPDF implements Exportador {
  public exportar(): void {
    console.log("Exportando relatório em PDF");
  }
}

class ExportadorCSV implements Exportador {
  public exportar(): void {
    console.log("Exportando relatório em CSV");
  }
}

class ExportadorXLSX implements Exportador {
  public exportar(): void {
    console.log("Exportando relatório em XLSX");
  }
}

class Relatorio {
  constructor(private exportador: Exportador) {}

  public exportar(): void {
    this.exportador.exportar();
  }
}
```

Uso:

```ts
const relatorioPDF = new Relatorio(new ExportadorPDF());
relatorioPDF.exportar();

const relatorioCSV = new Relatorio(new ExportadorCSV());
relatorioCSV.exportar();
```

---

### Nova extensão sem modificar a classe existente

```ts
class ExportadorJSON implements Exportador {
  public exportar(): void {
    console.log("Exportando relatório em JSON");
  }
}
```

Uso:

```ts
const relatorioJSON = new Relatorio(new ExportadorJSON());
relatorioJSON.exportar();
```

A classe `Relatorio` não precisou ser modificada.

---

## 9. Resposta pronta para prova

> O código viola o Princípio Aberto/Fechado porque, para adicionar um novo formato de exportação, é necessário modificar a classe `ExportadorRelatorio`, adicionando novos `if` ou `else if`. Isso faz com que a classe esteja aberta para modificação, o que não é desejável. A correção é criar uma abstração `Exportador` e implementar cada formato em uma classe separada, como `ExportadorPDF`, `ExportadorCSV` e `ExportadorXLSX`. Assim, novos formatos podem ser adicionados criando novas classes, sem alterar o código já existente.

---

## 10. Exemplo com cálculo de frete

### Código quebrando o princípio

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

    return 0;
  }
}
```

---

### Por que quebra?

A classe `CalculadoraFrete` precisa ser alterada sempre que surgir uma nova forma de frete.

Exemplo:

```text
motoboy;
retirada na loja;
frete internacional;
frete expresso.
```

Isso quebra o Aberto/Fechado.

---

### Código corrigido

```ts
interface FreteStrategy {
  calcular(peso: number): number;
}

class FreteSedex implements FreteStrategy {
  public calcular(peso: number): number {
    return peso * 10;
  }
}

class FretePac implements FreteStrategy {
  public calcular(peso: number): number {
    return peso * 5;
  }
}

class FreteTransportadora implements FreteStrategy {
  public calcular(peso: number): number {
    return peso * 8;
  }
}

class CalculadoraFrete {
  constructor(private freteStrategy: FreteStrategy) {}

  public calcular(peso: number): number {
    return this.freteStrategy.calcular(peso);
  }
}
```

Nova forma de frete:

```ts
class FreteMotoboy implements FreteStrategy {
  public calcular(peso: number): number {
    return 15;
  }
}
```

---

## 11. Exemplo com notificações

### Código quebrando o princípio

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

---

### Por que quebra?

Sempre que surgir um novo canal, a classe será modificada.

Exemplo:

```text
push notification;
telegram;
discord;
slack.
```

Isso viola o Aberto/Fechado.

---

### Código corrigido

```ts
interface Notificacao {
  enviar(destino: string, mensagem: string): void;
}

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

class NotificacaoService {
  constructor(private notificacao: Notificacao) {}

  public enviar(destino: string, mensagem: string): void {
    this.notificacao.enviar(destino, mensagem);
  }
}
```

Nova extensão:

```ts
class PushNotificacao implements Notificacao {
  public enviar(destino: string, mensagem: string): void {
    console.log(`Enviando push para ${destino}: ${mensagem}`);
  }
}
```

---

## 12. Relação com padrões de projeto

Alguns padrões da apresentação ajudam muito a aplicar o Princípio Aberto/Fechado.

---

## Strategy

Strategy permite adicionar novos algoritmos sem modificar a classe principal.

Exemplo:

```text
CalculadoraFrete usa FreteStrategy.
Para adicionar novo frete, crio nova classe.
```

---

## Decorator

Decorator permite adicionar responsabilidades sem modificar a classe base.

Exemplo:

```text
CafeExpresso continua igual.
Para adicionar leite, crio LeiteDecorator.
Para adicionar chantilly, crio ChantillyDecorator.
```

---

## Observer

Observer permite adicionar novos observadores sem modificar o sujeito.

Exemplo:

```text
Temperatura continua igual.
Para adicionar TermometroCelular, crio uma nova classe que implementa Observer.
```

---

## Visitor

Visitor permite adicionar novas operações a uma hierarquia sem modificar as classes visitadas.

Exemplo:

```text
Carro, Onibus e Motocicleta continuam iguais.
Para adicionar uma nova operação, crio um novo Visitor.
```

---

## Factory

Factory pode ajudar a centralizar a criação de objetos.

Porém, uma Factory com muitos `if` também pode violar Aberto/Fechado.

Exemplo:

```ts
class NotificationFactory {
  public static create(tipo: string): Notificacao {
    if (tipo === "email") {
      return new EmailNotificacao();
    }

    if (tipo === "sms") {
      return new SmsNotificacao();
    }

    throw new Error("Tipo inválido");
  }
}
```

Essa Factory centraliza criação, mas se surgirem muitos tipos novos, a Factory também precisará ser modificada.

Mesmo assim, ela ainda pode ser útil porque concentra a mudança em um único ponto.

---

## 13. Como identificar violação do Aberto/Fechado em prova

Procure por:

```text
muitos if/else por tipo;
switch por tipo;
string indicando tipo de operação;
classe que precisa ser alterada sempre que surge uma nova opção;
método muito grande com vários casos;
comentários como "se for PDF", "se for CSV", "se for SMS".
```

Exemplos típicos:

```text
calcular desconto por tipo de cliente;
exportar por formato;
enviar notificação por canal;
calcular frete por transportadora;
processar pagamento por método;
ordenar lista por algoritmo.
```

---

## 14. Estrutura ideal da resposta de prova

Quando a questão pedir para explicar e corrigir, responda assim:

```text
1. O código viola o Princípio Aberto/Fechado.
2. Ele viola porque a classe precisa ser modificada sempre que surge um novo tipo/comportamento.
3. O problema geralmente está nos if/else ou switch.
4. Para corrigir, crio uma interface para o comportamento variável.
5. Cada variação vira uma classe concreta.
6. A classe principal passa a depender da interface.
7. Novas variações são adicionadas por extensão, sem modificar a classe principal.
```

---

## 15. Modelo de resposta curta

> O código viola o Princípio Aberto/Fechado porque, sempre que surge um novo tipo de comportamento, é necessário modificar a classe existente, normalmente adicionando novos `if` ou `switch`. Para corrigir, o comportamento variável deve ser extraído para uma interface, e cada variação deve ser implementada em uma classe própria. Assim, a classe principal passa a depender da abstração e novas funcionalidades são adicionadas por extensão, sem modificar o código existente.

---

## 16. Resumo final

Princípio Aberto/Fechado significa:

```text
Aberto para extensão.
Fechado para modificação.
```

Sinais de violação:

```text
muitos if/else;
switch por tipo;
classe alterada a cada nova regra;
método que concentra várias variações.
```

Correção comum:

```text
criar uma interface;
criar classes concretas para cada variação;
usar polimorfismo;
usar Strategy, Decorator, Observer ou Visitor.
```

Frase para memorizar:

> Uma classe respeita o Aberto/Fechado quando posso adicionar novos comportamentos criando novas classes, sem modificar a classe principal já existente.
