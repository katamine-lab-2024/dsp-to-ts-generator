import { NODE_TYPE, NEW_NODE_TYPE } from "./constant";
import type {
  Program as astProgram,
  Node as astNode,
  BinaryNode,
} from "./types/ast";
import type { Program as NewProgram } from "./types/newAst";
import type { CompileError } from "./types/error";
import type * as ast from "./types/ast";

export type IVisitor = {
  [NODE_TYPE.PROGRAM]?: {
    enter?: (node: ast.Program, parent: ast.Node) => void;
    exit?: (node: ast.Program, parent: ast.Node) => void;
  };
  [NODE_TYPE.MODULE]?: {
    enter?: (node: ast.ModuleNode, parent: ast.Node) => void;
    exit?: (node: ast.ModuleNode, parent: ast.Node) => void;
  };
  [NODE_TYPE.PARAM]?: {
    enter?: (node: ast.ParamNode, parent: ast.Node) => void;
    exit?: (node: ast.ParamNode, parent: ast.Node) => void;
  };
  [NODE_TYPE.BLOCK]?: {
    enter?: (node: ast.BlockNode, parent: ast.Node) => void;
    exit?: (node: ast.BlockNode, parent: ast.Node) => void;
  };
  [NODE_TYPE.STMT]?: {
    enter?: (node: ast.StmtNode, parent: ast.Node) => void;
    exit?: (node: ast.StmtNode, parent: ast.Node) => void;
  };
  [NODE_TYPE.ASSIGN]?: {
    enter?: (node: ast.AssignNode, parent: ast.Node) => void;
    exit?: (node: ast.AssignNode, parent: ast.Node) => void;
  };
  [NODE_TYPE.TEST]?: {
    enter?: (node: ast.TestNode, parent: ast.Node) => void;
    exit?: (node: ast.TestNode, parent: ast.Node) => void;
  };
  [NODE_TYPE.WHEN]?: {
    enter?: (node: ast.WhenNode, parent: ast.Node) => void;
    exit?: (node: ast.WhenNode, parent: ast.Node) => void;
  };
  [NODE_TYPE.CALL]?: {
    enter?: (node: ast.CallNode, parent: ast.Node) => void;
    exit?: (node: ast.CallNode, parent: ast.Node) => void;
  };
  [NODE_TYPE.FOR]?: {
    enter?: (node: ast.ForNode, parent: ast.Node) => void;
    exit?: (node: ast.ForNode, parent: ast.Node) => void;
  };
  [NODE_TYPE.SQRT]?: {
    enter?: (node: ast.SqrtNode, parent: ast.Node) => void;
    exit?: (node: ast.SqrtNode, parent: ast.Node) => void;
  };
  [NODE_TYPE.CALL_EXPR]?: {
    enter?: (node: ast.BinaryNode, parent: ast.Node) => void;
    exit?: (node: ast.BinaryNode, parent: ast.Node) => void;
  };
  [NODE_TYPE.VAR]?: {
    enter?: (node: ast.VarNode, parent: ast.Node) => void;
    exit?: (node: ast.VarNode, parent: ast.Node) => void;
  };
  [NODE_TYPE.LIST]?: {
    enter?: (node: ast.ListNode, parent: ast.Node) => void;
    exit?: (node: ast.ListNode, parent: ast.Node) => void;
  };
  [NODE_TYPE.VECTOR]?: {
    enter?: (node: ast.StructNode, parent: ast.Node) => void;
    exit?: (node: ast.StructNode, parent: ast.Node) => void;
  };
  [NODE_TYPE.MEMBER]?: {
    enter?: (node: ast.Member, parent: ast.Node) => void;
    exit?: (node: ast.Member, parent: ast.Node) => void;
  };
  [NODE_TYPE.NUM]?: {
    enter?: (node: ast.LiteralNode, parent: ast.Node) => void;
    exit?: (node: ast.LiteralNode, parent: ast.Node) => void;
  };
  [NODE_TYPE.STRING]?: {
    enter?: (node: ast.LiteralNode, parent: ast.Node) => void;
    exit?: (node: ast.LiteralNode, parent: ast.Node) => void;
  };
  [NODE_TYPE.ATOM]?: {
    enter?: (node: ast.LiteralNode, parent: ast.Node) => void;
    exit?: (node: ast.LiteralNode, parent: ast.Node) => void;
  };
  [NODE_TYPE.DUMMY]?: {
    enter?: (node: ast.Dummy, parent: ast.Node) => void;
    exit?: (node: ast.Dummy, parent: ast.Node) => void;
  };
};

export class Converter {
  /** 出力: エラーリスト */
  errorList: CompileError[] = [];

  traverser(ast: astProgram, visitor: IVisitor) {
    const traverseArray = (array: astNode[], parent: astNode) => {
      for (const child of array) {
        traverseNode(child, parent);
      }
    };

    const traverseNode = (node: astNode, parent?: astNode) => {
      const methods = visitor[node.type];

      if (methods?.enter) {
        // @ts-ignore: Type errors I can't fix
        methods.enter(node, parent);
      }

      switch (node.type) {
        case NODE_TYPE.PROGRAM:
          traverseArray(node.body, node);
          break;
        case NODE_TYPE.CALL_EXPR: {
          // 左辺をトラバース
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          const leftNode: any = node.lhs;
          leftNode._context = node._context.lhs;
          traverseNode(leftNode, node);

          // 右辺をトラバース
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          const rightNode: any = (node as BinaryNode).rhs;
          rightNode._context = node._context.rhs;
          traverseNode(rightNode, node);
          break;
        }
        case NODE_TYPE.NUM:
        case NODE_TYPE.STRING:
        case NODE_TYPE.ATOM:
          break;

        default:
          this.errorList.push({
            message: `unknown node type: ${node.type}`,
            position: node.token.position,
          });
      }

      if (methods?.exit) {
        // @ts-ignore: Type errors I can't fix
        methods.exit(node, parent);
      }
    };
    traverseNode(ast);
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  transform(ast: any) {
    const newAst: NewProgram = {
      type: NEW_NODE_TYPE.PROGRAM,
      body: [],
    };

    ast._context = newAst.body;

    this.traverser(ast, {
      [NODE_TYPE.NUM]: {
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        enter(node: any, parent: any) {
          parent._context.push({
            type: NEW_NODE_TYPE.NUM,
            value: node.value,
          });
        },
      },
      [NODE_TYPE.STRING]: {
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        enter(node: any, parent: any) {
          parent._context.push({
            type: NEW_NODE_TYPE.STRING,
            value: node.value,
          });
        },
      },
      [NODE_TYPE.ATOM]: {
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        enter(node: any, parent: any) {
          parent._context.push({
            type: NEW_NODE_TYPE.STRING,
            value: node.value,
          });
        },
      },
      //   [NODE_TYPE.VAR]: {
      //     // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      //     enter(node: any, parent: any) {
      //       parent.__context.push({
      //         type: NEW_NODE_TYPE.VAR,
      //         name: node.name,
      //         valueType: node.valueType,
      //       });
      //     },
      //   },
      [NODE_TYPE.CALL_EXPR]: {
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        enter(node: any, parent: any) {
          // 初期化: 空の構造を用意
          const expression = {
            type: NODE_TYPE.CALL_EXPR,
            lhs: null, // まだ処理されていないので空にする
            rhs: null,
            callee: node.callee,
          };

          // 現在のノードの__contextを子ノード用に初期化
          node._context = expression;

          // 親のコンテキストに追加
          parent._context.push(expression);
        },
      },
      [NODE_TYPE.MODULE]: {
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        enter(node: any, parent: any) {
          const module = {
            type: NEW_NODE_TYPE.CLASS,
            token: node.token,
            name: node.name,
            fieldList: [],
            body: [],
          };

          node._context = module;
          parent._context.push(module);
        },
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        exit(node: any, parent: any) {
          let i = 1;
          for (const field of node.body) {
            node._context.body.name = `${i}`;
            i++;
          }
        },
      },
    });

    return newAst;
  }
}

const test = () => {
  const converter = new Converter();
  const ast: astProgram = {
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
            ],
          },
        ],
      },
    ],
  };
  const newAst = converter.transform(ast);
  console.log(newAst);
};

test();
