import { tokenize } from "./lexer";
import { parser } from "./parser";
import * as fs from "node:fs";
import { getUserInput, setFilename, setUserInput, reportError } from "./utils";
import type { CompileError } from "./types/error";
import { converter } from "./converter";
import { codeGen } from "./codeGen";

/**
 * エラーリスト
 */
const errorList: CompileError[] = [];

/**
 * コンパイル
 * @param args
 * @returns {string} コンパイル結果
 */
const compile = (args: string[]) => {
  if (args.length !== 1) {
    throw new Error("Usage: node dist/main.js <filename>");
  }
  // ファイル名を格納
  const filename = args[0];
  setFilename(filename);
  // ファイル読み込み
  const input = fs.readFileSync(filename, "utf-8");
  setUserInput(input);
  // 字句解析
  const tokenized = tokenize(getUserInput());
  if (tokenized.errorList.length > 0) {
    errorList.push(...tokenized.errorList);
    throw new Error("字句解析エラー");
  }
  // 構文解析
  const ast = parser(tokenized.tokenList);
  if (ast.errorList.length > 0) {
    errorList.push(...ast.errorList);
    throw new Error("構文解析エラー");
  }
  // 変換
  const newAst = converter(ast.program);
  // コード生成
  const output = codeGen(newAst);
  return output;
};

/**
 * メイン関数
 * @param args
 */
const main = (args: string[]) => {
  try {
    const output = compile(args);
    console.log(output);
  } catch (e) {
    reportError(errorList);
  }
};

main(process.argv.slice(2));
