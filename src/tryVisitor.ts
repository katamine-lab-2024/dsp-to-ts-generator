import { NEW_NODE_TYPE, NODE_TYPE } from "./constant";
import type * as ast from "./types/ast";
import type * as newAst from "./types/newAst";
import type { Type, NewType } from "./types/type";

const stmtBlockType = "stmt-block" as const;

// Visitorの型を定義
type Visitor = {
  [NODE_TYPE.NUM]: (node: ast.LiteralNode) => newAst.LiteralNode;
  [NODE_TYPE.VAR]: (node: ast.VarNode) => newAst.VarNode;
  //todo: 本来は違うけど、paramのためにvarNode
  [NODE_TYPE.MEMBER]: (node: ast.Member) => newAst.VarNode;
  [NODE_TYPE.CALL_EXPR]: (node: ast.Expr) => newAst.Expr;
  [NODE_TYPE.SQRT]: (node: ast.SqrtNode) => newAst.SqrtNode;
  [NODE_TYPE.FOR]: (node: ast.ForNode) => newAst.ForNode;
  [NODE_TYPE.ASSIGN]: (node: ast.AssignNode) => newAst.AssignNode;
  [NODE_TYPE.TEST]: (node: ast.TestNode) => newAst.If;
  //   [NODE_TYPE.STMT]: (node: ast.StmtNode) => newAst.StmtNode;
  [stmtBlockType]: (node: ast.StmtBlock) => newAst.ClassNode;
  [NODE_TYPE.BLOCK]: (node: ast.Block) => newAst.ClassNode;
  [NODE_TYPE.PARAM]: (node: ast.ParamNode) => newAst.ParamNode;
  [NODE_TYPE.MODULE]: (node: ast.Module) => newAst.ClassNode;
  [NODE_TYPE.PROGRAM]: (node: ast.Program) => newAst.Program;
};

// ノードの配列を操作する関数
function visitNode(node: ast.Node, visitor: Visitor): newAst.Node {
  switch (node.type) {
    case NODE_TYPE.NUM:
      return visitor[NODE_TYPE.NUM](node as ast.LiteralNode);
    case NODE_TYPE.VAR:
      return visitor[NODE_TYPE.VAR](node as ast.VarNode);
    case NODE_TYPE.MEMBER:
      return visitor[NODE_TYPE.MEMBER](node as ast.Member);
    case NODE_TYPE.CALL_EXPR:
      return visitor[NODE_TYPE.CALL_EXPR](node as ast.Expr);
    case NODE_TYPE.SQRT:
      return visitor[NODE_TYPE.SQRT](node as ast.SqrtNode);
    case NODE_TYPE.FOR:
      return visitor[NODE_TYPE.FOR](node as ast.ForNode);
    case NODE_TYPE.ASSIGN:
      return visitor[NODE_TYPE.ASSIGN](node as ast.AssignNode);
    case NODE_TYPE.TEST:
      return visitor[NODE_TYPE.TEST](node as ast.TestNode);
    // case NODE_TYPE.STMT:
    //   return visitor[NODE_TYPE.STMT](node as ast.StmtNode);
    case stmtBlockType:
      return visitor[stmtBlockType](node as ast.StmtBlock);
    case NODE_TYPE.BLOCK:
      return visitor[NODE_TYPE.BLOCK](node as ast.Block);
    case NODE_TYPE.MODULE:
      return visitor[NODE_TYPE.MODULE](node as ast.Module);
    case NODE_TYPE.PARAM:
      return visitor[NODE_TYPE.PARAM](node as ast.ParamNode);
    case NODE_TYPE.PROGRAM:
      return visitor[NODE_TYPE.PROGRAM](node as ast.Program);
    default:
      throw new Error(
        `Unknown node type: ${
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          (node as any).type
        }`
      );
  }
}

// typeの変換
const convertType = (type: Type): NewType => {
  switch (type.type) {
    case "integer":
      return {
        type: "number",
        token: type.token,
      };
    case "real":
      return {
        type: "number",
        token: type.token,
      };
    case "bool":
      return {
        type: "boolean",
        token: type.token,
      };
    case "atom":
      return {
        type: "string",
        token: type.token,
      };
    case "list":
      return {
        type: "list",
        member: "member" in type ? type.member.map(convertType) : [],
        token: type.token,
      };
    case "vector":
      return {
        type: "vector",
        member: "member" in type ? type.member.map(convertType) : [],
        token: type.token,
      };
    default:
      return {
        type: "dummy",
        token: type.token,
      };
  }
};

// Visitorの実装
const visitor: Visitor = {
  [NODE_TYPE.NUM]: (node) => {
    return {
      type: NODE_TYPE.NUM,
      token: node.token,
    };
  },
  [NODE_TYPE.VAR]: (node) => {
    return {
      type: NODE_TYPE.VAR,
      token: node.token,
      name: node.name,
      valueType: convertType(node.valueType),
    };
  },
  [NODE_TYPE.MEMBER]: (node) => {
    const v = visitNode(node.value as ast.VarNode, visitor) as newAst.VarNode;
    return {
      type: NODE_TYPE.VAR,
      token: node.token,
      name: v.name,
      valueType: v.valueType,
    };
  },
  [NODE_TYPE.CALL_EXPR]: (node: ast.Expr) => {
    if ("callee" in node) {
      const lhs = visitNode(node.lhs, visitor) as newAst.Expr;
      if ("rhs" in node) {
        const rhs = visitNode(node.rhs, visitor) as newAst.Expr;
        return {
          type: NODE_TYPE.CALL_EXPR,
          token: node.token,
          callee: node.callee,
          lhs: lhs,
          rhs: rhs,
        };
      }
      return {
        type: NODE_TYPE.CALL_EXPR,
        token: node.token,
        callee: node.callee,
        lhs: lhs,
      };
    }
    return visitNode(node, visitor) as newAst.Primary;
  },
  [NODE_TYPE.SQRT]: (node: ast.SqrtNode) => {
    const expr = visitNode(node.expr, visitor) as newAst.Expr;
    return {
      type: NODE_TYPE.SQRT,
      token: node.token,
      expr: expr,
    };
  },
  [NODE_TYPE.FOR]: (node: ast.ForNode) => {
    console.log("::for");
    const from = visitNode(node.from, visitor) as newAst.Expr;
    const to = visitNode(node.to, visitor) as newAst.Expr;
    const inc = visitNode(node.inc, visitor) as newAst.Expr;
    return {
      type: NODE_TYPE.FOR,
      token: node.token,
      from: from,
      to: to,
      inc: inc,
    };
  },
  [NODE_TYPE.ASSIGN]: (node: ast.AssignNode) => {
    const lhs = visitNode(node.lhs, visitor) as newAst.VarNode;
    const rhs = visitNode(node.rhs, visitor) as newAst.Expr;
    return {
      type: NODE_TYPE.ASSIGN,
      token: node.token,
      lhs: lhs,
      rhs: rhs,
    };
  },
  [NODE_TYPE.TEST]: (node: ast.TestNode) => {
    const cond = visitNode(node.cond, visitor) as newAst.Expr;
    const ifStmt: newAst.If = {
      type: NEW_NODE_TYPE.IF,
      token: node.token,
      cond: cond,
    };
    return ifStmt;
  },
  [stmtBlockType]: (node: ast.StmtBlock) => {
    const body = node.body.map((stmt) =>
      visitNode((stmt as ast.Stmt).stmt, visitor)
    ) as newAst.StmtNode[];
    return {
      type: NEW_NODE_TYPE.CLASS,
      token: node.token,
      name: "",
      fieldList: [],
      body: [
        {
          type: NEW_NODE_TYPE.METHOD,
          token: node.token,
          body: body,
        },
      ],
    };
  },
  [NODE_TYPE.BLOCK]: (node: ast.Block) => {
    const list = [];
    let slist: ast.Stmt[] = [];
    for (const stmt of node.body) {
      const s = stmt as ast.Stmt;
      if (s.stmt.type === NODE_TYPE.ASSIGN) {
        if (s.stmt.rhs.type === NODE_TYPE.FOR) {
          if (slist.length !== 0) {
            list.push({
              type: "stmt-block" as const,
              token: node.token,
              body: slist,
              varList: [],
            });
            slist = [];
          }
          list.push({
            type: "stmt-block" as const,
            token: node.token,
            body: [s],
            varList: [],
          });
          continue;
        }
      }
      slist.push(s);
    }
    if (slist.length !== 0) {
      list.push({
        type: "stmt-block" as const,
        token: node.token,
        body: slist,
        varList: [],
      });
      slist = [];
    }
    const newBody = list.map((stmt, index) => {
      const innerClass = visitNode(stmt, visitor) as newAst.Class;
      innerClass.name = `${index + 1}`;
      return innerClass;
    }) as newAst.Class[];
    const newField = node.varList.map((param) => {
      const v = visitNode(param, visitor);
      return {
        type: NEW_NODE_TYPE.PARAM,
        token: param.token,
        value: [v],
      };
    }) as newAst.ParamNode[];

    const c: newAst.Class = {
      type: NEW_NODE_TYPE.CLASS,
      token: node.token,
      name: "",
      fieldList: newField,
      body: newBody,
    };
    return c;
  },
  [NODE_TYPE.PARAM]: (node: ast.ParamNode) => {
    const member = (node as ast.Param).value as ast.Member[];
    const value = member.map((param) =>
      visitNode(param, visitor)
    ) as newAst.VarNode[];
    return {
      type: NEW_NODE_TYPE.PARAM,
      token: node.token,
      value: value,
    };
  },
  [NODE_TYPE.MODULE]: (node: ast.Module) => {
    const body = node.body.map((stmt) =>
      visitNode(stmt, visitor)
    ) as newAst.MethodNode[];
    let i = 1;
    for (const inner of body) {
      (inner as newAst.Class).name = `${i}`;
      i++;
    }
    const field = node.paramList.map((param) =>
      visitNode(param, visitor)
    ) as newAst.ParamNode[];

    return {
      type: NEW_NODE_TYPE.CLASS,
      token: node.token,
      name: node.name,
      fieldList: field,
      body: body,
    };
  },
  [NODE_TYPE.PROGRAM]: (node: ast.Program) => {
    const body = node.body.map((stmt) =>
      visitNode(stmt, visitor)
    ) as newAst.ClassNode[];
    return {
      type: NEW_NODE_TYPE.PROGRAM,
      body: body,
    };
  },
};

// ノードの例
// a = 1 + 2;
const complexNode: ast.Node = {
  type: NODE_TYPE.PROGRAM,
  body: [
    {
      type: NODE_TYPE.MODULE,
      token: {
        type: "reserved",
        value: "module",
        position: {
          line: 1,
          character: 1,
        },
      },
      name: "main",
      paramList: [],
      localList: [],
      body: [
        {
          type: NODE_TYPE.BLOCK,
          token: {
            type: "reserved",
            value: "{",
            position: {
              line: 1,
              character: 1,
            },
          },
          varList: [],
          body: [
            {
              type: NODE_TYPE.STMT,
              token: {
                type: "reserved",
                value: ";",
                position: {
                  line: 1,
                  character: 1,
                },
              },
              stmt: {
                type: NODE_TYPE.ASSIGN,
                token: {
                  type: "reserved",
                  value: "=",
                  position: {
                    line: 1,
                    character: 1,
                  },
                },
                lhs: {
                  type: NODE_TYPE.VAR,
                  name: "a",
                  token: {
                    type: "ident-var",
                    value: "a",
                    position: {
                      line: 1,
                      character: 1,
                    },
                  },
                  valueType: {
                    type: "real",
                    token: {
                      type: "ident-var",
                      value: "a",
                      position: {
                        line: 1,
                        character: 1,
                      },
                    },
                  },
                },
                rhs: {
                  type: NODE_TYPE.FOR,
                  token: {
                    type: "reserved",
                    value: "for",
                    position: {
                      line: 1,
                      character: 1,
                    },
                  },
                  from: {
                    type: NODE_TYPE.NUM,
                    token: {
                      type: "number",
                      value: "1",
                      position: {
                        line: 1,
                        character: 1,
                      },
                    },
                  },
                  to: {
                    type: NODE_TYPE.NUM,
                    token: {
                      type: "number",
                      value: "10",
                      position: {
                        line: 1,
                        character: 1,
                      },
                    },
                  },
                  inc: {
                    type: NODE_TYPE.NUM,
                    token: {
                      type: "number",
                      value: "1",
                      position: {
                        line: 1,
                        character: 1,
                      },
                    },
                  },
                },
              },
            },
            {
              type: NODE_TYPE.STMT,
              token: {
                type: "reserved",
                value: ";",
                position: {
                  line: 1,
                  character: 1,
                },
              },
              stmt: {
                type: NODE_TYPE.ASSIGN,
                token: {
                  type: "reserved",
                  value: "=",
                  position: {
                    line: 1,
                    character: 1,
                  },
                },
                lhs: {
                  type: NODE_TYPE.VAR,
                  name: "b",
                  token: {
                    type: "ident-var",
                    value: "b",
                    position: {
                      line: 1,
                      character: 1,
                    },
                  },
                  valueType: {
                    type: "real",
                    token: {
                      type: "ident-var",
                      value: "b",
                      position: {
                        line: 1,
                        character: 1,
                      },
                    },
                  },
                },
                rhs: {
                  type: NODE_TYPE.CALL_EXPR,
                  token: {
                    type: "reserved",
                    value: "+",
                    position: {
                      line: 1,
                      character: 1,
                    },
                  },
                  callee: "add",
                  lhs: {
                    type: NODE_TYPE.NUM,
                    token: {
                      type: "number",
                      value: "1",
                      position: {
                        line: 1,
                        character: 1,
                      },
                    },
                  },
                  rhs: {
                    type: NODE_TYPE.NUM,
                    token: {
                      type: "number",
                      value: "2",
                      position: {
                        line: 1,
                        character: 1,
                      },
                    },
                  },
                },
              },
            },
            {
              type: NODE_TYPE.STMT,
              token: {
                type: "reserved",
                value: ";",
                position: {
                  line: 1,
                  character: 1,
                },
              },
              stmt: {
                type: NODE_TYPE.TEST,
                token: {
                  type: "reserved",
                  value: "test",
                  position: {
                    line: 1,
                    character: 1,
                  },
                },
                cond: {
                  type: NODE_TYPE.CALL_EXPR,
                  token: {
                    type: "reserved",
                    value: "test",
                    position: {
                      line: 1,
                      character: 1,
                    },
                  },
                  callee: "EQ",
                  lhs: {
                    type: NODE_TYPE.VAR,
                    name: "a",
                    token: {
                      type: "ident-var",
                      value: "a",
                      position: {
                        line: 1,
                        character: 1,
                      },
                    },
                    valueType: {
                      type: "real",
                      token: {
                        type: "ident-var",
                        value: "a",
                        position: {
                          line: 1,
                          character: 1,
                        },
                      },
                    },
                  },
                  rhs: {
                    type: NODE_TYPE.NUM,
                    token: {
                      type: "number",
                      value: "10",
                      position: {
                        line: 1,
                        character: 1,
                      },
                    },
                  },
                },
              },
            },
          ],
        },
      ],
    },
  ],
};

// ノードを訪問
// const result = visitNode(complexNode, visitor);
// console.dir(result, { depth: null });

export const converter = (input: ast.Node): newAst.Node => {
  return visitNode(input, visitor);
};
