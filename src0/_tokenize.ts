import { errorAt } from "./utils";
import { useValue, useSetState } from "./stateManager";
import { userInput, token } from "./state";
import { Token, TokenKind } from "./Token";

const setTokenState = useSetState(token);

// 入力文字列pをトークナイズして返す
export function tokenize(): Token {
  const p = useValue(userInput);
  const head: Token = new Token(TokenKind.TK_EOF, "", 0);
  head.next = null;
  let cur = head;
  let pos = 0;

  while (pos < p.length) {
    // 空白をスキップ
    if (/\s/.test(p.charAt(pos))) {
      pos++;
      continue;
    }

    // keyword
    if ((startsWith(p, "return", pos) && !isAlnum(p, pos + 6)) || "") {
      cur = newToken(TokenKind.TK_RESERVED, cur, p.slice(pos, pos + 6), 6);
      pos += 6;
      continue;
    }

    // 複数文字
    if (
      startsWith(p, "==", pos) ||
      startsWith(p, "!=", pos) ||
      startsWith(p, "<=", pos) ||
      startsWith(p, ">=", pos)
    ) {
      cur = newToken(TokenKind.TK_RESERVED, cur, p.slice(pos, pos + 2), 2);
      pos += 2;
      continue;
    }

    // 1文字
    if ("+-*/()<>;=".includes(p.charAt(pos))) {
      cur = newToken(TokenKind.TK_RESERVED, cur, p.charAt(pos), 1);
      pos++;
      continue;
    }

    // 識別子
    if (isAlpha(p, pos)) {
      const start = pos;
      while (isAlnum(p, pos)) {
        pos++;
      }
      const length = pos - start;
      cur = newToken(TokenKind.TK_IDENT, cur, p.slice(start, pos), length);
      continue;
    }

    // 数値
    if (isDigit(p, pos)) {
      const start = pos;
      while (isDigit(p, pos)) {
        pos++;
      }
      const length = pos - start;
      const s = p.slice(start, pos);
      cur = newToken(TokenKind.TK_NUM, cur, s, length, Number.parseInt(s));
      continue;
    }

    errorAt(pos, "不適切なtokenです");
  }

  newToken(TokenKind.TK_EOF, cur, "", 0);
  if (!head.next) throw new Error("Tokenization failed, no tokens found.");

  return head.next;
}

// 次のtokenが期待している記号の場合、tokenを1つ読み進めてtrueを返す。それ以外はfalseを返す
export function consume(op: string): boolean {
  const tok = useValue(token);
  if (
    !tok ||
    tok.kind !== TokenKind.TK_RESERVED ||
    tok.str.substring(0, tok.len) !== op
  ) {
    return false;
  }
  setTokenState(tok.next);
  return true;
}

export function consumeIdent(): Token | null {
  const tok = useValue(token);
  if (!tok || tok.kind !== TokenKind.TK_IDENT) {
    return null;
  }
  setTokenState(tok.next);
  return tok;
}

// 次のtokenが期待している記号の場合、tokenを1つ読み進める。それ以外はエラーを報告する
export function expect(op: string): void {
  const tok = useValue(token);
  if (
    !tok ||
    tok.kind !== TokenKind.TK_RESERVED ||
    tok.str.substring(0, tok.len) !== op
  ) {
    errorAt(tok?.str ? tok.str.indexOf(op) : 0, `'${op}'ではありません`);
  }
  setTokenState(tok.next);
}

// 次のtokenが数値の場合、tokenを1つ読み進めてその数値を返す。それ以外はエラーを報告する
export function expectNumber(): number {
  const tok = useValue(token);
  if (!tok) throw new Error("No token found");
  if (tok.kind !== TokenKind.TK_NUM) {
    errorAt(tok?.str ? tok.str.length : 0, "数ではありません");
  }
  const val: number = tok.val;
  setTokenState(tok.next);
  return val;
}

// EOFかどうか
export function atEof(): boolean {
  const tok = useValue(token);
  return tok?.kind === TokenKind.TK_EOF;
}

// 新しいtokenを作成してcurに繋げる
function newToken(
  kind: TokenKind,
  cur: Token,
  str: string,
  len: number,
  val?: number
): Token {
  const tok = new Token(kind, str, len, val);
  cur.next = tok;
  return tok;
}

// pがqで始まるか確認する
function startsWith(p: string, q: string, pos: number): boolean {
  return p.startsWith(q, pos);
}

// `p`がアルファベットかアンダースコアかどうか
function isAlpha(p: string, pos: number): boolean {
  return /[a-zA-Z_]/.test(p.charAt(pos));
}

// `p`が数字かどうか
function isDigit(p: string, pos: number): boolean {
  return /[0-9]/.test(p.charAt(pos));
}

// `p`が英数字かどうか
function isAlnum(p: string, pos: number): boolean {
  return isAlpha(p, pos) || isDigit(p, pos);
}
