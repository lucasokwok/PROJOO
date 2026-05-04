# 05 - Facade

## 1. Ideia principal

O **Facade** é um padrão de projeto usado para criar uma **interface mais simples** para um sistema, módulo ou conjunto de classes complexo.

A ideia central é:

> Facade fornece uma interface simplificada para um subsistema complexo.

Em vez de o cliente precisar conhecer várias classes internas e chamar vários métodos em uma ordem específica, ele passa a chamar uma única classe de fachada.

Fluxo sem Facade:

```text
Cliente ---> Classe A
Cliente ---> Classe B
Cliente ---> Classe C
Cliente ---> Classe D
```

Fluxo com Facade:

```text
Cliente ---> Facade ---> Classe A
                  |----> Classe B
                  |----> Classe C
                  |----> Classe D
```

A fachada não elimina as classes internas. Ela apenas cria um ponto de entrada mais simples para o cliente.

---

## 2. Problema que o Facade resolve

Na apresentação, o problema é descrito assim:

- existe um módulo `M`;
- esse módulo é usado por vários outros módulos;
- a interface de `M` é complexa;
- os clientes reclamam que é difícil usar o módulo.

Ou seja, o cliente precisa saber detalhes demais sobre o funcionamento interno de um subsistema.

Isso aumenta o acoplamento.

Exemplo genérico sem Facade:

```ts
const scanner = new Scanner();
const parser = new Parser();
const ast = parser.parse(scanner.scan("codigo fonte"));
const codeGen = new CodeGen();

codeGen.generate(ast);
```

O cliente precisa conhecer várias etapas internas:

```text
Scanner
Parser
AST
CodeGen
```

O problema é que o cliente fica acoplado a muitas classes do subsistema.

Se o processo interno mudar, o cliente pode precisar ser alterado.

---

## 3. Solução com Facade

A solução é criar uma classe que esconda essa complexidade.

Exemplo:

```ts
class InterpretadorFacade {
  private scanner = new Scanner();
  private parser = new Parser();
  private codeGen = new CodeGen();

  public interpretar(codigo: string): void {
    const tokens = this.scanner.scan(codigo);
    const ast = this.parser.parse(tokens);
    this.codeGen.generate(ast);
  }
}
```

Agora o cliente usa apenas:

```ts
const interpretador = new InterpretadorFacade();

interpretador.interpretar("codigo fonte");
```

O cliente não precisa saber que internamente existem `Scanner`, `Parser`, `AST` e `CodeGen`.

---

## 4. Exemplo da apresentação: interpretador

A apresentação mostra um exemplo conceitual com um interpretador.

Sem fachada, o cliente precisa lidar diretamente com:

```text
Scanner
Parser
AST
CodeGen
```

Com fachada, o cliente passa a usar uma classe mais simples, chamada conceitualmente de `InterpretadorX`.

```text
Cliente ---> InterpretadorX ---> Scanner
                         |----> Parser
                         |----> AST
                         |----> CodeGen
```

A classe `InterpretadorX` é a fachada.

Ela coordena o uso das classes internas.

O cliente só chama a operação de alto nível.

---

## 5. Exemplo prático da apresentação: Home Theater

A apresentação também propõe um exercício com um **Home Theater**.

O sistema possui vários equipamentos:

```text
TV
Projetor
Receiver
Player de mídia
Sistema de som
Luz ambiente
```

Sem Facade, o usuário teria que fazer algo assim:

```ts
const tv = new TV();
const projetor = new Projetor();
const receiver = new Receiver();
const player = new PlayerMidia();
const som = new SistemaSom();
const luz = new LuzAmbiente();

tv.ligar();
projetor.ligar();
receiver.ligar();
player.ligar();
som.ligar();
som.definirVolume(20);
luz.reduzir();
player.reproduzir("filme.mp4");
```

O cliente precisa conhecer todos os dispositivos e a ordem correta das chamadas.

Com Facade, o cliente faz apenas:

```ts
const homeTheater = new HomeTheaterFacade(
  new TV(),
  new Projetor(),
  new Receiver(),
  new PlayerMidia(),
  new SistemaSom(),
  new LuzAmbiente()
);

homeTheater.assistirFilme("filme.mp4");
```

A fachada coordena os dispositivos.

---

## 6. Código completo em TypeScript

```ts
class TV {
  public ligar(): void {
    console.log("TV ligada");
  }

  public desligar(): void {
    console.log("TV desligada");
  }
}

class Projetor {
  public ligar(): void {
    console.log("Projetor ligado");
  }

  public desligar(): void {
    console.log("Projetor desligado");
  }
}

class Receiver {
  public ligar(): void {
    console.log("Receiver ligado");
  }

  public desligar(): void {
    console.log("Receiver desligado");
  }
}

class PlayerMidia {
  public ligar(): void {
    console.log("Player de mídia ligado");
  }

  public reproduzir(arquivo: string): void {
    console.log(`Reproduzindo: ${arquivo}`);
  }

  public desligar(): void {
    console.log("Player de mídia desligado");
  }
}

class SistemaSom {
  public ligar(): void {
    console.log("Sistema de som ligado");
  }

  public definirVolume(volume: number): void {
    console.log(`Volume definido para ${volume}`);
  }

  public desligar(): void {
    console.log("Sistema de som desligado");
  }
}

class LuzAmbiente {
  public reduzir(): void {
    console.log("Luz ambiente reduzida");
  }

  public acender(): void {
    console.log("Luz ambiente acesa");
  }
}

class HomeTheaterFacade {
  constructor(
    private tv: TV,
    private projetor: Projetor,
    private receiver: Receiver,
    private player: PlayerMidia,
    private som: SistemaSom,
    private luz: LuzAmbiente
  ) {}

  public assistirFilme(arquivo: string): void {
    this.luz.reduzir();
    this.tv.ligar();
    this.projetor.ligar();
    this.receiver.ligar();
    this.player.ligar();
    this.som.ligar();
    this.som.definirVolume(20);
    this.player.reproduzir(arquivo);
  }

  public desligarTudo(): void {
    this.player.desligar();
    this.som.desligar();
    this.receiver.desligar();
    this.projetor.desligar();
    this.tv.desligar();
    this.luz.acender();
  }
}

const homeTheater = new HomeTheaterFacade(
  new TV(),
  new Projetor(),
  new Receiver(),
  new PlayerMidia(),
  new SistemaSom(),
  new LuzAmbiente()
);

homeTheater.assistirFilme("interestelar.mp4");
homeTheater.desligarTudo();
```

---

## 7. O que acontece nesse código?

As classes `TV`, `Projetor`, `Receiver`, `PlayerMidia`, `SistemaSom` e `LuzAmbiente` representam o subsistema.

Cada uma possui suas próprias operações.

A classe `HomeTheaterFacade` concentra operações de alto nível:

```ts
assistirFilme()
desligarTudo()
```

O cliente não precisa mais coordenar cada dispositivo manualmente.

Ele apenas chama:

```ts
homeTheater.assistirFilme("interestelar.mp4");
```

A fachada se encarrega da sequência interna.

---

## 8. Estrutura do padrão Facade

```text
+------------------+
|     Cliente      |
+------------------+
          |
          v
+------------------+
|      Facade      |
+------------------+
| operacaoSimples()|
+------------------+
   |       |       |
   v       v       v
ClasseA ClasseB ClasseC
```

No exemplo do Home Theater:

```text
Cliente              = código que quer assistir ao filme
Facade               = HomeTheaterFacade
Classes do subsistema = TV, Projetor, Receiver, PlayerMidia, SistemaSom, LuzAmbiente
```

---

## 9. Relação com acoplamento

O Facade reduz o acoplamento do cliente com o subsistema.

Sem Facade, o cliente depende diretamente de várias classes:

```text
Cliente depende de TV
Cliente depende de Projetor
Cliente depende de Receiver
Cliente depende de PlayerMidia
Cliente depende de SistemaSom
Cliente depende de LuzAmbiente
```

Com Facade, o cliente depende principalmente de uma classe:

```text
Cliente depende de HomeTheaterFacade
```

Isso torna o cliente mais simples e menos sensível a mudanças internas.

Se amanhã a sequência para assistir filme mudar, provavelmente será necessário alterar apenas a fachada.

---

## 10. Relação com Information Hiding

Facade também se relaciona com **Information Hiding**, porque esconde detalhes internos do subsistema.

O cliente não precisa saber:

```text
qual dispositivo liga primeiro;
qual volume deve ser configurado;
como o player é iniciado;
como a luz é ajustada;
quais classes internas existem.
```

Ele apenas usa uma operação de alto nível:

```ts
homeTheater.assistirFilme("filme.mp4");
```

A complexidade fica escondida dentro da fachada.

---

## 11. Relação com Responsabilidade Única

O Facade pode ajudar a organizar o uso de um subsistema, mas também exige cuidado.

A apresentação pergunta qual princípio pode ser violado se não tomarmos cuidado ao usar uma fachada.

O risco é violar o **Princípio da Responsabilidade Única**.

Isso acontece quando a fachada começa a fazer coisas demais.

Exemplo ruim:

```ts
class SistemaFacade {
  public gerarRelatorio(): void {}
  public enviarEmail(): void {}
  public salvarNoBanco(): void {}
  public processarPagamento(): void {}
  public controlarEstoque(): void {}
  public autenticarUsuario(): void {}
}
```

Essa classe virou uma “classe Deus”, concentrando responsabilidades demais.

Uma fachada deve simplificar o acesso ao subsistema, mas não deve virar um depósito de todas as funcionalidades do sistema.

---

## 12. Facade não é apenas juntar métodos

Um erro comum é achar que qualquer classe com muitos métodos é uma fachada.

Facade não é simplesmente uma classe com vários métodos.

Facade tem uma intenção específica:

```text
simplificar o acesso a um subsistema complexo.
```

Ela deve representar operações de alto nível que fazem sentido para o cliente.

Exemplo bom:

```ts
homeTheater.assistirFilme()
homeTheater.ouvirMusica()
homeTheater.desligarTudo()
```

Exemplo ruim:

```ts
homeTheater.ligarTV()
homeTheater.ligarProjetor()
homeTheater.ligarSom()
homeTheater.abaixarLuz()
```

Se a fachada apenas repassa todos os métodos individuais, ela não simplifica muito.

O ideal é oferecer operações mais próximas do objetivo do usuário.

---

## 13. Diferença entre Facade e Adapter

| Facade | Adapter |
|---|---|
| Simplifica o uso de um subsistema complexo | Adapta uma interface incompatível |
| Normalmente envolve várias classes internas | Normalmente adapta uma classe ou API |
| Foco em simplicidade | Foco em compatibilidade |
| Cliente poderia até usar o subsistema diretamente, mas seria mais difícil | Cliente não consegue usar o Adaptee diretamente sem adaptação |

Exemplo de Facade:

```text
HomeTheaterFacade controla TV, som, projetor e luz.
```

Exemplo de Adapter:

```text
AdaptadorProjetorSamsung adapta ProjetorSamsung para a interface Projetor.
```

---

## 14. Diferença entre Facade e Proxy

| Facade | Proxy |
|---|---|
| Simplifica acesso a um subsistema | Controla acesso a um objeto real |
| Normalmente envolve várias classes | Normalmente envolve um objeto principal |
| Foco em simplificação | Foco em controle/intermediação |
| Esconde complexidade de uso | Pode adicionar cache, log, segurança etc. |

Exemplo de Facade:

```text
Cliente chama assistirFilme().
```

Exemplo de Proxy:

```text
Cliente chama BookSearchProxy, que verifica cache antes de chamar BookSearch.
```

---

## 15. Quando usar Facade

Use Facade quando:

```text
um subsistema possui várias classes;
o cliente precisa fazer muitas chamadas para realizar uma operação;
a interface atual é difícil de usar;
você quer reduzir o acoplamento entre cliente e subsistema;
você quer esconder detalhes internos;
você quer oferecer operações de alto nível.
```

Exemplos comuns:

```text
Home Theater
Interpretador
Compilador
Módulo de pagamento
Sistema de relatórios
Integração com vários serviços externos
Biblioteca com API complexa
```

---

## 16. Quando não usar Facade

Evite Facade quando:

```text
o subsistema já é simples;
a fachada só repete métodos individuais sem simplificar;
a fachada começa a concentrar responsabilidades demais;
não existe ganho real de clareza;
a complexidade adicionada é maior que o benefício.
```

Nesse caso, pode virar overengineering.

---

## 17. Como identificar Facade em uma prova

Procure por situações em que:

```text
o cliente precisa lidar com muitas classes;
existe um subsistema complexo;
querem simplificar o uso;
querem reduzir acoplamento;
querem esconder detalhes internos;
há uma classe central com operações de alto nível.
```

Palavras-chave:

```text
fachada
interface simples
subsistema complexo
reduzir acoplamento
esconder complexidade
operações de alto nível
```

---

## 18. Possível pergunta de prova

### Pergunta

Explique o padrão Facade e aplique ao exemplo do Home Theater.

### Resposta sugerida

O padrão Facade fornece uma interface simplificada para um subsistema complexo. No exemplo do Home Theater, o sistema possui vários equipamentos, como TV, projetor, receiver, player de mídia, sistema de som e luz ambiente. Sem fachada, o cliente precisaria ligar e configurar cada dispositivo separadamente. Com uma `HomeTheaterFacade`, o cliente chama métodos de alto nível, como `assistirFilme()` ou `desligarTudo()`, e a fachada coordena internamente todos os dispositivos. Isso reduz o acoplamento do cliente com o subsistema e esconde a complexidade interna.

---

## 19. Outra possível pergunta de prova

### Pergunta

Qual propriedade de projeto o Facade melhora? E qual princípio pode ser violado se ele for mal usado?

### Resposta sugerida

O Facade melhora principalmente o acoplamento, pois o cliente deixa de depender diretamente de várias classes do subsistema e passa a depender de uma interface mais simples. Também melhora o Information Hiding, porque esconde detalhes internos de funcionamento. Porém, se a fachada acumular responsabilidades demais, ela pode violar o Princípio da Responsabilidade Única.

---

## 20. Resumo final

Facade é:

```text
Uma interface simplificada para um subsistema complexo.
```

Estrutura:

```text
Cliente -> Facade -> Classes internas do subsistema
```

No exemplo do Home Theater:

```text
Cliente -> HomeTheaterFacade -> TV, Projetor, Receiver, PlayerMidia, SistemaSom, LuzAmbiente
```

Vantagens:

```text
reduz acoplamento;
esconde complexidade;
facilita uso do subsistema;
concentra sequências complexas em operações de alto nível;
melhora legibilidade do cliente.
```

Cuidado:

```text
não transformar a fachada em uma classe com responsabilidades demais.
```

Frase para memorizar:

> Facade cria uma interface simples para usar um conjunto complexo de classes, reduzindo o acoplamento do cliente com o subsistema.
