import { useValue } from "./stateManager";
import { userInput } from "./state";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function errorAt(loc: number, fmt: string, ...args: any[]): never {
  console.error(useValue(userInput));
  console.error(`${" ".repeat(loc)}^ ${fmt}`, ...args);
  throw new Error(fmt);
}

export function strDup(p: string, len: number): string {
  return p.substring(0, len);
}
