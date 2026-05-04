# 12 - Responsabilidade Única

## 1. Ideia principal

O **Princípio da Responsabilidade Única** é a letra **S** do SOLID.

Em inglês:

```text
Single Responsibility Principle
```

A definição mais importante é:

> Uma classe deve ter apenas um motivo para mudar.

Isso significa que uma classe deve ter uma responsabilidade principal bem definida.

Não significa que uma classe deve ter apenas um método.

Uma classe pode ter vários métodos, desde que todos estejam relacionados à mesma responsabilidade.

---

## 2. O que é uma responsabilidade?

Uma responsabilidade é um papel que a classe exerce dentro do sistema.

Exemplos de responsabilidades:

```text
representar um pedido;
calcular o total de uma venda;
salvar dados no banco;
enviar e-mail;
gerar PDF;
validar CPF;
buscar dados em uma API;
exibir dados na tela.
```

O problema começa quando uma única classe mistura várias dessas responsabilidades.

---

## 3. O que significa “um motivo para mudar”?

Uma classe tem um motivo para mudar quando uma alteração em uma parte do sistema exige que essa classe seja modificada.

Exemplo:

```text
se mudou a regra de cálculo, muda a classe;
se mudou o banco de dados, muda a classe;
se mudou o layout do e-mail, muda a classe;
se mudou a forma de gerar PDF, muda a classe.
```

Se a mesma classe muda por todos esses motivos, ela provavelmente viola Responsabilidade Única.

---

## 4. Relação com coesão

Responsabilidade Única está muito ligada a **coesão**.

Uma classe com alta coesão tem métodos e atributos relacionados a um mesmo assunto.

Uma classe com baixa coesão mistura assuntos diferentes.

Exemplo de baixa coesão:

```ts
class Sistema {
  public cadastrarUsuario(): void {}

  public processarPagamento(): void {}

  public gerarRelatorio(): void {}

  public enviarEmailMarketing(): void {}

  public fazerBackupBanco(): void {}
}
```

Essa classe mistura muitas áreas diferentes.

Ela não possui uma responsabilidade clara.

---

## 5. Exemplo 1 quebrando Responsabilidade Única

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
    console.log("Salvando pedido no banco");
  }

  public enviarEmailConfirmacao(): void {
    console.log(`Enviando confirmação para ${this.cliente}`);
  }

  public gerarNotaFiscal(): void {
    console.log("Gerando nota fiscal");
  }
}
```

---

## 6. Por que esse código quebra o princípio?

A classe `Pedido` possui mais de uma responsabilidade.

Ela faz:

```text
cálculo do total do pedido;
persistência no banco de dados;
envio de e-mail;
geração de nota fiscal.
```

Essas responsabilidades podem mudar por motivos diferentes:

```text
mudou a regra de cálculo do pedido;
mudou o banco de dados;
mudou o provedor de e-mail;
mudou a regra fiscal.
```

Portanto, a classe tem vários motivos para mudar.

Isso viola Responsabilidade Única.

---

## 7. Código corrigido

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
    console.log(`Enviando confirmação para ${pedido.cliente}`);
  }
}

class NotaFiscalService {
  public gerar(pedido: Pedido): void {
    console.log(`Gerando nota fiscal no valor de ${pedido.calcularTotal()}`);
  }
}
```

---

## 8. Por que o código corrigido respeita o princípio?

Agora cada classe tem uma responsabilidade específica:

| Classe | Responsabilidade |
|---|---|
| `Pedido` | Representar o pedido e calcular seu total |
| `PedidoRepository` | Salvar pedido |
| `EmailService` | Enviar confirmação |
| `NotaFiscalService` | Gerar nota fiscal |

Se mudar o envio de e-mail, alteramos apenas `EmailService`.

Se mudar o banco, alteramos apenas `PedidoRepository`.

Se mudar a nota fiscal, alteramos apenas `NotaFiscalService`.

---

## 9. Exemplo 2 quebrando Responsabilidade Única

```ts
class Relatorio {
  public buscarDados(): string[] {
    console.log("Buscando dados no banco");
    return ["Dado 1", "Dado 2"];
  }

  public gerarPDF(dados: string[]): void {
    console.log(`Gerando PDF com ${dados.length} registros`);
  }

  public enviarPorEmail(): void {
    console.log("Enviando relatório por e-mail");
  }
}
```

---

## 10. Por que esse código quebra?

A classe `Relatorio` está fazendo três coisas diferentes:

```text
buscando dados;
gerando PDF;
enviando e-mail.
```

Ela pode mudar por motivos diferentes:

```text
mudou a consulta no banco;
mudou o formato do PDF;
mudou a forma de envio por e-mail.
```

Logo, ela viola Responsabilidade Única.

---

## 11. Código corrigido

```ts
class RelatorioDataService {
  public buscarDados(): string[] {
    console.log("Buscando dados no banco");
    return ["Dado 1", "Dado 2"];
  }
}

class RelatorioPdfGenerator {
  public gerar(dados: string[]): void {
    console.log(`Gerando PDF com ${dados.length} registros`);
  }
}

class RelatorioEmailSender {
  public enviar(): void {
    console.log("Enviando relatório por e-mail");
  }
}
```

Uso:

```ts
const dataService = new RelatorioDataService();
const pdfGenerator = new RelatorioPdfGenerator();
const emailSender = new RelatorioEmailSender();

const dados = dataService.buscarDados();

pdfGenerator.gerar(dados);
emailSender.enviar();
```

---

## 12. Explicação da correção

Agora as responsabilidades foram separadas:

```text
RelatorioDataService busca dados;
RelatorioPdfGenerator gera PDF;
RelatorioEmailSender envia e-mail.
```

Cada classe possui um motivo mais claro para mudar.

---

## 13. Exemplo 3 quebrando Responsabilidade Única

```ts
class Usuario {
  constructor(
    public nome: string,
    public email: string,
    public senha: string
  ) {}

  public validarEmail(): boolean {
    return this.email.includes("@");
  }

  public criptografarSenha(): string {
    return `hash-${this.senha}`;
  }

  public salvarNoBanco(): void {
    console.log("Salvando usuário no banco");
  }
}
```

---

## 14. Por que esse código quebra?

A classe `Usuario` mistura:

```text
dados do usuário;
validação de e-mail;
criptografia de senha;
persistência no banco.
```

Ela tem vários motivos para mudar:

```text
mudou a regra de validação;
mudou o algoritmo de criptografia;
mudou o banco de dados;
mudou a estrutura de dados do usuário.
```

---

## 15. Código corrigido

```ts
class Usuario {
  constructor(
    public nome: string,
    public email: string,
    public senha: string
  ) {}
}

class EmailValidator {
  public validar(email: string): boolean {
    return email.includes("@");
  }
}

class PasswordHasher {
  public gerarHash(senha: string): string {
    return `hash-${senha}`;
  }
}

class UsuarioRepository {
  public salvar(usuario: Usuario): void {
    console.log(`Salvando usuário ${usuario.nome}`);
  }
}
```

Uso:

```ts
const usuario = new Usuario("Ana", "ana@email.com", "123456");

const emailValidator = new EmailValidator();
const passwordHasher = new PasswordHasher();
const repository = new UsuarioRepository();

if (emailValidator.validar(usuario.email)) {
  const senhaCriptografada = passwordHasher.gerarHash(usuario.senha);
  console.log(senhaCriptografada);

  repository.salvar(usuario);
}
```

---

## 16. Exemplo 4 quebrando Responsabilidade Única

```ts
class Produto {
  constructor(
    public nome: string,
    public preco: number
  ) {}

  public aplicarDesconto(percentual: number): number {
    return this.preco - this.preco * percentual;
  }

  public renderizarHTML(): string {
    return `<h1>${this.nome}</h1><p>${this.preco}</p>`;
  }
}
```

---

## 17. Por que esse código quebra?

A classe `Produto` mistura:

```text
regra de produto;
lógica de apresentação HTML.
```

Se mudar a regra de desconto, a classe muda.

Se mudar a estrutura visual do HTML, a classe também muda.

São motivos diferentes.

---

## 18. Código corrigido

```ts
class Produto {
  constructor(
    public nome: string,
    public preco: number
  ) {}

  public aplicarDesconto(percentual: number): number {
    return this.preco - this.preco * percentual;
  }
}

class ProdutoView {
  public renderizarHTML(produto: Produto): string {
    return `<h1>${produto.nome}</h1><p>${produto.preco}</p>`;
  }
}
```

Agora `Produto` cuida da regra de produto, e `ProdutoView` cuida da apresentação.

---

# 19. Como identificar violação em prova

Procure por classes que fazem coisas de áreas diferentes.

Sinais comuns:

```text
classe que calcula e salva no banco;
classe que valida e envia e-mail;
classe que representa dados e gera PDF;
classe que mistura regra de negócio e interface gráfica;
classe que acessa API e também formata tela;
classe que faz tudo dentro de um único service.
```

Também fique atento a nomes muito genéricos:

```text
Sistema
Gerenciador
Manager
Util
Helper
Processador
Controlador
```

Esses nomes não são sempre errados, mas muitas vezes escondem classes com responsabilidades demais.

---

# 20. Como explicar na prova

A estrutura ideal da resposta é:

```text
1. Dizer qual princípio foi violado.
2. Explicar quais responsabilidades estão misturadas.
3. Explicar quais são os motivos diferentes para mudança.
4. Separar as responsabilidades em novas classes.
5. Justificar por que a nova solução respeita o princípio.
```

---

## 21. Modelo de resposta para prova

> O código viola o Princípio da Responsabilidade Única porque a classe possui mais de uma responsabilidade. Ela não apenas representa o pedido, mas também salva no banco, envia e-mail e gera nota fiscal. Essas tarefas podem mudar por motivos diferentes: mudança na regra de negócio, mudança no banco de dados, mudança no serviço de e-mail ou mudança nas regras fiscais. Para corrigir, a classe `Pedido` deve manter apenas os dados e regras do pedido, enquanto a persistência deve ser movida para `PedidoRepository`, o envio de e-mail para `EmailService` e a nota fiscal para `NotaFiscalService`.

---

# 22. Exemplo completo no estilo da prova antiga

## Código dado

```ts
class Venda {
  constructor(
    public cliente: string,
    public valor: number
  ) {}

  public calcularComissao(): number {
    return this.valor * 0.05;
  }

  public salvar(): void {
    console.log("Salvando venda no banco");
  }

  public enviarResumoPorEmail(): void {
    console.log(`Enviando resumo para ${this.cliente}`);
  }
}
```

---

## O que está errado?

A classe `Venda` viola o Princípio da Responsabilidade Única.

Ela possui três responsabilidades:

```text
calcular comissão;
salvar venda no banco;
enviar resumo por e-mail.
```

Essas responsabilidades podem mudar por motivos diferentes.

Se a regra de comissão mudar, a classe muda.

Se o banco de dados mudar, a classe muda.

Se o formato do e-mail mudar, a classe muda.

Logo, há mais de um motivo para modificar a classe.

---

## Código corrigido

```ts
class Venda {
  constructor(
    public cliente: string,
    public valor: number
  ) {}

  public calcularComissao(): number {
    return this.valor * 0.05;
  }
}

class VendaRepository {
  public salvar(venda: Venda): void {
    console.log(`Salvando venda de ${venda.cliente}`);
  }
}

class VendaEmailService {
  public enviarResumo(venda: Venda): void {
    console.log(`Enviando resumo para ${venda.cliente}`);
  }
}
```

---

## Explicação da correção

Agora cada classe tem apenas uma responsabilidade:

```text
Venda representa a venda e calcula a comissão;
VendaRepository salva a venda;
VendaEmailService envia o resumo por e-mail.
```

Com isso, cada mudança fica isolada na classe correspondente.

---

# 23. Responsabilidade Única e padrões de projeto

Alguns padrões ajudam a aplicar Responsabilidade Única.

## Proxy

O objeto real cuida da operação principal.

O Proxy cuida de cache, log, validação ou controle de acesso.

Exemplo:

```text
BookSearch = busca livros;
BookSearchProxy = controla cache.
```

---

## Strategy

A classe principal deixa de conter vários algoritmos.

Cada algoritmo fica em uma estratégia separada.

Exemplo:

```text
CalculadoraFrete = usa uma estratégia;
SedexStrategy = calcula frete Sedex;
PacStrategy = calcula frete PAC.
```

---

## Decorator

Cada decorador adiciona uma responsabilidade pequena.

Exemplo:

```text
CafeExpresso = bebida base;
Leite = adiciona leite;
Chantilly = adiciona chantilly.
```

---

## Facade

A fachada pode simplificar o acesso a um subsistema.

Mas cuidado: se a fachada fizer coisas demais, ela pode violar Responsabilidade Única.

---

# 24. Resumo final

Responsabilidade Única significa:

```text
Uma classe deve ter apenas um motivo para mudar.
```

Sinais de violação:

```text
classe faz regra de negócio e banco;
classe faz cálculo e e-mail;
classe faz dados e tela;
classe faz relatório, PDF e envio;
classe tem métodos de assuntos muito diferentes.
```

Correção:

```text
separar responsabilidades em classes específicas.
```

Frase para memorizar:

> Uma classe com Responsabilidade Única é uma classe coesa, com uma função clara no sistema e apenas um motivo principal para mudar.
