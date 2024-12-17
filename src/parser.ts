import type {
  AssignNode,
  BuildInNode,
  Expr,
  Member,
  ModuleNode,
  ParamNode,
  Program,
  Stmt,
  Type,
  TypeKind,
  VarNode,
} from "./types/ast";
import type { CompileError } from "./types/error";
import type { Token, TokenType } from "./types/token";
import { NODE_TYPE, TOKEN_TYPE } from "./constant";

// 構文解析の結果
export type ParseResult = {
  errorList: CompileError[];
  program: Program;
};

// ローカル変数
type LocalVar = {
  fname: string[];
  varList: VarNode[];
};

// スコープ
type Scope = {
  module: VarNode[];
  block: VarNode[];
};

/**
 * 構文解析器
 * @class Parser
 * @method {ParseResult} exec 構文解析を実行
 */
export class Parser {
  /** 入力: トークンリスト */
  tokenList: Token[] = [];
  /** 現在見ているトークンのindex */
  current = 0;
  /** ローカル変数のリスト */
  localVarList: LocalVar = {
    fname: [],
    varList: [],
  };
  /** 変数のスコープ */
  scope: Scope = {
    module: [],
    block: [],
  };
  /** 出力: エラーリスト */
  errorList: CompileError[] = [];
  /** 出力: `Program` */
  program: ModuleNode[] = [];

  /**
   * 現在のトークンを取得
   * @returns {Token} 現在のトークン
   */
  peek(): Token {
    return this.tokenList[this.current];
  }

  /**
   * 次のトークンに進む
   * @returns {void}
   */
  next(): void {
    this.current++;
  }

  /**
   * 現在のトークンが、指定した内容であるか判定
   * @param {string | TokenType} c 比較対象
   * @returns {boolean} 一致した場合はtrue
   */
  isCurrent(c: string | TokenType): boolean {
    const cur = this.peek();
    if (Object.values(TOKEN_TYPE).includes(c as TokenType)) {
      return cur.type === c;
    }
    return cur.value === c;
  }

  /**
   * 現在のトークンが、指定した内容でない場合にエラーを追加
   * @param {string | TokenType} c 比較対象
   * @returns {void}
   */
  expect(c: string | TokenType): void {
    if (!this.isCurrent(c)) {
      const cur = this.peek();
      this.errorList.push({
        message: `Expected ${c}, but got ${
          typeof c === "string" ? JSON.stringify(cur.value) : cur.type
        }`,
        position: cur.position,
      });
    }
  }

  /**
   * 現在のトークンを消費し、次のトークンを返す
   * @param {string | TokenType} c 消費対象
   * @returns {Token} 消費したトークン
   */
  consume(c: string | TokenType): Token {
    this.expect(c);
    const cur = this.peek();
    this.next();
    return cur;
  }

  /**
   * `scope`から変数を探し、見つかった場合はその変数を返す
   * @param {Token} tok トークン
   * @returns {VarNode | null} 変数
   */
  findVar(tok: Token): VarNode | null {
    const s = [...this.scope.module, ...this.scope.block];
    for (const v of s) {
      if (v.name === tok.value) {
        return v;
      }
    }
    // 有無を確認するためNULLを返す
    return null;
  }

  /**
   * `localList`や`scope`に変数を追加し、その変数を返す
   * @param {Token} tok トークン
   * @param {Type} ty 変数の型
   * @param {boolean} isBlock ブロックスコープかどうか
   * @returns {VarNode} 追加した変数
   */
  pushVar(tok: Token, ty: Type, isBlock: boolean): VarNode {
    // 既に定義されていたら、型検査をして返す
    const fv = this.findVar(tok);
    if (fv) {
      if (fv.valueType.type !== ty.type) {
        this.errorList.push({
          message: `Variable ${JSON.stringify(
            tok.value
          )} is already defined as ${fv.valueType.type}.`,
          position: ty.position,
        });
        return {
          type: NODE_TYPE.VAR,
          name: "Dummy",
          token: tok,
          valueType: {
            type: "Dummy",
            position: ty.position,
          },
        };
      }
      return fv;
    }

    const v: VarNode = {
      type: NODE_TYPE.VAR,
      name: tok.value,
      valueType: ty,
      token: tok,
    };
    this.localVarList.varList.push(v);

    if (isBlock) {
      this.scope.block.push(v);
    } else {
      this.scope.module.push(v);
    }
    return v;
  }

  /**
   * 構文解析を実行
   * @param {Token[]} tokens 入力トークンリスト
   * @returns {ParseResult} 構文解析の結果
   */
  exec(tokens: Token[]): ParseResult {
    this.tokenList = tokens;
    while (!this.isCurrent(TOKEN_TYPE.EOF)) {
      this.program.push(this.parseModule());
    }
    return {
      errorList: this.errorList,
      program: {
        type: NODE_TYPE.PROGRAM,
        body: this.program,
      },
    };
  }

  /**
   * 内容が型名かどうか判定
   * @returns {boolean} 型名の場合はtrue
   */
  isTypeName(): boolean {
    return (
      this.isCurrent("integer") ||
      this.isCurrent("real") ||
      this.isCurrent("atom") ||
      this.isCurrent("bool")
    );
  }

  /**
   * 型名を解析
   * @returns {Type} 型
   */
  parseType(): Type {
    const cur = this.peek();
    if (this.isTypeName()) {
      this.next();
      return {
        type: cur.value as TypeKind,
        position: cur.position,
      };
    }
    this.errorList.push({
      message: `Expected type, but got ${JSON.stringify(cur.value)}.`,
      position: cur.position,
    });
    return {
      type: "Dummy",
      position: cur.position,
    };
  }

  /**
   * `module = ident-func params *stmt "end" "module" ";"`
   * @returns {ModuleNode} モジュールノード
   */
  parseModule(): ModuleNode {
    this.localVarList = {
      fname: [],
      varList: [],
    };
    this.scope = {
      module: [],
      block: [],
    };
    const tok = this.peek();
    let name: string;

    if (
      this.isCurrent(TOKEN_TYPE.IDENT_FUNC) ||
      this.isCurrent(TOKEN_TYPE.RESERVED)
    ) {
      name = tok.value;
      this.localVarList.fname.push(name);
    } else {
      this.errorList.push({
        message: `Expected module name, but got ${JSON.stringify(tok.value)}.`,
        position: tok.position,
      });
      name = "dummy";
    }
    this.next();

    const params = this.parseParams();
    const stmt: Stmt[] = [];
    while (!this.isCurrent("end")) {
      stmt.push(this.parseStmt());
    }
    this.next();
    if (this.isCurrent("module")) {
      this.next();
    }
    this.consume(";");
    return {
      type: NODE_TYPE.MODULE,
      token: tok,
      name: name,
      paramList: params,
      body: stmt,
      localList: this.localVarList.varList,
    };
  }

  /**
   * `params = "(" ?( param *("," param)) ")"`
   * @returns {ParamNode[]} 引数リスト
   */
  parseParams(): ParamNode[] {
    this.consume("(");
    const params: ParamNode[] = [];
    if (!this.isCurrent(")")) {
      params.push(this.parseParam());
      while (this.isCurrent(",")) {
        this.next();
        params.push(this.parseParam());
      }
    }
    this.next();
    return params;
  }

  /**
   * `param = atom | vector`
   * @returns {ParamNode} 引数
   */
  parseParam(): ParamNode {
    const tok = this.peek();

    // ここのatomはモジュール名
    if (this.isCurrent(TOKEN_TYPE.ATOM)) {
      this.next();
      this.localVarList.fname.push(tok.value);
      return {
        type: NODE_TYPE.PARAM,
        token: tok,
        value: {
          type: NODE_TYPE.ATOM,
          token: tok,
        },
      };
    }

    if (this.isCurrent("{")) {
      const vector = this.parsePrimary();
      if (vector.type !== NODE_TYPE.VECTOR) {
        this.errorList.push({
          message: `Expected vector parameter, but got ${JSON.stringify(
            tok.value
          )}.`,
          position: tok.position,
        });
        return {
          type: NODE_TYPE.DUMMY,
          token: tok,
        };
      }
      // memberをpushVar
      for (const m of vector.member) {
        if (m.type === NODE_TYPE.MEMBER) {
          this.pushVar(m.token, m.value as Type, false);
        }
      }
      return {
        type: NODE_TYPE.PARAM,
        token: tok,
        value: vector.member,
      };
    }

    this.errorList.push({
      message: `Expected parameter, but got ${JSON.stringify(tok.value)}.`,
      position: tok.position,
    });
    return {
      type: NODE_TYPE.DUMMY,
      token: tok,
    };
  }

  /**
   * `stmt = "method" *stmt "end" "method" ";"
   *        | build-in ";"`
   * @returns {Stmt} 文
   */
  parseStmt(): Stmt {
    const tok = this.peek();

    if (this.isCurrent("method")) {
      this.scope.block = [];
      const stmt: Stmt[] = [];
      this.next();
      while (!this.isCurrent("end")) {
        stmt.push(this.parseStmt());
      }
      this.next();
      this.consume("method");
      if (!this.isCurrent(";")) {
        const cur = this.peek();
        if (this.isCurrent(TOKEN_TYPE.EOF)) {
          this.errorList.push({
            message: `Expected ;, but got ${JSON.stringify(cur.value)}.`,
            position: {
              line: cur.position.line - 1,
              character: cur.position.character,
            },
          });
          return {
            type: NODE_TYPE.DUMMY,
            token: cur,
          };
        }
        this.errorList.push({
          message: `Expected ;, but got ${JSON.stringify(cur.value)}.`,
          position: cur.position,
        });
        this.next();
        return {
          type: NODE_TYPE.DUMMY,
          token: cur,
        };
      }
      this.next();
      return {
        type: NODE_TYPE.BLOCK,
        body: stmt,
        token: tok,
      };
    }

    const expr: BuildInNode = this.parseBuildIn();
    if (!this.isCurrent(";")) {
      const cur = this.peek();
      if (this.isCurrent(TOKEN_TYPE.EOF)) {
        this.errorList.push({
          message: `Expected ;, but got ${JSON.stringify(cur.value)}.`,
          position: {
            line: cur.position.line - 1,
            character: cur.position.character,
          },
        });
        return {
          type: NODE_TYPE.DUMMY,
          token: cur,
        };
      }
      this.errorList.push({
        message: `Expected ;, but got ${JSON.stringify(cur.value)}.`,
        position: cur.position,
      });
      this.next();
      return {
        type: NODE_TYPE.DUMMY,
        token: cur,
      };
    }
    this.next();
    return {
      type: NODE_TYPE.EXPR_STMT,
      expr: expr,
      token: tok,
    };
  }

  /**
   * `build-in = "for" "(" expr "," expr "," expr ")"
   *           | "test" "(" expr ")"
   *           | "when" "(" expr ")"
   *           | "sqrt" "(" expr ")"
   *           | "call" "(" atom "," expr "," expr ")"
   *           | expr`
   * @returns {BuildInNode} 組み込み関数
   */
  parseBuildIn(): BuildInNode {
    const tok = this.peek();

    // "for" "(" expr "," expr "," expr ")"
    if (this.isCurrent("for")) {
      this.next();
      this.consume("(");
      const from = this.parseExpr();
      this.consume(",");
      const to = this.parseExpr();
      this.consume(",");
      const inc = this.parseExpr();
      this.consume(")");
      return {
        type: NODE_TYPE.FOR,
        from: from,
        to: to,
        inc: inc,
        token: tok,
      };
    }

    // "test" "(" expr ")"
    if (this.isCurrent("test")) {
      this.next();
      this.consume("(");
      const cond = this.parseExpr();
      this.consume(")");
      return {
        type: NODE_TYPE.TEST,
        cond: cond,
        token: tok,
      };
    }

    // "when" "(" expr ")"
    if (this.isCurrent("when")) {
      this.next();
      this.consume("(");
      const cond = this.parseExpr();
      this.consume(")");
      return {
        type: NODE_TYPE.WHEN,
        cond: cond,
        token: tok,
      };
    }

    // "sqrt" "(" expr ")"
    if (this.isCurrent("sqrt")) {
      this.next();
      this.consume("(");
      const expr = this.parseExpr();
      this.consume(")");
      return {
        type: NODE_TYPE.SQRT,
        expr: expr,
        token: tok,
      };
    }

    // "call" "(" atom "," expr "," expr ")"
    if (this.isCurrent("call")) {
      this.next();
      this.consume("(");

      let mname = "";
      if (
        this.isCurrent(TOKEN_TYPE.ATOM) ||
        this.isCurrent(TOKEN_TYPE.RESERVED)
      ) {
        // localList.fnameから探す
        for (const fname of this.localVarList.fname) {
          if (this.isCurrent(fname)) {
            mname = fname;
            break;
          }
        } // 見つからなかったらエラー
        if (mname === "") {
          this.errorList.push({
            message: `Expected atom, but got ${JSON.stringify(
              this.peek().value
            )}.`,
            position: this.peek().position,
          });
          mname = "dummy";
        }
      } else {
        this.errorList.push({
          message: `Expected atom, but got ${JSON.stringify(
            this.peek().value
          )}.`,
          position: this.peek().position,
        });
        mname = "dummy";
      }
      this.next();

      this.consume(",");
      const input = this.parseExpr();
      this.consume(",");
      const output = this.parseExpr();
      this.consume(")");
      return {
        type: NODE_TYPE.CALL,
        module: mname,
        input: input,
        output: output,
        token: tok,
      };
    }

    // expr
    return this.parseExpr();
  }

  /**
   * `expr = assign`
   * @returns {Expr} 式
   */
  parseExpr(): Expr {
    return this.parseAssign();
  }

  /**
   * `assign = logical ?("=" build-in)`
   * @returns {Expr} 代入式
   */
  parseAssign(): Expr {
    const tok = this.peek();
    const expr = this.parseLogical();

    if (this.isCurrent("=")) {
      this.next();
      const assign: AssignNode = {
        type: NODE_TYPE.ASSIGN,
        lhs: expr,
        rhs: this.parseBuildIn(),
        token: tok,
      };
      return assign;
    }

    return expr;
  }

  /**
   * `logical = term *("or" term)`
   * @returns {Expr} 論理式
   */
  parseLogical(): Expr {
    const node = this.parseTerm();
    let token: Token;

    for (;;) {
      if (this.isCurrent("or")) {
        token = this.peek();
        this.next();
        return {
          type: NODE_TYPE.OR,
          lhs: node,
          rhs: this.parseTerm(),
          token: token,
        };
      }
      return node;
    }
  }

  /**
   * `term = not_term *("and" not_term)`
   * @returns {Expr} 項
   */
  parseTerm(): Expr {
    const node = this.parseNotTerm();
    let token: Token;

    for (;;) {
      if (this.isCurrent("and")) {
        token = this.peek();
        this.next();
        return {
          type: NODE_TYPE.AND,
          lhs: node,
          rhs: this.parseNotTerm(),
          token: token,
        };
      }
      return node;
    }
  }

  /**
   * `not_term = "not" "(" equality ")" | equality`
   * @returns {Expr} 否定項
   */
  parseNotTerm(): Expr {
    if (this.isCurrent("not")) {
      const token = this.peek();
      this.next();
      this.consume("(");
      const expr = this.parseEquality();
      this.consume(")");
      return {
        type: NODE_TYPE.NOT,
        lhs: expr,
        token: token,
      };
    }
    return this.parseEquality();
  }

  /**
   * `equality = relational *("==" relational | "\=" relational)`
   * @returns {Expr} 等価式
   */
  parseEquality(): Expr {
    const node = this.parseRelational();
    let token: Token;

    for (;;) {
      if (this.isCurrent("==")) {
        token = this.peek();
        this.next();
        return {
          type: NODE_TYPE.EQ,
          lhs: node,
          rhs: this.parseRelational(),
          token: token,
        };
      }
      if (this.isCurrent("\\=")) {
        token = this.peek();
        this.next();
        return {
          type: NODE_TYPE.NE,
          lhs: node,
          rhs: this.parseRelational(),
          token: token,
        };
      }
      return node;
    }
  }

  /**
   * `relational = add *("<" add | "=<" add | ">" add | ">=" add)`
   * @returns {Expr} 関係式
   */
  parseRelational(): Expr {
    const node = this.parseAdd();
    let token: Token;

    for (;;) {
      if (this.isCurrent("<")) {
        token = this.peek();
        this.next();
        return {
          type: NODE_TYPE.LT,
          lhs: node,
          rhs: this.parseAdd(),
          token: token,
        };
      }
      if (this.isCurrent("=<")) {
        token = this.peek();
        this.next();
        return {
          type: NODE_TYPE.LE,
          lhs: node,
          rhs: this.parseAdd(),
          token: token,
        };
      }
      if (this.isCurrent(">")) {
        token = this.peek();
        this.next();
        return {
          type: NODE_TYPE.LT,
          lhs: this.parseAdd(),
          rhs: node,
          token: token,
        };
      }
      if (this.isCurrent(">=")) {
        token = this.peek();
        this.next();
        return {
          type: NODE_TYPE.LE,
          lhs: this.parseAdd(),
          rhs: node,
          token: token,
        };
      }
      return node;
    }
  }

  /**
   * `add = mul ("+" mul | "-" mul)*`
   * @returns {Expr} 加算式
   */
  parseAdd(): Expr {
    const node = this.parseMul();
    let token: Token;

    for (;;) {
      if (this.isCurrent("+")) {
        token = this.peek();
        this.next();
        return {
          type: NODE_TYPE.ADD,
          lhs: node,
          rhs: this.parseMul(),
          token: token,
        };
      }
      if (this.isCurrent("-")) {
        token = this.peek();
        this.next();
        return {
          type: NODE_TYPE.SUB,
          lhs: node,
          rhs: this.parseMul(),
          token: token,
        };
      }
      return node;
    }
  }

  /**
   * `mul = unary *("*" unary | "/" unary | "mod" unary | "^" unary)`
   * @returns {Expr} 乗算式
   */
  parseMul(): Expr {
    const node = this.parseUnary();
    let token: Token;

    for (;;) {
      if (this.isCurrent("*")) {
        token = this.peek();
        this.next();
        return {
          type: NODE_TYPE.MUL,
          lhs: node,
          rhs: this.parseUnary(),
          token: token,
        };
      }
      if (this.isCurrent("/")) {
        token = this.peek();
        this.next();
        return {
          type: NODE_TYPE.DIV,
          lhs: node,
          rhs: this.parseUnary(),
          token: token,
        };
      }
      if (this.isCurrent("mod")) {
        token = this.peek();
        this.next();
        return {
          type: NODE_TYPE.MOD,
          lhs: node,
          rhs: this.parseUnary(),
          token: token,
        };
      }
      if (this.isCurrent("^")) {
        token = this.peek();
        this.next();
        return {
          type: NODE_TYPE.POW,
          lhs: node,
          rhs: this.parseUnary(),
          token: token,
        };
      }
      return node;
    }
  }

  /**
   * `unary = ?("+" | "-") primary`
   * @returns {Expr} 単項式
   */
  parseUnary(): Expr {
    if (this.isCurrent("-")) {
      const token = this.peek();
      this.next();
      return {
        type: NODE_TYPE.SUB,
        lhs: {
          type: NODE_TYPE.NUM,
          token: {
            type: TOKEN_TYPE.NUMBER,
            position: {
              line: token.position.line,
              character: token.position.character - 1,
            },
            value: "0",
          },
        },
        rhs: this.parsePrimary(),
        token: token,
      };
    }
    if (this.isCurrent("+")) {
      this.next();
      return this.parsePrimary();
    }
    return this.parsePrimary();
  }

  /**
   * `primary = "(" expr ")"
   *          | list
   *          | vector
   *          | bool
   *          | number
   *          | atom
   *          | ident-var ?(":" type)
   *          | dummy`
   * @returns {Expr} 基本式
   */
  parsePrimary(): Expr {
    // "(" expr ")"
    if (this.isCurrent("(")) {
      this.next();
      const expr = this.parseExpr();
      this.consume(")");
      return expr;
    }

    // list = "[" ?(unary *("," unary)) "]"
    if (this.isCurrent("[")) {
      const tok = this.peek();
      this.next();
      const list: Expr[] = [];
      if (!this.isCurrent("]")) {
        list.push(this.parseUnary());
        while (this.isCurrent(",")) {
          this.next();
          list.push(this.parseUnary());
        }
      }
      this.consume("]");
      return {
        type: NODE_TYPE.LIST,
        list: list,
        token: tok,
      };
    }

    // vector = "{" member *("," member) "}"
    if (this.isCurrent("{")) {
      const tok = this.peek();
      this.next();
      const member: Member[] = [];
      if (!this.isCurrent("}")) {
        member.push(this.parseMember());
        while (this.isCurrent(",")) {
          this.next();
          member.push(this.parseMember());
        }
      }
      this.consume("}");
      return {
        type: NODE_TYPE.VECTOR,
        member: member,
        token: tok,
      };
    }

    // bool
    if (this.isCurrent("true") || this.isCurrent("false")) {
      const tok = this.peek();
      this.next();
      return {
        type: NODE_TYPE.BOOL,
        token: tok,
      };
    }

    switch (this.peek().type) {
      // number
      case TOKEN_TYPE.NUMBER:
        return {
          type: NODE_TYPE.NUM,
          token: this.consume(TOKEN_TYPE.NUMBER),
        };
      // atom
      case TOKEN_TYPE.ATOM:
        return {
          type: NODE_TYPE.ATOM,
          token: this.consume(TOKEN_TYPE.ATOM),
        };
      // ident-var ?(":" type)
      case TOKEN_TYPE.IDENT_VAR: {
        const tok = this.peek();
        let ty: Type = {
          type: "Dummy",
          position: this.tokenList[this.current + 2].position,
        };
        this.next();
        if (this.isCurrent(":")) {
          this.consume(":");
          ty = this.parseType();
          this.pushVar(tok, ty, true);
        }

        if (!this.findVar(tok)) {
          this.errorList.push({
            message: `Variable ${JSON.stringify(tok.value)} is not defined.`,
            position: tok.position,
          });
          return {
            type: NODE_TYPE.DUMMY,
            token: tok,
          };
        }

        return {
          type: NODE_TYPE.VAR,
          token: tok,
          name: tok.value,
          valueType: ty,
        };
      }
      default: {
        const cur = this.peek();
        this.errorList.push({
          message: `Unexpected token ${JSON.stringify(cur.value)}.`,
          position: cur.position,
        });
        this.next();

        return {
          type: NODE_TYPE.DUMMY,
          token: cur,
        };
      }
    }
  }

  /**
   * `member = unary | ident ":" type`
   * @returns {Member} メンバー
   */
  parseMember(): Member {
    const tok = this.peek();
    let ty: Type = {
      type: "Dummy",
      position: this.tokenList[this.current + 2].position,
    };

    if (this.isCurrent(TOKEN_TYPE.IDENT_VAR)) {
      this.next();
      if (this.isCurrent(":")) {
        this.next();
        ty = this.parseType();
      }
      return {
        type: NODE_TYPE.MEMBER,
        token: tok,
        value: ty,
      };
    }

    const node = this.parseUnary();
    return {
      type: NODE_TYPE.MEMBER,
      token: tok,
      value: node,
    };
  }
}

/**
 * 構文解析
 * @param {Token[]} input トークンリスト
 * @returns {ParseResult} 構文解析の結果
 */
export const parser = (input: Token[]): ParseResult => {
  const parser = new Parser();
  return parser.exec(input);
};
