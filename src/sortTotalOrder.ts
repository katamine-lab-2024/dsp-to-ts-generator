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
      if (innerStmt.rhs.type === NODE_TYPE.FOR) {
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
          operands = collectVariables(innerStmt.rhs.lhs, (v) => !v.isInput);
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
      const vars = collectVariables(innerStmt.cond as Expr);
      const target = vars.find((v) => !v.isInput) ?? vars[0];
      const operand = vars.filter((v) => v !== target);
      categories.test.push({
        type: "stmt-block",
        token: s.token,
        body: [s],
        phase: "test",
        target,
        operand,
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

  // assumeVarのみ
  const inAssumeOnly = calcWithAnalysis.filter(
    (item) => item.opInfo.assumeVar !== 0 && item.opInfo.calcVar === 0
  );
  // それ以外
  const other = calcWithAnalysis.filter(
    (item) =>
      item.opInfo.assumeVar > 0 &&
      item.opInfo.calcVar > 0 &&
      !inAssumeOnly.includes(item)
  );

  // それぞれsort
  inAssumeOnly.sort((a, b) => a.opInfo.assumeVar - b.opInfo.assumeVar);
  other.sort((a, b) => {
    if (a.opInfo.assumeVar !== b.opInfo.assumeVar)
      return a.opInfo.assumeVar - b.opInfo.assumeVar;
    if (a.opInfo.calcVar !== b.opInfo.calcVar)
      return a.opInfo.calcVar - b.opInfo.calcVar;
    return (
      a.opInfo.assumeVar +
      a.opInfo.calcVar -
      (b.opInfo.assumeVar + b.opInfo.calcVar)
    );
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

  while (
    sorted.length <
    assumeList.length + testCalc.length + otherCalc.length
  ) {
    const opList: StmtBlock[][] = [];
    for (const calc of testCalc) {
      const target = calc.operand ?? [];
      const ol: StmtBlock[] = [];
      // operandの状況
      const isInAssume = assumeList.filter((op) =>
        target.some((t) => t.name === op.target.name)
      );
      const isInSorted = sorted.filter((sb) =>
        target.some((t) => t.name === sb.target.name)
      );
      // 条件を満たしていれば、sortedに追加
      // すでに解決済みの場合はスルー
      if (sorted.includes(calc)) continue;
      switch (target.length) {
        case isInAssume.length: {
          // まだ解決していない仮定を追加
          for (const op of isInAssume) {
            if (!sorted.includes(op)) {
              sorted.push(op);
            }
          }
          sorted.push(calc);
          const test = testList.find((t) => t.target.name === calc.target.name);
          if (test && !sorted.includes(test)) sorted.push(test);
          break;
        }
        case isInSorted.length: {
          sorted.push(calc);
          const test = testList.find((t) => t.target.name === calc.target.name);
          if (test && !sorted.includes(test)) sorted.push(test);
          break;
        }
        case isInAssume.length + isInSorted.length: {
          // まだ解決していない仮定を追加
          for (const op of isInAssume) {
            if (!sorted.includes(op)) {
              sorted.push(op);
            }
          }
          sorted.push(calc);
          const test = testList.find((t) => t.target.name === calc.target.name);
          if (test && !sorted.includes(test)) sorted.push(test);
          break;
        }
        default: {
          const notInSorted = otherCalc.find((oc) =>
            target.includes(oc.target)
          );
          if (notInSorted && !sorted.includes(notInSorted))
            ol.push(notInSorted);
          opList.push(ol);
          break;
        }
      }
    }
    // opListの処理
    // todo: この辺も処理見直したい
    if (opList.length > 0) {
      for (const ol of opList) {
        for (const o of ol) {
          // oのoperandについて、全てsortedに含まれている、またはassumeListに含まれている方を、sortedに追加
          const target = o.operand ?? [];
          for (const op of target) {
            const isInAssume = assumeList.find(
              (assume) => assume.target.name === op.name
            );
            const isInSorted = sorted.find((sb) => sb.target.name === op.name);
            if (isInAssume) {
              if (!sorted.includes(isInAssume)) {
                sorted.push(isInAssume);
              }
            } else if (isInSorted) {
              if (!sorted.includes(isInSorted)) {
                sorted.push(isInSorted);
              }
            }
            // どちらにも含まれていない場合、次回に処理するのでスルー
          }
        }
      }
    }
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

  const sortedTestCalc = sortCalcStatements(testCalc, assume);
  const sortedOtherCalc = sortCalcStatements(otherCalc, assume);

  return mergeBlocks(assume, sortedTestCalc, sortedOtherCalc, test);
};
