# 03 - Proxy

## 1. Ideia principal

O **Proxy** é um padrão de projeto em que criamos um objeto intermediário entre o cliente e o objeto real.

Em vez de o cliente acessar diretamente a classe principal, ele acessa um **proxy**, que decide o que fazer antes ou depois de chamar o objeto real.

A ideia central é:

> Proxy é um intermediário que controla o acesso a outro objeto.

Fluxo sem Proxy:

```text
Cliente  --->  Objeto Real
```

Fluxo com Proxy:

```text
Cliente  --->  Proxy  --->  Objeto Real
```

O cliente conversa com o Proxy como se estivesse conversando com o objeto real.

---

## 2. Exemplo da apresentação

Na apresentação, o exemplo usado é uma função/classe que pesquisa livros.

Imagine uma classe `BookSearch`, responsável por buscar livros pelo ISBN:

```ts
class Book {
  constructor(
    public isbn: string,
    public title: string,
  ) {}
}

class BookSearch {
  public getBook(isbn: string): Book {
    console.log("Buscando livro na fonte original...");
    return new Book(isbn, "Livro encontrado");
  }
}
```

Uso sem Proxy:

```ts
const bookSearch = new BookSearch();

const book = bookSearch.getBook("978-1234567890");

console.log(book.title);
```

Nesse caso, o cliente acessa diretamente `BookSearch`.

---

## 3. Problema que o Proxy resolve

O problema da apresentação é:

> Como inserir um cache para melhorar desempenho sem modificar a classe `BookSearch`?

A classe `BookSearch` já existe, já funciona e talvez seja mantida por outro desenvolvedor.

Não queremos alterar diretamente essa classe para adicionar cache.

Exemplo do comportamento desejado:

```text
Se o livro estiver no cache:
    retorna imediatamente o livro do cache.

Se o livro não estiver no cache:
    chama a busca original;
    guarda o resultado no cache;
    retorna o livro.
```

Ou seja, queremos adicionar uma nova responsabilidade, mas sem mexer na classe original.

---

## 4. Solução com Proxy

A solução é criar uma classe `BookSearchProxy`.

Essa classe fica entre o cliente e o `BookSearch`.

```text
Cliente  --->  BookSearchProxy  --->  BookSearch
```

O Proxy implementa a lógica de cache.

Exemplo:

```ts
class Book {
  constructor(
    public isbn: string,
    public title: string,
  ) {}
}

interface Search {
  getBook(isbn: string): Book;
}

class BookSearch implements Search {
  public getBook(isbn: string): Book {
    console.log("Buscando livro na fonte original...");
    return new Book(isbn, "Livro encontrado");
  }
}

class BookSearchProxy implements Search {
  private cachedBook: Book | null = null;

  constructor(private bookSearch: BookSearch) {}

  public getBook(isbn: string): Book {
    if (this.cachedBook && this.cachedBook.isbn === isbn) {
      console.log("Retornando livro do cache...");
      return this.cachedBook;
    }

    const book = this.bookSearch.getBook(isbn);
    this.cachedBook = book;

    return book;
  }
}
```

Uso:

```ts
const search = new BookSearchProxy(new BookSearch());

const book1 = search.getBook("123");
console.log(book1.title);

const book2 = search.getBook("123");
console.log(book2.title);

const book3 = search.getBook("456");
console.log(book3.title);
```

Saída esperada:

```text
Buscando livro na fonte original...
Retornando livro do cache...
```

Na primeira chamada, o livro ainda não está no cache.

Na segunda chamada, o Proxy retorna o livro diretamente do cache.

---

## 5. Por que isso é um Proxy?

Porque o cliente não acessa mais diretamente o objeto real.

Antes:

```ts
const search = new BookSearch();
search.getBook("978-1234567890");
```

Depois:

```ts
const realSearch = new BookSearch();
const search = new BookSearchProxy(realSearch);

search.getBook("978-1234567890");
```

O objeto `BookSearchProxy` controla o acesso ao objeto `BookSearch`.

O cliente pede o livro ao Proxy.

O Proxy decide se retorna do cache ou se chama o objeto real.

---

## 6. Estrutura do padrão Proxy

A estrutura comum do padrão Proxy é:

```text
+----------------+
|    Subject     |
+----------------+
| request()      |
+----------------+
        ^
        |
+----------------+          +----------------+
|   RealSubject  |          |     Proxy      |
+----------------+          +----------------+
| request()      |          | request()      |
+----------------+          | realSubject    |
                            +----------------+
```

No exemplo da apresentação:

```text
Subject       = Search
RealSubject   = BookSearch
Proxy         = BookSearchProxy
Cliente       = código que pesquisa livros
```

---

## 7. Código completo em TypeScript

```ts
class Book {
  constructor(
    public isbn: string,
    public title: string,
  ) {}
}

interface Search {
  getBook(isbn: string): Book;
}

class BookSearch implements Search {
  public getBook(isbn: string): Book {
    console.log("Buscando livro na fonte original...");
    return new Book(isbn, "Engenharia de Software Moderna");
  }
}

class BookSearchProxy implements Search {
  private cache: Map<string, Book> = new Map();

  constructor(private realSearch: Search) {}

  public getBook(isbn: string): Book {
    const cachedBook = this.cache.get(isbn);

    if (cachedBook) {
      console.log("Livro encontrado no cache.");
      return cachedBook;
    }

    console.log("Livro não encontrado no cache.");
    const book = this.realSearch.getBook(isbn);

    this.cache.set(isbn, book);

    return book;
  }
}

const search: Search = new BookSearchProxy(new BookSearch());

const firstResult = search.getBook("978-1234567890");
console.log(firstResult.title);

const secondResult = search.getBook("978-1234567890");
console.log(secondResult.title);
```

---

## 8. Explicando o código

### 8.1. Interface comum

```ts
interface Search {
  getBook(isbn: string): Book;
}
```

A interface define o comportamento esperado.

Tanto o objeto real quanto o Proxy implementam essa interface.

---

### 8.2. Objeto real

```ts
class BookSearch implements Search {
  public getBook(isbn: string): Book {
    console.log("Buscando livro na fonte original...");
    return new Book(isbn, "Engenharia de Software Moderna");
  }
}
```

Essa é a classe que realmente sabe buscar o livro.

Ela representa o objeto principal.

---

### 8.3. Proxy

```ts
class BookSearchProxy implements Search {
  private cache: Map<string, Book> = new Map();

  constructor(private realSearch: Search) {}

  public getBook(isbn: string): Book {
    const cachedBook = this.cache.get(isbn);

    if (cachedBook) {
      return cachedBook;
    }

    const book = this.realSearch.getBook(isbn);
    this.cache.set(isbn, book);

    return book;
  }
}
```

O Proxy também implementa `Search`.

Isso permite que o cliente use o Proxy da mesma forma que usaria o objeto real.

O Proxy guarda uma referência para o objeto real:

```ts
constructor(private realSearch: Search) {}
```

E adiciona a lógica de cache antes de chamar o objeto real.

---

## 9. Vantagem principal

A principal vantagem é adicionar um comportamento extra sem modificar a classe original.

No exemplo:

```text
BookSearch continua cuidando da busca.
BookSearchProxy cuida do cache.
```

Isso melhora a separação de responsabilidades.

---

## 10. Relação com Responsabilidade Única

O Proxy se relaciona com o **Princípio da Responsabilidade Única**.

Sem Proxy, poderíamos alterar `BookSearch` para fazer duas coisas:

```text
1. Buscar livros.
2. Gerenciar cache.
```

Isso misturaria responsabilidades.

Com Proxy:

```text
BookSearch      = busca o livro.
BookSearchProxy = controla cache antes de buscar.
```

Cada classe fica com uma responsabilidade mais clara.

Resposta de prova:

> O Proxy pode ajudar a aplicar Responsabilidade Única porque permite separar a responsabilidade principal do objeto real da responsabilidade extra adicionada pelo proxy, como cache, log, validação ou controle de acesso.

---

## 11. Relação com Aberto/Fechado

O Proxy também pode ajudar no **Princípio Aberto/Fechado**.

A classe `BookSearch` fica fechada para modificação.

Para adicionar cache, criamos uma nova classe:

```ts
class BookSearchProxy implements Search {}
```

Assim, estendemos o comportamento sem alterar a classe original.

Resposta de prova:

> O Proxy favorece o Princípio Aberto/Fechado porque permite adicionar comportamentos ao acesso de um objeto sem modificar a implementação original desse objeto.

---

## 12. Relação com acoplamento

O Proxy pode reduzir o acoplamento quando o cliente depende de uma interface.

Exemplo melhor:

```ts
const search: Search = new BookSearchProxy(new BookSearch());
```

O cliente sabe apenas que existe algo do tipo `Search`.

Ele não precisa saber se está usando:

```text
BookSearch
BookSearchProxy
LoggedBookSearchProxy
SecureBookSearchProxy
```

Isso torna a troca de implementação mais simples.

---

## 13. Relação com Information Hiding

A apresentação também associa Proxy à ideia de esconder detalhes internos.

O cliente não precisa saber:

```text
se existe cache;
se existe validação;
se existe log;
se existe controle de permissão;
se existe limitação de tentativas.
```

Ele apenas chama:

```ts
search.getBook(isbn);
```

O funcionamento interno fica escondido dentro do Proxy.

Isso é **Information Hiding**.

---

## 14. Outros usos de Proxy

Além de cache, o Proxy pode implementar outros requisitos não-funcionais.

### 14.1. Logging

Registrar informações antes ou depois da chamada.

```ts
class LoggingSearchProxy implements Search {
  constructor(private realSearch: Search) {}

  public getBook(isbn: string): Book {
    console.log(`Pesquisando livro com ISBN: ${isbn}`);

    const book = this.realSearch.getBook(isbn);

    console.log(`Livro retornado: ${book.title}`);

    return book;
  }
}
```

---

### 14.2. Controle de acesso

Verificar se o usuário tem permissão antes de acessar o objeto real.

```ts
class SecureSearchProxy implements Search {
  constructor(
    private realSearch: Search,
    private userRole: string,
  ) {}

  public getBook(isbn: string): Book {
    if (this.userRole !== "admin") {
      throw new Error("Usuário sem permissão para pesquisar livros.");
    }

    return this.realSearch.getBook(isbn);
  }
}
```

---

### 14.3. Validação

Validar os dados antes de chamar o objeto real.

```ts
class ValidationSearchProxy implements Search {
  constructor(private realSearch: Search) {}

  public getBook(isbn: string): Book {
    if (!isbn || isbn.trim().length === 0) {
      throw new Error("ISBN inválido.");
    }

    return this.realSearch.getBook(isbn);
  }
}
```

---

### 14.4. Limitação de tentativas

Controlar quantas vezes uma operação pode ser chamada.

```ts
class RateLimitSearchProxy implements Search {
  private attempts = 0;

  constructor(private realSearch: Search) {}

  public getBook(isbn: string): Book {
    this.attempts++;

    if (this.attempts > 3) {
      throw new Error("Limite de buscas excedido.");
    }

    return this.realSearch.getBook(isbn);
  }
}
```

---

## 15. Exemplo mais próximo dos seus exercícios: Proxy de notificação

Nos seus exercícios de padrões, você já trabalhou com notificações.

Imagine a interface:

```ts
interface Notification {
  send(to: string, message: string): string;
}
```

Classe real:

```ts
class EmailNotification implements Notification {
  public send(to: string, message: string): string {
    return `E-mail enviado para ${to}: ${message}`;
  }
}
```

Proxy com log:

```ts
class LoggingNotificationProxy implements Notification {
  constructor(private notification: Notification) {}

  public send(to: string, message: string): string {
    console.log("Iniciando envio da notificação...");

    const result = this.notification.send(to, message);

    console.log("Finalizando envio da notificação...");

    return result;
  }
}
```

Uso:

```ts
const notification: Notification = new LoggingNotificationProxy(
  new EmailNotification(),
);

const result = notification.send("teste@email.com", "Olá");

console.log(result);
```

Aqui, o Proxy adiciona log sem alterar `EmailNotification`.

---

## 16. Comparação entre Proxy e Decorator

Proxy e Decorator são parecidos porque ambos envolvem outro objeto.

Mas a intenção é diferente.

| Proxy                                               | Decorator                                     |
| --------------------------------------------------- | --------------------------------------------- |
| Controla o acesso ao objeto real                    | Adiciona responsabilidades ao objeto          |
| Pode fazer cache, segurança, log, validação         | Pode adicionar comportamento combinável       |
| Normalmente representa o objeto real para o cliente | Normalmente compõe funcionalidades em camadas |
| Foco em intermediação e controle                    | Foco em extensão dinâmica                     |

Exemplo de Proxy:

```text
Antes de buscar, verifico cache ou permissão.
```

Exemplo de Decorator:

```text
Bebida base + leite + chantilly + canela.
```

---

## 17. Comparação entre Proxy e Adapter

| Proxy                                     | Adapter                                                       |
| ----------------------------------------- | ------------------------------------------------------------- |
| Tem a mesma interface do objeto real      | Converte uma interface incompatível em outra                  |
| Controla acesso                           | Adapta chamadas                                               |
| Cliente poderia usar objeto real ou proxy | Cliente não consegue usar diretamente o adaptee sem adaptação |

Exemplo de Proxy:

```text
BookSearchProxy implementa a mesma interface de BookSearch.
```

Exemplo de Adapter:

```text
AdaptadorProjetorSamsung implementa Projetor e traduz chamadas para ProjetorSamsung.
```

---

## 18. Quando usar Proxy

Use Proxy quando você quer controlar o acesso a um objeto real.

Situações típicas:

```text
Adicionar cache.
Adicionar logging.
Adicionar controle de acesso.
Adicionar validação.
Adicionar auditoria.
Adicionar limitação de tentativas.
Adiar criação de objetos pesados.
Controlar acesso remoto.
```

---

## 19. Quando não usar Proxy

Evite Proxy se:

```text
a operação é simples demais;
não existe comportamento adicional relevante;
o Proxy só repete a chamada do objeto real;
a solução adiciona complexidade sem necessidade.
```

Se a classe original dificilmente vai mudar ou se o requisito é muito simples, criar Proxy pode ser overengineering.

---

## 20. Como identificar Proxy em uma prova

Procure por uma situação em que:

```text
Existe uma classe real que já faz uma operação.
Querem adicionar cache, log, validação, segurança ou controle.
Não querem alterar a classe original.
Criam uma classe intermediária com a mesma interface.
O cliente passa a chamar a intermediária.
```

Palavras-chave:

```text
intermediário
controle de acesso
cache
log
validação
permissão
objeto real
mesma interface
```

---

## 21. Possível pergunta de prova

### Pergunta

Explique o padrão Proxy e dê exemplos de requisitos não-funcionais que podem ser implementados com ele.

### Resposta sugerida

O Proxy é um padrão de projeto que cria um objeto intermediário entre o cliente e o objeto real. O cliente passa a chamar o Proxy, e o Proxy decide se encaminha ou não a chamada ao objeto real. Ele pode adicionar comportamentos sem alterar a classe original, como cache, logging, controle de acesso, validação, auditoria e limitação de tentativas. No exemplo de busca de livros, o Proxy pode verificar se o livro já está no cache antes de chamar a classe `BookSearch`.

---

## 22. Outra possível pergunta de prova

### Pergunta

Qual propriedade de projeto o Proxy ajuda a melhorar? E com qual princípio SOLID ele pode se relacionar?

### Resposta sugerida

O Proxy pode melhorar o baixo acoplamento e o Information Hiding, pois o cliente não precisa conhecer os detalhes internos de cache, validação, log ou controle de acesso. Ele apenas chama a interface esperada. O Proxy também pode se relacionar com o Princípio da Responsabilidade Única, porque permite separar a responsabilidade principal do objeto real das responsabilidades adicionais, como cache ou segurança. Além disso, pode favorecer o Princípio Aberto/Fechado, pois adiciona comportamento sem modificar a classe original.

---

## 23. Resumo final

Proxy é:

```text
Um objeto intermediário que controla o acesso a outro objeto.
```

Estrutura:

```text
Cliente -> Proxy -> Objeto Real
```

No exemplo da apresentação:

```text
Cliente -> BookSearchProxy -> BookSearch
```

Serve para adicionar:

```text
cache
log
segurança
validação
auditoria
limitação de tentativas
controle de acesso remoto
```

Vantagens:

```text
Não modifica a classe original.
Separa responsabilidades.
Esconde detalhes internos.
Pode reduzir acoplamento.
Pode favorecer Aberto/Fechado.
```

Frase para memorizar:

> Proxy é um intermediário que controla o acesso a um objeto real, permitindo adicionar comportamentos como cache, log ou segurança sem modificar a classe original.
