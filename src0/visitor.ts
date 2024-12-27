import { NODE_TYPE } from "./constant";
import type * as ast from "./types/ast";
import type * as newAst from "./types/newAst";

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

class VisitableGroup {
  private _items: IVisitor[] = [];

  constructor() {
    this._items = [];
  }

  public addVisitor(visitor: IVisitor) {
    this._items.push(visitor);
  }

  public getVisitor(nodeType: ast.NodeType) {
    return this._items.find((item) => item[nodeType as keyof IVisitor]);
  }
}

class Converter {
  traverser(node: ast.Node, parent?: ast.Node) {
    const methods = this.visitor()[node.type];
    if (methods?.enter) {
      methods.enter(node, parent);
    }
    // switch (node.type) {
    //   case NODE_TYPE.PROGRAM:
    //     traverseArray(node.body, node);
    //     break;
    //   case NODE_TYPE.CALL_EXPRESSION:
    //     traverseArray(node.params, node);
    //     break;
    //   case NODE_TYPE.NUMBER_LITERAL:
    //   case NODE_TYPE.STRING_LITERAL:
    //     break;

    //   default:
    //     throw new TypeError("unknown node type", node);
    // }
    if (methods?.exit) {
      methods.exit(node, parent);
    }
  }

  visitor(): IVisitor {
    return {
      [NODE_TYPE.PROGRAM]: {
        enter: (node: ast.Program, parent: ast.Node) => {
          console.log("enter program");
          const newProgram: newAst.Program = {
            type: "program",
            body: [],
          };
          for (const stmt of node.body) {
            const newStmt = this.traverser(stmt, node);
            newProgram.body.push(newStmt);
          }
        },
        exit: (node: ast.Program, parent: ast.Node) => {
          console.log("exit program");
        },
      },
    };
  }
}
