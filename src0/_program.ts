import { atEof, consume, consumeIdent, expect, expectNumber } from "./tokenize";
import { useValue, useSetState } from "./stateManager";
import { locals } from "./state";
import { Var } from "./Var";
import { Program } from "./Program";
import { ASTNode, NodeKind } from "./ASTNode";
import type { Token } from "./Token";
import { strDup } from "./utils";

const setLocalsState = useSetState(locals);

export function program(): Program {
  setLocalsState(null); // locals = null
  const head: ASTNode = new ASTNode(NodeKind.EXPR_STMT);
  head.next = null;
  let cur = head;

  while (!atEof()) {
    cur.next = stmt();
    cur = cur.next;
  }

  if (!head.next) throw new Error("Unexpected end of input");
  const prog: Program = new Program(head.next, 0);
  prog.node = head.next;
  prog.locals = useValue(locals);
  return prog;
}

function stmt(): ASTNode {
  if (consume("return")) {
    const node: ASTNode = ASTNode.newUnary(NodeKind.RETURN, expr());
    expect(";");
    return node;
  }
  const node: ASTNode = ASTNode.newUnary(NodeKind.EXPR_STMT, expr());
  expect(";");
  return node;
}

export function expr(): ASTNode {
  return assign();
}

function assign(): ASTNode {
  let node: ASTNode = equality();
  if (consume("=")) node = ASTNode.newBinary(NodeKind.ASSIGN, node, assign());
  return node;
}

function equality(): ASTNode {
  let node: ASTNode = relational();

  while (true) {
    if (consume("==")) {
      node = ASTNode.newBinary(NodeKind.EQ, node, relational());
    } else if (consume("!=")) {
      node = ASTNode.newBinary(NodeKind.NE, node, relational());
    } else {
      return node;
    }
  }
}

function relational(): ASTNode {
  let node = add();

  while (true) {
    if (consume("<")) {
      node = ASTNode.newBinary(NodeKind.LT, node, add());
    } else if (consume("<=")) {
      node = ASTNode.newBinary(NodeKind.LE, node, add());
    } else if (consume(">")) {
      node = ASTNode.newBinary(NodeKind.LT, add(), node);
    } else if (consume(">=")) {
      node = ASTNode.newBinary(NodeKind.LE, add(), node);
    } else {
      return node;
    }
  }
}

function add(): ASTNode {
  let node = mul();

  while (true) {
    if (consume("+")) {
      node = ASTNode.newBinary(NodeKind.ADD, node, mul());
    } else if (consume("-")) {
      node = ASTNode.newBinary(NodeKind.SUB, node, mul());
    } else {
      return node;
    }
  }
}

function mul(): ASTNode {
  let node = unary();

  while (true) {
    if (consume("*")) {
      node = ASTNode.newBinary(NodeKind.MUL, node, unary());
    } else if (consume("/")) {
      node = ASTNode.newBinary(NodeKind.DIV, node, unary());
    } else {
      return node;
    }
  }
}

function unary(): ASTNode {
  if (consume("+")) return unary();
  if (consume("-"))
    return ASTNode.newBinary(NodeKind.SUB, ASTNode.newNumber(0), unary());

  return primary();
}

function primary(): ASTNode {
  if (consume("(")) {
    const node = expr();
    expect(")");
    return node;
  }

  const tok: Token | null = consumeIdent();
  if (tok) {
    let v: Var | null = Var.findVar(tok);
    if (v === null) {
      v = Var.pushVar(strDup(tok.str, tok.len));
    }
    return ASTNode.newVar(v);
  }

  return ASTNode.newNumber(expectNumber());
}
