import type { Var } from "./Var";

export class ASTNode {
  kind: NodeKind; // Nodeの種類
  next: ASTNode | null = null; // 次のNode
  lhs?: ASTNode; // 左辺
  rhs?: ASTNode; // 右辺
  var?: Var; // kindがNodeKind.VARのとき使う
  val?: number; // kindがNodeKind.NUMのとき使う

  constructor(
    kind: NodeKind,
    lhs?: ASTNode,
    rhs?: ASTNode,
    val?: number,
    v?: Var
  ) {
    this.kind = kind;
    this.lhs = lhs;
    this.rhs = rhs;
    this.val = val;
    this.var = v;
  }

  public [Symbol.iterator]() {
    let current: ASTNode | null = this;
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

  // 左辺と右辺を受け取るノードを作成
  static newBinary(kind: NodeKind, lhs: ASTNode, rhs: ASTNode): ASTNode {
    return new ASTNode(kind, lhs, rhs);
  }

  static newUnary(kind: NodeKind, lhs: ASTNode): ASTNode {
    return new ASTNode(kind, lhs);
  }

  // 数値を受け取るノードを作成
  static newNumber(val: number): ASTNode {
    return new ASTNode(NodeKind.NUM, undefined, undefined, val);
  }

  // ローカル変数を受け取るノードを作成
  static newVar(v: Var): ASTNode {
    return new ASTNode(NodeKind.VAR, undefined, undefined, undefined, v);
  }
}

// 抽象構文木のNodeの種類
export enum NodeKind {
  ADD = "ADD", // +
  SUB = "SUB", // -
  MUL = "MUL", // *
  DIV = "DIV", // /
  EQ = "EQ", // ==
  NE = "NE", // !=
  LT = "LT", // <
  LE = "LE", // <=
  ASSIGN = "ASSIGN", // =
  RETURN = "RETURN", // return
  EXPR_STMT = "EXPR_STMT", // 式ステートメント
  VAR = "VAR", // ローカル変数
  NUM = "NUM", // 整数
}
