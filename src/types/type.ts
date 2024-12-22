import type { SIMPLE_TYPE, STRUCT_TYPE } from "../constant";
import type { Token } from "./token";

// 変数の型
export type TypeKind =
  | (typeof SIMPLE_TYPE)[keyof typeof SIMPLE_TYPE]
  | (typeof STRUCT_TYPE)[keyof typeof STRUCT_TYPE]
  | "dummy";

// 基底の型
type BaseType = {
  type: TypeKind;
  token: Token;
};

// 単純変数を表す型
export type SimpleType = {
  type:
    | typeof SIMPLE_TYPE.INTEGER
    | typeof SIMPLE_TYPE.REAL
    | typeof SIMPLE_TYPE.BOOL
    | typeof SIMPLE_TYPE.ATOM;
} & BaseType;

// 構造変数を表す型
export type StructType = {
  type: typeof STRUCT_TYPE.LIST | typeof STRUCT_TYPE.VECTOR;
  member: Type[];
} & BaseType;

export type Type = SimpleType | StructType | BaseType;
