# 16 - Framework vs Biblioteca

## 1. Ideia principal

A diferença principal entre **framework** e **biblioteca** está em quem controla o fluxo da aplicação.

A frase mais importante é:

```text
Biblioteca: você chama o código dela.
Framework: ele chama o seu código.
```

Ou seja:

```text
Biblioteca -> ferramenta que você usa quando precisa.
Framework -> estrutura que organiza e controla parte do funcionamento da aplicação.
```

---

## 2. O que é uma biblioteca?

Uma **biblioteca** é um conjunto de funcionalidades prontas que você chama diretamente no seu código.

Você continua controlando o fluxo principal da aplicação.

Fluxo:

```text
Meu código -> Biblioteca
```

Exemplos de bibliotecas:

```text
axios;
lodash;
date-fns;
zod;
moment;
bibliotecas de gráficos;
bibliotecas de validação;
bibliotecas matemáticas.
```

---

## 3. Exemplo de biblioteca

```ts
class MathUtils {
  public static dobro(numero: number): number {
    return numero * 2;
  }
}

const resultado = MathUtils.dobro(10);

console.log(resultado);
```

Nesse exemplo, o seu código decide quando chamar `MathUtils.dobro()`.

A biblioteca apenas oferece uma função pronta.

---

## 4. Exemplo com axios

```ts
import axios from "axios";

async function buscarUsuarios(): Promise<void> {
  const response = await axios.get("https://api.exemplo.com/usuarios");

  console.log(response.data);
}

buscarUsuarios();
```

Aqui, você decide:

```text
quando chamar axios;
qual URL usar;
o que fazer com a resposta;
em qual função colocar a chamada.
```

A biblioteca não controla sua aplicação.

Ela apenas oferece funções prontas.

---

## 5. O que é um framework?

Um **framework** é uma estrutura maior que define como sua aplicação deve ser organizada e executada.

No framework, muitas vezes ele controla o fluxo principal e chama o código que você escreveu em determinados momentos.

Fluxo:

```text
Framework -> Meu código
```

Exemplos de frameworks:

```text
React;
Angular;
Vue;
NestJS;
Express;
Spring;
Django;
Laravel.
```

Alguns exemplos podem ser discutidos como biblioteca ou framework dependendo do contexto, mas para prova o mais importante é entender a ideia de controle do fluxo.

---

## 6. Exemplo conceitual de framework

Imagine uma estrutura base:

```ts
abstract class ControllerFramework {
  public handleRequest(): void {
    const request = this.getRequest();
    const response = this.execute(request);

    this.sendResponse(response);
  }

  protected getRequest(): string {
    return "requisição recebida";
  }

  protected abstract execute(request: string): string;

  protected sendResponse(response: string): void {
    console.log(`Resposta enviada: ${response}`);
  }
}
```

Seu código entra implementando apenas uma parte:

```ts
class UsuarioController extends ControllerFramework {
  protected execute(request: string): string {
    return "Lista de usuários";
  }
}
```

Uso:

```ts
const controller = new UsuarioController();

controller.handleRequest();
```

O framework define o fluxo:

```text
receber requisição;
executar lógica;
enviar resposta.
```

Você implementa apenas a parte específica.

---

## 7. Exemplo com React

Em React, você escreve um componente:

```tsx
function App() {
  return <h1>Olá, mundo</h1>;
}
```

Você não chama manualmente o mecanismo interno de renderização.

O React decide:

```text
quando renderizar;
quando atualizar;
quando chamar componentes;
quando aplicar mudanças na tela.
```

Você fornece componentes.

O React controla o ciclo de vida da interface.

---

## 8. Exemplo com evento no React

```tsx
function Tela() {
  function salvar(): void {
    console.log("Salvando dados");
  }

  return <button onClick={salvar}>Salvar</button>;
}
```

Você não chama diretamente `salvar()` no clique.

Você entrega a função para o React.

Quando o usuário clica, o React chama a função.

Isso mostra a relação entre framework e **Inversão de Controle**.

---

## 9. Tabela comparativa

| Biblioteca | Framework |
|---|---|
| Você chama o código dela | Ele chama o seu código |
| Você controla o fluxo principal | O framework controla parte do fluxo |
| Mais liberdade de organização | Mais estrutura e convenções |
| Normalmente resolve problemas pontuais | Normalmente estrutura a aplicação |
| Exemplo: axios, date-fns, lodash | Exemplo: React, Angular, Spring |
| Fluxo: seu código -> biblioteca | Fluxo: framework -> seu código |

---

## 10. Comparação prática

### Biblioteca

```ts
class EmailLibrary {
  public enviar(destino: string, mensagem: string): void {
    console.log(`Enviando e-mail para ${destino}: ${mensagem}`);
  }
}

const emailLibrary = new EmailLibrary();

emailLibrary.enviar("teste@email.com", "Olá");
```

Você decide quando chamar `enviar()`.

---

### Framework

```ts
abstract class EmailFramework {
  public executarEnvio(): void {
    const destino = this.obterDestino();
    const mensagem = this.obterMensagem();

    console.log(`Enviando e-mail para ${destino}: ${mensagem}`);
  }

  protected abstract obterDestino(): string;
  protected abstract obterMensagem(): string;
}

class MeuEnvioEmail extends EmailFramework {
  protected obterDestino(): string {
    return "teste@email.com";
  }

  protected obterMensagem(): string {
    return "Olá";
  }
}

const envio = new MeuEnvioEmail();

envio.executarEnvio();
```

Aqui, a classe base controla o processo de envio.

Seu código fornece apenas os detalhes.

---

## 11. Framework e Inversão de Controle

Frameworks estão diretamente ligados à **Inversão de Controle**.

Em vez de o programador controlar todo o fluxo, o framework fornece uma estrutura principal e chama o código do usuário quando necessário.

Exemplo:

```text
React chama componentes.
Spring chama controllers/services.
Framework de testes chama funções de teste.
Framework web chama handlers de rota.
```

A ideia é:

```text
O framework controla o ciclo de vida.
O programador preenche pontos específicos.
```

---

## 12. Biblioteca e controle direto

Com biblioteca, o controle normalmente continua com o programador.

Exemplo:

```ts
const valorFormatado = formatCurrency(100);
```

Você decide:

```text
onde chamar;
quando chamar;
quantas vezes chamar;
o que fazer com o retorno.
```

A biblioteca não define a arquitetura da aplicação.

---

## 13. Não é sempre uma divisão perfeita

Na prática, algumas tecnologias podem ser discutidas.

Por exemplo, React é oficialmente tratado muitas vezes como biblioteca de UI, mas no uso prático ele também pode assumir papel de framework quando organiza o ciclo de renderização e a estrutura da aplicação.

Para prova, use a diferença conceitual:

```text
biblioteca: você chama;
framework: ele chama você.
```

---

## 14. Exemplo no estilo da prova

### Pergunta

Explique a diferença entre framework e biblioteca.

### Resposta sugerida

> A principal diferença está em quem controla o fluxo da aplicação. Em uma biblioteca, o meu código chama as funções da biblioteca quando precisa, então o controle principal continua comigo. Em um framework, a estrutura principal é definida pelo framework, que chama o meu código em momentos específicos. Por isso, frameworks estão relacionados à Inversão de Controle.

---

## 15. Exemplo de resposta com código

### Biblioteca

```ts
const resultado = Math.max(10, 20);
```

Meu código chama a função.

---

### Framework

```ts
function App() {
  return <h1>Olá</h1>;
}
```

O React chama o componente quando precisa renderizar.

---

## 16. Como identificar em prova

Procure por:

```text
quem chama quem;
quem controla o fluxo;
se existe ciclo de vida definido;
se o código do usuário é registrado e chamado depois;
se há uma estrutura fixa para organizar a aplicação.
```

Se o código do usuário chama funções prontas, tende a ser biblioteca.

Se uma estrutura chama o código do usuário, tende a ser framework.

---

## 17. Relação com Template Method

Template Method ajuda a entender framework.

A classe abstrata define o fluxo:

```text
passo 1;
passo 2;
passo 3.
```

A subclasse implementa os detalhes.

Isso é parecido com um framework, porque o framework define o modelo e o programador preenche partes específicas.

---

## 18. Resumo final

Biblioteca:

```text
Você chama.
```

Framework:

```text
Ele chama você.
```

Biblioteca:

```text
Oferece funções/classes prontas.
```

Framework:

```text
Oferece uma estrutura de aplicação.
```

Biblioteca:

```text
Menos controle sobre sua arquitetura.
```

Framework:

```text
Mais controle sobre a organização e ciclo de vida.
```

Frase para memorizar:

> Em uma biblioteca, meu código está no controle e chama funcionalidades prontas; em um framework, a estrutura principal controla o fluxo e chama o meu código.
