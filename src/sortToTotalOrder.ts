import { NODE_TYPE } from "./constant";
import type { Expr, StmtBlock, StmtNode, VarNode } from "./types/ast";

// Helper: Collect variables used in an expression
const collectVariables = (
  node: Expr,
  filterFn: (v: VarNode) => boolean = () => true
): VarNode[] => {
  const vars: VarNode[] = [];
  const traverse = (n: Expr) => {
    if (n.type === NODE_TYPE.VAR && filterFn(n)) vars.push(n);
    if ("lhs" in n) traverse(n.lhs);
    if ("rhs" in n) traverse(n.rhs);
  };
  traverse(node);
  return vars;
};

// Classify statements into categories
const classifyStatements = (
  stmt: StmtNode[]
): Record<string, StmtBlock[]> | null => {
  const categories = { assume: [], calc: [], test: [] } as Record<
    string,
    StmtBlock[]
  >;

  for (const s of stmt) {
    if (s.type === "dummy") return null;

    const { stmt: innerStmt } = s;

    if (innerStmt.type === NODE_TYPE.ASSIGN) {
      if (
        innerStmt.rhs.type === NODE_TYPE.FOR ||
        innerStmt.rhs.type === NODE_TYPE.SELECT
      ) {
        // 仮定
        categories.assume.push({
          type: "stmt-block",
          token: s.token,
          body: [s],
          phase: "assume",
          target: innerStmt.lhs as VarNode,
        });
      } else {
        // todo: assignかつtestの可能性もある どうしよう
        // 計算
        let operands: VarNode[] = [];
        if (innerStmt.rhs.type === NODE_TYPE.SQRT)
          operands = collectVariables(innerStmt.rhs.expr, (v) => !v.isInput);
        if (innerStmt.rhs.type === NODE_TYPE.CALL_EXPR)
          operands = collectVariables(innerStmt.rhs, (v) => !v.isInput);
        // operandsの中で重複しているものを削除
        operands = operands.filter(
          (v, i, self) => self.findIndex((s) => s.name === v.name) === i
        );
        categories.calc.push({
          type: "stmt-block",
          token: s.token,
          body: [s],
          phase: "calc",
          target: innerStmt.lhs as VarNode,
          operand: operands,
        });
      }
    } else if (innerStmt.type === NODE_TYPE.TEST) {
      // 検証
      const vars = collectVariables(innerStmt.cond as Expr).filter(
        (v, i, self) => self.findIndex((s) => s.name === v.name) === i
      );
      const target = vars.find((v) => !v.isInput) ?? vars[0];
      const operand = vars.filter((v) => v !== target);
      categories.test.push({
        type: "stmt-block",
        token: s.token,
        body: [s],
        phase: "test",
        target: target,
        operand: operand,
      });
    }
  }

  return Object.values(categories).some((list) => list.length > 0)
    ? categories
    : null;
};

// Sort calc statements based on operand analysis
const sortCalcStatements = (
  calcList: StmtBlock[],
  assumeList: StmtBlock[]
): StmtBlock[] => {
  const analyzeOperand = (calc: StmtBlock) => ({
    sb: calc,
    opInfo: {
      assumeVar:
        calc.operand?.filter((op) =>
          assumeList.some((a) => a.target.name === op.name)
        ).length ?? 0,
      calcVar:
        calc.operand?.filter(
          (op) => !assumeList.some((a) => a.target.name === op.name)
        ).length ?? 0,
    },
  });

  const calcWithAnalysis = calcList.map(analyzeOperand);

  // assumeVarのみをopに持つ
  const inAssumeOnly = calcWithAnalysis.filter(
    (item) => item.opInfo.assumeVar !== 0 && item.opInfo.calcVar === 0
  );
  // それ以外
  const other = calcWithAnalysis.filter(
    (item) =>
      item.opInfo.assumeVar >= 0 &&
      item.opInfo.calcVar > 0 &&
      !inAssumeOnly.includes(item)
  );

  // それぞれsort
  inAssumeOnly.sort((a, b) => a.opInfo.assumeVar - b.opInfo.assumeVar);
  other.sort((a, b) => {
    const assume = b.opInfo.assumeVar - a.opInfo.assumeVar;
    const calc = b.opInfo.calcVar - a.opInfo.calcVar;
    return assume !== 0 ? assume : calc;
  });

  return inAssumeOnly.concat(other).map((item) => item.sb);
};

// Merge test and calc blocks into sorted order
const mergeBlocks = (
  assumeList: StmtBlock[],
  testCalc: StmtBlock[],
  otherCalc: StmtBlock[],
  testList: StmtBlock[]
): StmtBlock[] => {
  // 解決済みリスト
  const sorted: StmtBlock[] = [];
  // 全てのstmtが解決するまで繰り返す
  while (
    sorted.length <
    assumeList.length + testCalc.length + otherCalc.length + testList.length
  ) {
    // testCalcごとのopを格納
    const opList: StmtBlock[][] = [];
    // testCalcのoperandの状況を確認
    for (const calc of testCalc) {
      // testCalcのoperand
      const to = calc.operand ?? [];
      // toのうち、sortedに含まれていないものを格納
      const ol: StmtBlock[] = [];
      // operandの状況
      const isInSorted = sorted.filter((sb) =>
        to.some((t) => t.name === sb.target.name)
      );
      const isInAssume = assumeList.filter((op) =>
        to.some((t) => t.name === op.target.name && !sorted.includes(op))
      );
      // 条件を満たしていれば、sortedに追加
      // すでに解決済みの場合はスルー
      if (sorted.includes(calc)) continue;
      switch (to.length) {
        // 1. toが全てassumeListに含まれている場合
        case isInAssume.length: {
          // toのうちまだ解決していない仮定を追加
          for (const op of isInAssume) {
            if (!sorted.includes(op)) {
              sorted.push(op);
            }
          }
          // testCalcを追加
          sorted.push(calc);
          // testを追加
          const test = testList.find((t) => t.target.name === calc.target.name);
          if (test && !sorted.includes(test)) sorted.push(test);
          break;
        }
        // 2. toが全てsortedに含まれている場合
        case isInSorted.length: {
          // testCalcを追加
          sorted.push(calc);
          // testを追加
          const test = testList.find((t) => t.target.name === calc.target.name);
          if (test && !sorted.includes(test)) sorted.push(test);
          break;
        }
        // 3. toがassumeListに含まれているものと、sortedに含まれているものがある場合
        case isInAssume.length + isInSorted.length: {
          // まだ解決していない仮定を追加
          for (const op of isInAssume) {
            if (!sorted.includes(op)) {
              sorted.push(op);
            }
          }
          // testCalcを追加
          sorted.push(calc);
          // testを追加
          const test = testList.find((t) => t.target.name === calc.target.name);
          if (test && !sorted.includes(test)) sorted.push(test);
          break;
        }
        // 4. まだoperandが解決していないものがある場合
        default: {
          // toのうち、まだ解決していないoperandのcalcを格納
          // const notInSorted = otherCalc.filter((oc) => to.includes(oc.target));
          const notInSorted = otherCalc.filter(
            (oc) =>
              to.some((t) => t.name === oc.target.name) && !sorted.includes(oc)
          );
          // otherCalcの処理対象として追加
          if (notInSorted?.every((item) => !sorted.includes(item)))
            ol.push(...notInSorted);
          opList.push(ol);
          break;
        }
      }
    }
    // opListの処理
    if (opList.length > 0) {
      for (const ol of opList) {
        for (const o of ol) {
          // oのoperandについて、全てsortedに含まれている、またはassumeListに含まれている方を、sortedに追加
          const target = o.operand ?? [];
          // for (const op of target) {
          const isInSorted = sorted.filter((sb) =>
            target.some((t) => t.name === sb.target.name)
          );
          const isInAssume = assumeList.filter((assume) =>
            target.some(
              (t) => t.name === assume.target.name && !sorted.includes(assume)
            )
          );
          if (sorted.includes(o)) continue;
          switch (target.length) {
            case isInAssume.length: {
              for (const op of isInAssume) {
                if (!sorted.includes(op)) {
                  sorted.push(op);
                }
              }
              sorted.push(o);
              break;
            }
            case isInSorted.length: {
              sorted.push(o);
              break;
            }
            case isInAssume.length + isInSorted.length: {
              for (const op of isInAssume) {
                if (!sorted.includes(op)) {
                  sorted.push(op);
                }
              }
              sorted.push(o);
              break;
            }
            default: {
              // スルー
              break;
            }
          }
        }
      }
    }
    // testに関わらないstmtの処理
    if (testList.every((t) => sorted.includes(t))) {
      for (const c of otherCalc) {
        const isInSorted = sorted.filter((sb) =>
          c.operand?.some((t) => t.name === sb.target.name)
        );
        const isInAssume = assumeList.filter((op) =>
          c.operand?.some(
            (t) => t.name === op.target.name && !sorted.includes(op)
          )
        );
        if (sorted.includes(c)) continue;
        switch (c.operand?.length) {
          case isInAssume.length: {
            for (const op of isInAssume) {
              if (!sorted.includes(op)) {
                sorted.push(op);
              }
            }
            sorted.push(c);
            break;
          }
          case isInSorted.length: {
            sorted.push(c);
            break;
          }
          case isInAssume.length + isInSorted.length: {
            for (const op of isInAssume) {
              if (!sorted.includes(op)) {
                sorted.push(op);
              }
            }
            sorted.push(c);
            break;
          }
          default: {
            // スルー
            break;
          }
        }
      }
      for (const a of assumeList) if (!sorted.includes(a)) sorted.push(a);
    }
  }
  return sorted;
};

const margeCalcTest = (sorted: StmtBlock[]) => {
  let i = 0;
  while (i < sorted.length) {
    const s = sorted[i];
    // testじゃなかったら、次へ
    if (s.phase !== "test") {
      i++;
      continue;
    }
    const calc = sorted[i - 1];
    // sとcalcのbodyを結合
    const body = calc.body.concat(s.body);
    // sortedからcalcを削除
    sorted.splice(i - 1, 1);
    // sortedのs.bodyをbodyに置き換え
    sorted[i - 1] = {
      ...calc,
      body,
    };
    i++;
  }
  return sorted;
};

// Main function to sort statements
export const sortStmt = (predicates: StmtNode[]): StmtBlock[] => {
  // stmtの種類を分類
  const stmtList = classifyStatements(predicates);
  if (!stmtList) throw new Error("No valid statements to process.");

  const { assume, calc, test } = stmtList;

  // testのcalcを取得
  const testCalc = test.map((t) =>
    calc.find((c) => c.target.name === t.target.name)
  ) as StmtBlock[];
  // それ以外のcalc
  const otherCalc = calc.filter((c) => !testCalc.includes(c));

  // それぞれのcalcをソート
  const sortedTestCalc = sortCalcStatements(testCalc, assume);
  const sortedOtherCalc = sortCalcStatements(otherCalc, assume);

  // assume, calc, testをソートして結合
  const sorted = mergeBlocks(assume, sortedTestCalc, sortedOtherCalc, test);

  // testとその前のcalcのbodyを、結合する
  const result: StmtBlock[] = margeCalcTest(sorted);

  return result;
};
