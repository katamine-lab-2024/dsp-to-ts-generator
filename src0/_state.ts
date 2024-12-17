import { createState, type State } from "./stateManager";
import type { Token } from "./Token";
import type { Var } from "./Var";

export const userInput: State<string> = createState("");

export const token: State<Token | null> = createState(null);

export const locals: State<Var | null> = createState(null);
