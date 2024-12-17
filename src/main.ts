import { tokenize } from "./lexer";
import { parser } from "./parser";
import * as fs from "node:fs";
import { getUserInput, setFilename, setUserInput } from "./utils";

const compile = (args: string[]) => {
  // ファイル名を格納
  const filename = args[0];
  setFilename(filename);

  // ファイル読み込み
  const input = fs.readFileSync(filename, "utf-8");
  setUserInput(input);

  // 字句解析
  const tokenized = tokenize(getUserInput());
  if (tokenized.errorList.length > 0) {
    reportError(tokenized.errorList);
    process.exit(1);
  }

  // console.log("字句解析:");
  // for (const token of tokenized.tokenList) {
  //   console.log(`${token.type}, ${token.value}`);
  // }

  // 構文解析
  const ast = parser(tokenized.tokenList);
  console.log("構文解析:");
  console.dir(ast.program, { depth: null });

  // エラー出力
  const errorList = [...tokenized.errorList, ...ast.errorList];
  if (errorList.length > 0) {
    reportError(errorList);
    process.exit(1);
  }

  // let offset = 0;
  // for (let v: Var | null = ast.locals; v !== null; v = v.next) {
  //   offset += 8;
  //   v.offset = offset;
  // }
  // ast.stackSize = offset;

  // codeGen(ast);
  // return output;
};

const main = (args: string[]) => {
  if (args.length < 1) {
    console.error("Usage: node dist/main.js <filename>");
    process.exit(1);
  }
  try {
    compile(args);
  } catch (e) {
    // ここでエラーをキャッチ
  }
};

main(process.argv.slice(2));
