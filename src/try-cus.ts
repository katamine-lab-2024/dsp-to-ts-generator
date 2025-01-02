import { NODE_TYPE } from "./constant";
import type { Expr, StmtBlock, StmtNode, VarNode } from "./types/ast";

// stmtの種類を判別し、情報を追加する
const stmtInfo = (
  stmt: StmtNode[]
): {
  assume: StmtBlock[];
  calc: StmtBlock[];
  test: StmtBlock[];
} | null => {
  const assumeList: StmtBlock[] = [];
  const calcList: StmtBlock[] = [];
  const testList: StmtBlock[] = [];

  // 仮定と計算
  // 計算は、typeがassignかつ、rhsがforでない場合
  for (const s of stmt) {
    // dummyは除外
    if (s.type === "dummy") continue;
    if (s.stmt.type === NODE_TYPE.ASSIGN) {
      if (s.stmt.rhs.type === NODE_TYPE.FOR) {
        assumeList.push({
          type: "stmt-block" as const,
          token: s.token,
          body: [s],
          phase: "assume",
          target: s.stmt.lhs as VarNode,
        });
        continue;
      }
      // todo: assignかつtestの可能性もある どうしよう
      // 計算なら、式に使われる変数を全て上げる
      const operand: VarNode[] = [];
      const getVar = (node: Expr) => {
        if (node.type === NODE_TYPE.VAR) {
          if (node.isInput) return;
          operand.push(node);
        }
        if ("lhs" in node) {
          getVar(node.lhs);
        }
        if ("rhs" in node) {
          getVar(node.rhs);
        }
      };
      if (s.stmt.rhs.type === NODE_TYPE.SQRT) {
        getVar(s.stmt.rhs.expr);
      }
      if (s.stmt.rhs.type === NODE_TYPE.CALL_EXPR) {
        getVar(s.stmt.rhs.lhs);
      }
      calcList.push({
        type: "stmt-block" as const,
        token: s.token,
        body: [s],
        phase: "calc",
        target: s.stmt.lhs as VarNode,
        operand: operand,
      });
      continue;
    }
    // 検証
    // 検証は、typeがtestの場合
    if (s.stmt.type === NODE_TYPE.TEST) {
      // stmt.stmt.cond内の変数を取得
      const varList: VarNode[] = [];
      const getVar = (node: Expr) => {
        if (node.type === NODE_TYPE.VAR) {
          varList.push(node);
        }
        if ("lhs" in node) {
          getVar(node.lhs);
        }
        if ("rhs" in node) {
          getVar(node.rhs);
        }
      };
      getVar(s.stmt.cond);
      // targetは、頻出している変数を選択、かつisInputではない
      const filteredVL = varList.filter((v) => !v.isInput);
      const target = filteredVL.reduce((a, b) =>
        filteredVL.filter((v) => v === a).length >
        filteredVL.filter((v) => v === b).length
          ? a
          : b
      );
      // target以外の変数をoperandに保存。varListの重複も除く
      const operand: VarNode[] = [];
      for (const v of varList) {
        if (v !== target && !operand.includes(v)) {
          operand.push(v);
        }
      }
      testList.push({
        type: "stmt-block" as const,
        token: s.token,
        body: [s],
        phase: "test",
        target: target,
        operand: operand,
      });
    }
  }
  if (assumeList.length > 0 || calcList.length > 0 || testList.length > 0) {
    return {
      assume: assumeList,
      calc: calcList,
      test: testList,
    };
  }
  return null;
};

// testのtargetを求めるcalcを取得
const getTestTargetCalc = (test: StmtBlock, list: StmtBlock[]) => {
  const target = test.target;
  const calc = list.find((c) => {
    return c.phase === "calc" && c.target.name === target.name;
  });
  return calc;
};

// calcのオペランドの種類とその数を、sbと紐ずけて返す
const handleCalcOpKind = (calc: StmtBlock, assumeList: StmtBlock[]) => {
  // calcのoperandをtargetとするassumeListの要素があれば、その数を取得
  const count: number =
    calc.operand?.filter((op) => {
      return assumeList.some((assume) => assume.target.name === op.name);
    }).length ?? 0;
  // sb.operandにそれ以外の変数が含まれている数を取得
  const otherCount =
    calc.operand?.filter((op) => {
      return !assumeList.some((assume) => assume.target.name === op.name);
    }).length ?? 0;
  return {
    sb: calc,
    opInfo: {
      assumeVar: count,
      calcVar: otherCount,
    },
  };
};

// calcの順位を決める
// test-targetの計算とそれ以外は同じ処理
const orderCalc = (
  calcList: {
    sb: StmtBlock;
    opInfo: {
      assumeVar: number;
      calcVar: number;
    };
  }[]
) => {
  // opに
  const inVarOnly = calcList.filter((item) => {
    return item.opInfo.assumeVar !== 0 && item.opInfo.calcVar === 0;
  });
  // それ以外
  const other = calcList.filter((item) => {
    return (
      item.opInfo.assumeVar > 0 &&
      item.opInfo.calcVar > 0 &&
      !inVarOnly.includes(item)
    );
  });
  // inVarのみを持つcalcのlistを、inVarの数が少ない順に並べ替える
  inVarOnly.sort((a, b) => a.opInfo.assumeVar - b.opInfo.assumeVar);
  // それ以外のlistを、inVarの数がoutVarより多い順に並べ替える。さらに、inVarとoutVarの数の和が少ない順に並べ替える
  other.sort((a, b) => {
    if (a.opInfo.assumeVar !== b.opInfo.assumeVar) {
      return a.opInfo.assumeVar - b.opInfo.assumeVar;
    }
    if (a.opInfo.calcVar !== b.opInfo.calcVar) {
      return a.opInfo.calcVar - b.opInfo.calcVar;
    }
    return (
      a.opInfo.assumeVar +
      a.opInfo.calcVar -
      (b.opInfo.assumeVar + b.opInfo.calcVar)
    );
  });
  // inVarOnlyの後にotherを追加
  return inVarOnly.concat(other);
};

// testCalcとそれ以外calcの順位を決めて、結合する
const catOrderCalc = (
  assumeList: StmtBlock[],
  testCalc: {
    sb: StmtBlock;
    opInfo: {
      assumeVar: number;
      calcVar: number;
    };
  }[],
  otherCalc: {
    sb: StmtBlock;
    opInfo: {
      assumeVar: number;
      calcVar: number;
    };
  }[],
  testList: StmtBlock[]
) => {
  // 順序解決済みリスト
  const sorted: StmtBlock[] = [];

  // testCalcとotherCalcの全ての要素が、sortedに含まれたら終了
  while (
    sorted.length <
    testCalc.length + otherCalc.length + assumeList.length
  ) {
    // sortedに追加できなかった場合の、対象のopを保持するリスト
    const opList: {
      sb: StmtBlock;
      opInfo: {
        assumeVar: number;
        calcVar: number;
      };
    }[][] = [];

    // 取り出したcalcのoperandについて、全てsortedに含まれている、またはassumeListに含まれている方を、sortedに追加
    for (const t of testCalc) {
      const target = t.sb.operand ?? [];
      const ol: {
        sb: StmtBlock;
        opInfo: {
          assumeVar: number;
          calcVar: number;
        };
      }[] = [];
      // targetの中から、assumeListのtargetになっているもの全てを、リストとして取得
      const isInAssume = assumeList.filter((op) => {
        return target.some((t) => t.name === op.target.name);
      });
      const isInSorted = sorted.filter((sb) => {
        return target.some((t) => t.name === sb.target.name);
      });
      if (isInAssume.length > 0) {
        // すでに解決済みの場合もあるので、その場合はスルー
        for (const op of isInAssume) {
          if (!sorted.includes(op)) {
            sorted.push(op);
          }
        }
        if (!sorted.includes(t.sb)) {
          sorted.push(t.sb);
          // t.sb.targetと同じtargetを持つtestを取得
          const test = testList.find(
            (tl) => tl.target.name === t.sb.target.name
          );
          if (test) {
            if (!sorted.includes(test)) {
              sorted.push(test);
            }
          }
        }
      } else if (isInSorted.length > 0) {
        for (const op of isInSorted) {
          if (!sorted.includes(op)) {
            sorted.push(op);
          }
        }
        if (!sorted.includes(t.sb)) {
          sorted.push(t.sb);
          // t.sb.targetと同じtargetを持つtestを取得
          const test = testList.find(
            (tl) => tl.target.name === t.sb.target.name
          );
          if (test) {
            if (!sorted.includes(test)) {
              sorted.push(test);
            }
          }
        }
      } else {
        // どちらにも含まれていない場合、opListに追加
        const found = otherCalc.find((oc) => target.includes(oc.sb.target));
        if (found) {
          ol.push(found);
        }
        opList.push(ol);
      }
      // }
      // todo: この辺も処理見直したい
      // もしopListに要素があれば、otherCalcの処理に移る
      if (opList.length > 0) {
        for (const ol of opList) {
          for (const o of ol) {
            // oのoperandについて、全てsortedに含まれている、またはassumeListに含まれている方を、sortedに追加
            const target = o.sb.operand ?? [];
            for (const op of target) {
              const isInAssume = assumeList.find(
                (assume) => assume.target.name === op.name
              );
              const isInSorted = sorted.find(
                (sb) => sb.target.name === op.name
              );
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
  }
  return sorted;
};

export const sortStmt = (predicates: StmtNode[]): StmtBlock[] => {
  const stmtList = stmtInfo(predicates);
  if (!stmtList) throw new Error("stmtList失敗");
  const testCalc: StmtBlock[] = [];
  for (const t of stmtList.test) {
    testCalc.push(getTestTargetCalc(t, stmtList.calc) as StmtBlock);
  }
  // testCalc以外のcalc
  const otherCalc = stmtList.calc.filter((c) => !testCalc.includes(c));
  // calcのop情報を追加
  const testCalcWithOp = testCalc.map((t) =>
    handleCalcOpKind(t, stmtList.assume)
  );
  const otherCalcWithOp = otherCalc.map((o) =>
    handleCalcOpKind(o, stmtList.assume)
  );
  // testCalc内とそれ以外のcalc内で順番を決める
  const orderedTestCalc = orderCalc(testCalcWithOp);
  const orderedOtherCalc = orderCalc(otherCalcWithOp);
  // 順番を結合
  const sorted = catOrderCalc(
    stmtList.assume,
    orderedTestCalc,
    orderedOtherCalc,
    stmtList.test
  );
  return sorted;
};
