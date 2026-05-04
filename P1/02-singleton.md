# 02 - Singleton

## 1. Ideia principal

O **Singleton** é um padrão de projeto que garante que uma classe tenha **no máximo uma única instância** durante a execução do sistema.

Em vez de permitir que várias partes do código façam:

```ts
const logger = new Logger();
```

a própria classe controla sua criação e fornece um ponto de acesso único:

```ts
const logger = Logger.getInstance();
```

A ideia central é:

> Singleton é uma classe que controla sua própria instância e impede que vários objetos dela sejam criados livremente.

---

## 2. Problema que o Singleton resolve

Na apresentação, o exemplo usado é uma classe `Logger`.

Um `Logger` é uma classe responsável por registrar mensagens de log do sistema.

Exemplo sem Singleton:

```ts
class Logger {
  public log(message: string): void {
    console.log(`[LOG]: ${message}`);
  }
}

class UserService {
  public createUser(): void {
    const logger = new Logger();
    logger.log("Usuário criado");
  }
}

class PaymentService {
  public processPayment(): void {
    const logger = new Logger();
    logger.log("Pagamento processado");
  }
}
```

Nesse exemplo, cada serviço cria sua própria instância de `Logger`.

O problema é que, em alguns casos, queremos que todos usem **a mesma instância**.

Por exemplo:

- todos os logs devem ser escritos no mesmo arquivo;
- todos os módulos devem compartilhar a mesma configuração;
- o sistema deve controlar um único recurso global;
- não faz sentido criar várias instâncias da mesma classe.

No caso do `Logger`, a pergunta de projeto é:

> Como fazer com que todos os clientes usem a mesma instância de `Logger`?

---

## 3. Solução proposta pelo Singleton

A solução é impedir que outras classes criem objetos diretamente com `new`.

Para isso, a classe Singleton normalmente possui:

1. um atributo estático para guardar a instância única;
2. um construtor privado;
3. um método estático para acessar a instância.

Exemplo:

```ts
class Logger {
  private static instance: Logger;

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }

    return Logger.instance;
  }

  public log(message: string): void {
    console.log(`[LOG]: ${message}`);
  }
}
```

Agora, o uso correto é:

```ts
const logger1 = Logger.getInstance();
const logger2 = Logger.getInstance();

logger1.log("Primeira mensagem");
logger2.log("Segunda mensagem");

console.log(logger1 === logger2); // true
```

A comparação retorna `true` porque `logger1` e `logger2` apontam para o mesmo objeto.

---

## 4. Explicando cada parte do código

### 4.1. Atributo estático

```ts
private static instance: Logger;
```

Esse atributo pertence à classe `Logger`, e não a um objeto específico.

Ele guarda a única instância da classe.

---

### 4.2. Construtor privado

```ts
private constructor() {}
```

O construtor privado impede que outras partes do código façam:

```ts
const logger = new Logger();
```

Ou seja, a própria classe controla quando o objeto será criado.

---

### 4.3. Método `getInstance()`

```ts
public static getInstance(): Logger {
  if (!Logger.instance) {
    Logger.instance = new Logger();
  }

  return Logger.instance;
}
```

Esse método verifica se a instância já existe.

Se não existir, ele cria:

```ts
Logger.instance = new Logger();
```

Se já existir, apenas retorna a instância existente.

---

## 5. Exemplo completo em TypeScript

```ts
class Logger {
  private static instance: Logger;

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }

    return Logger.instance;
  }

  public log(message: string): void {
    console.log(`[LOG]: ${message}`);
  }
}

class UserService {
  public createUser(): void {
    const logger = Logger.getInstance();
    logger.log("Usuário criado com sucesso");
  }
}

class PaymentService {
  public processPayment(): void {
    const logger = Logger.getInstance();
    logger.log("Pagamento processado com sucesso");
  }
}

const userService = new UserService();
const paymentService = new PaymentService();

userService.createUser();
paymentService.processPayment();

const loggerA = Logger.getInstance();
const loggerB = Logger.getInstance();

console.log(loggerA === loggerB); // true
```

---

## 6. Diagrama conceitual

```text
+-----------------------------+
|           Logger            |
+-----------------------------+
| - instance: Logger          |
+-----------------------------+
| - constructor()             |
| + getInstance(): Logger     |
| + log(message: string): void|
+-----------------------------+
```

A classe `Logger` possui uma instância estática dela mesma.

O construtor é privado.

O acesso ocorre pelo método `getInstance()`.

---

## 7. Quando usar Singleton

Singleton pode fazer sentido quando realmente precisa existir apenas uma instância de uma classe.

Exemplos comuns:

- logger;
- gerenciador de configuração;
- gerenciador de conexão;
- controle central de cache;
- objeto que representa um recurso único do sistema.

Exemplo:

```ts
class AppConfig {
  private static instance: AppConfig;

  private constructor(
    public readonly environment: string,
    public readonly apiUrl: string
  ) {}

  public static getInstance(): AppConfig {
    if (!AppConfig.instance) {
      AppConfig.instance = new AppConfig(
        "production",
        "https://api.exemplo.com"
      );
    }

    return AppConfig.instance;
  }
}

const config = AppConfig.getInstance();

console.log(config.apiUrl);
```

---

## 8. Problemas e críticas ao Singleton

A apresentação destaca que Singleton é um padrão bastante criticado.

Ele pode resolver um problema real, mas também pode causar problemas de design se for usado de forma exagerada ou inadequada.

---

### 8.1. Pode criar acoplamento global

Como qualquer classe pode chamar:

```ts
Logger.getInstance();
```

o Singleton vira uma dependência global espalhada pelo sistema.

Isso aumenta o acoplamento.

Exemplo:

```ts
class OrderService {
  public finishOrder(): void {
    Logger.getInstance().log("Pedido finalizado");
  }
}
```

Aqui, `OrderService` está diretamente acoplado ao Singleton `Logger`.

---

### 8.2. Pode dificultar testes

Como a classe chama diretamente `Logger.getInstance()`, fica mais difícil substituir o `Logger` por um objeto falso durante os testes.

Exemplo problemático:

```ts
class OrderService {
  public finishOrder(): void {
    Logger.getInstance().log("Pedido finalizado");
  }
}
```

Em um teste, talvez você queira usar um `FakeLogger`, mas a classe está presa ao Singleton.

Uma alternativa melhor seria depender de uma interface:

```ts
interface Logger {
  log(message: string): void;
}

class ConsoleLogger implements Logger {
  public log(message: string): void {
    console.log(message);
  }
}

class OrderService {
  constructor(private logger: Logger) {}

  public finishOrder(): void {
    this.logger.log("Pedido finalizado");
  }
}
```

Nesse caso, `OrderService` depende de uma abstração, e não de um Singleton global.

---

### 8.3. Pode esconder dependências

Uma classe pode parecer independente, mas internamente usar um Singleton.

Exemplo:

```ts
class ReportService {
  public generateReport(): void {
    Logger.getInstance().log("Relatório gerado");
  }
}
```

O construtor de `ReportService` não mostra que ela depende de `Logger`.

Isso torna o código menos explícito.

---

### 8.4. Pode virar uma variável global disfarçada

Se o Singleton mantém estado mutável, ele pode se comportar como uma variável global.

Exemplo:

```ts
class Session {
  private static instance: Session;
  public currentUser: string | null = null;

  private constructor() {}

  public static getInstance(): Session {
    if (!Session.instance) {
      Session.instance = new Session();
    }

    return Session.instance;
  }
}
```

Qualquer parte do sistema pode alterar:

```ts
Session.getInstance().currentUser = "João";
```

Isso pode gerar efeitos colaterais difíceis de rastrear.

---

## 9. Singleton e sistemas concorrentes

Em linguagens com múltiplas threads, uma implementação simples pode falhar.

Exemplo conceitual:

```ts
if (!Logger.instance) {
  Logger.instance = new Logger();
}
```

Se duas threads executarem esse trecho ao mesmo tempo, pode acontecer:

1. Thread A verifica que `instance` está vazia.
2. Thread B também verifica que `instance` está vazia.
3. Thread A cria um objeto.
4. Thread B cria outro objeto.

Resultado: duas instâncias podem ser criadas.

Por isso, em linguagens como Java, é comum usar sincronização para garantir segurança em ambiente concorrente.

Exemplo conceitual em Java:

```java
public class Singleton {
    private static Singleton instance;

    private Singleton() {}

    public static Singleton getInstance() {
        if (instance == null) {
            synchronized (Singleton.class) {
                if (instance == null) {
                    instance = new Singleton();
                }
            }
        }

        return instance;
    }
}
```

Esse código usa sincronização para impedir que duas threads criem a instância ao mesmo tempo.

---

## 10. Relação com SOLID

Singleton não é um padrão diretamente associado a um princípio SOLID positivo.

Na verdade, se usado sem cuidado, ele pode prejudicar alguns princípios.

---

### 10.1. Pode prejudicar Inversão de Dependência

Exemplo ruim:

```ts
class PaymentService {
  public pay(): void {
    Logger.getInstance().log("Pagamento realizado");
  }
}
```

Aqui `PaymentService` depende diretamente de uma classe concreta global.

Uma solução melhor seria:

```ts
interface Logger {
  log(message: string): void;
}

class PaymentService {
  constructor(private logger: Logger) {}

  public pay(): void {
    this.logger.log("Pagamento realizado");
  }
}
```

Agora a classe depende de uma abstração.

---

### 10.2. Pode prejudicar testes e manutenção

Como a dependência não aparece no construtor, fica mais difícil trocar a implementação.

Isso pode prejudicar:

- testes automatizados;
- manutenção;
- extensibilidade;
- baixo acoplamento.

---

## 11. Diferença entre Singleton e objeto comum

Objeto comum:

```ts
const logger1 = new Logger();
const logger2 = new Logger();
```

Aqui temos dois objetos diferentes.

Singleton:

```ts
const logger1 = Logger.getInstance();
const logger2 = Logger.getInstance();
```

Aqui os dois apontam para a mesma instância.

---

## 12. Diferença entre Singleton e classe estática

Uma classe estática possui apenas métodos e atributos estáticos.

Exemplo:

```ts
class LoggerStatic {
  public static log(message: string): void {
    console.log(message);
  }
}
```

Uso:

```ts
LoggerStatic.log("Mensagem");
```

Já o Singleton ainda trabalha com um objeto real, mas controla para que exista apenas uma instância.

Exemplo:

```ts
const logger = Logger.getInstance();
logger.log("Mensagem");
```

Diferença principal:

| Classe estática | Singleton |
|---|---|
| Não precisa criar objeto | Existe um objeto único |
| Usa apenas membros estáticos | Usa uma instância controlada |
| Mais rígida | Pode implementar interfaces em algumas linguagens |
| Mais difícil de substituir | Também pode ser difícil, mas é mais flexível que classe puramente estática |

---

## 13. Exemplo de Singleton com configuração

```ts
class ConfigManager {
  private static instance: ConfigManager;

  private settings: Record<string, string> = {};

  private constructor() {}

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }

    return ConfigManager.instance;
  }

  public set(key: string, value: string): void {
    this.settings[key] = value;
  }

  public get(key: string): string | undefined {
    return this.settings[key];
  }
}

const config1 = ConfigManager.getInstance();
const config2 = ConfigManager.getInstance();

config1.set("theme", "dark");

console.log(config2.get("theme")); // dark
console.log(config1 === config2); // true
```

Nesse exemplo, `config1` e `config2` são a mesma instância.

Por isso, quando `config1` altera uma configuração, `config2` enxerga a mesma alteração.

---

## 14. Como identificar Singleton em uma prova

Procure por sinais como:

```text
private static instance
private constructor
static getInstance()
```

Também pode aparecer uma classe que deseja garantir instância única, como:

```text
Logger
Config
DatabaseConnection
CacheManager
SessionManager
```

---

## 15. Como explicar Singleton em uma resposta de prova

Resposta curta:

> Singleton é um padrão de projeto que garante que uma classe tenha no máximo uma instância e fornece um ponto global de acesso a essa instância. Ele normalmente é implementado com um atributo estático que guarda a instância, um construtor privado e um método estático `getInstance()`. Pode ser útil para recursos únicos, como logger ou configuração global, mas deve ser usado com cuidado, pois pode aumentar acoplamento, esconder dependências e dificultar testes.

Resposta mais completa:

> O padrão Singleton é usado quando queremos controlar a criação de objetos de uma classe para garantir que exista apenas uma instância dela no sistema. Para isso, a classe impede a criação externa por meio de um construtor privado e fornece um método estático, geralmente chamado `getInstance()`, que cria a instância se ela ainda não existir e retorna a mesma instância nas chamadas seguintes. No exemplo de um Logger, isso permite que todos os módulos registrem mensagens no mesmo objeto de log. Apesar disso, Singleton deve ser usado com cuidado, pois cria acesso global, pode aumentar o acoplamento, dificultar testes e causar problemas em sistemas concorrentes se não for implementado de forma segura.

---

## 16. Possível pergunta de prova

### Pergunta

Explique o padrão Singleton e descreva um problema de design que ele pode causar.

### Resposta sugerida

O Singleton garante que uma classe tenha no máximo uma instância durante a execução do sistema. Ele geralmente possui um atributo estático para guardar a instância, um construtor privado para impedir `new` externo e um método estático `getInstance()` para acessar a instância.

Um problema de design é que ele pode criar acoplamento global. Como qualquer classe pode chamar diretamente `ClasseSingleton.getInstance()`, as dependências ficam espalhadas e escondidas no código. Isso dificulta testes, manutenção e substituição da implementação por outra. Além disso, em sistemas concorrentes, uma implementação simples pode criar mais de uma instância se duas threads acessarem `getInstance()` ao mesmo tempo.

---

## 17. Resumo final

Singleton serve para:

```text
Garantir uma única instância de uma classe.
```

Ele normalmente usa:

```text
private static instance
private constructor
static getInstance()
```

Vantagem:

```text
Controla recurso único e evita múltiplas instâncias desnecessárias.
```

Problemas:

```text
Pode aumentar acoplamento.
Pode esconder dependências.
Pode dificultar testes.
Pode virar variável global disfarçada.
Pode ter problema em sistemas concorrentes.
```

Frase para memorizar:

> Singleton garante instância única, mas deve ser usado com cuidado porque pode criar dependência global e dificultar manutenção e testes.
