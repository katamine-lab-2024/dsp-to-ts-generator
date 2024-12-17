import type { NODE_TYPE } from "../constant";
import type { Token } from "./token";

// 変数の型
export type TypeKind = "integer" | "real" | "atom" | "bool" | "Dummy";
export type Type = {
  type: TypeKind;
  position: { line: number; character: number };
};

// 構文木
export type NodeType = (typeof NODE_TYPE)[keyof typeof NODE_TYPE];

// 基底ノード
type BaseNode = {
  type: NodeType;
  // エラー報告のため、トークンを保持
  token: Token;
};

// ダミー
// エラー時にダミーノードを返して解析を継続する
export type Dummy = {
  type: typeof NODE_TYPE.DUMMY;
} & BaseNode;

// リテラル
export type SimpleNode = {
  type: typeof NODE_TYPE.NUM | typeof NODE_TYPE.ATOM | typeof NODE_TYPE.BOOL;
  // | typeof NODE_TYPE.NULL; //? nullあるのか
} & BaseNode;

// リスト
export type ListNode = {
  type: typeof NODE_TYPE.LIST;
  list: Expr[];
} & BaseNode;

// ベクトル(構造体)
export type StructNode = {
  type: typeof NODE_TYPE.VECTOR;
  member: Member[];
} & BaseNode;

// ベクトルのメンバー
export type Member = {
  type: typeof NODE_TYPE.MEMBER;
  value: Type | Expr;
} & BaseNode;

// 変数
export type VarNode = {
  type: typeof NODE_TYPE.VAR;
  name: string;
  valueType: Type; // ない場合はdummy
} & BaseNode;

// Primary文法
export type Primary = SimpleNode | ListNode | StructNode | VarNode | Dummy;

// 単項演算子
export type UnaryNode = {
  type: typeof NODE_TYPE.NOT;
  lhs: Expr;
} & BaseNode;

// 式文
export type ESNode = {
  type: typeof NODE_TYPE.EXPR_STMT;
  expr: BuildInNode;
} & BaseNode;

// 二項演算子
export type BinaryNode = {
  type:
    | typeof NODE_TYPE.ADD
    | typeof NODE_TYPE.SUB
    | typeof NODE_TYPE.MUL
    | typeof NODE_TYPE.DIV
    | typeof NODE_TYPE.MOD
    | typeof NODE_TYPE.POW
    | typeof NODE_TYPE.EQ
    | typeof NODE_TYPE.NE
    | typeof NODE_TYPE.LT
    | typeof NODE_TYPE.LE
    | typeof NODE_TYPE.AND
    | typeof NODE_TYPE.OR;
  lhs: Expr;
  rhs: Expr;
} & BaseNode;

// 代入文
export type AssignNode = {
  type: typeof NODE_TYPE.ASSIGN;
  lhs: Expr;
  rhs: BuildInNode;
} & BaseNode;

// 式
export type Expr = Primary | UnaryNode | BinaryNode | AssignNode | ESNode;

// ブロック
export type BlockNode = {
  type: typeof NODE_TYPE.BLOCK;
  body: Stmt[];
} & BaseNode;

// 仮定・生成
// for
export type ForNode = {
  type: typeof NODE_TYPE.FOR;
  from: Expr;
  to: Expr;
  inc: Expr;
} & BaseNode;

// 条件分岐
// when
export type WhenNode = {
  type: typeof NODE_TYPE.WHEN;
  cond: Expr;
} & BaseNode;

// 枝刈り
// test
export type TestNode = {
  type: typeof NODE_TYPE.TEST;
  cond: Expr;
} & BaseNode;

// モジュール呼び出し
// call
export type CallNode = {
  type: typeof NODE_TYPE.CALL;
  module: string;
  input: Expr;
  output: Expr;
} & BaseNode;

// 数値演算
// 平方根: sqrt
export type SqrtNode = {
  type: typeof NODE_TYPE.SQRT;
  expr: Expr;
} & BaseNode;

// 組み込みモジュール
export type BuildInNode =
  | ForNode
  | WhenNode
  | TestNode
  | CallNode
  | SqrtNode
  | Expr;

// 文
export type Stmt = Expr | BlockNode;

// モジュールの引数
export type Param = {
  type: typeof NODE_TYPE.PARAM;
  value: SimpleNode | Member[];
} & BaseNode;

// エラー対応にダミー含む
export type ParamNode = Param | Dummy;

// モジュール(関数定義)
export type Module = {
  type: typeof NODE_TYPE.MODULE;
  name: string;
  paramList: ParamNode[];
  body: Stmt[];
  localList: VarNode[];
} & BaseNode;

// エラー対応にダミー含む
export type ModuleNode = Module | Dummy;

// プログラム
export type Program = {
  type: typeof NODE_TYPE.PROGRAM;
  body: ModuleNode[];
};
