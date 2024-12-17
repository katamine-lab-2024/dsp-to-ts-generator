import * as fs from "node:fs";
import { CONTENT } from "./generatePredicate";

// 生成したい TypeScript コードの内容
const tsContent = CONTENT;

// 書き込み先のファイル名
const filePath = "./generatedFile.ts";

// ファイルを生成して書き込む関数
function generateTsFile(content: string, path: string) {
  fs.writeFileSync(path, content, { encoding: "utf8" });
  console.log(`File ${path} has been generated.`);
}

// 実行
generateTsFile(tsContent, filePath);
