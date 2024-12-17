import { type ASTNode, NodeKind } from "./ASTNode";
import type { Program } from "./Program";

export function codeGen(prog: Program) {
  console.log(".intel_syntax noprefix");
  console.log(".global main");
  console.log("main:");

  console.log("    push rbp");
  console.log("    mov rbp, rsp");
  console.log(`    sub rsp, ${prog.stackSize}`);

  for (let node: ASTNode | null = prog.node; node !== null; node = node.next) {
    gen(node);
  }

  console.log(".Lreturn:");
  console.log("    mov rsp, rbp");
  console.log("    pop rbp");
  console.log("    ret");
  console.log('.section	.note.GNU-stack,"",@progbits');
}

function gen(node: ASTNode): void {
  switch (node.kind) {
    case NodeKind.NUM: {
      const v = node.val;
      console.log(`    push ${v}`);
      return;
    }
    case NodeKind.EXPR_STMT:
      if (node.lhs) gen(node.lhs);
      console.log("    add rsp, 8");
      return;
    case NodeKind.VAR:
      genAddr(node);
      load();
      return;
    case NodeKind.ASSIGN:
      if (node.lhs) genAddr(node.lhs);
      if (node.rhs) gen(node.rhs);
      store();
      return;
    case NodeKind.RETURN:
      if (node.lhs) gen(node.lhs);
      console.log("    pop rax");
      console.log("    jmp .Lreturn");
      return;
  }

  if (node.lhs) gen(node.lhs);
  if (node.rhs) gen(node.rhs);

  console.log("    pop rdi");
  console.log("    pop rax");

  switch (node.kind) {
    case NodeKind.ADD:
      console.log("    add rax, rdi");
      break;
    case NodeKind.SUB:
      console.log("    sub rax, rdi");
      break;
    case NodeKind.MUL:
      console.log("    imul rax, rdi");
      break;
    case NodeKind.DIV:
      console.log("    cqo");
      console.log("    idiv rdi");
      break;
    case NodeKind.EQ:
      console.log("    cmp rax, rdi");
      console.log("    sete al");
      console.log("    movzb rax, al");
      break;
    case NodeKind.NE:
      console.log("    cmp rax, rdi");
      console.log("    setne al");
      console.log("    movzb rax, al");
      break;
    case NodeKind.LT:
      console.log("    cmp rax, rdi");
      console.log("    setl al");
      console.log("    movzb rax, al");
      break;
    case NodeKind.LE:
      console.log("    cmp rax, rdi");
      console.log("    setle al");
      console.log("    movzb rax, al");
      break;
  }

  console.log("    push rax");
}

function genAddr(node: ASTNode) {
  if (node.kind === NodeKind.VAR) {
    console.log(`    lea rax, [rbp-${node.var?.offset}]`);
    console.log("    push rax");
    return;
  }

  throw new Error("代入の左辺値が変数ではありません");
}

function load() {
  console.log("    pop rax");
  console.log("    mov rax, [rax]");
  console.log("    push rax");
}

function store() {
  console.log("    pop rdi");
  console.log("    pop rax");
  console.log("    mov [rax], rdi");
  console.log("    push rdi");
}
