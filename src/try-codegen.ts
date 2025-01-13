import type {
  BuildInNode,
  Class,
  Expr,
  Program,
  StmtNode,
  VarNode,
} from "./types/newAst";

/**
 *
 * @param prog
 * @returns
 */

export const codeGen = (prog: Program) => {
  // import
  const libs =
    'import { type VM, type List, type IC, Variable, createInnerClass, Predicate, } from "./libs";';
  const buildIn = 'import { Member, Test } from "./buildIn";';
  const output = [libs, buildIn, ""];
  const classList = prog.body.filter((stmt) => stmt.type !== "dummy");
  const classContents: string[][] = [];
  // class
  for (const module of classList) {
    classContents.push([...codeClass(module), ""]);
  }
  output.push(...classContents.flat());
  return output.join("\n");
};

const codeClass = (module: Class): string[] => {
  // クラス宣言
  const name = module.name;
  const classDecl = `export class ${
    name.charAt(0).toUpperCase() + name.slice(1)
  } implements Predicate {`;
  // フィールド
  const field = [
    ...module.fieldList
      .filter((p) => p.type !== "dummy")
      .flatMap((p) => p.value.map((v) => `  private ${v.name}: Variable;`)),
    "  private cont: Predicate;",
    "",
  ];
  // コンストラクタ
  const construct = [
    "  public constructor(",
    ...module.fieldList
      .filter((p) => p.type !== "dummy")
      .flatMap((p) => p.value.map((v) => `    ${v.name}: Variable,`)),
    "    cont: Predicate",
    "  ) {",
    ...module.fieldList
      .filter((p) => p.type !== "dummy")
      .flatMap((p) => p.value.map((v) => `    this.${v.name} = ${v.name};`)),
    "    this.cont = cont;",
    "  }",
    "",
  ];
  // block
  const blockList = module.body.filter((stmt) => stmt.type === "class");
  // execメソッド
  const exec = [
    "  public exec(vm: VM): Predicate {",
    ...blockList.map(
      (block) =>
        // todo: blockが複数ある場合の対応
        `    return new this.Method_${block.name}().exec(vm);`
    ),
    "  }",
    "",
  ];
  const blockContents: string[][] = [];
  // blockクラス
  for (const block of blockList) {
    blockContents.push([...codeBlock(block), ""]);
  }
  return [
    classDecl,
    ...field,
    ...construct,
    ...exec,
    ...blockContents.flat(),
    "}",
  ];
};

const codeBlock = (block: Class): string[] => {
  const name = `Method_${block.name}`;
  const classDecl = [
    `  public ${name}: IC = createInnerClass(this).with(`,
    "    (outerThis) =>",
    "      class implements Predicate {",
  ];
  // フィールド
  const field = [
    ...block.fieldList
      .filter((p) => p.type !== "dummy")
      .flatMap((p) =>
        p.value.map((v) => `        private ${v.name}: Variable;`)
      ),
    "",
  ];
  // stmt
  const stmtList = block.body.filter(
    (stmt) => stmt.type !== "dummy" && stmt.type !== "method"
  );
  // execメソッド
  const exec = [
    "        public exec(vm: VM): Predicate {",
    `          return this.${name.toLowerCase()}_cu${
      stmtList[0].name
    }.exec(vm);`,
    "        }",
    "",
  ];
  // stmtクラス
  const stmtContents: string[][] = [];
  for (let i = 0; i < stmtList.length; i++) {
    const stmt = stmtList[i];
    const nextName = stmtList[i + 1] ? stmtList[i + 1].name : undefined;
    stmtContents.push([...codeStmt(stmt, name, nextName), ""]);
  }
  const stmtInstanceList = stmtList.map(
    (s) =>
      `        private ${name.toLowerCase()}_cu${s.name} = new this.${name}_cu${
        s.name
      }();`
  );
  return [
    ...classDecl,
    ...field,
    ...exec,
    ...stmtContents.flat(),
    ...stmtInstanceList,
    "      }",
    "  );",
  ];
};

const codeStmt = (
  stmt: Class,
  blockName: string,
  cont: string | undefined
): string[] => {
  const c = cont
    ? `methodThis.${blockName.toLowerCase()}_cu${cont}`
    : "outerThis.cont";

  const name = `${blockName}_cu${stmt.name}`;
  const classDecl = [
    `        public ${name}: IC = createInnerClass(this).with(`,
    "          (methodThis) =>",
    "            class implements Predicate {",
  ];
  // execメソッド
  const execBodyContents: string[] = [];
  const methodList = stmt.body.filter(
    (stmt) => stmt.type !== "dummy" && stmt.type !== "class"
  );
  for (const method of methodList) {
    execBodyContents.push(
      ...method.body.flatMap((stmt) =>
        [
          stmtGen(stmt, c),
          // もしstmtがmethod.bodyの最後、かつtypeがassignなら、return cont
          stmt === method.body[method.body.length - 1] && stmt.type === "assign"
            ? `                return ${c};\n`
            : "",
        ].join("")
      )
    );
  }
  const exec = [
    "              public exec(vm: VM) {",
    ...execBodyContents,
    "              }",
  ];
  return [...classDecl, ...exec, "            }", "        );"];
};

const stmtGen = (stmt: StmtNode, cont: string | undefined): string => {
  switch (stmt.type) {
    case "if": {
      return [
        `                if (!(${exprGen(stmt.cond, false)})) {`,
        // stmt.then
        //   ? `                ${stmt.then.map((t) => stmtGen(t)).join("\n")}`
        //   : "                return Predicate.failure;",
        "                  return Predicate.failure;",
        "                }",
        `                return ${cont};`,
      ].join("\n");
    }
    case "assign": {
      const ths = (stmt.lhs as VarNode).isInParam ? "outerThis" : "methodThis";
      return [
        `                ${ths}.${
          (stmt.lhs as VarNode).name
        }.setValue(${buildInGen(stmt.rhs, cont)});`,
      ].join("\n");
    }
    case "return": {
      return `                return ${buildInGen(stmt.value, cont)};`;
    }
    default:
      return "";
  }
};

const buildInGen = (buildIn: BuildInNode, cont: string | undefined): string => {
  switch (buildIn.type) {
    case "for": {
      return [
        "For(",
        buildIn.target ? primaryGen(buildIn.target, true) : "",
        ", ",
        ...exprGen(buildIn.from, true),
        ", ",
        ...exprGen(buildIn.to, true),
        ", ",
        ...exprGen(buildIn.inc, true),
        ", ",
        cont,
        ")",
      ].join("");
    }
    case "select": {
      return [
        "Member(",
        buildIn.target ? primaryGen(buildIn.target, true) : "",
        ", ",
        ...exprGen(buildIn.list, true),
        ", ",
        cont,
        ")",
      ].join("");
    }
    case "sqrt": {
      return ["Math.sqrt(", ...exprGen(buildIn.expr, false), ")"].join("");
    }
    default:
      return exprGen(buildIn, false);
  }
};

const exprGen = (expr: Expr, isVarRef: boolean): string => {
  if (expr.type === "call-expr") {
    switch (expr.callee) {
      case "add": {
        return `${exprGen(expr.lhs, false)} + ${exprGen(expr.rhs, false)}`;
      }
      case "sub": {
        return `${exprGen(expr.lhs, false)} - ${exprGen(expr.rhs, false)}`;
      }
      case "mul": {
        return `${exprGen(expr.lhs, false)} * ${exprGen(expr.rhs, false)}`;
      }
      case "div": {
        return `${exprGen(expr.lhs, false)} / ${exprGen(expr.rhs, false)}`;
      }
      case "mod": {
        return `${exprGen(expr.lhs, false)} % ${exprGen(expr.rhs, false)}`;
      }
      case "pow": {
        return `${exprGen(expr.lhs, false)} ** ${exprGen(expr.rhs, false)}`;
      }
      case "EQ": {
        return `${exprGen(expr.lhs, false)} === ${exprGen(expr.rhs, false)}`;
      }
      case "NE": {
        return `${exprGen(expr.lhs, false)} !== ${exprGen(expr.rhs, false)}`;
      }
      case "LT": {
        return `${exprGen(expr.lhs, false)} < ${exprGen(expr.rhs, false)}`;
      }
      case "LE": {
        return `${exprGen(expr.lhs, false)} <= ${exprGen(expr.rhs, false)}`;
      }
      case "and": {
        return `${exprGen(expr.lhs, false)} && ${exprGen(expr.rhs, false)}`;
      }
      case "or": {
        return `${exprGen(expr.lhs, false)} || ${exprGen(expr.rhs, false)}`;
      }
      case "not": {
        return `!${exprGen(expr.lhs, false)}`;
      }
      case "neg": {
        return `-${exprGen(expr.lhs, false)}`;
      }
      default:
        return "";
    }
  }
  return primaryGen(expr, isVarRef);
};

const primaryGen = (primary: Expr, isVarRef: boolean): string => {
  switch (primary.type) {
    case "num": {
      return primary.token.value;
    }
    case "string": {
      return primary.token.value;
    }
    case "boolean": {
      return primary.token.value;
    }
    case "var": {
      const ths = primary.isInParam ? "outerThis" : "methodThis";
      return isVarRef
        ? `${ths}.${primary.name}`
        : `${ths}.${primary.name}.getValue()`;
    }
    default:
      return "";
  }
};
