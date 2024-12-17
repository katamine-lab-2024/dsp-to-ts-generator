import type { ASTNode } from "./ASTNode";
import type { Var } from "./Var";

export class Program {
  node: ASTNode;
  locals: Var | null = null;
  stackSize: number;

  constructor(node: ASTNode, stackSize: number) {
    this.node = node;
    this.stackSize = stackSize;
  }

  public [Symbol.iterator]() {
    let current: ASTNode | null = this.node;
    return {
      next() {
        if (current) {
          const value = current;
          current = current.next || null;
          return { value, done: false };
        }
        return { value: null, done: true };
      },
    };
  }
}
