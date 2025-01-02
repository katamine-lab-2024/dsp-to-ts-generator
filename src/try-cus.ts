import { NODE_TYPE } from "./constant";
import type { Expr, Stmt, StmtBlock, StmtNode, VarNode } from "./types/ast";

// const list: StmtBlock[] = [
//   {
//     type: "stmt-block" as const,
//     token: {
//       type: "reserved",
//       position: { line: 6, character: 3 },
//       value: "test",
//     },
//     body: [
//       {
//         type: "stmt",
//         stmt: {
//           type: "test",
//           cond: {
//             type: "call-expr",
//             callee: "LE",
//             lhs: {
//               type: "var",
//               name: "D",
//               valueType: {
//                 type: "dummy",
//                 token: {
//                   type: "ident-var",
//                   position: { line: 6, character: 9 },
//                   value: "dummy",
//                 },
//               },
//               token: {
//                 type: "ident-var",
//                 position: { line: 6, character: 8 },
//                 value: "D",
//               },
//             },
//             rhs: {
//               type: "var",
//               name: "R",
//               valueType: {
//                 type: "dummy",
//                 token: {
//                   type: "ident-var",
//                   position: { line: 6, character: 14 },
//                   value: "dummy",
//                 },
//               },
//               token: {
//                 type: "ident-var",
//                 position: { line: 6, character: 13 },
//                 value: "R",
//               },
//             },
//             token: {
//               type: "reserved",
//               position: { line: 6, character: 10 },
//               value: "=<",
//             },
//           },
//           token: {
//             type: "reserved",
//             position: { line: 6, character: 3 },
//             value: "test",
//           },
//         },
//         token: {
//           type: "reserved",
//           position: { line: 6, character: 3 },
//           value: "test",
//         },
//       },
//     ],
//     // varList: [],
//     phase: "test",
//     target: {
//       type: "var",
//       name: "D",
//       valueType: {
//         type: "dummy",
//         token: {
//           type: "ident-var",
//           position: { line: 6, character: 9 },
//           value: "dummy",
//         },
//       },
//       token: {
//         type: "ident-var",
//         position: { line: 6, character: 8 },
//         value: "D",
//       },
//     },
//     operand: [
//       {
//         type: "var",
//         token: {
//           type: "ident-var",
//           position: { line: 6, character: 8 },
//           value: "D",
//         },
//         name: "D",
//         valueType: {
//           type: "dummy",
//           token: {
//             type: "ident-var",
//             position: { line: 6, character: 9 },
//             value: "dummy",
//           },
//         },
//       },
//     ],
//   },
//   {
//     type: "stmt-block" as const,
//     token: {
//       type: "ident-var",
//       position: { line: 4, character: 3 },
//       value: "Y",
//     },
//     body: [
//       {
//         type: "stmt",
//         stmt: {
//           type: "assign",
//           lhs: {
//             type: "var",
//             name: "Y",
//             valueType: {
//               type: "real",
//               token: {
//                 type: "reserved",
//                 position: { line: 4, character: 7 },
//                 value: "real",
//               },
//             },
//             token: {
//               type: "ident-var",
//               position: { line: 4, character: 3 },
//               value: "Y",
//             },
//           },
//           rhs: {
//             type: "for",
//             from: {
//               type: "num",
//               token: {
//                 type: "number",
//                 position: { line: 4, character: 18 },
//                 value: "0.0",
//               },
//             },
//             to: {
//               type: "var",
//               name: "R",
//               valueType: {
//                 type: "dummy",
//                 token: {
//                   type: "ident-var",
//                   position: { line: 4, character: 24 },
//                   value: "dummy",
//                 },
//               },
//               token: {
//                 type: "ident-var",
//                 position: { line: 4, character: 23 },
//                 value: "R",
//               },
//             },
//             inc: {
//               type: "num",
//               token: {
//                 type: "number",
//                 position: { line: 4, character: 26 },
//                 value: "1.0",
//               },
//             },
//             token: {
//               type: "reserved",
//               position: { line: 4, character: 14 },
//               value: "for",
//             },
//           },
//           token: {
//             type: "ident-var",
//             position: { line: 4, character: 3 },
//             value: "Y",
//           },
//         },
//         token: {
//           type: "ident-var",
//           position: { line: 4, character: 3 },
//           value: "Y",
//         },
//       },
//     ],
//     phase: "assume",
//     target: {
//       type: "var",
//       name: "Y",
//       valueType: {
//         type: "real",
//         token: {
//           type: "reserved",
//           position: { line: 4, character: 7 },
//           value: "real",
//         },
//       },
//       token: {
//         type: "ident-var",
//         position: { line: 4, character: 3 },
//         value: "Y",
//       },
//     },
//   },
//   {
//     type: "stmt-block" as const,
//     token: {
//       type: "ident-var",
//       position: { line: 5, character: 3 },
//       value: "D",
//     },
//     body: [
//       {
//         type: "stmt",
//         stmt: {
//           type: "assign",
//           lhs: {
//             type: "var",
//             name: "D",
//             valueType: {
//               type: "real",
//               token: {
//                 type: "reserved",
//                 position: { line: 5, character: 7 },
//                 value: "real",
//               },
//             },
//             token: {
//               type: "ident-var",
//               position: { line: 5, character: 3 },
//               value: "D",
//             },
//           },
//           rhs: {
//             type: "sqrt",
//             expr: {
//               type: "call-expr",
//               callee: "add",
//               lhs: {
//                 type: "call-expr",
//                 callee: "pow",
//                 lhs: {
//                   type: "var",
//                   name: "X",
//                   valueType: {
//                     type: "dummy",
//                     token: {
//                       type: "ident-var",
//                       position: { line: 5, character: 20 },
//                       value: "dummy",
//                     },
//                   },
//                   token: {
//                     type: "ident-var",
//                     position: { line: 5, character: 19 },
//                     value: "X",
//                   },
//                 },
//                 rhs: {
//                   type: "num",
//                   token: {
//                     type: "number",
//                     position: { line: 5, character: 21 },
//                     value: "2",
//                   },
//                 },
//                 token: {
//                   type: "reserved",
//                   position: { line: 5, character: 20 },
//                   value: "^",
//                 },
//               },
//               rhs: {
//                 type: "call-expr",
//                 callee: "pow",
//                 lhs: {
//                   type: "var",
//                   name: "Y",
//                   valueType: {
//                     type: "dummy",
//                     token: {
//                       type: "ident-var",
//                       position: { line: 5, character: 26 },
//                       value: "dummy",
//                     },
//                   },
//                   token: {
//                     type: "ident-var",
//                     position: { line: 5, character: 25 },
//                     value: "Y",
//                   },
//                 },
//                 rhs: {
//                   type: "num",
//                   token: {
//                     type: "number",
//                     position: { line: 5, character: 27 },
//                     value: "2",
//                   },
//                 },
//                 token: {
//                   type: "reserved",
//                   position: { line: 5, character: 26 },
//                   value: "^",
//                 },
//               },
//               token: {
//                 type: "reserved",
//                 position: { line: 5, character: 23 },
//                 value: "+",
//               },
//             },
//             token: {
//               type: "reserved",
//               position: { line: 5, character: 14 },
//               value: "sqrt",
//             },
//           },
//           token: {
//             type: "ident-var",
//             position: { line: 5, character: 3 },
//             value: "D",
//           },
//         },
//         token: {
//           type: "ident-var",
//           position: { line: 5, character: 3 },
//           value: "D",
//         },
//       },
//     ],
//     phase: "calc",
//     target: {
//       type: "var",
//       name: "D",
//       valueType: {
//         type: "real",
//         token: {
//           type: "reserved",
//           position: { line: 5, character: 7 },
//           value: "real",
//         },
//       },
//       token: {
//         type: "ident-var",
//         position: { line: 5, character: 3 },
//         value: "D",
//       },
//     },
//     operand: [
//       {
//         type: "var",
//         token: {
//           type: "ident-var",
//           position: { line: 5, character: 19 },
//           value: "X",
//         },
//         name: "X",
//         valueType: {
//           type: "dummy",
//           token: {
//             type: "ident-var",
//             position: { line: 5, character: 20 },
//             value: "dummy",
//           },
//         },
//       },
//       {
//         type: "var",
//         token: {
//           type: "ident-var",
//           position: { line: 5, character: 25 },
//           value: "Y",
//         },
//         name: "Y",
//         valueType: {
//           type: "dummy",
//           token: {
//             type: "ident-var",
//             position: { line: 5, character: 26 },
//             value: "dummy",
//           },
//         },
//       },
//     ],
//   },
//   {
//     type: "stmt-block" as const,
//     token: {
//       type: "ident-var",
//       position: { line: 3, character: 3 },
//       value: "X",
//     },
//     body: [
//       {
//         type: "stmt",
//         stmt: {
//           type: "assign",
//           lhs: {
//             type: "var",
//             name: "X",
//             valueType: {
//               type: "real",
//               token: {
//                 type: "reserved",
//                 position: { line: 3, character: 7 },
//                 value: "real",
//               },
//             },
//             token: {
//               type: "ident-var",
//               position: { line: 3, character: 3 },
//               value: "X",
//             },
//           },
//           rhs: {
//             type: "for",
//             from: {
//               type: "num",
//               token: {
//                 type: "number",
//                 position: { line: 3, character: 18 },
//                 value: "0.0",
//               },
//             },
//             to: {
//               type: "var",
//               name: "R",
//               valueType: {
//                 type: "dummy",
//                 token: {
//                   type: "ident-var",
//                   position: { line: 3, character: 24 },
//                   value: "dummy",
//                 },
//               },
//               token: {
//                 type: "ident-var",
//                 position: { line: 3, character: 23 },
//                 value: "R",
//               },
//             },
//             inc: {
//               type: "num",
//               token: {
//                 type: "number",
//                 position: { line: 3, character: 26 },
//                 value: "1.0",
//               },
//             },
//             token: {
//               type: "reserved",
//               position: { line: 3, character: 14 },
//               value: "for",
//             },
//           },
//           token: {
//             type: "ident-var",
//             position: { line: 3, character: 3 },
//             value: "X",
//           },
//         },
//         token: {
//           type: "ident-var",
//           position: { line: 3, character: 3 },
//           value: "X",
//         },
//       },
//     ],
//     phase: "assume",
//     target: {
//       type: "var",
//       name: "X",
//       valueType: {
//         type: "real",
//         token: {
//           type: "reserved",
//           position: { line: 3, character: 7 },
//           value: "real",
//         },
//       },
//       token: {
//         type: "ident-var",
//         position: { line: 3, character: 3 },
//         value: "X",
//       },
//     },
//   },
// ];

const list0: Stmt[] = [
  {
    type: "stmt",
    stmt: {
      type: "test",
      cond: {
        type: "call-expr",
        callee: "LE",
        lhs: {
          type: "var",
          name: "D",
          valueType: {
            type: "dummy",
            token: {
              type: "ident-var",
              position: { line: 6, character: 9 },
              value: "dummy",
            },
          },
          token: {
            type: "ident-var",
            position: { line: 6, character: 8 },
            value: "D",
          },
          isInput: false,
        },
        rhs: {
          type: "var",
          name: "R",
          valueType: {
            type: "dummy",
            token: {
              type: "ident-var",
              position: { line: 6, character: 14 },
              value: "dummy",
            },
          },
          token: {
            type: "ident-var",
            position: { line: 6, character: 13 },
            value: "R",
          },
          isInput: true,
        },
        token: {
          type: "reserved",
          position: { line: 6, character: 10 },
          value: "=<",
        },
      },
      token: {
        type: "reserved",
        position: { line: 6, character: 3 },
        value: "test",
      },
    },
    token: {
      type: "reserved",
      position: { line: 6, character: 3 },
      value: "test",
    },
  },
  {
    type: "stmt",
    stmt: {
      type: "assign",
      lhs: {
        type: "var",
        name: "D",
        valueType: {
          type: "real",
          token: {
            type: "reserved",
            position: { line: 5, character: 7 },
            value: "real",
          },
        },
        token: {
          type: "ident-var",
          position: { line: 5, character: 3 },
          value: "D",
        },
        isInput: false,
      },
      rhs: {
        type: "sqrt",
        expr: {
          type: "call-expr",
          callee: "add",
          lhs: {
            type: "call-expr",
            callee: "pow",
            lhs: {
              type: "var",
              name: "X",
              valueType: {
                type: "dummy",
                token: {
                  type: "ident-var",
                  position: { line: 5, character: 20 },
                  value: "dummy",
                },
              },
              token: {
                type: "ident-var",
                position: { line: 5, character: 19 },
                value: "X",
              },
              isInput: false,
            },
            rhs: {
              type: "num",
              token: {
                type: "number",
                position: { line: 5, character: 21 },
                value: "2",
              },
            },
            token: {
              type: "reserved",
              position: { line: 5, character: 20 },
              value: "^",
            },
          },
          rhs: {
            type: "call-expr",
            callee: "pow",
            lhs: {
              type: "var",
              name: "Y",
              valueType: {
                type: "dummy",
                token: {
                  type: "ident-var",
                  position: { line: 5, character: 26 },
                  value: "dummy",
                },
              },
              token: {
                type: "ident-var",
                position: { line: 5, character: 25 },
                value: "Y",
              },
              isInput: false,
            },
            rhs: {
              type: "num",
              token: {
                type: "number",
                position: { line: 5, character: 27 },
                value: "2",
              },
            },
            token: {
              type: "reserved",
              position: { line: 5, character: 26 },
              value: "^",
            },
          },
          token: {
            type: "reserved",
            position: { line: 5, character: 23 },
            value: "+",
          },
        },
        token: {
          type: "reserved",
          position: { line: 5, character: 14 },
          value: "sqrt",
        },
      },
      token: {
        type: "ident-var",
        position: { line: 5, character: 3 },
        value: "D",
      },
    },
    token: {
      type: "ident-var",
      position: { line: 5, character: 3 },
      value: "D",
    },
  },
  {
    type: "stmt",
    stmt: {
      type: "assign",
      lhs: {
        type: "var",
        name: "Y",
        valueType: {
          type: "real",
          token: {
            type: "reserved",
            position: { line: 4, character: 7 },
            value: "real",
          },
        },
        token: {
          type: "ident-var",
          position: { line: 4, character: 3 },
          value: "Y",
        },
        isInput: false,
      },
      rhs: {
        type: "for",
        from: {
          type: "num",
          token: {
            type: "number",
            position: { line: 4, character: 18 },
            value: "0.0",
          },
        },
        to: {
          type: "var",
          name: "R",
          valueType: {
            type: "dummy",
            token: {
              type: "ident-var",
              position: { line: 4, character: 24 },
              value: "dummy",
            },
          },
          token: {
            type: "ident-var",
            position: { line: 4, character: 23 },
            value: "R",
          },
          isInput: true,
        },
        inc: {
          type: "num",
          token: {
            type: "number",
            position: { line: 4, character: 26 },
            value: "1.0",
          },
        },
        token: {
          type: "reserved",
          position: { line: 4, character: 14 },
          value: "for",
        },
      },
      token: {
        type: "ident-var",
        position: { line: 4, character: 3 },
        value: "Y",
      },
    },
    token: {
      type: "ident-var",
      position: { line: 4, character: 3 },
      value: "Y",
    },
  },
  {
    type: "stmt",
    stmt: {
      type: "assign",
      lhs: {
        type: "var",
        name: "X",
        valueType: {
          type: "real",
          token: {
            type: "reserved",
            position: { line: 3, character: 7 },
            value: "real",
          },
        },
        token: {
          type: "ident-var",
          position: { line: 3, character: 3 },
          value: "X",
        },
        isInput: false,
      },
      rhs: {
        type: "for",
        from: {
          type: "num",
          token: {
            type: "number",
            position: { line: 3, character: 18 },
            value: "0.0",
          },
        },
        to: {
          type: "var",
          name: "R",
          valueType: {
            type: "dummy",
            token: {
              type: "ident-var",
              position: { line: 3, character: 24 },
              value: "dummy",
            },
          },
          token: {
            type: "ident-var",
            position: { line: 3, character: 23 },
            value: "R",
          },
          isInput: true,
        },
        inc: {
          type: "num",
          token: {
            type: "number",
            position: { line: 3, character: 26 },
            value: "1.0",
          },
        },
        token: {
          type: "reserved",
          position: { line: 3, character: 14 },
          value: "for",
        },
      },
      token: {
        type: "ident-var",
        position: { line: 3, character: 3 },
        value: "X",
      },
    },
    token: {
      type: "ident-var",
      position: { line: 3, character: 3 },
      value: "X",
    },
  },
];

interface Predicate {
  name: string; // 述語名 (例: "p_計算")
  type: "仮定" | "計算" | "検証"; // 処理の種類
  dependencies: string[]; // オペランドとして必要な値
  result: string; // 計算または検証の結果として生成される値
}

const predicates: Predicate[] = [
  {
    name: "constraint_p_計算",
    type: "検証",
    dependencies: ["_p"],
    result: "_constraint_p",
  },
  { name: "member", type: "仮定", dependencies: [], result: "_pin" },
  {
    name: "p_計算",
    type: "計算",
    dependencies: ["_aUXPin", "_pin"],
    result: "_p",
  },
  {
    name: "member",
    type: "仮定",
    dependencies: [],
    result: "_aUXPin",
  },
];

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
          // varList: [],
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
        // varList: [],
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
          // if (node.isInput) return;
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
      // ~~targetは`constraint`の接頭辞をもたない~~
      // const target = varList.find((v) => {
      //   return !v.name.startsWith("constraint");
      // }) as VarNode;
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
        // if (v.isInput) continue;
        if (v !== target && !operand.includes(v)) {
          operand.push(v);
        }
      }
      testList.push({
        type: "stmt-block" as const,
        token: s.token,
        body: [s],
        // varList: [],
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
  // console.log("::target", target);
  const calc = list.find((c) => {
    // console.log("::c.target.name", c.target.name);
    // console.log("::target.name", target.name);
    return (
      c.phase === "calc" &&
      // stmt.operand?.includes(target) &&
      c.target.name === target.name
    );
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

  // todo: testCalcとotherCalcの全ての要素が、sortedに含まれたら終了
  // console.log(testCalc.length + otherCalc.length + assumeList.length);
  while (
    sorted.length <
    testCalc.length + otherCalc.length + assumeList.length
  ) {
    // testCalcから、要素を前から2つ取り出す。
    // 1つしか取り出せない場合は、1つだけ取り出す
    // const test = testCalc.splice(0, Math.min(2, testCalc.length));
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
      // todo: ここopを回したら変かも
      // for (const op of target) {
      // targetの中から、assumeListのtargetになっているもの全てを、リストとして取得
      const isInAssume = assumeList.filter((op) => {
        return target.some((t) => t.name === op.target.name);
      });
      // console.log("::isInAssume");
      // console.dir(isInAssume, { depth: null });
      const isInSorted = sorted.filter((sb) => {
        return target.some((t) => t.name === sb.target.name);
      });
      // console.log("::isInSorted");
      // console.dir(isInSorted, { depth: null });
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

export const sortPredicates = (predicates: StmtNode[]): StmtBlock[] => {
  // const sorted: StmtBlock[] = [];
  // const availableResults = new Set<string>(); // 計算済みまたは仮定済みの結果
  // console.log("=== 初期状態 ===");
  // console.log("述語一覧:", predicates);
  // console.log("================");
  // while (sorted.length < predicates.length) {
  //   console.log("\n=== 現在のソート済み述語 ===");
  //   console.log(sorted.map((pred) => pred.phase));
  //   console.log("現在利用可能な結果:", Array.from(availableResults));
  //   console.log("===========================");
  //   // ソート可能な述語を選択
  //   const candidates = predicates
  //     .filter((pred) => !sorted.includes(pred)) // 未処理の述語
  //     .filter((pred) => {
  //       if (!pred.operand) return true;
  //       return pred.operand.every((dep) => availableResults.has(dep.name));
  //     });
  //   console.log("\n候補となる述語:");
  //   console.log(candidates.map((pred) => pred.phase));
  //   const next = candidates.sort((a, b) => {
  //     const typePriority = (type: "assume" | "calc" | "test") =>
  //       type === "test" ? 0 : type === "calc" ? 1 : 2;
  //     if (typePriority(a.phase) !== typePriority(b.phase)) {
  //       return typePriority(a.phase) - typePriority(b.phase);
  //     }
  //     const getOperandStats = (sb: StmtBlock) => {
  //       let assumedCount = 0; // 仮定の値
  //       let computedCount = 0; // 計算の値
  //       for (const op of sb.operand ?? []) {
  //         if (availableResults.has(op.name)) {
  //           computedCount++;
  //         } else {
  //           assumedCount++;
  //         }
  //       }
  //       return {
  //         assumedCount,
  //         computedCount,
  //         total: assumedCount + computedCount,
  //       };
  //     };
  //     const aStats = getOperandStats(a);
  //     const bStats = getOperandStats(b);
  //     // 仮定の値が少ないものが優先
  //     if (aStats.assumedCount !== bStats.assumedCount) {
  //       return aStats.assumedCount - bStats.assumedCount;
  //     }
  //     // オペランド全体の数が少ないものが優先
  //     if (aStats.total !== bStats.total) {
  //       return aStats.total - bStats.total;
  //     }
  //     // 計算された値の数が少ないものが優先
  //     return aStats.computedCount - bStats.computedCount;
  //   })[0];
  //   if (!next) {
  //     console.error("循環依存が発生しました。現在の状態:");
  //     console.log(
  //       "ソート済み述語:",
  //       sorted.map((pred) => pred.phase)
  //     );
  //     console.log(
  //       "候補述語:",
  //       candidates.map((pred) => pred.phase)
  //     );
  //     throw new Error("循環依存が発生しました");
  //   }
  //   console.log("\n次に処理する述語:", next.phase);
  //   sorted.push(next);
  //   availableResults.add(next.target.name);
  //   console.log("新たに利用可能な結果:", next.target);
  // }
  // console.log("\n=== ソート完了 ===");
  // console.log(sorted.map((pred) => pred.phase));
  // console.log("================");
  // return sorted;

  const stmtList = stmtInfo(predicates);
  if (!stmtList) throw new Error("stmtList失敗");
  const testCalc: StmtBlock[] = [];
  for (const t of stmtList.test) {
    testCalc.push(getTestTargetCalc(t, stmtList.calc) as StmtBlock);
  }
  // testCalc以外のcalc
  const otherCalc = stmtList.calc.filter((c) => !testCalc.includes(c));
  // console.log("::testCalc", testCalc);
  // console.log("::otherCalc", otherCalc);
  // calcのop情報を追加
  const testCalcWithOp = testCalc.map((t) =>
    handleCalcOpKind(t, stmtList.assume)
  );
  const otherCalcWithOp = otherCalc.map((o) =>
    handleCalcOpKind(o, stmtList.assume)
  );
  // console.log("::testCalcWithOp", testCalcWithOp);
  // testCalc内とそれ以外のcalc内で順番を決める
  const orderedTestCalc = orderCalc(testCalcWithOp);
  const orderedOtherCalc = orderCalc(otherCalcWithOp);
  // 順番を結合
  // console.log("::orderedTestCalc");
  // console.dir(orderedTestCalc, { depth: null });
  // console.log("::orderedOtherCalc");
  // console.dir(orderedOtherCalc, { depth: null });
  const sorted = catOrderCalc(
    stmtList.assume,
    orderedTestCalc,
    orderedOtherCalc,
    stmtList.test
  );
  return sorted;
};

// // ソートを実行
// const sortedPredicates = sortPredicates(list0);

// // 結果を表示
// console.log("\n=== 最終的な順序 ===");
// for (const pred of sortedPredicates) {
//   console.log(pred.phase);
// }
