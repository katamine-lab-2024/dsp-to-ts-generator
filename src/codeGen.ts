import type {
  BuildInNode,
  Expr,
  Method,
  Program,
  StmtNode,
  VarNode,
} from "./types/newAst";

// todo: 小さいnodeを出力しながら発展させる開発をすべき

export const codeGen = (prog: Program) => {
  let output: string;
  // import文
  const libs = 'import type { VM, Predicate, Variable, List } from "./libs";\n';
  const buildIn = 'import { Member, Test } from "./buildIn";\n';
  output = libs.concat(buildIn);
  // class
  for (const method of prog.body) {
    // dummyを除外
    if (method.type === "dummy") continue;
    // class name
    const name = method.name;
    const classDecl = `export class ${name.toUpperCase()} implements Predicate {\n`;
    output.concat(classDecl);
    // field
    const fieldList = method.fieldList
      .map((param) => {
        if (param.type === "dummy") return;
        param.value.map((varNode) => {
          return `public ${varNode.name}: ${varNode.type};`;
        });
      })
      .join("\n")
      .concat("private cont: Predicate;");
    output.concat(fieldList);
    // constructor
    const construct = "public constructor(\n".concat(
      method.fieldList
        .map((param) => {
          if (param.type === "dummy") return;
          param.value.map((varNode) => {
            return `${varNode.name}: ${varNode.type}`;
          });
        })
        .join(",\n")
        .concat("cont: Predicate\n"),
      ") {\n",
      method.fieldList
        .map((param) => {
          if (param.type === "dummy") return;
          param.value.map((varNode) => {
            return `this.${varNode.name} = ${varNode.name};`;
          });
        })
        .join("\n")
        .concat("this.cont = cont;"),
      "}"
    );
    output.concat(construct);
    // body
    // bodyに含まれているclassを取得
    const blockList = method.body.filter((stmt) => stmt.type === "class");
    // exec
    const exec = "public exec(vm: VM): Predicate {\n".concat(
      blockList
        .map((block) => {
          // todo: whenなどで分岐するときの対応. blockに条件の情報を追加する？
          return `return new this.Method_${block.name}().exec(vm);`;
        })
        .join("\n"),
      "}"
    );
    output.concat(exec);

    // block class
    for (const block of blockList) {
      const blockName = `Method_${block.name}`;
      const declareBlockClass = `public ${blockName}: IC = createInnerClass(this).with(\n(outerThis) =>\nclass implements Predicate {\n`;
      output.concat(declareBlockClass);
      const blockField = block.fieldList
        .map((param) => {
          if (param.type === "dummy") return;
          param.value.map((varNode) => {
            // todo: 多分あってるけどVariable前提で良いのかな
            return `private ${varNode.name}: ${varNode.type} = new ${varNode.type}();`;
          });
        })
        .join("\n");
      output.concat(blockField);
      // bodyに含まれているclassを取得
      const stmtList = block.body.filter((stmt) => stmt.type === "class");
      // exec
      // stmtListの一番目が対象
      const execBlock = `public exec(vm: VM): Predicate {\nreturn this.${blockName.toLowerCase()}_cu${
        stmtList[0].name
      }.exec(vm);\n}`;
      output.concat(execBlock);

      // stmt class
      for (const stmt of stmtList) {
        const stmtName = `${blockName}_cu${stmt.name}`;
        const declareStmtClass = `public ${stmtName}: IC = createInnerClass(this).with(\n(methodThis) =>\nclass implements Predicate {\n`;
        output.concat(declareStmtClass);
        //exec
        const execDecl = "public exec(vm: VM): Predicate {\n";
        output.concat(execDecl);
        const execBody = (stmt.body as Method[])
          .map((method) =>
            // stmtGen()
            method.body.map((stmt) => stmtGen(stmt)).join("\n")
          )
          .join("\n");
        output.concat(execBody);
        const stmtEnd = "}\n);";
        output.concat(stmtEnd);
      }

      // stmt class field
      const stmtField = stmtList
        .map((stmt) => {
          return `private ${blockName.toLowerCase()}_cu${
            stmt.name
          } = new this.${blockName}_cu${stmt.name}();`;
        })
        .join("\n");
      output.concat(stmtField);
      // block class end
      const blockEnd = "}\n);";
      output.concat(blockEnd);
    }
  }
  const classEnd = "}\n";
  output.concat(classEnd);
  return output;
};

const stmtGen = (stmt: StmtNode): string => {
  switch (stmt.type) {
    case "if": {
      const ifDecl = "if";
      // todo: exprを処理する関数を作成する必要
      const cond: string = "(!".concat(exprGen(stmt.cond), ")");
      const then = "{\n".concat(
        stmt.then
          ? stmt.then.map((t) => stmtGen(t)).join("\n")
          : "return Predicate.failure;\n",
        "}\n"
      );
      const returnCont = " return outerThis.cont;\n";
      return ifDecl.concat(cond, then, returnCont);
    }
    case "assign": {
      // const assignedScope;
      const assignedName = (stmt.lhs as VarNode).name;
      const assignedValue: string = buildInGen(stmt.rhs);
      // todo: block scopeじゃないかもしれんけど一旦block scope前提
      return `methodThis.${assignedName}.setValue(${assignedValue});\n`;
    }
    case "return":
      return `return ${buildInGen(stmt.value)};\n`;
    default:
      return "";
  }
};

const buildInGen = (node: BuildInNode): string => {
  switch (node.type) {
    case "for": {
      return "for";
    }
    case "sqrt": {
      return "sqrt";
    }
    default:
      return exprGen(node);
  }
};

const exprGen = (node: Expr): string => {
  if (node.type === "call-expr") {
    return "";
  }
  return primaryGen(node);
};

const primaryGen = (node: Expr): string => {
  switch (node.type) {
    case "num":
      return node.token.value;
    case "string":
      return node.token.value;
    case "boolean":
      return node.token.value;
    case "var":
      return `methodThis.${node.name}.getValue()`;
    default:
      return "";
  }
};
