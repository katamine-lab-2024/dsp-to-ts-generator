import { codeGen } from "./generator";
import { program } from "./parser";
import { tokenize } from "./tokenize";
import { useSetState } from "./stateManager";
import { userInput, token } from "./state";
import type { Var } from "./Var";

const setInputState = useSetState(userInput);
const setTokenState = useSetState(token);

function main(args: string[]): void {
  setInputState(args[0]);
  setTokenState(tokenize());
  // for (let tok = useValue(token); tok !== null; tok = tok.next) {
  //   console.log(tok.kind, tok.len, tok.str);
  // }
  const prog = program();
  // console.dir(prog, { depth: null });

  let offset = 0;
  for (let v: Var | null = prog.locals; v !== null; v = v.next) {
    offset += 8;
    v.setOffset(offset);
  }
  prog.stackSize = offset;

  codeGen(prog);
}

// test
const input = "foo123=3; bar=5; return foo123+bar;";

main([input]);
