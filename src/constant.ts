/**
 * トークンの種類
 */
export const TOKEN_TYPE = {
  RESERVED: "reserved",
  IDENT_VAR: "ident-var",
  IDENT_FUNC: "ident-func",
  ATOM: "atom",
  NUMBER: "number",
  NEWLINE: "new-line",
  EOF: "EOF",
} as const;

/**
 * 構文木ノードの種類
 */
export const NODE_TYPE = {
  // 値
  NUM: "num",
  BOOL: "bool",
  ATOM: "atom",
  VECTOR: "vector",
  MEMBER: "member",
  LIST: "list",
  VAR: "var",

  // 演算
  ADD: "add",
  SUB: "sub",
  MUL: "mul",
  DIV: "div",
  MOD: "mod",
  POW: "pow",
  EQ: "EQ",
  NE: "NE",
  LT: "LT",
  LE: "LE",
  AND: "and",
  OR: "or",
  NOT: "not",

  // 文
  ASSIGN: "assign",
  BLOCK: "block",
  EXPR_STMT: "EXPR_STMT",
  PARAM: "param",
  MODULE: "module",
  PROGRAM: "program",
  DUMMY: "dummy",

  // 制御構文
  WHEN: "when",
  TEST: "test",
  FOR: "for",
  CALL: "call",
  SQRT: "sqrt",
} as const;

export const TYPE_KIND = {
  CHAR: "CHAR",
  INT: "INT",
  PTR: "PTR",
  ARRAY: "ARRAY",
  STRUCT: "STRUCT",
} as const;
