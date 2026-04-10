import { Notification } from "./Notification";

export class LoggingProxy implements Notification {
  constructor(private notification: Notification) {}

  public send(destinatario: string, mensagem: string): string {
    console.log(
      "Entrando no proxy - destinatario: " +
        destinatario +
        "; msg: " +
        mensagem,
    );

    return this.notification.send(destinatario, mensagem);
  }
}

// class BookSearchProxy implements BookSearchInterface {

//   private BookSearchInterface base;

//   BookSearchProxy (BookSearchInterface base) {
//     this.base = base;
//   }

//   public Book getBook(String ISBN) {
//     Book book;
//     System.out.println("Entrando no proxy - ISBN: " + ISBN);

//     // A ideia aqui é que o Proxy conhece o livro que tem ISBN 1
//     // Logo, ele nem precisa fazer a consulta ao objeto base
//     if (ISBN.equals("1")) {
//        System.out.println("Livro achado no proxy - ISBN: " + ISBN);
//        book = new Book("ESM");
//     }
//     else {
//       System.out.println("Livro não achado no proxy; repassando chamada para objeto base - ISBN: " + ISBN);
//       book = base.getBook(ISBN);
//     }
//     System.out.println("Saindo do Proxy");
//     return book;
//   }

// }
