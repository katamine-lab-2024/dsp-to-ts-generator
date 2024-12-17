import { locals } from "./state";
import { useSetState, useValue } from "./stateManager";
import type { Token } from "./Token";

const setLocalsState = useSetState(locals);

export class Var {
  next: Var | null;
  name: string;
  offset: number;

  constructor(next: Var | null, name: string, offset: number) {
    this.next = next;
    this.name = name;
    this.offset = offset;
  }

  public setOffset(offset: number) {
    this.offset = offset;
  }

  static findVar(tok: Token) {
    for (let v = useValue(locals); v; v = v.next) {
      if (
        v.name.length === tok.len &&
        tok.str.substring(0, tok.len) === v.name.substring(0, tok.len)
      ) {
        return v;
      }
    }
    return null;
  }

  static pushVar(name: string): Var {
    const v: Var = new Var(useValue(locals), name, 0);
    v.next = useValue(locals);
    v.name = name;
    setLocalsState(v);
    return v;
  }
}
