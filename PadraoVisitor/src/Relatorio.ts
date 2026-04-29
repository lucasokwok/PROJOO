import { Visitor } from "./Visitor";

export interface Relatorio {
  accept(visitor: Visitor): void;
}
