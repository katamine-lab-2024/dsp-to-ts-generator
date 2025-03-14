# 2024 年度卒業研究「属性モデルに基づくプログラム表現から Typescript への変換ツールの試作」

これは、中村優希が卒業研究で作成した、DSP コードから TypeScript を生成するモジュールです。

変換ツールについては、「[test-run-dsp-in-browser](https://github.com/katamine-lab-2024/dsp-to-ts-generator)」を参照してください。

## 🚀 概要

DSP コードを入力とし、TypeScript を生成するモジュールです。

非決定性処理のブラウザ実行を目標に作成しました。

## 🔧 開発

### 📌 前提

システムに `Node.js` がインストールされているか確認してください。

研究当時のバージョンは以下のとおりです。

```sh
❯ node -v
  v22.14.0
```

```sh
❯ npm -v
  11.0.0
```

### 📥 インストール

本リポジトリをダウンロードまたは clone 後、ターミナルで以下を実行します。

```sh
cd [本リポジトリ]
npm install
```

### ▶️ 変換器の実行

ターミナルで以下を実行し、build します。

```sh
npm run build
```

次に、変換したいファイルの指定とともに実行します。

```sh
node dist/main.js [DSPコードのファイル名]
```

実行結果を TypeScript ファイルに出力したい場合、以下のようにできます。

```sh
node dist/main.js [DSPコードのファイル名] > [出力するファイル名]
```

## ✨ 構成

ファイル構成は以下のとおりです。

```sh
.
├── dist/             … buildされたファイルのディレクトリ
├── puml/             … 卒論で使用した構成図(クラス図など)のディレクトリ
├── sample/           … 開発や実験で使用した、DSPコードファイルと生成結果のディレクトリ
├── src/
│   ├── types/        … ASTを含む型定義ディレクトリ
│   ├── codeGen.ts    … コード生成器
│   ├── constant.ts   … 定数ファイル
│   ├── converter.ts  … 変換器
│   ├── lexer.ts      … 字句解析器
│   ├── main.ts       … エントリーポイント
│   ├── parser.ts     … 構文解析器
│   ├── sortStmt.ts   … 式ソートモジュール
│   └── utils.ts      … その他モジュール
├── package.json      … インストールしたライブラリ等の情報
├── README.md         … 本ファイル
└── tsconfig.json     … TypeScript設定
```

## 📍 その他

このコードは、以下の GitHub に載せています。

https://github.com/katamine-lab-2024/dsp-to-ts-generator

もしかしたら個人的にリファクタ等しているかもしれないです。
