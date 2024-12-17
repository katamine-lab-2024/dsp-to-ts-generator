export class Token {
  kind: TokenKind; // tokenの型
  next: Token | null = null; // 次の入力token
  val = 0; // kindがTK_NUMの場合の数値
  str: string; // token文字列
  len: number; // tokenの長さ

  constructor(kind: TokenKind, str: string, len: number, val?: number) {
    this.kind = kind;
    this.str = str;
    this.len = len;
    this.val = val ?? 0;
    this.next = null;
  }
}

export enum TokenKind {
  TK_RESERVED = "TK_RESERVED", // 記号
  TK_IDENT = "TK_IDENT", // 識別子
  TK_NUM = "TK_NUM", // 整数トークン
  TK_EOF = "TK_EOF", // EOF
}
